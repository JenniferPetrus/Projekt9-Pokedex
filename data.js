const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
const LIMIT = 20; // Pokemon Limit pro Seite
let allPokemonData = []; // Array alle geladenen Pokemons Daten
let displayedPokemonData = []; //Array angezeigte Pokemon Daten
let offset = 0; 
let totalPokemon = 1025;
let currentPokemonIndex = 0;

function init() {
    showLoadingScreen();
    loadMore();
    // setupSearch();
}

async function loadAllPokemon() { //Alle Pokemons laden
    const loadPokemonData = async () => { //Pokemon Daten fetchen
            const url = `${BASE_URL}?limit=${totalPokemon}&offset=${offset}`;
            const response = await fetch(url); //Pokemon Daten von URL fetchen
            const data = await response.json(); //JSON parsen
            for (let i = 0; i < data.results.length; i++) { 
                const pokemon = data.results[i]; 
            }
        setupSearch(); //Suchfunktion 
    };
    loadPokemonData();
}

function setupSearch() {
    const searchInput = document.getElementById('searchText'); //Suchfunktion Input ID
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase(); // Suche in kleinbuchstaben
        const filteredData = allPokemonData.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm)); //Namen filtern 
        renderContent(filteredData); //Pokemon Daten rendern
    });
}

async function loadMore() { // Mehr Pokemon Daten laden
    const url = `${BASE_URL}?limit=${LIMIT}&offset=${offset}`;
    try {
        const response = await fetch(url); // Daten von der API fetchen
        if (!response.ok) { // Checken ob Antwort gültig
            throw new Error('Error'); // Error wenn Antwort nicht gültig
        }
        const data = await response.json(); // JSON parsen
        const pokemonPromises = [];
        
        data.results.forEach(pokemon => {
            const pokemonPromise = loadPokemonDetails(pokemon.url)
                .then(pokemonDetails => {
                    if (pokemonDetails) { // Details verfügbar?
                        allPokemonData.push(pokemonDetails); // Details direkt zu den vorhandenen Daten hinzufügen
                    }
                })
                .catch(error => {
                    console.error('Error');
                });
            pokemonPromises.push(pokemonPromise);
        });
        await Promise.all(pokemonPromises);
        offset += LIMIT; // Beim Laden die Zahl des LIMITS erhöhen
        displayedPokemonData = allPokemonData.slice(0, offset); // Angezeigte Daten updaten
        renderContent(displayedPokemonData); // Daten rendern
    } catch (error) {
        console.error(error.message);
    } finally {
        hideLoadingScreen(); // Ladescreen verstecken
    }
}

async function loadPokemonDetails(url) { //Details der Pokemons laden
    let response = await fetch(url); //Daten fetchen von der URL
    let data = await response.json(); //JSON parsen
    return data; //parsed Daten zurückgeben
}

function renderContent(pokemonList) { //content rendern
    let contentBox = document.getElementById('content'); //content mit ID 
    contentBox.innerHTML = ''; //content html leeren

    for (let i = 0; i < pokemonList.length; i++) {
        let pokemonDetails = pokemonList[i]; //Pokemon Details vom i-ten Pokemon
        let pokeID = pokemonDetails.id; //Pokemon ID
        let imageUrl = pokemonDetails.sprites.other.showdown.front_default; //Pokemon Bilder
        let types = ''; //Typen String initialisieren
        for (let j = 0; j < pokemonDetails.types.length; j++) {
            types += pokemonDetails.types[j].type.name; //Typen Name
            if (j < pokemonDetails.types.length - 1) { //nicht der letzte Typ
                types += ', '; //nicht letzter Typ bekommt ein Komma
            }
        }
        let backgroundColor = getBackgroundColor(pokemonDetails.types[0].type.name); //Hintergrundfarbe anhand des ersten Typen 
        let html = renderContentHTML(pokeID, pokemonDetails, imageUrl, backgroundColor); //Ausgelagertes HTML Code

        contentBox.innerHTML += html; //Pokemon Card zu content HTML hinzufügen
    }
}

