// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB9CuMxbji00wW5eeS9r1314zSVjRB7Tzc",
    authDomain: "soul-link-nuzlocke.firebaseapp.com",
    databaseURL: "https://soul-link-nuzlocke-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "soul-link-nuzlocke",
    storageBucket: "soul-link-nuzlocke.firebasestorage.app",
    messagingSenderId: "355103407131",
    appId: "1:355103407131:web:c5b81fded8674b1c3c8cbe"
};

// Variables globales
let db = null;
let currentPlayer = null;
let currentZone = null;
let dataRef = null;
let presenceRef = null;
let playersRef = null;
let deviceId = null;
let currentGameData = {}; // Pour stocker les données actuelles
let unlockedIsland = 1; // Île débloquée (commence à 1 = Mele-Mele)

// Générer un ID unique pour cet appareil (simule l'adresse MAC)
function getDeviceId() {
    let id = localStorage.getItem('soulLinkDeviceId');
    if (!id) {
        // Générer un ID unique basé sur le temps + random
        id = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('soulLinkDeviceId', id);
    }
    return id;
}

// Initialisation Firebase
firebase.initializeApp(firebaseConfig);
db = firebase.database();
dataRef = db.ref('gameData');
presenceRef = db.ref('presence');
playersRef = db.ref('players');
deviceId = getDeviceId();

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Écouter les changements de présence
    presenceRef.on('value', (snapshot) => {
        updatePresenceUI(snapshot.val() || {});
    });

    // Vérifier l'état des joueurs
    checkPlayerStatus();
});

// Limite d'appareils par joueur
const MAX_DEVICES_PER_PLAYER = 2;

// Vérifier si ce device a déjà choisi ou si un joueur est déjà pris
function checkPlayerStatus() {
    // D'abord vérifier le localStorage pour une reconnexion rapide
    const savedPlayer = localStorage.getItem('soulLinkPlayer');

    playersRef.once('value').then((snapshot) => {
        const players = snapshot.val() || {};

        // Vérifier si ce device a déjà un joueur assigné dans Firebase
        if (players.sun && players.sun.devices && players.sun.devices[deviceId]) {
            currentPlayer = 'sun';
            localStorage.setItem('soulLinkPlayer', 'sun');
            startApp();
            return;
        }
        if (players.moon && players.moon.devices && players.moon.devices[deviceId]) {
            currentPlayer = 'moon';
            localStorage.setItem('soulLinkPlayer', 'moon');
            startApp();
            return;
        }

        // Si on avait un joueur sauvegardé mais pas dans Firebase, le réenregistrer
        if (savedPlayer && (savedPlayer === 'sun' || savedPlayer === 'moon')) {
            const playerData = players[savedPlayer];
            const deviceCount = playerData && playerData.devices ? Object.keys(playerData.devices).length : 0;
            const isMyDevice = playerData && playerData.devices && playerData.devices[deviceId];

            // Vérifier qu'il y a de la place ou que c'est déjà mon device
            if (!playerData || isMyDevice || deviceCount < MAX_DEVICES_PER_PLAYER) {
                // Réenregistrer ce device
                playersRef.child(`${savedPlayer}/devices/${deviceId}`).set({
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                }).then(() => {
                    currentPlayer = savedPlayer;
                    startApp();
                });
                return;
            }
        }

        // Sinon afficher la sélection avec les options disponibles
        updatePlayerSelection(players);
    });

    // Écouter les changements en temps réel
    playersRef.on('value', (snapshot) => {
        const players = snapshot.val() || {};
        if (!currentPlayer) {
            updatePlayerSelection(players);
        }
    });
}

// Mettre à jour l'affichage de la sélection des joueurs
function updatePlayerSelection(players) {
    const sunBtn = document.querySelector('.game-btn.sun');
    const moonBtn = document.querySelector('.game-btn.moon');

    if (!sunBtn || !moonBtn) return;

    // Sun est plein (2 appareils) et je n'en fais pas partie ?
    const sunDevices = players.sun && players.sun.devices ? Object.keys(players.sun.devices) : [];
    const sunFull = sunDevices.length >= MAX_DEVICES_PER_PLAYER && !sunDevices.includes(deviceId);

    if (sunFull) {
        sunBtn.classList.add('player-taken');
        sunBtn.onclick = null;
    } else {
        sunBtn.classList.remove('player-taken');
        sunBtn.onclick = () => selectPlayer('sun');
    }

    // Moon est plein (2 appareils) et je n'en fais pas partie ?
    const moonDevices = players.moon && players.moon.devices ? Object.keys(players.moon.devices) : [];
    const moonFull = moonDevices.length >= MAX_DEVICES_PER_PLAYER && !moonDevices.includes(deviceId);

    if (moonFull) {
        moonBtn.classList.add('player-taken');
        moonBtn.onclick = null;
    } else {
        moonBtn.classList.remove('player-taken');
        moonBtn.onclick = () => selectPlayer('moon');
    }
}

