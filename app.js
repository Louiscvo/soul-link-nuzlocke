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

// Liste des 3 joueurs
const PLAYERS = ['louis', 'louka', 'thibault'];
const PLAYER_NAMES = {
    louis: 'Louis (Ultra Sun)',
    louka: 'Louka (Ultra Sun)',
    thibault: 'Thibault (Ultra Moon)'
};
const PLAYER_COLORS = {
    louis: '#f39c12',
    louka: '#e67e22',
    thibault: '#9b59b6'
};

// Variables globales
let db = null;
let currentPlayer = null;
let currentZone = null;
let dataRef = null;
let presenceRef = null;
let playersRef = null;
let deviceId = null;
let currentGameData = {};

// Sons
const SOUNDS = {
    death: new Audio('https://www.myinstants.com/media/sounds/pokemon-faint.mp3'),
    flee: new Audio('https://www.myinstants.com/media/sounds/pokemon-run-away.mp3'),
    victory: new Audio('https://www.myinstants.com/media/sounds/pokemon-victory-pokemon-gold-silver.mp3')
};

Object.values(SOUNDS).forEach(sound => {
    sound.volume = 0.5;
    sound.load();
});

function playSound(soundName) {
    if (SOUNDS[soundName]) {
        SOUNDS[soundName].currentTime = 0;
        SOUNDS[soundName].play().catch(() => {});
    }
}

// Confettis
function createConfetti(player) {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = player === 'thibault'
        ? ['#9b59b6', '#8e44ad', '#a569bd', '#bb8fce']
        : ['#f39c12', '#e67e22', '#f1c40f', '#ff9500'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(confetti);
    }

    setTimeout(() => container.remove(), 5000);
}

// Animations
function playDeathAnimation(zoneId) {
    PLAYERS.forEach(player => {
        const slot = document.getElementById(`slot-${player}-${zoneId}`);
        if (slot) slot.classList.add('death-animation');
    });
    playSound('death');
    setTimeout(() => {
        PLAYERS.forEach(player => {
            const slot = document.getElementById(`slot-${player}-${zoneId}`);
            if (slot) slot.classList.remove('death-animation');
        });
    }, 1000);
}

function playFleeAnimation(zoneId, player) {
    const slot = document.getElementById(`slot-${player}-${zoneId}`);
    if (slot) {
        slot.classList.add('flee-animation');
        playSound('flee');
        setTimeout(() => slot.classList.remove('flee-animation'), 1000);
    }
}

function playVictoryAnimation(winner) {
    const indicator = document.getElementById(`${winner}Indicator`);
    if (indicator) {
        indicator.classList.add('victory-animation');
        playSound('victory');
        createConfetti(winner);
        setTimeout(() => indicator.classList.remove('victory-animation'), 3000);
    }
}

// Device ID
function getDeviceId() {
    let id = localStorage.getItem('soulLinkDeviceId');
    if (!id) {
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
    presenceRef.on('value', (snapshot) => {
        updatePresenceUI(snapshot.val() || {});
    });
    checkPlayerStatus();
});

const MAX_DEVICES_PER_PLAYER = 2;

function checkPlayerStatus() {
    const savedPlayer = localStorage.getItem('soulLinkPlayer');

    playersRef.once('value').then((snapshot) => {
        const players = snapshot.val() || {};

        // Vérifier si ce device a déjà un joueur
        for (const player of PLAYERS) {
            if (players[player] && players[player].devices && players[player].devices[deviceId]) {
                currentPlayer = player;
                localStorage.setItem('soulLinkPlayer', player);
                startApp();
                return;
            }
        }

        // Si on avait un joueur sauvegardé
        if (savedPlayer && PLAYERS.includes(savedPlayer)) {
            const playerData = players[savedPlayer];
            const deviceCount = playerData && playerData.devices ? Object.keys(playerData.devices).length : 0;
            const isMyDevice = playerData && playerData.devices && playerData.devices[deviceId];

            if (!playerData || isMyDevice || deviceCount < MAX_DEVICES_PER_PLAYER) {
                playersRef.child(`${savedPlayer}/devices/${deviceId}`).set({
                    timestamp: firebase.database.ServerValue.TIMESTAMP
                }).then(() => {
                    currentPlayer = savedPlayer;
                    startApp();
                });
                return;
            }
        }

        updatePlayerSelection(players);
    });

    playersRef.on('value', (snapshot) => {
        const players = snapshot.val() || {};
        if (!currentPlayer) {
            updatePlayerSelection(players);
        }
    });
}

