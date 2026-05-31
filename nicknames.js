// Liste de 400+ pseudonymes drôles/absurdes pour Pokémon
// Inspirés de mèmes, YouTubeurs FR, pop culture, jeux vidéo
const NICKNAMES = [
    // ═══════════════════════════════════════════════════════════════
    // MÈMES INTERNET CLASSIQUES
    // ═══════════════════════════════════════════════════════════════
    "Doge", "Harambe", "Big Chungus", "Stonks", "Amogus", "Shrek", "Shaggy", "Sanic",
    "Nyan Cat", "Grumpy Cat", "Keyboard Cat", "Longcat", "Ceiling Cat", "Cheems", "Bonk",
    "Pepe", "Wojak", "Chad", "Karen", "Boomer", "Zoomer", "Simp", "Poggers", "Monke",
    "Juan", "Pedro", "Ricardo", "Gigachad", "Copium", "Hopium", "Sadge", "Kekw",
    "Pepega", "Omegalul", "Jebaited", "Pog", "Weirdchamp", "Sadchamp", "Widepeepo",
    "Rickroll", "Loss", "E", "Oof", "Bruh", "Sus", "Impostor", "Sussy Baka",
    "Ohio", "Skibidi", "Gyatt", "Rizz", "Sigma", "Ligma", "Candice", "Deez Nuts",
    "It's Wednesday", "Press F", "OK Boomer", "No U", "Uno Reverse", "NPC Energy",

    // ═══════════════════════════════════════════════════════════════
    // YOUTUBEURS FRANÇAIS - Références Nuzlocke/Gaming
    // ═══════════════════════════════════════════════════════════════
    // Fildrong & Sneaze références
    "Patoche", "Fildrong", "Sneaze", "Bushido", "Soul Linké",
    "Redemption", "TheGuill84", "Vohlt", "Maitre Armand",

    // Streamers/YouTubeurs FR Gaming
    "Squeezie", "Cyprien", "Bigorneaux", "Coquillages", "Gotaga",
    "Zerator", "Sardoche", "Ponce", "Laink", "Terracid",
    "Bibi", "Petit Veine", "Les Meules", "Kameto", "Locklear",
    "Domingo", "Joueur du Grenier", "Benzaie", "Bob Lennon",
    "Newtiteuf", "Pokémon Trash", "Mickalow", "Pokémon Challenges",

    // Expressions YouTubeurs FR
    "Yo tout l'monde", "C'est Squeezie", "Bref", "Wesh alors",
    "Ça fait plais", "GG WP", "Z Event", "Popcorn Double Beurre",

    // ═══════════════════════════════════════════════════════════════
    // NOMS FRANÇAIS ABSURDES
    // ═══════════════════════════════════════════════════════════════
    "Gérard", "Hubert", "Gontran", "Fernand", "Norbert", "Gaston", "Eugène", "Marcel",
    "Ginette", "Germaine", "Bernadette", "Josiane", "Mauricette", "Cunégonde", "Gertrude",
    "Jean-Michel", "Jean-Pierre", "Jean-Claude", "Jean-Kévin", "Jean-Eudes", "Jean-Luc",
    "Didier", "Thierry", "Bernard", "Raymond", "Robert", "Roger", "René", "Maurice",
    "Monique", "Simone", "Yvette", "Odette", "Colette", "Paulette", "Georgette", "Lisette",
    "Tonton", "Tata", "Mémé", "Pépé", "Papi", "Mamie", "Dédé", "Momo", "Jojo", "Bibi",
    "Fifi", "Loulou", "Cricri", "Nini", "Zaza", "Coco", "Titi", "Mimi", "Kiki", "Riri",
    "Alphonse", "Barnabé", "Célestin", "Dieudonné", "Eustache", "Flavien", "Gratien",
    "Hippolyte", "Isidore", "Jérémie", "Kléber", "Léopold", "Médéric", "Narcisse",
    "Onésime", "Prosper", "Quentin", "Régis", "Sylvestre", "Théophile", "Urbain",

    // ═══════════════════════════════════════════════════════════════
    // TITRES ÉPIQUES
    // ═══════════════════════════════════════════════════════════════
    "le Magnifique", "le Terrible", "le Destructeur", "l'Invincible", "le Légendaire",
    "le Puissant", "le Glorieux", "le Majestueux", "le Redoutable", "l'Impitoyable",
    "le Conquérant", "le Victorieux", "l'Éternel", "le Suprême", "l'Ultime", "le Divin",
    "le Chaotique", "l'Implacable", "le Furieux", "le Rageux", "le Salty", "le Tryhard",
    "le Briseur", "le Fléau", "l'Élu", "le Maudit", "le Béni", "l'Ancien", "le Sage",

    // ═══════════════════════════════════════════════════════════════
    // POP CULTURE - Films/Séries/Anime
    // ═══════════════════════════════════════════════════════════════
    // Star Wars
    "Obiwan", "Yoda", "Vader", "Palpatine", "Grogu", "Anakin", "Padmé", "Leia", "Han",
    "Chewbacca", "R2D2", "C3PO", "Kylo Ren", "Rey", "Maul", "Boba Fett", "Mandalorian",

    // Le Seigneur des Anneaux
    "Gandalf", "Frodon", "Sauron", "Gollum", "Aragorn", "Legolas", "Gimli", "Bilbo",
    "Samsagace", "Merry", "Pippin", "Boromir", "Faramir", "Eowyn", "Theoden", "Elrond",

    // Harry Potter
    "Dumbledore", "Voldemort", "Dobby", "Hagrid", "Snape", "Drago", "Hermione", "Ron",
    "Sirius", "Remus", "Neville", "Luna", "Ginny", "Bellatrix", "Lucius", "Hedwige",

    // Marvel/DC
    "Batman", "Joker", "Thanos", "Groot", "Rocket", "Thor", "Loki", "Hulk", "Stark",
    "Spider-Man", "Deadpool", "Wolverine", "Magneto", "Xavier", "Venom", "Carnage",
    "Superman", "Wonder Woman", "Aquaman", "Flash", "Harley Quinn", "Catwoman",

    // Anime
    "Goku", "Vegeta", "Naruto", "Sasuke", "Luffy", "Zoro", "Eren", "Levi", "Saitama",
    "Tanjiro", "Nezuko", "Gojo", "Sukuna", "Itachi", "Kakashi", "Jiraiya", "Madara",
    "Deku", "All Might", "Bakugo", "Todoroki", "Light", "L", "Ryuk", "Misa",
    "Edward Elric", "Alphonse", "Roy Mustang", "Lelouch", "Spike Spiegel",

    // Disney/Pixar
    "Simba", "Mufasa", "Scar", "Timon", "Pumba", "Buzz", "Woody", "Nemo", "Dory",
    "Elsa", "Olaf", "Stitch", "Maui", "Moana", "Ratatouille", "Wall-E", "Eve",

    // ═══════════════════════════════════════════════════════════════
    // JEUX VIDÉO - Citations cultes
    // ═══════════════════════════════════════════════════════════════
    // Citations célèbres
    "The Cake is a Lie", "Arrow in the Knee", "Finish Him", "Fatality", "Get Over Here",
    "War Never Changes", "Would You Kindly", "Boy", "Praise the Sun", "Git Gud",
    "Do a Barrel Roll", "It's Dangerous Alone", "Wasted", "You Died", "Game Over",

    // Personnages JV
    "Mario", "Luigi", "Bowser", "Peach", "Toad", "Yoshi", "Wario", "Waluigi",
    "Link", "Zelda", "Ganondorf", "Epona", "Navi", "Midna", "Sheik", "Impa",
    "Sonic", "Tails", "Knuckles", "Eggman", "Shadow", "Amy", "Rouge", "Silver",
    "Kratos", "Atreus", "Geralt", "Yennefer", "Ciri", "Triss", "Roach", "Dandelion",
    "Master Chief", "Cortana", "Doom Guy", "Isaac Clarke", "Gordon Freeman",
    "Solid Snake", "Big Boss", "Raiden", "Ocelot", "Quiet", "Otacon",
    "Cloud", "Sephiroth", "Tifa", "Aerith", "Barret", "Red XIII", "Chocobo",
    "Sans", "Papyrus", "Frisk", "Flowey", "Undyne", "Alphys", "Mettaton",

    // ═══════════════════════════════════════════════════════════════
    // NOURRITURE
    // ═══════════════════════════════════════════════════════════════
    "Saucisse", "Nugget", "Burger", "Pizza", "Kebab", "Tacos", "Sushi", "Ramen",
    "Croissant", "Baguette", "Camembert", "Raclette", "Tartiflette", "Fondue", "Gratin",
    "Cookie", "Brownie", "Muffin", "Donut", "Cupcake", "Pancake", "Waffle", "Crêpe",
    "Poulet", "Steak", "Bacon", "Jambon", "Saucisson", "Pâté", "Rillettes", "Terrine",
    "Frite", "Chips", "Popcorn", "Bretzel", "Nachos", "Guacamole", "Salsa", "Mayo",
    "Ketchup", "Moutarde", "Wasabi", "Sriracha", "Tabasco", "Piment", "Cornichon",
    "Patate", "Banane", "Concombre", "Courgette", "Aubergine", "Carotte", "Navet",
    "Poireau", "Oignon", "Échalote", "Ail", "Persil", "Ciboulette", "Basilic",
    "Ravioli", "Tortellini", "Spaghetti", "Lasagne", "Gnocchi", "Risotto", "Pesto",
    "Chonk", "Chunk", "Thicc Boi", "Absolute Unit",

    // ═══════════════════════════════════════════════════════════════
    // ANIMAUX RANDOM
    // ═══════════════════════════════════════════════════════════════
    "Canard", "Poulet", "Dinde", "Oie", "Pigeon", "Moineau", "Corbeau", "Mouette",
    "Hamster", "Cochon d'Inde", "Gerbille", "Chinchilla", "Furet", "Hérisson", "Lapin",
    "Castor", "Loutre", "Raton", "Blaireau", "Putois", "Belette", "Martre", "Mouffette",
    "Crapaud", "Grenouille", "Têtard", "Triton", "Salamandre", "Axolotl", "Iguane",
    "Bichon", "Caniche", "Chihuahua", "Teckel", "Carlin", "Bouledogue", "Boxer",
    "Crevette", "Homard", "Crabe", "Poulpe", "Méduse", "Étoile de Mer", "Oursin",

    // ═══════════════════════════════════════════════════════════════
    // OBJETS DU QUOTIDIEN
    // ═══════════════════════════════════════════════════════════════
    "Grille-Pain", "Micro-Ondes", "Frigo", "Aspirateur", "Tondeuse", "Perceuse",
    "Tournevis", "Marteau", "Clé à Molette", "Pince", "Scie", "Rabot", "Niveau",
    "Chaussette", "Pantoufle", "Tong", "Sandale", "Basket", "Mocassin", "Botte",
    "Parapluie", "Parasol", "Imperméable", "Poncho", "K-Way", "Doudoune", "Parka",
    "Tabouret", "Pouf", "Fauteuil", "Canapé", "Matelas", "Oreiller", "Couette",
    "Lampadaire", "Abat-jour", "Lustre", "Ampoule", "Prise", "Rallonge", "Multiprise",

    // ═══════════════════════════════════════════════════════════════
    // EXPRESSIONS FRANÇAISES
    // ═══════════════════════════════════════════════════════════════
    "Saperlipopette", "Sacrebleu", "Fichtre", "Diantre", "Palsambleu", "Morbleu",
    "Nom d'un Chien", "Crotte de Bique", "Mille Sabords", "Tonnerre de Brest",
    "Crotte alors", "Zut alors", "Flûte alors", "Mince alors", "Purée de Pois",
    "Bigre", "Tudieu", "Parbleu", "Ventrebleu", "Jarnicoton", "Saperlotte",

    // ═══════════════════════════════════════════════════════════════
    // GAMING / TWITCH
    // ═══════════════════════════════════════════════════════════════
    "Noob", "Pro Gamer", "Bot", "AFK", "GG", "EZ", "Ragequit", "Camper", "Rusher",
    "Feeder", "Carry", "Support", "Tank", "DPS", "Healer", "One Shot", "Clutch",
    "Smurf", "Tryharder", "Casual", "Sweat", "Grinder", "Farmer", "Speedrunner",
    "Lag", "Ping", "FPS", "Aimbot", "Wallhack", "Glitch", "Bug", "Exploit",
    "Skill Issue", "Main Character", "Ohio Mode", "NPC", "Ratio", "L + Ratio",
    "W", "Dub", "No Cap", "Fax", "Based", "Cringe", "Cope", "Mald", "Seethe",
    "Touch Grass", "Go Outside", "Least Deranged", "Most Sane", "Average Enjoyer",
    "Press Like", "Subscribe", "Clip That", "Stream Sniper", "Hype Train",

    // ═══════════════════════════════════════════════════════════════
    // NOMS NUZLOCKE DRÔLES (inspirés forums/communautés)
    // ═══════════════════════════════════════════════════════════════
    "Dr Bees", "Komrad Karp", "Jet Fuel", "Snowsevelt", "Obamasnow", "DIOlga",
    "Jotaro", "Star Platinum", "Za Warudo", "Ora Ora", "Muda Muda",
    "Sir Derpsalot", "Noodleface", "Chonkasaur", "Potatoachu", "Fluffmeister",
    "Zapwurst", "Bonkmann", "El Zapzap", "Monsieur Puff", "Señor Chomp",
    "Pikabo", "Chonkachu", "Zapchan", "Probably Fine", "Definitely Legal",
    "Working As Intended", "Not a Bug", "Feature", "Intended Gameplay",

    // ═══════════════════════════════════════════════════════════════
    // ONOMATOPÉES
    // ═══════════════════════════════════════════════════════════════
    "Boum", "Bam", "Paf", "Splash", "Crash", "Bang", "Pow", "Zap", "Whoosh",
    "Plouf", "Splatch", "Crac", "Vlan", "Badaboum", "Patatras", "Bling", "Ding",
    "Meow", "Woof", "Moo", "Oink", "Quack", "Ribbit", "Hiss", "Roar", "Growl",
    "Bonk", "Zoink", "Boing", "Swoosh", "Thud", "Thwack", "Splat", "Plop",

    // ═══════════════════════════════════════════════════════════════
    // PSEUDOS INTERNET RIDICULES
    // ═══════════════════════════════════════════════════════════════
    "xXDarkSasuke69Xx", "NarutoFan2007", "GamerPro360", "NoScopeKing", "QuickScope",
    "Xx_Shadow_xX", "DarkAngel666", "BlackDragon", "NightWolf", "SilentKiller",
    "SnipeGod", "HeadshotMaster", "AimAssist", "WallBanger", "FlickMaster",
    "MLG_Pro", "420BlazeIt", "360NoScope", "xX_Killer_Xx", "DarkLord69",
    "Pussydestroyer", "NotABot", "TotallyHuman", "Definitely18", "Anonymous",

    // ═══════════════════════════════════════════════════════════════
    // TITRES HONORIFIQUES
    // ═══════════════════════════════════════════════════════════════
    "Maître", "Docteur", "Professeur", "Capitaine", "Colonel", "Général", "Amiral",
    "Seigneur", "Baron", "Comte", "Duc", "Prince", "Roi", "Empereur", "Dieu",
    "Padawan", "Jedi", "Sith", "Hokage", "Kage", "Sensei", "Sama", "Kun", "Chan",
    "Sir", "Dame", "Lord", "Lady", "Sultan", "Pharaon", "Tsar", "Kaiser",

    // ═══════════════════════════════════════════════════════════════
    // PRÉNOMS RINGARDS
    // ═══════════════════════════════════════════════════════════════
    "Kevin", "Enzo", "Dylan", "Bryan", "Jordan", "Steven", "Brandon", "Jason",
    "Chantal", "Christiane", "Micheline", "Jacqueline", "Pascaline", "Jocelyne",
    "Cindy", "Sandy", "Wendy", "Kimberley", "Priscilla", "Vanessa", "Jessica",
    "Kylian", "Mathéo", "Léo", "Nathan", "Lucas", "Théo", "Noah", "Evan",
    "Mélodie", "Océane", "Marine", "Amandine", "Aurélie", "Émilie", "Julie",

    // ═══════════════════════════════════════════════════════════════
    // MÉTIERS ABSURDES
    // ═══════════════════════════════════════════════════════════════
    "Comptable", "Plombier", "Électricien", "Maçon", "Couvreur", "Menuisier",
    "Boulanger", "Pâtissier", "Boucher", "Poissonnier", "Fromager", "Charcutier",
    "Facteur", "Livreur", "Chauffeur", "Pilote", "Capitaine", "Amiral", "Général",
    "Stagiaire", "Manager", "CEO", "Président", "Ministre", "Député", "Sénateur",
    "Influenceur", "Tiktoker", "Streamer", "Gamer Pro", "Testeur de Jeux",

    // ═══════════════════════════════════════════════════════════════
    // ADJECTIFS + NOMS
    // ═══════════════════════════════════════════════════════════════
    "Petit Pain", "Gros Lard", "Grand Dadais", "Vieux Schnock", "Jeune Padawan",
    "Beau Gosse", "Belle Gosse", "Sacré Numéro", "Drôle d'Oiseau", "Sale Bête",
    "Brave Bête", "Pauvre Type", "Riche Héritier", "Fou Furieux", "Doux Dingue",
    "Gros Bébé", "Petit Chef", "Grand Chef", "Vrai G", "Goat", "The GOAT"
];

// Fonction pour obtenir un pseudonyme aléatoire
function getRandomNickname() {
    return NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)];
}
