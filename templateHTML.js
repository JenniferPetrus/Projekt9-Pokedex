function renderContentHTML(pokeID, pokemonDetails, imageUrl, backgroundColor) {
    return `
    <div class="pokemon-card" style="background-color: ${backgroundColor};">
        <h3 class="pokemon-id">#${pokeID}</h3>
        <h3 class="pokemon-name">${pokemonDetails.name}</h3>
        <img class="pokemon-image" src="${imageUrl}">
        <button onclick="openDetails(${pokeID})" id="pokemonDetails">Details</button>
    </div>
    `;
}

function openDetailsHTML(pokemon, types){
    return `
            <div class="pokemon-card-big" style="background-color: ${getBackgroundColor(pokemon.types[0].type.name)};">
                <h3 class="pokemon-id-big">#${pokemon.id}</h3>
                <h3 class="pokemon-name-big">${pokemon.name}</h3>
                <img class="pokemon-image-big" src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
                <p class="type">${types}</p>
                <p class="height">Height: <br> ${pokemon.height/10} m</p>
                <p class="weight">Weight: <br> ${pokemon.weight/10} kg</p>
                <div class="modal-navigation">
                    <button class="modal-button"onclick="previousPokemon()">Previous</button>
                    <button class="modal-button" onclick="nextPokemon()">Next</button>
                </div>
            </div>
    `;
}