function updatePlayerSelection(players) {
    PLAYERS.forEach(player => {
        const btn = document.querySelector(`.game-btn.${player}`);
        if (!btn) return;

        const devices = players[player] && players[player].devices ? Object.keys(players[player].devices) : [];
        const isFull = devices.length >= MAX_DEVICES_PER_PLAYER && !devices.includes(deviceId);

        if (isFull) {
            btn.classList.add('player-taken');
            btn.onclick = null;
        } else {
            btn.classList.remove('player-taken');
            btn.onclick = () => selectPlayer(player);
        }
    });
}

function selectPlayer(player) {
    playersRef.child(player).once('value').then((snapshot) => {
        const data = snapshot.val();
        const devices = data && data.devices ? Object.keys(data.devices) : [];

        if (devices.length >= MAX_DEVICES_PER_PLAYER && !devices.includes(deviceId)) {
            alert('Ce joueur a déjà 2 appareils enregistrés !');
            return;
        }

        playersRef.child(`${player}/devices/${deviceId}`).set({
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            currentPlayer = player;
            localStorage.setItem('soulLinkPlayer', currentPlayer);
            startApp();
        });
    });
}

function startApp() {
    document.getElementById('sessionSetup').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';

    // Rendre toutes les zones immédiatement
    renderZones();

    dataRef.on('value', (snapshot) => {
        const data = snapshot.val() || {};
        currentGameData = data;
        updateUI(data);
        updateBattlesUI(data.battles);
    });

    setupPresence();
}

function setupPresence() {
    const myPresenceRef = presenceRef.child(currentPlayer);

    myPresenceRef.set({
        online: true,
        lastSeen: firebase.database.ServerValue.TIMESTAMP
    });

    myPresenceRef.onDisconnect().set({
        online: false,
        lastSeen: firebase.database.ServerValue.TIMESTAMP
    });

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
    const now = Date.now();
    const timeout = 60000;

    PLAYERS.forEach(player => {
        const status = document.getElementById(`${player}Status`);
        const indicator = document.getElementById(`${player}Indicator`);

        if (status) {
            if (presence[player] && presence[player].online && (now - presence[player].lastSeen) < timeout) {
                status.className = 'status-dot online';
            } else {
                status.className = 'status-dot offline';
            }
        }

        if (indicator) {
            if (currentPlayer === player) {
                indicator.style.boxShadow = `0 0 20px ${PLAYER_COLORS[player]}`;
            } else {
                indicator.style.boxShadow = 'none';
            }
        }
    });
}

