// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "soul-link-nuzlocke.firebaseapp.com",
    databaseURL: "https://soul-link-nuzlocke-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "soul-link-nuzlocke",
    storageBucket: "soul-link-nuzlocke.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:xxxxxxxxxxxxxxxx"
};

// Variables globales
let db = null;
let currentSession = null;
let currentPlayer = null; // 'sun' ou 'moon'
let sessionRef = null;
let currentZone = null;
let presenceInterval = null;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si Firebase est disponible
    if (typeof firebase !== 'undefined') {
        try {
            firebase.initializeApp(firebaseConfig);
            db = firebase.database();
        } catch(e) {
            console.log('Firebase non configuré, mode local activé');
        }
    }

    // Vérifier session existante dans localStorage
    const savedSession = localStorage.getItem('soulLinkSession');
    const savedPlayer = localStorage.getItem('soulLinkPlayer');

    if (savedSession && savedPlayer) {
        currentSession = savedSession;
        currentPlayer = savedPlayer;
        startApp();
    }
});

// Créer une nouvelle session
function createSession() {
    currentSession = generateSessionId();
    document.getElementById('playerSelect').style.display = 'block';
    document.getElementById('sessionId').value = currentSession;
}

// Rejoindre une session
function joinSession() {
    const sessionId = document.getElementById('sessionId').value.trim().toUpperCase();
    if (sessionId.length >= 4) {
        currentSession = sessionId;
        document.getElementById('playerSelect').style.display = 'block';
    } else {
        alert('Code de session invalide');
    }
}

// Sélectionner le joueur
function selectPlayer(player) {
    currentPlayer = player;
    localStorage.setItem('soulLinkSession', currentSession);
    localStorage.setItem('soulLinkPlayer', currentPlayer);
    startApp();
}

// Démarrer l'application
function startApp() {
    document.getElementById('sessionSetup').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('currentSession').textContent = currentSession;

    // Initialiser la référence Firebase
    if (db) {
        sessionRef = db.ref('sessions/' + currentSession);
        setupRealtimeListeners();
        setupPresence();
    } else {
        // Mode local - simuler présence
        updatePresenceUI();
    }

    renderZones();
    loadData();

    // Mettre à jour la présence toutes les 30 secondes
    presenceInterval = setInterval(updatePresence, 30000);
    updatePresence();
}

// Configuration des listeners temps réel
function setupRealtimeListeners() {
    if (!sessionRef) return;

    sessionRef.on('value', (snapshot) => {
        const data = snapshot.val() || {};
        updateUI(data);
        updatePresenceUI(data.presence);
    });
}

// Gestion de la présence
function setupPresence() {
    if (!sessionRef) return;

    // Marquer comme hors ligne à la déconnexion
    const presenceRef = sessionRef.child('presence/' + currentPlayer);
    presenceRef.onDisconnect().set({
        online: false,
        lastSeen: firebase.database.ServerValue.TIMESTAMP
    });
}

function updatePresence() {
    const presenceData = {
        online: true,
        lastSeen: Date.now()
    };

    if (sessionRef) {
        sessionRef.child('presence/' + currentPlayer).set(presenceData);
    } else {
        // Mode local
        const data = JSON.parse(localStorage.getItem('soulLinkData_' + currentSession) || '{}');
        if (!data.presence) data.presence = {};
        data.presence[currentPlayer] = presenceData;
        localStorage.setItem('soulLinkData_' + currentSession, JSON.stringify(data));
        updatePresenceUI(data.presence);
    }
}

function updatePresenceUI(presence = {}) {
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
    if (currentPlayer === 'sun') {
        document.getElementById('sunIndicator').style.boxShadow = '0 0 20px rgba(243, 156, 18, 0.5)';
    } else if (currentPlayer === 'moon') {
        document.getElementById('moonIndicator').style.boxShadow = '0 0 20px rgba(155, 89, 182, 0.5)';
    }
}

// Générer un ID de session
function generateSessionId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Rendu des zones
function renderZones() {
    const container = document.getElementById('zonesContainer');
    let currentIsland = '';
    let html = '';

    ZONES_DATA.forEach(zone => {
        if (zone.island !== currentIsland) {
            if (currentIsland !== '') {
                html += '</div>';
            }
            currentIsland = zone.island;
            html += `<div class="island-section"><h2 class="island-title" style="margin: 20px 0 10px; color: #888; font-size: 1.2rem;">${zone.island}</h2>`;
        }

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
    });

    if (currentIsland !== '') {
        html += '</div>';
    }

    container.innerHTML = html;
}

// Charger les données
function loadData() {
    if (sessionRef) {
        sessionRef.once('value').then(snapshot => {
            const data = snapshot.val() || {};
            updateUI(data);
        });
    } else {
        // Mode local sans Firebase
        const localData = JSON.parse(localStorage.getItem('soulLinkData_' + currentSession) || '{}');
        updateUI(localData);
    }
}

// Sauvegarder les données
function saveData(data) {
    if (sessionRef) {
        sessionRef.set(data);
    } else {
        localStorage.setItem('soulLinkData_' + currentSession, JSON.stringify(data));
        updateUI(data);
    }
}

// Obtenir les données actuelles
function getData() {
    return new Promise((resolve) => {
        if (sessionRef) {
            sessionRef.once('value').then(snapshot => {
                resolve(snapshot.val() || {});
            });
        } else {
            const localData = JSON.parse(localStorage.getItem('soulLinkData_' + currentSession) || '{}');
            resolve(localData);
        }
    });
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

    // Mettre à jour la présence
    if (data.presence) {
        updatePresenceUI(data.presence);
    }
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

    // Boutons seulement pour son propre joueur
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
async function rerollNickname(zoneId, player) {
    const data = await getData();

    if (data.zones && data.zones[zoneId] && data.zones[zoneId][player]) {
        data.zones[zoneId][player].nickname = getRandomNickname();
        saveData(data);
    }
}

// Ouvrir le modal de sélection
function openModal(zoneId, player) {
    // Vérifier que c'est bien le joueur courant
    if (player !== currentPlayer) {
        alert(`Tu ne peux ajouter des Pokémon que pour Ultra ${currentPlayer === 'sun' ? 'Soleil' : 'Lune'}`);
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
async function selectPokemon(pokemonId) {
    if (!currentZone) return;

    const data = await getData();

    if (!data.zones) data.zones = {};
    if (!data.zones[currentZone]) data.zones[currentZone] = {};

    data.zones[currentZone][currentPlayer] = {
        id: pokemonId,
        nickname: getRandomNickname(),
        dead: false,
        timestamp: Date.now()
    };

    saveData(data);
    closeModal();
}

// Marquer un Pokémon comme mort (Soul Link)
async function killPokemon(zoneId, player) {
    if (!confirm('Confirmer la mort de ce Pokémon ? Son partenaire Soul Link mourra aussi !')) {
        return;
    }

    const data = await getData();

    if (data.zones && data.zones[zoneId]) {
        // Marquer les deux comme morts (Soul Link)
        if (data.zones[zoneId].sun) {
            data.zones[zoneId].sun.dead = true;
        }
        if (data.zones[zoneId].moon) {
            data.zones[zoneId].moon.dead = true;
        }

        saveData(data);
    }
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
    if (presenceInterval) {
        clearInterval(presenceInterval);
    }
    // Marquer comme hors ligne
    if (sessionRef && currentPlayer) {
        sessionRef.child('presence/' + currentPlayer).update({
            online: false,
            lastSeen: Date.now()
        });
    }
});
