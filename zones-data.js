// Zones de capture dans Pokémon Ultra Soleil / Ultra Lune
const ZONES_DATA = [
    // Mele-Mele (Île 1)
    {id: "route1", name: "Route 1", island: "Mele-Mele"},
    {id: "route1_grass", name: "Route 1 (Herbes)", island: "Mele-Mele"},
    {id: "hauoli_outskirts", name: "Périphérie d'Ekaeka", island: "Mele-Mele"},
    {id: "hauoli_city", name: "Ekaeka", island: "Mele-Mele"},
    {id: "route2", name: "Route 2", island: "Mele-Mele"},
    {id: "hauoli_cemetery", name: "Cimetière d'Ekaeka", island: "Mele-Mele"},
    {id: "verdant_cavern", name: "Grotte Verdoyante", island: "Mele-Mele"},
    {id: "route3", name: "Route 3", island: "Mele-Mele"},
    {id: "melemele_meadow", name: "Prairie de Mele-Mele", island: "Mele-Mele"},
    {id: "seaward_cave", name: "Grotte Littorale", island: "Mele-Mele"},
    {id: "kala_bay", name: "Baie de Kala'e", island: "Mele-Mele"},
    {id: "ten_carat_hill", name: "Colline Clapotis", island: "Mele-Mele"},
    {id: "melemele_sea", name: "Mer de Mele-Mele", island: "Mele-Mele"},
    {id: "trainers_school", name: "École des Dresseurs", island: "Mele-Mele"},
    {id: "hau_oli_shopping", name: "Centre Commercial Ekaeka", island: "Mele-Mele"},

    // Akala (Île 2)
    {id: "route4", name: "Route 4", island: "Akala"},
    {id: "paniola_town", name: "Ohana", island: "Akala"},
    {id: "paniola_ranch", name: "Ranch Ohana", island: "Akala"},
    {id: "route5", name: "Route 5", island: "Akala"},
    {id: "brooklet_hill", name: "Colline Ondula", island: "Akala"},
    {id: "route6", name: "Route 6", island: "Akala"},
    {id: "royal_avenue", name: "Avenue Royale", island: "Akala"},
    {id: "route7", name: "Route 7", island: "Akala"},
    {id: "wela_volcano", name: "Volcan Wela", island: "Akala"},
    {id: "route8", name: "Route 8", island: "Akala"},
    {id: "lush_jungle", name: "Jungle Sombrefeuille", island: "Akala"},
    {id: "dividing_peak", name: "Tunnel Diglett", island: "Akala"},
    {id: "route9", name: "Route 9", island: "Akala"},
    {id: "konikoni_city", name: "Konikoni", island: "Akala"},
    {id: "memorial_hill", name: "Colline du Souvenir", island: "Akala"},
    {id: "akala_outskirts", name: "Périphérie d'Akala", island: "Akala"},
    {id: "ruins_of_life", name: "Ruines de la Vie", island: "Akala"},
    {id: "hano_beach", name: "Plage de Hano", island: "Akala"},
    {id: "hano_resort", name: "Resort de Hano", island: "Akala"},
    {id: "akala_sea", name: "Mer d'Akala", island: "Akala"},

    // Ula-Ula (Île 3)
    {id: "route10", name: "Route 10", island: "Ula-Ula"},
    {id: "mount_hokulani", name: "Mont Hokulani", island: "Ula-Ula"},
    {id: "route11", name: "Route 11", island: "Ula-Ula"},
    {id: "route12", name: "Route 12", island: "Ula-Ula"},
    {id: "secluded_shore", name: "Côte Cachée", island: "Ula-Ula"},
    {id: "blush_mountain", name: "Mont Ardent", island: "Ula-Ula"},
    {id: "route13", name: "Route 13", island: "Ula-Ula"},
    {id: "tapu_village", name: "Village Toko", island: "Ula-Ula"},
    {id: "route14", name: "Route 14", island: "Ula-Ula"},
    {id: "thrifty_megamart", name: "Méga Épicerie Abandonnée", island: "Ula-Ula"},
    {id: "route15", name: "Route 15", island: "Ula-Ula"},
    {id: "aether_house", name: "Maison Æther", island: "Ula-Ula"},
    {id: "route16", name: "Route 16", island: "Ula-Ula"},
    {id: "ula_ula_meadow", name: "Prairie d'Ula-Ula", island: "Ula-Ula"},
    {id: "route17", name: "Route 17", island: "Ula-Ula"},
    {id: "po_town", name: "Po Town", island: "Ula-Ula"},
    {id: "malie_city", name: "Malie", island: "Ula-Ula"},
    {id: "malie_garden", name: "Jardin de Malie", island: "Ula-Ula"},
    {id: "outer_cape", name: "Cap Extérieur", island: "Ula-Ula"},
    {id: "mount_lanakila", name: "Mont Lanakila", island: "Ula-Ula"},
    {id: "lake_of_moone", name: "Lac du Croissant (Moon)", island: "Ula-Ula"},
    {id: "lake_of_sunne", name: "Lac du Soleil (Sun)", island: "Ula-Ula"},
    {id: "ruins_abundance", name: "Ruines de l'Abondance", island: "Ula-Ula"},
    {id: "haina_desert", name: "Désert de Haina", island: "Ula-Ula"},
    {id: "ula_ula_sea", name: "Mer d'Ula-Ula", island: "Ula-Ula"},

    // Poni (Île 4)
    {id: "seafolk_village", name: "Village Flottant", island: "Poni"},
    {id: "poni_wilds", name: "Nature Sauvage de Poni", island: "Poni"},
    {id: "ancient_poni_path", name: "Chemin du Vieux Poni", island: "Poni"},
    {id: "poni_breaker_coast", name: "Côte de Poni", island: "Poni"},
    {id: "ruins_of_hope", name: "Ruines de l'Espoir", island: "Poni"},
    {id: "exeggutor_island", name: "Île Noadkoko", island: "Poni"},
    {id: "vast_poni_canyon", name: "Grand Canyon de Poni", island: "Poni"},
    {id: "poni_grove", name: "Bosquet de Poni", island: "Poni"},
    {id: "poni_plains", name: "Plaine de Poni", island: "Poni"},
    {id: "poni_meadow", name: "Prairie de Poni", island: "Poni"},
    {id: "poni_gauntlet", name: "Dédale de Poni", island: "Poni"},
    {id: "resolution_cave", name: "Grotte Résolution", island: "Poni"},
    {id: "poni_sea", name: "Mer de Poni", island: "Poni"},

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

// Combats Rivaux obligatoires entre les deux joueurs
const RIVAL_BATTLES = [
    {
        id: "battle_1",
        name: "Combat Rival #1",
        location: "Après l'Épreuve de Mele-Mele",
        description: "Premier affrontement ! Après avoir battu Rachid.",
        rules: "3v3 - Pas de légendaires"
    },
    {
        id: "battle_2",
        name: "Combat Rival #2",
        location: "Après l'Épreuve d'Akala",
        description: "Combat après avoir battu Kiawe au Volcan Wela.",
        rules: "4v4 - Pas de légendaires"
    },
    {
        id: "battle_3",
        name: "Combat Rival #3",
        location: "Avant le Paradis Æther",
        description: "Dernier combat avant d'infiltrer la Fondation Æther !",
        rules: "5v5 - Pas de légendaires"
    },
    {
        id: "battle_4",
        name: "Combat Rival #4",
        location: "Après Po Town",
        description: "Combat après avoir vaincu Guzma à Po Town.",
        rules: "5v5 - Pas de légendaires"
    },
    {
        id: "battle_5",
        name: "Combat Rival #5",
        location: "Avant Necrozma",
        description: "Combat décisif avant d'affronter Ultra-Necrozma !",
        rules: "6v6 - Pas de légendaires"
    },
    {
        id: "battle_final",
        name: "COMBAT FINAL",
        location: "Avant la Ligue Pokémon",
        description: "Le combat ultime pour déterminer le vrai Champion d'Alola !",
        rules: "6v6 - Équipe complète autorisée"
    }
];
