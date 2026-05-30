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

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si Firebase est disponible
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
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
    }

    renderZones();
    loadData();
}

// Configuration des listeners temps réel
function setupRealtimeListeners() {
    if (!sessionRef) return;

    sessionRef.on('value', (snapshot) => {
        const data = snapshot.val() || {};
        updateUI(data);
    });
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
            html += `<div class="island-section"><h2 class="island-title">${zone.island}</h2>`;
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

                if (isDead) sunDead++; else sunAlive++;

                sunSlot.className = `player-slot sun ${isDead ? 'dead' : ''} ${zoneData.moon ? 'linked' : ''}`;
                sunSlot.innerHTML = renderPokemonSlot(pokemon, zoneId, 'sun', isDead, zoneData.moon);
            }
        }

        if (zoneData.moon) {
            const moonSlot = document.getElementById(`slot-moon-${zoneId}`);
            if (moonSlot) {
                const pokemon = POKEMON_DATA.find(p => p.id === zoneData.moon.id);
                const isDead = zoneData.moon.dead;

                if (isDead) moonDead++; else moonAlive++;

                moonSlot.className = `player-slot moon ${isDead ? 'dead' : ''} ${zoneData.sun ? 'linked' : ''}`;
                moonSlot.innerHTML = renderPokemonSlot(pokemon, zoneId, 'moon', isDead, zoneData.sun);
            }
        }
    });

    // Mettre à jour les stats
    document.getElementById('sunAlive').textContent = sunAlive;
    document.getElementById('sunDead').textContent = sunDead;
    document.getElementById('moonAlive').textContent = moonAlive;
    document.getElementById('moonDead').textContent = moonDead;
}

// Rendu d'un slot Pokémon
function renderPokemonSlot(pokemon, zoneId, player, isDead, hasPartner) {
    if (!pokemon) return '';

    let html = `
        <div class="pokemon-display">
            <img src="${getPokemonSprite(pokemon.id)}" alt="${pokemon.name}">
            <span class="name">${pokemon.name}</span>
    `;

    // Bouton mort seulement pour son propre joueur et si pas déjà mort
    if (player === currentPlayer && !isDead) {
        html += `<button class="kill-btn" onclick="killPokemon('${zoneId}', '${player}')">☠ Mort</button>`;
    }

    html += '</div>';

    // Indicateur de lien
    if (hasPartner) {
        html += '<span class="link-indicator">🔗</span>';
    }

    return html;
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