// Sélectionner le joueur
function selectPlayer(player) {
    // Vérifier que le joueur n'est pas déjà plein
    playersRef.child(player).once('value').then((snapshot) => {
        const data = snapshot.val();
        const devices = data && data.devices ? Object.keys(data.devices) : [];

        // Vérifier si c'est déjà mon device ou s'il y a de la place
        if (devices.length >= MAX_DEVICES_PER_PLAYER && !devices.includes(deviceId)) {
            alert('Ce joueur a déjà 2 appareils enregistrés !');
            return;
        }

        // Enregistrer ce device pour ce joueur
        playersRef.child(`${player}/devices/${deviceId}`).set({
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            currentPlayer = player;
            localStorage.setItem('soulLinkPlayer', currentPlayer);
            startApp();
        });
    });
}

// Démarrer l'application
function startApp() {
    document.getElementById('sessionSetup').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';

    // Écouter le niveau d'île débloquée
    dataRef.child('unlockedIsland').on('value', (snapshot) => {
        unlockedIsland = snapshot.val() || 1;
        renderZones();
    });

    // Écouter les changements en temps réel
    dataRef.on('value', (snapshot) => {
        const data = snapshot.val() || {};
        currentGameData = data; // Sauvegarder pour les combats
        unlockedIsland = data.unlockedIsland || 1;
        updateUI(data);
        updateBattlesUI(data.battles);
    });

    // Gérer la présence
    setupPresence();
}

// Gestion de la présence
function setupPresence() {
    const myPresenceRef = presenceRef.child(currentPlayer);

    // Mettre en ligne
    myPresenceRef.set({
        online: true,
        lastSeen: firebase.database.ServerValue.TIMESTAMP
    });

    // Marquer hors ligne à la déconnexion
    myPresenceRef.onDisconnect().set({
        online: false,
        lastSeen: firebase.database.ServerValue.TIMESTAMP
    });

    // Heartbeat toutes les 30 secondes
    setInterval(() => {
        if (currentPlayer) {
            myPresenceRef.update({
                online: true,
                lastSeen: firebase.database.ServerValue.TIMESTAMP
            });
        }
    }, 30000);
}

function markOffline() {
    if (currentPlayer) {
        presenceRef.child(currentPlayer).set({
            online: false,
            lastSeen: firebase.database.ServerValue.TIMESTAMP
        });
    }
}

function updatePresenceUI(presence) {
    const sunStatus = document.getElementById('sunStatus');
    const moonStatus = document.getElementById('moonStatus');

    const now = Date.now();
    const timeout = 60000; // 60 secondes

    // Sun player
    if (presence.sun && presence.sun.online && (now - presence.sun.lastSeen) < timeout) {
        sunStatus.className = 'status-dot online';
    } else {
        sunStatus.className = 'status-dot offline';
    }

    // Moon player
    if (presence.moon && presence.moon.online && (now - presence.moon.lastSeen) < timeout) {
        moonStatus.className = 'status-dot online';
    } else {
        moonStatus.className = 'status-dot offline';
    }

    // Highlight current player
    const sunIndicator = document.getElementById('sunIndicator');
    const moonIndicator = document.getElementById('moonIndicator');

    if (currentPlayer === 'sun') {
        sunIndicator.style.boxShadow = '0 0 20px rgba(243, 156, 18, 0.7)';
        moonIndicator.style.boxShadow = 'none';
    } else if (currentPlayer === 'moon') {
        moonIndicator.style.boxShadow = '0 0 20px rgba(155, 89, 182, 0.7)';
        sunIndicator.style.boxShadow = 'none';
    }
}

