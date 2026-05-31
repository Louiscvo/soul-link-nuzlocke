// Zones de capture dans Pokémon Ultra Soleil / Ultra Lune
const ZONES_DATA = [
    // Mele-Mele (Île 1)
    {id: "route1", name: "Route 1", island: "Mele-Mele", islandNum: 1},
    {id: "route1_grass", name: "Route 1 (Herbes)", island: "Mele-Mele", islandNum: 1},
    {id: "hauoli_outskirts", name: "Périphérie d'Ekaeka", island: "Mele-Mele", islandNum: 1},
    {id: "hauoli_city", name: "Ekaeka", island: "Mele-Mele", islandNum: 1},
    {id: "route2", name: "Route 2", island: "Mele-Mele", islandNum: 1},
    {id: "hauoli_cemetery", name: "Cimetière d'Ekaeka", island: "Mele-Mele", islandNum: 1},

    // ⚔️ COMBAT #1
    {id: "battle_1", name: "⚔️ COMBAT #1", island: "Mele-Mele", islandNum: 1, isBattle: true, rules: "2v2", description: "Avant la Grotte Verdoyante"},

    {id: "verdant_cavern", name: "Grotte Verdoyante", island: "Mele-Mele", islandNum: 1},
    {id: "route3", name: "Route 3", island: "Mele-Mele", islandNum: 1},
    {id: "melemele_meadow", name: "Prairie de Mele-Mele", island: "Mele-Mele", islandNum: 1},
    {id: "seaward_cave", name: "Grotte Littorale", island: "Mele-Mele", islandNum: 1},
    {id: "kala_bay", name: "Baie de Kala'e", island: "Mele-Mele", islandNum: 1},
    {id: "ten_carat_hill", name: "Colline Clapotis", island: "Mele-Mele", islandNum: 1},
    {id: "melemele_sea", name: "Mer de Mele-Mele", island: "Mele-Mele", islandNum: 1},
    {id: "trainers_school", name: "École des Dresseurs", island: "Mele-Mele", islandNum: 1},
    {id: "hau_oli_shopping", name: "Centre Commercial Ekaeka", island: "Mele-Mele", islandNum: 1},

    // ⚔️ COMBAT #2 - Fin Mele-Mele
    {id: "battle_2", name: "⚔️ COMBAT #2", island: "Mele-Mele", islandNum: 1, isBattle: true, rules: "3v3", description: "Grande Épreuve de Pectorius", unlocksIsland: 2},

    // Akala (Île 2)
    {id: "route4", name: "Route 4", island: "Akala", islandNum: 2},
    {id: "paniola_town", name: "Ohana", island: "Akala", islandNum: 2},
    {id: "paniola_ranch", name: "Ranch Ohana", island: "Akala", islandNum: 2},
    {id: "route5", name: "Route 5", island: "Akala", islandNum: 2},
    {id: "brooklet_hill", name: "Colline Ondula", island: "Akala", islandNum: 2},

    // ⚔️ COMBAT #3
    {id: "battle_3", name: "⚔️ COMBAT #3", island: "Akala", islandNum: 2, isBattle: true, rules: "3v3", description: "Après l'Épreuve de Barbara"},

    {id: "route6", name: "Route 6", island: "Akala", islandNum: 2},
    {id: "royal_avenue", name: "Avenue Royale", island: "Akala", islandNum: 2},
    {id: "route7", name: "Route 7", island: "Akala", islandNum: 2},
    {id: "wela_volcano", name: "Volcan Wela", island: "Akala", islandNum: 2},

    // ⚔️ COMBAT #4
    {id: "battle_4", name: "⚔️ COMBAT #4", island: "Akala", islandNum: 2, isBattle: true, rules: "4v4", description: "Après l'Épreuve de Kiawe"},

    {id: "route8", name: "Route 8", island: "Akala", islandNum: 2},
    {id: "lush_jungle", name: "Jungle Sombrefeuille", island: "Akala", islandNum: 2},
    {id: "dividing_peak", name: "Tunnel Diglett", island: "Akala", islandNum: 2},
    {id: "route9", name: "Route 9", island: "Akala", islandNum: 2},
    {id: "konikoni_city", name: "Konikoni", island: "Akala", islandNum: 2},
    {id: "memorial_hill", name: "Colline du Souvenir", island: "Akala", islandNum: 2},
    {id: "akala_outskirts", name: "Périphérie d'Akala", island: "Akala", islandNum: 2},
    {id: "ruins_of_life", name: "Ruines de la Vie", island: "Akala", islandNum: 2},
    {id: "hano_beach", name: "Plage de Hano", island: "Akala", islandNum: 2},
    {id: "hano_resort", name: "Resort de Hano", island: "Akala", islandNum: 2},
    {id: "akala_sea", name: "Mer d'Akala", island: "Akala", islandNum: 2},

    // ⚔️ COMBAT #5 - Fin Akala
    {id: "battle_5", name: "⚔️ COMBAT #5", island: "Akala", islandNum: 2, isBattle: true, rules: "4v4", description: "Grande Épreuve d'Alyxia", unlocksIsland: 3},

    // Ula-Ula (Île 3)
    {id: "route10", name: "Route 10", island: "Ula-Ula", islandNum: 3},
    {id: "mount_hokulani", name: "Mont Hokulani", island: "Ula-Ula", islandNum: 3},
    {id: "route11", name: "Route 11", island: "Ula-Ula", islandNum: 3},
    {id: "route12", name: "Route 12", island: "Ula-Ula", islandNum: 3},
    {id: "secluded_shore", name: "Côte Cachée", island: "Ula-Ula", islandNum: 3},
    {id: "blush_mountain", name: "Mont Ardent", island: "Ula-Ula", islandNum: 3},

    // ⚔️ COMBAT #6
    {id: "battle_6", name: "⚔️ COMBAT #6", island: "Ula-Ula", islandNum: 3, isBattle: true, rules: "4v4", description: "Après l'Épreuve de Chrys"},

    {id: "route13", name: "Route 13", island: "Ula-Ula", islandNum: 3},
    {id: "tapu_village", name: "Village Toko", island: "Ula-Ula", islandNum: 3},
    {id: "route14", name: "Route 14", island: "Ula-Ula", islandNum: 3},
    {id: "thrifty_megamart", name: "Méga Épicerie Abandonnée", island: "Ula-Ula", islandNum: 3},

    // ⚔️ COMBAT #7
    {id: "battle_7", name: "⚔️ COMBAT #7", island: "Ula-Ula", islandNum: 3, isBattle: true, rules: "5v5", description: "Après l'Épreuve de Margie"},

    {id: "route15", name: "Route 15", island: "Ula-Ula", islandNum: 3},
    {id: "aether_house", name: "Maison Æther", island: "Ula-Ula", islandNum: 3},
    {id: "route16", name: "Route 16", island: "Ula-Ula", islandNum: 3},
    {id: "ula_ula_meadow", name: "Prairie d'Ula-Ula", island: "Ula-Ula", islandNum: 3},
    {id: "route17", name: "Route 17", island: "Ula-Ula", islandNum: 3},
    {id: "po_town", name: "Po Town", island: "Ula-Ula", islandNum: 3},

    // ⚔️ COMBAT #8
    {id: "battle_8", name: "⚔️ COMBAT #8", island: "Ula-Ula", islandNum: 3, isBattle: true, rules: "5v5", description: "Après avoir vaincu Guzma"},

    {id: "malie_city", name: "Malie", island: "Ula-Ula", islandNum: 3},
    {id: "malie_garden", name: "Jardin de Malie", island: "Ula-Ula", islandNum: 3},
    {id: "outer_cape", name: "Cap Extérieur", island: "Ula-Ula", islandNum: 3},
    {id: "mount_lanakila", name: "Mont Lanakila", island: "Ula-Ula", islandNum: 3},
    {id: "lake_of_moone", name: "Lac du Croissant (Moon)", island: "Ula-Ula", islandNum: 3},
    {id: "lake_of_sunne", name: "Lac du Soleil (Sun)", island: "Ula-Ula", islandNum: 3},
    {id: "ruins_abundance", name: "Ruines de l'Abondance", island: "Ula-Ula", islandNum: 3},
    {id: "haina_desert", name: "Désert de Haina", island: "Ula-Ula", islandNum: 3},
    {id: "ula_ula_sea", name: "Mer d'Ula-Ula", island: "Ula-Ula", islandNum: 3},

    // ⚔️ COMBAT #9 - Fin Ula-Ula
    {id: "battle_9", name: "⚔️ COMBAT #9", island: "Ula-Ula", islandNum: 3, isBattle: true, rules: "5v5", description: "Grande Épreuve d'Aratapec", unlocksIsland: 4},

    // Poni (Île 4)
    {id: "seafolk_village", name: "Village Flottant", island: "Poni", islandNum: 4},
    {id: "poni_wilds", name: "Nature Sauvage de Poni", island: "Poni", islandNum: 4},
    {id: "ancient_poni_path", name: "Chemin du Vieux Poni", island: "Poni", islandNum: 4},
    {id: "poni_breaker_coast", name: "Côte de Poni", island: "Poni", islandNum: 4},
    {id: "ruins_of_hope", name: "Ruines de l'Espoir", island: "Poni", islandNum: 4},

    // ⚔️ COMBAT #10
    {id: "battle_10", name: "⚔️ COMBAT #10", island: "Poni", islandNum: 4, isBattle: true, rules: "5v5", description: "Après les Ruines de l'Espoir"},

    {id: "exeggutor_island", name: "Île Noadkoko", island: "Poni", islandNum: 4},
    {id: "vast_poni_canyon", name: "Grand Canyon de Poni", island: "Poni", islandNum: 4},

    // ⚔️ COMBAT #11
    {id: "battle_11", name: "⚔️ COMBAT #11", island: "Poni", islandNum: 4, isBattle: true, rules: "5v5", description: "Après le Grand Canyon de Poni"},

    {id: "poni_grove", name: "Bosquet de Poni", island: "Poni", islandNum: 4},
    {id: "poni_plains", name: "Plaine de Poni", island: "Poni", islandNum: 4},
    {id: "poni_meadow", name: "Prairie de Poni", island: "Poni", islandNum: 4},
    {id: "poni_gauntlet", name: "Dédale de Poni", island: "Poni", islandNum: 4},
    {id: "resolution_cave", name: "Grotte Résolution", island: "Poni", islandNum: 4},
    {id: "poni_sea", name: "Mer de Poni", island: "Poni", islandNum: 4},

    // ⚔️ COMBAT FINAL - Avant la Ligue
    {id: "battle_final", name: "🏆 COMBAT FINAL", island: "Poni", islandNum: 4, isBattle: true, rules: "6v6", description: "Le combat ultime avant la Ligue Pokémon !", isFinal: true},

    // Ultra Space (Post-game)
    {id: "ultra_space", name: "Ultra-Dimension", island: "Ultra-Espace"},
    {id: "ultra_deep_sea", name: "Ultra-Abysses", island: "Ultra-Espace"},
    {id: "ultra_jungle", name: "Ultra-Jungle", island: "Ultra-Espace"},
    {id: "ultra_desert", name: "Ultra-Désert", island: "Ultra-Espace"},
    {id: "ultra_plant", name: "Ultra-Centrale", island: "Ultra-Espace"},
    {id: "ultra_forest", name: "Ultra-Forêt", island: "Ultra-Espace"},
    {id: "ultra_crater", name: "Ultra-Cratère", island: "Ultra-Espace"},
    {id: "ultra_ruin", name: "Ultra-Ruines", island: "Ultra-Espace"},
    {id: "ultra_megalopolis", name: "Ultra-Mégalopole", island: "Ultra-Espace"},

    // Autres zones spéciales
    {id: "aether_paradise", name: "Paradis Æther", island: "Spécial"},
    {id: "poke_pelago", name: "Poké Loisir", island: "Spécial"},
    {id: "battle_tree", name: "Arbre de Combat", island: "Spécial"},
    {id: "festival_plaza", name: "Festival Plaza", island: "Spécial"},

    // Pêche / Surf spécifiques
    {id: "fishing_route7", name: "Pêche Route 7", island: "Pêche"},
    {id: "fishing_route8", name: "Pêche Route 8", island: "Pêche"},
    {id: "fishing_route9", name: "Pêche Route 9", island: "Pêche"},
    {id: "fishing_route13", name: "Pêche Route 13", island: "Pêche"},
    {id: "fishing_route14", name: "Pêche Route 14", island: "Pêche"},
    {id: "fishing_route15", name: "Pêche Route 15", island: "Pêche"},
    {id: "fishing_poni", name: "Pêche Poni", island: "Pêche"},

    // Island Scan
    {id: "island_scan", name: "Island Scan", island: "Spécial"}
];