// Rendu des zones - TOUTES les zones visibles
function renderZones() {
    const container = document.getElementById('zonesContainer');
    let currentIsland = '';
    let html = '';

    // Toutes les zones sont visibles
    ZONES_DATA.forEach(zone => {
        if (zone.island !== currentIsland) {
            if (currentIsland !== '') {
                html += '</div>';
            }
            currentIsland = zone.island;
            html += `<div class="island-section"><h2 class="island-title">${zone.island}</h2>`;
        }

        if (zone.isBattle) {
            html += renderBattleCard(zone);
        } else {
            html += `
                <div class="zone-card" data-zone="${zone.id}">
                    <div class="zone-info">
                        <div class="zone-name">${zone.name}</div>
                    </div>
                    <div class="player-slot louis" id="slot-louis-${zone.id}">
                        <button class="add-pokemon-btn" onclick="openModal('${zone.id}', 'louis')">+ Louis</button>
                    </div>
                    <div class="player-slot louka" id="slot-louka-${zone.id}">
                        <button class="add-pokemon-btn" onclick="openModal('${zone.id}', 'louka')">+ Louka</button>
                    </div>
                    <div class="player-slot thibault" id="slot-thibault-${zone.id}">
                        <button class="add-pokemon-btn" onclick="openModal('${zone.id}', 'thibault')">+ Thibault</button>
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

// Rendu d'une carte de combat avec tournoi complet (3 joueurs)
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

            <!-- Sélection des équipes -->
            <div class="battle-teams-section">
                <div class="team-title">📋 Équipes pour ce combat</div>
                <div class="teams-grid">
                    <div class="team-column louis">
                        <div class="team-header">🌞 Louis</div>
                        <div class="team-selects" id="team-louis-${battle.id}">
                            ${renderTeamSelects(battle.id, 'louis', maxPokemon)}
                        </div>
                    </div>
                    <div class="team-column louka">
                        <div class="team-header">🌞 Louka</div>
                        <div class="team-selects" id="team-louka-${battle.id}">
                            ${renderTeamSelects(battle.id, 'louka', maxPokemon)}
                        </div>
                    </div>
                    <div class="team-column thibault">
                        <div class="team-header">🌙 Thibault</div>
                        <div class="team-selects" id="team-thibault-${battle.id}">
                            ${renderTeamSelects(battle.id, 'thibault', maxPokemon)}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tournoi: 3 matchs + Finale -->
            <div class="battle-bracket-full">
                <!-- PHASE DE POULES: 3 matchs -->
                <div class="pool-phase">
                    <div class="pool-title">📊 Phase de poules</div>
                    <div class="pool-matches">
                        <!-- Match 1: Louis vs Louka -->
                        <div class="pool-match" id="pool1-${battle.id}">
                            <span class="pool-label">Match 1</span>
                            <div class="pool-players">
                                <span class="pool-player louis">🌞 Louis</span>
                                <span class="vs-small">vs</span>
                                <span class="pool-player louka">🌞 Louka</span>
                            </div>
                            <div class="pool-winner-btns" id="pool1-btns-${battle.id}">
                                <button class="pool-btn louis" onclick="setPoolWinner('${battle.id}', 1, 'louis')">Louis</button>
                                <button class="pool-btn louka" onclick="setPoolWinner('${battle.id}', 1, 'louka')">Louka</button>
                            </div>
                        </div>

                        <!-- Match 2: Louka vs Thibault -->
                        <div class="pool-match" id="pool2-${battle.id}">
                            <span class="pool-label">Match 2</span>
                            <div class="pool-players">
                                <span class="pool-player louka">🌞 Louka</span>
                                <span class="vs-small">vs</span>
                                <span class="pool-player thibault">🌙 Thibault</span>
                            </div>
                            <div class="pool-winner-btns" id="pool2-btns-${battle.id}">
                                <button class="pool-btn louka" onclick="setPoolWinner('${battle.id}', 2, 'louka')">Louka</button>
                                <button class="pool-btn thibault" onclick="setPoolWinner('${battle.id}', 2, 'thibault')">Thibault</button>
                            </div>
                        </div>

                        <!-- Match 3: Louis vs Thibault -->
                        <div class="pool-match" id="pool3-${battle.id}">
                            <span class="pool-label">Match 3</span>
                            <div class="pool-players">
                                <span class="pool-player louis">🌞 Louis</span>
                                <span class="vs-small">vs</span>
                                <span class="pool-player thibault">🌙 Thibault</span>
                            </div>
                            <div class="pool-winner-btns" id="pool3-btns-${battle.id}">
                                <button class="pool-btn louis" onclick="setPoolWinner('${battle.id}', 3, 'louis')">Louis</button>
                                <button class="pool-btn thibault" onclick="setPoolWinner('${battle.id}', 3, 'thibault')">Thibault</button>
                            </div>
                        </div>
                    </div>

                    <!-- Tableau des scores -->
                    <div class="pool-standings" id="standings-${battle.id}">
                        <div class="standing-row louis"><span>🌞 Louis</span><span class="wins" id="wins-louis-${battle.id}">0</span></div>
                        <div class="standing-row louka"><span>🌞 Louka</span><span class="wins" id="wins-louka-${battle.id}">0</span></div>
                        <div class="standing-row thibault"><span>🌙 Thibault</span><span class="wins" id="wins-thibault-${battle.id}">0</span></div>
                    </div>
                </div>

                <!-- FINALE -->
                <div class="final-phase" id="final-phase-${battle.id}">
                    <div class="final-title">🏆 FINALE</div>
                    <div class="final-matchup" id="final-matchup-${battle.id}">
                        <span class="finalist" id="finalist1-${battle.id}">?</span>
                        <span class="vs-final">VS</span>
                        <span class="finalist" id="finalist2-${battle.id}">?</span>
                    </div>
                    <div class="final-btns" id="final-btns-${battle.id}">
                        <button class="final-winner-btn" id="final-btn1-${battle.id}" onclick="setFinalWinner('${battle.id}', 1)">🏆 Champion</button>
                        <button class="final-winner-btn" id="final-btn2-${battle.id}" onclick="setFinalWinner('${battle.id}', 2)">🏆 Champion</button>
                    </div>
                </div>
            </div>

            <div class="battle-final-result" id="result-${battle.id}"></div>
        </div>
    `;
    return html;
}

// Rendu des selects d'équipe pour un joueur
function renderTeamSelects(battleId, player, maxPokemon) {
    let html = '';
    for (let i = 0; i < maxPokemon; i++) {
        html += `
            <select class="team-pokemon-select" id="team-${battleId}-${player}-${i}"
                    onchange="selectTeamPokemon('${battleId}', '${player}', ${i}, this.value)"
                    ${player !== currentPlayer ? 'disabled' : ''}>
                <option value="">Slot ${i + 1}</option>
            </select>
        `;
    }
    return html;
}

// Sélectionner un Pokémon pour l'équipe
function selectTeamPokemon(battleId, player, slot, zoneId) {
    if (!zoneId) {
        dataRef.child(`battles/${battleId}/teams/${player}/${slot}`).remove();
    } else {
        dataRef.child(`battles/${battleId}/teams/${player}/${slot}`).set(zoneId);
    }
}

// Définir le gagnant d'un match de poule
function setPoolWinner(battleId, matchNum, winner) {
    if (!confirm(`Confirmer la victoire de ${PLAYER_NAMES[winner]} au Match ${matchNum} ?`)) {
        return;
    }

    playVictoryAnimation(winner);

    dataRef.child(`battles/${battleId}/pool/match${matchNum}`).set({
        winner: winner,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
}

// Définir le gagnant de la finale
function setFinalWinner(battleId, playerNum) {
    dataRef.child(`battles/${battleId}`).once('value').then(snap => {
        const battleData = snap.val() || {};
        const finalists = getFinalists(battleData.pool);

        if (finalists.length < 2) {
            alert('Les 3 matchs de poule doivent être terminés !');
            return;
        }

        const winner = playerNum === 1 ? finalists[0] : finalists[1];

        if (!confirm(`Confirmer la victoire FINALE de ${PLAYER_NAMES[winner]} ?`)) {
            return;
        }

        playVictoryAnimation(winner);

        dataRef.child(`battles/${battleId}`).update({
            winner: winner,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    });
}

// Calculer les victoires de chaque joueur dans la poule
function getPoolStandings(pool) {
    const wins = { louis: 0, louka: 0, thibault: 0 };

    if (pool) {
        if (pool.match1 && pool.match1.winner) wins[pool.match1.winner]++;
        if (pool.match2 && pool.match2.winner) wins[pool.match2.winner]++;
        if (pool.match3 && pool.match3.winner) wins[pool.match3.winner]++;
    }

    return wins;
}

// Déterminer les 2 finalistes (les 2 meilleurs)
function getFinalists(pool) {
    const wins = getPoolStandings(pool);

    // Trier par victoires
    const sorted = Object.entries(wins).sort((a, b) => b[1] - a[1]);

    // Si tout le monde a 1 victoire (égalité parfaite), on prend les 2 premiers alphabétiquement
    // Sinon on prend les 2 avec le plus de victoires
    if (sorted[0][1] === sorted[1][1] && sorted[1][1] === sorted[2][1]) {
        // Égalité totale - on prend Louis et Louka par défaut
        return ['louis', 'louka'];
    }

    // Les 2 meilleurs
    return [sorted[0][0], sorted[1][0]];
}

// Obtenir les Pokémon vivants d'un joueur
function getAlivePokemon(player) {
    const zones = currentGameData.zones || {};
    const alivePokemon = [];

    Object.keys(zones).forEach(zoneId => {
        const zoneData = zones[zoneId];
        if (zoneData[player] && !zoneData[player].dead && !zoneData[player].fled) {
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

// Mettre à jour les selects d'équipe avec les Pokémon vivants
function updateBattleSelects() {
    const pokemonByPlayer = {};
    PLAYERS.forEach(p => {
        pokemonByPlayer[p] = getAlivePokemon(p);
    });

    ZONES_DATA.filter(z => z.isBattle).forEach(battle => {
        const maxPokemon = parseInt(battle.rules.charAt(0)) || 6;
        const battleData = (currentGameData.battles && currentGameData.battles[battle.id]) || {};
        const teams = battleData.teams || {};

        PLAYERS.forEach(player => {
            const playerTeam = teams[player] || {};
            const pokemons = pokemonByPlayer[player];

            for (let i = 0; i < maxPokemon; i++) {
                const select = document.getElementById(`team-${battle.id}-${player}-${i}`);
                if (select) {
                    const currentValue = playerTeam[i] || '';
                    select.innerHTML = `<option value="">Slot ${i + 1}</option>`;
                    pokemons.forEach(p => {
                        const pokemon = POKEMON_DATA.find(pk => pk.id === p.id);
                        const name = pokemon ? pokemon.name : 'Pokemon';
                        select.innerHTML += `<option value="${p.zoneId}" ${currentValue === p.zoneId ? 'selected' : ''}>${name} "${p.nickname}"</option>`;
                    });
                    select.disabled = player !== currentPlayer;
                }
            }
        });
    });
}

// Mettre à jour l'interface
function updateUI(data) {
    // Reset tous les slots
    ZONES_DATA.filter(z => !z.isBattle).forEach(zone => {
        PLAYERS.forEach(player => {
            const slot = document.getElementById(`slot-${player}-${zone.id}`);
            if (slot) {
                slot.className = `player-slot ${player}`;
                slot.innerHTML = `<button class="add-pokemon-btn" onclick="openModal('${zone.id}', '${player}')">+ ${player.charAt(0).toUpperCase() + player.slice(1)}</button>`;
            }
        });
    });

    // Remplir avec les données
    const zones = data.zones || {};
    const stats = {};
    PLAYERS.forEach(p => { stats[p] = { alive: 0, dead: 0 }; });

    Object.keys(zones).forEach(zoneId => {
        const zoneData = zones[zoneId];

        PLAYERS.forEach(player => {
            if (zoneData[player]) {
                const slot = document.getElementById(`slot-${player}-${zoneId}`);
                if (slot) {
                    const pokemon = POKEMON_DATA.find(p => p.id === zoneData[player].id);
                    const isDead = zoneData[player].dead;
                    const nickname = zoneData[player].nickname || '';
                    const deathCount = zoneData[player].deathCount || 0;
                    const fled = zoneData[player].fled || false;

                    // Compter les partenaires liés
                    const partnerCount = PLAYERS.filter(p => p !== player && zoneData[p]).length;

                    if (isDead || fled) stats[player].dead++; else stats[player].alive++;

                    slot.className = `player-slot ${player} ${isDead ? 'dead' : ''} ${fled ? 'fled' : ''} ${partnerCount > 0 ? 'linked' : ''}`;
                    slot.innerHTML = renderPokemonSlot(pokemon, zoneId, player, isDead, partnerCount > 0, nickname, deathCount, fled);
                }
            }
        });
    });

    // Mettre à jour les stats
    PLAYERS.forEach(player => {
        const aliveEl = document.getElementById(`${player}Alive`);
        const deadEl = document.getElementById(`${player}Dead`);
        if (aliveEl) aliveEl.textContent = stats[player].alive;
        if (deadEl) deadEl.textContent = stats[player].dead;
    });

    // Mettre à jour les selects de combat
    updateBattleSelects();
}

function renderPokemonSlot(pokemon, zoneId, player, isDead, hasPartner, nickname, deathCount, fled) {
    if (!pokemon) return '';

    deathCount = deathCount || 0;
    const lives = 3 - deathCount;

    let html = `
        <div class="pokemon-display ${fled ? 'fled' : ''}">
            <img src="${getPokemonSprite(pokemon.id)}" alt="${pokemon.name}">
            <span class="name">${pokemon.name}</span>
            <span class="pokemon-nickname">"${nickname}"</span>
    `;

    if (!isDead && !fled) {
        html += `<span class="lives">❤️ ${lives}/3</span>`;
    }

    if (fled) {
        html += `<span class="fled-indicator">💨 Enfui</span>`;
    }

    if (player === currentPlayer && !isDead && !fled) {
        html += `
            <button class="edit-btn" onclick="editNickname('${zoneId}', '${player}')">✏️ Modifier</button>
            <button class="reroll-btn" onclick="rerollNickname('${zoneId}', '${player}')">🎲 Random</button>
            <button class="kill-btn" onclick="killPokemon('${zoneId}', '${player}')">☠ Mort</button>
            <button class="flee-btn" onclick="fleePokemon('${zoneId}', '${player}')">💨 Enfui</button>
        `;
    }

    html += '</div>';

    if (hasPartner) {
        html += '<span class="link-indicator">🔗</span>';
    }

    return html;
}

function rerollNickname(zoneId, player) {
    dataRef.child(`zones/${zoneId}/${player}/nickname`).set(getRandomNickname());
}

// Modifier manuellement le surnom d'un Pokémon
function editNickname(zoneId, player) {
    if (player !== currentPlayer) {
        alert('Tu ne peux modifier que tes propres Pokémon !');
        return;
    }

    dataRef.child(`zones/${zoneId}/${player}/nickname`).once('value').then(snap => {
        const currentNickname = snap.val() || '';
        const newNickname = prompt('Nouveau surnom:', currentNickname);

        if (newNickname !== null && newNickname.trim() !== '') {
            dataRef.child(`zones/${zoneId}/${player}/nickname`).set(newNickname.trim());
        }
    });
}

function openModal(zoneId, player) {
    if (player !== currentPlayer) {
        alert(`Tu ne peux ajouter des Pokemon que pour ${PLAYER_NAMES[currentPlayer]}`);
        return;
    }

    currentZone = zoneId;
    const zone = ZONES_DATA.find(z => z.id === zoneId);

    document.getElementById('modalZone').textContent = zone ? zone.name : zoneId;
    document.getElementById('pokemonSearch').value = '';

    renderPokemonGrid();

    document.getElementById('pokemonModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('pokemonModal').style.display = 'none';
    currentZone = null;
}

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

function filterPokemon() {
    const search = document.getElementById('pokemonSearch').value;
    renderPokemonGrid(search);
}

function selectPokemon(pokemonId) {
    if (!currentZone) return;

    dataRef.child(`zones/${currentZone}/${currentPlayer}`).set({
        id: pokemonId,
        nickname: getRandomNickname(),
        dead: false,
        deathCount: 0,
        fled: false,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    closeModal();
}

// Mort Soul Link pour 3 joueurs
function killPokemon(zoneId, player) {
    dataRef.child(`zones/${zoneId}`).once('value').then((snapshot) => {
        const zoneData = snapshot.val() || {};

        // Calculer les nouvelles morts pour tous les joueurs présents
        const updates = {};
        let anyWillDie = false;

        PLAYERS.forEach(p => {
            if (zoneData[p]) {
                const deaths = (zoneData[p].deathCount || 0) + 1;
                updates[`zones/${zoneId}/${p}/deathCount`] = deaths;
                if (deaths >= 3) {
                    updates[`zones/${zoneId}/${p}/dead`] = true;
                    anyWillDie = true;
                }
            }
        });

        if (anyWillDie) {
            if (!confirm('⚠️ C\'est la 3ème mort ! Les Pokémon liés seront définitivement morts. Confirmer ?')) {
                return;
            }
        }

        playDeathAnimation(zoneId);
        dataRef.update(updates);
    });
}

function fleePokemon(zoneId, player) {
    if (!confirm('Ce Pokémon s\'est enfui ? Il sera perdu pour cette zone.')) {
        return;
    }

    playFleeAnimation(zoneId, player);

    dataRef.child(`zones/${zoneId}/${player}`).update({
        fled: true
    });
}

window.onclick = function(event) {
    const modal = document.getElementById('pokemonModal');
    if (event.target === modal) {
        closeModal();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

window.addEventListener('beforeunload', () => {
    markOffline();
});

function hardRefresh() {
    if ('caches' in window) {
        caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
        });
    }
    location.reload(true);
}

function resetPlayers() {
    playersRef.remove().then(() => {
        localStorage.removeItem('soulLinkPlayer');
        localStorage.removeItem('soulLinkDeviceId');
        location.reload(true);
    });
}

function updateBattlesUI(battles) {
    if (!battles) battles = {};

    const totalWins = {};
    PLAYERS.forEach(p => { totalWins[p] = 0; });

    ZONES_DATA.filter(z => z.isBattle).forEach(battle => {
        const battleData = battles[battle.id] || {};
        const card = document.getElementById(`battle-${battle.id}`);
        const resultDiv = document.getElementById(`result-${battle.id}`);

        if (!card || !resultDiv) return;

        const pool = battleData.pool || {};

        // Mettre à jour les matchs de poule
        [1, 2, 3].forEach(matchNum => {
            const btnsDiv = document.getElementById(`pool${matchNum}-btns-${battle.id}`);
            if (btnsDiv && pool[`match${matchNum}`] && pool[`match${matchNum}`].winner) {
                const winner = pool[`match${matchNum}`].winner;
                btnsDiv.innerHTML = `<div class="pool-winner ${winner}">✓ ${PLAYER_NAMES[winner]}</div>`;
            }
        });

        // Mettre à jour le tableau des scores
        const standings = getPoolStandings(pool);
        PLAYERS.forEach(player => {
            const winsEl = document.getElementById(`wins-${player}-${battle.id}`);
            if (winsEl) winsEl.textContent = standings[player];
        });

        // Vérifier si les 3 matchs sont terminés
        const poolComplete = pool.match1 && pool.match2 && pool.match3;

        // Mettre à jour les finalistes
        const finalist1El = document.getElementById(`finalist1-${battle.id}`);
        const finalist2El = document.getElementById(`finalist2-${battle.id}`);
        const finalPhase = document.getElementById(`final-phase-${battle.id}`);

        if (poolComplete) {
            const finalists = getFinalists(pool);
            if (finalist1El) {
                finalist1El.textContent = PLAYER_NAMES[finalists[0]];
                finalist1El.className = `finalist ${finalists[0]}`;
            }
            if (finalist2El) {
                finalist2El.textContent = PLAYER_NAMES[finalists[1]];
                finalist2El.className = `finalist ${finalists[1]}`;
            }
            if (finalPhase) finalPhase.classList.add('active');

            // Mettre à jour les boutons de finale
            const btn1 = document.getElementById(`final-btn1-${battle.id}`);
            const btn2 = document.getElementById(`final-btn2-${battle.id}`);
            if (btn1) btn1.className = `final-winner-btn ${finalists[0]}`;
            if (btn2) btn2.className = `final-winner-btn ${finalists[1]}`;
        }

        // Gérer le gagnant final
        if (battleData.winner) {
            card.classList.add('completed');
            const winnerName = PLAYER_NAMES[battleData.winner];
            resultDiv.innerHTML = `<div class="winner-display ${battleData.winner}">🏆 CHAMPION: ${winnerName}</div>`;

            // Cacher les boutons de finale
            const finalBtns = document.getElementById(`final-btns-${battle.id}`);
            if (finalBtns) finalBtns.style.display = 'none';

            totalWins[battleData.winner]++;
        } else {
            card.classList.remove('completed');
            resultDiv.innerHTML = '';
        }
    });

    // Mettre à jour le score global
    PLAYERS.forEach(player => {
        const winsEl = document.getElementById(`${player}Wins`);
        if (winsEl) winsEl.textContent = totalWins[player];
    });
}

function resetAll() {
    if (!confirm('Supprimer TOUTES les données ? Cette action est irréversible !')) {
        return;
    }

    Promise.all([
        dataRef.child('zones').remove(),
        dataRef.child('battles').remove()
    ]).then(() => {
        renderZones();
    });
}