// Rendu des zones (avec combats intégrés) - filtré par île débloquée
function renderZones() {
    const container = document.getElementById('zonesContainer');
    let currentIsland = '';
    let html = '';

    // Filtrer les zones selon l'île débloquée
    const visibleZones = ZONES_DATA.filter(zone => {
        // Zones spéciales sans islandNum (Ultra-Espace, Spécial, Pêche) visibles après île 4
        if (!zone.islandNum) {
            return unlockedIsland >= 5; // Après combat final
        }
        return zone.islandNum <= unlockedIsland;
    });

    visibleZones.forEach(zone => {
        if (zone.island !== currentIsland) {
            if (currentIsland !== '') {
                html += '</div>';
            }
            currentIsland = zone.island;
            html += `<div class="island-section"><h2 class="island-title" style="margin: 20px 0 10px; color: #888; font-size: 1.2rem;">${zone.island}</h2>`;
        }

        // Si c'est un combat rival
        if (zone.isBattle) {
            html += renderBattleCard(zone);
        } else {
            // Zone normale
            html += `
                <div class="zone-card" data-zone="${zone.id}">
                    <div class="zone-info">
                        <div class="zone-name">${zone.name}</div>
                    </div>
                    <div class="player-slot sun" id="slot-sun-${zone.id}">
                        <button class="add-pokemon-btn" onclick="openModal('${zone.id}', 'sun')">+ Ajouter</button>
                    </div>
                    <div class="player-slot moon" id="slot-moon-${zone.id}">
                        <button class="add-pokemon-btn" onclick="openModal('${zone.id}', 'moon')">+ Ajouter</button>
                    </div>
                </div>
            `;
        }
    });

    if (currentIsland !== '') {
        html += '</div>';
    }

    container.innerHTML = html;
}

// Rendu d'une carte de combat
function renderBattleCard(battle) {
    const isFinal = battle.isFinal;
    const maxPokemon = parseInt(battle.rules.charAt(0)) || 6;

    let html = `
        <div class="battle-card ${isFinal ? 'final' : ''}" id="battle-${battle.id}" data-battle="${battle.id}">
            <div class="battle-header">
                <div class="battle-name">${battle.name}</div>
                <div class="battle-rules">🎮 ${battle.rules}</div>
            </div>
            <div class="battle-description">${battle.description}</div>

            <div class="battle-teams">
                <div class="battle-team sun-team">
                    <div class="team-label">☀️ Équipe Soleil</div>
                    <div class="team-slots" id="team-sun-${battle.id}">
                        ${renderTeamSlots(battle.id, 'sun', maxPokemon)}
                    </div>
                </div>
                <div class="battle-vs">VS</div>
                <div class="battle-team moon-team">
                    <div class="team-label">🌙 Équipe Lune</div>
                    <div class="team-slots" id="team-moon-${battle.id}">
                        ${renderTeamSlots(battle.id, 'moon', maxPokemon)}
                    </div>
                </div>
            </div>

            <div class="battle-result" id="result-${battle.id}">
                <button class="winner-btn sun" onclick="setWinner('${battle.id}', 'sun')">☀️ Soleil gagne</button>
                <button class="winner-btn moon" onclick="setWinner('${battle.id}', 'moon')">🌙 Lune gagne</button>
            </div>
        </div>
    `;
    return html;
}

// Rendu des slots d'équipe pour un combat
function renderTeamSlots(battleId, player, maxPokemon) {
    let html = '';
    for (let i = 0; i < maxPokemon; i++) {
        html += `
            <div class="team-slot" id="team-slot-${battleId}-${player}-${i}">
                <select class="pokemon-select" onchange="selectBattlePokemon('${battleId}', '${player}', ${i}, this.value)" ${player !== currentPlayer ? 'disabled' : ''}>
                    <option value="">-- Choisir --</option>
                </select>
            </div>
        `;
    }
    return html;
}

// Obtenir la liste des Pokémon vivants d'un joueur
function getAlivePokemon(player) {
    const zones = currentGameData.zones || {};
    const alivePokemon = [];

    Object.keys(zones).forEach(zoneId => {
        const zoneData = zones[zoneId];
        if (zoneData[player] && !zoneData[player].dead) {
            const pokemon = POKEMON_DATA.find(p => p.id === zoneData[player].id);
            if (pokemon) {
                alivePokemon.push({
                    zoneId: zoneId,
                    id: zoneData[player].id,
                    name: pokemon.name,
                    nickname: zoneData[player].nickname || ''
                });
            }
        }
    });

    return alivePokemon;
}

