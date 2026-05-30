// Variables globales
let currentPlayer = null; // 'sun' ou 'moon'
let currentZone = null;
let presenceInterval = null;

// Clé unique pour la sauvegarde
const STORAGE_KEY = 'soulLinkNuzlocke';
const PRESENCE_KEY = 'soulLinkPresence';

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si joueur déjà choisi
    const savedPlayer = localStorage.getItem('soulLinkPlayer');

    if (savedPlayer) {
        currentPlayer = savedPlayer;
        startApp();
    }

    // Mettre à jour la présence au chargement
    updatePresenceUI();
});

// Sélectionner le joueur
function selectPlayer(player) {
    currentPlayer = player;
    localStorage.setItem('soulLinkPlayer', currentPlayer);
    startApp();
}

// Changer de joueur
function changePlayer() {
    // Marquer comme hors ligne avant de changer
    markOffline();
    localStorage.removeItem('soulLinkPlayer');
    currentPlayer = null;
    document.getElementById('sessionSetup').style.display = 'block';
    document.getElementById('mainApp').style.display = 'none';
}

// Démarrer l'application
function startApp() {
    document.getElementById('sessionSetup').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';

    renderZones();
    loadData();

    // Mettre à jour la présence toutes les 10 secondes
    presenceInterval = setInterval(updatePresence, 10000);
    updatePresence();
}

// Gestion de la présence (localStorage partagé)
function updatePresence() {
    const now = Date.now();
    let presence = JSON.parse(localStorage.getItem(PRESENCE_KEY) || '{}');

    presence[currentPlayer] = {
        online: true,
        lastSeen: now
    };

    localStorage.setItem(PRESENCE_KEY, JSON.stringify(presence));
    updatePresenceUI();
}

function markOffline() {
    let presence = JSON.parse(localStorage.getItem(PRESENCE_KEY) || '{}');
    if (presence[currentPlayer]) {
        presence[currentPlayer].online = false;
        presence[currentPlayer].lastSeen = Date.now();
        localStorage.setItem(PRESENCE_KEY, JSON.stringify(presence));
    }
}

function updatePresenceUI() {
    const presence = JSON.parse(localStorage.getItem(PRESENCE_KEY) || '{}');
    const sunStatus = document.getElementById('sunStatus');
    const moonStatus = document.getElementById('moonStatus');

    const now = Date.now();
    const timeout = 30000; // 30 secondes

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
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    updateUI(data);
}

// Sauvegarder les données
function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    updateUI(data);
}

// Obtenir les données actuelles
function getData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
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
    const data = getData();

    if (data.zones && data.zones[zoneId] && data.zones[zoneId][player]) {
        data.zones[zoneId][player].nickname = getRandomNickname();
        saveData(data);
    }
}

// Ouvrir le modal de sélection
function openModal(zoneId, player) {
    // Vérifier que c'est bien le joueur courant
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

    const data = getData();

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
function killPokemon(zoneId, player) {
    if (!confirm('Confirmer la mort de ce Pokemon ? Son partenaire Soul Link mourra aussi !')) {
        return;
    }

    const data = getData();

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
    markOffline();
});

// Rafraîchir les données périodiquement (pour voir les changements de l'autre joueur)
setInterval(() => {
    if (currentPlayer) {
        loadData();
        updatePresenceUI();
    }
}, 3000);
