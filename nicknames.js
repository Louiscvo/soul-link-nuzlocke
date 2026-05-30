// Liste de 400 pseudonymes drôles/absurdes pour Pokémon
const NICKNAMES = [
    // Mèmes et culture internet
    "Doge", "Harambe", "Big Chungus", "Stonks", "Amogus", "Shrek", "Shaggy", "Sanic",
    "Nyan Cat", "Grumpy Cat", "Keyboard Cat", "Longcat", "Ceiling Cat", "Cheems", "Bonk",
    "Pepe", "Wojak", "Chad", "Karen", "Boomer", "Zoomer", "Simp", "Poggers", "Monke",
    "Juan", "Pedro", "Ricardo", "Gigachad", "Copium", "Hopium", "Sadge", "Kekw",
    "Pepega", "Omegalul", "Jebaited", "Pog", "Weirdchamp", "Sadchamp", "Widepeepo",

    // Noms français absurdes
    "Gérard", "Hubert", "Gontran", "Fernand", "Norbert", "Gaston", "Eugène", "Marcel",
    "Ginette", "Germaine", "Bernadette", "Josiane", "Mauricette", "Cunégonde", "Gertrude",
    "Jean-Michel", "Jean-Pierre", "Jean-Claude", "Jean-Kévin", "Jean-Eudes", "Jean-Luc",
    "Didier", "Thierry", "Bernard", "Raymond", "Robert", "Roger", "René", "Maurice",
    "Monique", "Simone", "Yvette", "Odette", "Colette", "Paulette", "Georgette", "Lisette",
    "Tonton", "Tata", "Mémé", "Pépé", "Papi", "Mamie", "Dédé", "Momo", "Jojo", "Bibi",
    "Fifi", "Loulou", "Cricri", "Nini", "Zaza", "Coco", "Titi", "Mimi", "Kiki", "Riri",

    // Titres épiques
    "le Magnifique", "le Terrible", "le Destructeur", "l'Invincible", "le Légendaire",
    "le Puissant", "le Glorieux", "le Majestueux", "le Redoutable", "l'Impitoyable",
    "le Conquérant", "le Victorieux", "l'Éternel", "le Suprême", "l'Ultime", "le Divin",
    "le Chaotique", "l'Implacable", "le Furieux", "le Rageux", "le Salty", "le Tryhard",

    // Références pop culture
    "Obiwan", "Yoda", "Vader", "Palpatine", "Grogu", "Anakin", "Padmé", "Leia", "Han",
    "Gandalf", "Frodon", "Sauron", "Gollum", "Aragorn", "Legolas", "Gimli", "Bilbo",
    "Dumbledore", "Voldemort", "Dobby", "Hagrid", "Snape", "Drago", "Hermione", "Ron",
    "Batman", "Joker", "Thanos", "Groot", "Rocket", "Thor", "Loki", "Hulk", "Stark",
    "Goku", "Vegeta", "Naruto", "Sasuke", "Luffy", "Zoro", "Eren", "Levi", "Saitama",

    // Nourriture
    "Saucisse", "Nugget", "Burger", "Pizza", "Kebab", "Tacos", "Sushi", "Ramen",
    "Croissant", "Baguette", "Camembert", "Raclette", "Tartiflette", "Fondue", "Gratin",
    "Cookie", "Brownie", "Muffin", "Donut", "Cupcake", "Pancake", "Waffle", "Crêpe",
    "Poulet", "Steak", "Bacon", "Jambon", "Saucisson", "Pâté", "Rillettes", "Terrine",
    "Frite", "Chips", "Popcorn", "Bretzel", "Nachos", "Guacamole", "Salsa", "Mayo",
    "Ketchup", "Moutarde", "Wasabi", "Sriracha", "Tabasco", "Piment", "Cornichon",

    // Animaux random
    "Canard", "Poulet", "Dinde", "Oie", "Pigeon", "Moineau", "Corbeau", "Mouette",
    "Hamster", "Cochon d'Inde", "Gerbille", "Chinchilla", "Furet", "Hérisson", "Lapin",
    "Castor", "Loutre", "Raton", "Blaireau", "Putois", "Belette", "Martre", "Mouffette",
    "Crapaud", "Grenouille", "Têtard", "Triton", "Salamandre", "Axolotl", "Iguane",

    // Objets du quotidien
    "Grille-Pain", "Micro-Ondes", "Frigo", "Aspirateur", "Tondeuse", "Perceuse",
    "Tournevis", "Marteau", "Clé à Molette", "Pince", "Scie", "Rabot", "Niveau",
    "Chaussette", "Pantoufle", "Tong", "Sandale", "Basket", "Mocassin", "Botte",
    "Parapluie", "Parasol", "Imperméable", "Poncho", "K-Way", "Doudoune", "Parka",
    "Tabouret", "Pouf", "Fauteuil", "Canapé", "Matelas", "Oreiller", "Couette",

    // Expressions françaises
    "Saperlipopette", "Sacrebleu", "Fichtre", "Diantre", "Palsambleu", "Morbleu",
    "Nom d'un Chien", "Crotte de Bique", "Mille Sabords", "Tonnerre de Brest",
    "Crotte alors", "Zut alors", "Flûte alors", "Mince alors", "Purée de Pois",

    // Gaming
    "Noob", "Pro Gamer", "Bot", "AFK", "GG", "EZ", "Ragequit", "Camper", "Rusher",
    "Feeder", "Carry", "Support", "Tank", "DPS", "Healer", "One Shot", "Clutch",
    "Smurf", "Tryharder", "Casual", "Sweat", "Grinder", "Farmer", "Speedrunner",
    "Lag", "Ping", "FPS", "Aimbot", "Wallhack", "Glitch", "Bug", "Exploit",

    // Métiers absurdes
    "Comptable", "Plombier", "Électricien", "Maçon", "Couvreur", "Menuisier",
    "Boulanger", "Pâtissier", "Boucher", "Poissonnier", "Fromager", "Charcutier",
    "Facteur", "Livreur", "Chauffeur", "Pilote", "Capitaine", "Amiral", "Général",
    "Stagiaire", "Manager", "CEO", "Président", "Ministre", "Député", "Sénateur",

    // Adjectifs + noms
    "Petit Pain", "Gros Lard", "Grand Dadais", "Vieux Schnock", "Jeune Padawan",
    "Beau Gosse", "Belle Gosse", "Sacré Numéro", "Drôle d'Oiseau", "Sale Bête",
    "Brave Bête", "Pauvre Type", "Riche Héritier", "Fou Furieux", "Doux Dingue",

    // Onomatopées
    "Boum", "Bam", "Paf", "Splash", "Crash", "Bang", "Pow", "Zap", "Whoosh",
    "Plouf", "Splatch", "Crac", "Vlan", "Badaboum", "Patatras", "Bling", "Ding",
    "Meow", "Woof", "Moo", "Oink", "Quack", "Ribbit", "Hiss", "Roar", "Growl",

    // Pseudo internet français
    "xXDarkSasuke69Xx", "NarutoFan2007", "GamerPro360", "NoScopeKing", "QuickScope",
    "Xx_Shadow_xX", "DarkAngel666", "BlackDragon", "NightWolf", "SilentKiller",
    "SnipeGod", "HeadshotMaster", "AimAssist", "WallBanger", "FlickMaster",

    // Random drôle
    "Patate", "Banane", "Concombre", "Courgette", "Aubergine", "Carotte", "Navet",
    "Poireau", "Oignon", "Échalote", "Ail", "Persil", "Ciboulette", "Basilic",
    "Cacahuète", "Pistache", "Amande", "Noisette", "Noix", "Châtaigne", "Marron",
    "Melon", "Pastèque", "Ananas", "Mangue", "Papaye", "Kiwi", "Litchi", "Goyave",

    // Titres honorifiques
    "Maître", "Docteur", "Professeur", "Capitaine", "Colonel", "Général", "Amiral",
    "Seigneur", "Baron", "Comte", "Duc", "Prince", "Roi", "Empereur", "Dieu",
    "Padawan", "Jedi", "Sith", "Hokage", "Kage", "Sensei", "Sama", "Kun", "Chan",

    // Autres absurdes
    "Kevin", "Enzo", "Dylan", "Bryan", "Jordan", "Steven", "Brandon", "Jason",
    "Chantal", "Christiane", "Micheline", "Jacqueline", "Pascaline", "Jocelyne",
    "Bichon", "Caniche", "Chihuahua", "Teckel", "Carlin", "Bouledogue", "Boxer",
    "Ravioli", "Tortellini", "Spaghetti", "Lasagne", "Gnocchi", "Risotto", "Pesto"
];

// Fonction pour obtenir un pseudonyme aléatoire
function getRandomNickname() {
    return NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)];
}