// Mettre à jour les selects des combats avec les Pokémon vivants
function updateBattleSelects() {
    const sunPokemon = getAlivePokemon('sun');
    const moonPokemon = getAlivePokemon('moon');

    ZONES_DATA.filter(z => z.isBattle).forEach(battle => {
        const maxPokemon = parseInt(battle.rules.charAt(0)) || 6;

        for (let i = 0; i < maxPokemon; i++) {
            // Sun selects
            const sunSelect = document.querySelector(`#team-slot-${battle.id}-sun-${i} select`);
            if (sunSelect) {
                const currentValue = sunSelect.value;
                sunSelect.innerHTML = '<option value="">-- Choisir --</option>';
                sunPokemon.forEach(p => {
                    sunSelect.innerHTML += `<option value="${p.zoneId}" ${currentValue === p.zoneId ? 'selected' : ''}>${p.name} "${p.nickname}"</option>`;
                });
            }

            // Moon selects
            const moonSelect = document.querySelector(`#team-slot-${battle.id}-moon-${i} select`);
            if (moonSelect) {
                const currentValue = moonSelect.value;
                moonSelect.innerHTML = '<option value="">-- Choisir --</option>';
                moonPokemon.forEach(p => {
                    moonSelect.innerHTML += `<option value="${p.zoneId}" ${currentValue === p.zoneId ? 'selected' : ''}>${p.name} "${p.nickname}"</option>`;
                });
            }
        }
    });
}

// Sélectionner un Pokémon pour un combat
function selectBattlePokemon(battleId, player, slot, zoneId) {
    if (!zoneId) {
        dataRef.child(`battles/${battleId}/teams/${player}/${slot}`).remove();
    } else {
        dataRef.child(`battles/${battleId}/teams/${player}/${slot}`).set(zoneId);
    }
}

// Mettre à jour l'interface
function updateUI(data) {
    // Reset tous les slots
    ZONES_DATA.forEach(zone => {
        const sunSlot = document.getElementById(`slot-sun-${zone.id}`);
        const moonSlot = document.getElementById(`slot-moon-${zone.id}`);

        if (sunSlot) {
            sunSlot.className = 'player-slot sun';
            sunSlot.innerHTML = `<button class="add-pokemon-btn" onclick="openModal('${zone.id}', 'sun')">+ Ajouter</button>`;
        }
        if (moonSlot) {
            moonSlot.className = 'player-slot moon';
            moonSlot.innerHTML = `<button class="add-pokemon-btn" onclick="openModal('${zone.id}', 'moon')">+ Ajouter</button>`;
        }
    });

    // Remplir avec les données
    const zones = data.zones || {};
    let sunAlive = 0, sunDead = 0, moonAlive = 0, moonDead = 0;

    Object.keys(zones).forEach(zoneId => {
        const zoneData = zones[zoneId];

        if (zoneData.sun) {
            const sunSlot = document.getElementById(`slot-sun-${zoneId}`);
            if (sunSlot) {
                const pokemon = POKEMON_DATA.find(p => p.id === zoneData.sun.id);
                const isDead = zoneData.sun.dead;
                const nickname = zoneData.sun.nickname || '';

                if (isDead) sunDead++; else sunAlive++;

                sunSlot.className = `player-slot sun ${isDead ? 'dead' : ''} ${zoneData.moon ? 'linked' : ''}`;
                sunSlot.innerHTML = renderPokemonSlot(pokemon, zoneId, 'sun', isDead, zoneData.moon, nickname);
            }
        }

        if (zoneData.moon) {
            const moonSlot = document.getElementById(`slot-moon-${zoneId}`);
            if (moonSlot) {
                const pokemon = POKEMON_DATA.find(p => p.id === zoneData.moon.id);
                const isDead = zoneData.moon.dead;
                const nickname = zoneData.moon.nickname || '';

                if (isDead) moonDead++; else moonAlive++;

                moonSlot.className = `player-slot moon ${isDead ? 'dead' : ''} ${zoneData.sun ? 'linked' : ''}`;
                moonSlot.innerHTML = renderPokemonSlot(pokemon, zoneId, 'moon', isDead, zoneData.sun, nickname);
            }
        }
    });

    // Mettre à jour les stats
    document.getElementById('sunAlive').textContent = sunAlive;
    document.getElementById('sunDead').textContent = sunDead;
    document.getElementById('moonAlive').textContent = moonAlive;
    document.getElementById('moonDead').textContent = moonDead;

    // Mettre à jour les selects de combat
    updateBattleSelects();
}