function getBackgroundColor(type) { // Hintergrundfarbe anhand des Pokemon Typen
    switch(type) { //Switch Statemnet für die Farben der Typen
        case 'normal': return '#A8A77A';
        case 'fighting': return '#C22E28';
        case 'flying': return '#A98FF3';
        case 'poison': return '#A33EA1';
        case 'ground': return '#E2BF65';
        case 'rock': return '#B6A136';
        case 'bug': return '#A6B91A';
        case 'ghost': return '#735797';
        case 'steel': return '#B7B7CE';
        case 'fire': return '#EE8130';
        case 'water': return '#6390F0';
        case 'grass': return '#7AC74C';
        case 'electric': return '#F7D02C';
        case 'psychic': return '#F95587';
        case 'ice': return '#96D9D6';
        case 'dragon': return '#6F35FC';
        case 'dark': return '#705746';
        case 'fairy': return '#D685AD';
    }
}

function showLoadingScreen() { //Ladescreen anzeigen
    document.getElementById('loadingScreen').style.display = 'flex';
}

function hideLoadingScreen() { //Ladescreen verstecken
    const loadingScreen = document.getElementById('loadingScreen'); //Ladescreen ID anwenden
    loadingScreen.style.opacity = '0'; //Transparenz
    loadingScreen.style.display = 'none';
}

loadAllPokemon(); //Alle Pokemon Daten laden

async function openDetails(pokemonID) {
    try {
        const pokemonIndex = allPokemonData.findIndex(pokemon => pokemon.id === pokemonID); // Index des Pokémon finden
        if (pokemonIndex === -1) throw new Error('Pokemon not found');
        
        currentPokemonIndex = pokemonIndex; // Aktuellen Index speichern
        const pokemon = allPokemonData[currentPokemonIndex]; // Aktuelles Pokémon holen
        let types = '';
        for (let i = 0; i < pokemon.types.length; i++) {
            if (i > 0) { // nicht beim ersten Element
                types += ' '; // Leerzeichen hinzufügen, aber nicht beim ersten
            }
            types += pokemon.types[i].type.name.toUpperCase(); // Typenname in Großbuchstaben anzeigen
        }
        const html = openDetailsHTML(pokemon, types, currentPokemonIndex === 0); // Überprüfen, ob es das erste Pokémon ist
        document.getElementById('modalDetails').innerHTML = html;
        document.getElementById('pokemonModal').style.display = 'block';
    } catch (error) {
        console.error('Error', error);
    }
}

function previousPokemon() {  //Slider vorheriges Pokemon anzeigen
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--; // Index verringern
        const pokemon = allPokemonData[currentPokemonIndex];
        let types = '';
        for (let i = 0; i < pokemon.types.length; i++) {
            if (i > 0) { // nicht beim ersten Element
                types += ' '; // Leerzeichen hinzufügen, aber nicht beim ersten
            }
            types += pokemon.types[i].type.name.toUpperCase(); // Typenname in Großbuchstaben anzeigen
        }
        const html = openDetailsHTML(pokemon, types, currentPokemonIndex === 0);
        document.getElementById('modalDetails').innerHTML = html;
    }
}

function nextPokemon() {
    if (currentPokemonIndex < allPokemonData.length - 1) {
        currentPokemonIndex++; // Index erhöhen
        const pokemon = allPokemonData[currentPokemonIndex];
        let types = '';
        for (let i = 0; i < pokemon.types.length; i++) {
            if (i > 0) { // nicht beim ersten Element
                types += ' '; // Leerzeichen hinzufügen, aber nicht beim ersten
            }
            types += pokemon.types[i].type.name.toUpperCase(); // Typenname in Großbuchstaben anzeigen
        }
        const html = openDetailsHTML(pokemon, types, false);
        document.getElementById('modalDetails').innerHTML = html;
    }
}
function closeModal() { //Modal schließen
    document.getElementById('pokemonModal').style.display = 'none';
}