// Rendu d'un slot Pokémon
function renderPokemonSlot(pokemon, zoneId, player, isDead, hasPartner, nickname) {
    if (!pokemon) return '';

    let html = `
        <div class="pokemon-display">
            <img src="${getPokemonSprite(pokemon.id)}" alt="${pokemon.name}">
            <span class="name">${pokemon.name}</span>
            <span class="pokemon-nickname">"${nickname}"</span>
    `;

    // Boutons seulement pour son propre joueur et si pas mort
    if (player === currentPlayer && !isDead) {
        html += `
            <button class="reroll-btn" onclick="rerollNickname('${zoneId}', '${player}')">🎲 Reroll</button>
            <button class="kill-btn" onclick="killPokemon('${zoneId}', '${player}')">☠ Mort</button>
        `;
    }

    html += '</div>';

    // Indicateur de lien
    if (hasPartner) {
        html += '<span class="link-indicator">🔗</span>';
    }

    return html;
}

// Reroll le surnom
function rerollNickname(zoneId, player) {
    dataRef.child(`zones/${zoneId}/${player}/nickname`).set(getRandomNickname());
}

// Ouvrir le modal de sélection
function openModal(zoneId, player) {
    if (player !== currentPlayer) {
        alert(`Tu ne peux ajouter des Pokemon que pour Ultra ${currentPlayer === 'sun' ? 'Soleil' : 'Lune'}`);
        return;
    }

    currentZone = zoneId;
    const zone = ZONES_DATA.find(z => z.id === zoneId);

    document.getElementById('modalZone').textContent = zone ? zone.name : zoneId;
    document.getElementById('pokemonSearch').value = '';

    renderPokemonGrid();

    document.getElementById('pokemonModal').style.display = 'block';
}

// Fermer le modal
function closeModal() {
    document.getElementById('pokemonModal').style.display = 'none';
    currentZone = null;
}

// Rendu de la grille Pokémon
function renderPokemonGrid(filter = '') {
    const grid = document.getElementById('pokemonGrid');
    const filterLower = filter.toLowerCase();

    const filtered = POKEMON_DATA.filter(p =>
        p.name.toLowerCase().includes(filterLower)
    );

    grid.innerHTML = filtered.map(pokemon => `
        <div class="pokemon-option" onclick="selectPokemon(${pokemon.id})">
            <img src="${getPokemonSprite(pokemon.id)}" alt="${pokemon.name}">
            <div class="name">${pokemon.name}</div>
        </div>
    `).join('');
}

// Filtrer les Pokémon
function filterPokemon() {
    const search = document.getElementById('pokemonSearch').value;
    renderPokemonGrid(search);
}

// Sélectionner un Pokémon
function selectPokemon(pokemonId) {
    if (!currentZone) return;

    dataRef.child(`zones/${currentZone}/${currentPlayer}`).set({
        id: pokemonId,
        nickname: getRandomNickname(),
        dead: false,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    closeModal();
}

// Marquer un Pokémon comme mort (Soul Link)
function killPokemon(zoneId, player) {
    if (!confirm('Confirmer la mort de ce Pokemon ? Son partenaire Soul Link mourra aussi !')) {
        return;
    }

    // Marquer les deux comme morts (Soul Link)
    const updates = {};
    updates[`zones/${zoneId}/sun/dead`] = true;
    updates[`zones/${zoneId}/moon/dead`] = true;

    dataRef.update(updates);
}

// Fermer modal si clic en dehors
window.onclick = function(event) {
    const modal = document.getElementById('pokemonModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Raccourci clavier Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Nettoyage à la fermeture
window.addEventListener('beforeunload', () => {
    markOffline();
});

// Admin Panel
const ADMIN_CODE = '123';

function openAdminPanel() {
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('adminCode').value = '';
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminActions').style.display = 'none';
}

function closeAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
}

function checkAdminCode() {
    const code = document.getElementById('adminCode').value;
    if (code === ADMIN_CODE) {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminActions').style.display = 'flex';
    } else {
        alert('❌ Code incorrect !');
    }
}

// Hard refresh - vide le cache et recharge (garde la sélection de joueur)
function hardRefresh() {
    if ('caches' in window) {
        caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
        });
    }
    location.reload(true);
}

// Reset les joueurs (libère sun et moon pour que quelqu'un d'autre puisse choisir)
function resetPlayers() {
    if (!confirm('⚠️ Libérer les deux joueurs ? Chacun devra rechoisir son jeu.')) {
        return;
    }

    // Supprimer les assignations de joueurs
    playersRef.remove().then(() => {
        // Supprimer aussi du localStorage local
        localStorage.removeItem('soulLinkPlayer');
        localStorage.removeItem('soulLinkDeviceId');
        alert('✅ Joueurs réinitialisés ! Rechargement...');
        location.reload(true);
    });
}

// Mettre à jour l'UI des combats
function updateBattlesUI(battles) {
    if (!battles) battles = {};

    let sunWins = 0;
    let moonWins = 0;

    ZONES_DATA.filter(z => z.isBattle).forEach(battle => {
        const battleData = battles[battle.id] || {};
        const card = document.getElementById(`battle-${battle.id}`);
        const resultDiv = document.getElementById(`result-${battle.id}`);

        if (!card || !resultDiv) return;

        // Mettre à jour les équipes sélectionnées
        if (battleData.teams) {
            const maxPokemon = parseInt(battle.rules.charAt(0)) || 6;

            ['sun', 'moon'].forEach(player => {
                const teamData = battleData.teams[player] || {};
                for (let i = 0; i < maxPokemon; i++) {
                    const select = document.querySelector(`#team-slot-${battle.id}-${player}-${i} select`);
                    if (select && teamData[i]) {
                        select.value = teamData[i];
                    }
                }
            });
        }

        // Gérer le gagnant
        if (battleData.winner) {
            card.classList.add('completed');

            const winnerName = battleData.winner === 'sun' ? '☀️ Ultra Soleil' : '🌙 Ultra Lune';
            resultDiv.innerHTML = `<div class="winner-display ${battleData.winner}">🏆 Vainqueur: ${winnerName}</div>`;

            if (battleData.winner === 'sun') sunWins++;
            else moonWins++;
        } else {
            card.classList.remove('completed');
            resultDiv.innerHTML = `
                <button class="winner-btn sun" onclick="setWinner('${battle.id}', 'sun')">☀️ Soleil gagne</button>
                <button class="winner-btn moon" onclick="setWinner('${battle.id}', 'moon')">🌙 Lune gagne</button>
            `;
        }
    });

    // Mettre à jour le score
    const sunWinsEl = document.getElementById('sunWins');
    const moonWinsEl = document.getElementById('moonWins');
    if (sunWinsEl) sunWinsEl.textContent = sunWins;
    if (moonWinsEl) moonWinsEl.textContent = moonWins;
}

// Définir le gagnant d'un combat
function setWinner(battleId, winner) {
    if (!confirm(`Confirmer la victoire de Ultra ${winner === 'sun' ? 'Soleil' : 'Lune'} ?`)) {
        return;
    }

    // Sauvegarder le gagnant
    dataRef.child(`battles/${battleId}`).set({
        winner: winner,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    // Vérifier si ce combat débloque une nouvelle île
    const battle = ZONES_DATA.find(z => z.id === battleId);
    if (battle && battle.unlocksIsland) {
        // Débloquer l'île suivante
        dataRef.child('unlockedIsland').set(battle.unlocksIsland);
    }

    // Combat final débloque les zones spéciales (île 5 = post-game)
    if (battle && battle.isFinal) {
        dataRef.child('unlockedIsland').set(5);
    }
}

// Reset complet de toutes les données
function resetAll() {
    if (!confirm('⚠️ ATTENTION: Supprimer TOUS les Pokémon et combats pour recommencer à zéro ?')) {
        return;
    }
    if (!confirm('Es-tu vraiment sûr ? Cette action est irréversible !')) {
        return;
    }

    // Supprimer toutes les zones, combats et remettre l'île à 1
    Promise.all([
        dataRef.child('zones').remove(),
        dataRef.child('battles').remove(),
        dataRef.child('unlockedIsland').set(1)
    ]).then(() => {
        unlockedIsland = 1;
        renderZones();
        alert('✅ Toutes les données ont été supprimées !');
    }).catch((error) => {
        alert('Erreur: ' + error.message);
    });
}
