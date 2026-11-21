const API_URL = "https://pokeapi.co/api/v2";
const getEl = (id) => document.getElementById(id);
const inputElement = getEl("pokemonInput");
const searchButton = getEl("searchBtn");
const cardContainer = getEl("pokemonCard");
// Cache: evita repetir requisições para o que já foi buscado
const pokemonCache = new Map();
let controller = null;
// ---------- Utilidades ----------
async function fetchJson(url, signal) {
    const res = await fetch(url, { signal });
    if (!res.ok) {
        throw new Error(res.status === 404
            ? "Pokémon não encontrado!"
            : `Erro na requisição (${res.status})`);
    }
    return res.json();
}
function showMessage(text, isError = false) {
    cardContainer.innerHTML = `<p class="message${isError ? " error" : ""}">${text}</p>`;
}
// ---------- Acesso à API ----------
async function getPokemon(query, signal) {
    const cached = pokemonCache.get(query);
    if (cached)
        return cached;
    const pokemon = await fetchJson(`${API_URL}/pokemon/${query}`, signal);
    pokemonCache.set(query, pokemon);
    pokemonCache.set(pokemon.name, pokemon);
    return pokemon;
}
// ---------- Sprites ----------
// Prefere o GIF animado (Showdown, depois Geração V) e cai para o sprite estático
function getSprite(pokemon) {
    const animated = pokemon.sprites.other?.showdown?.front_default ??
        pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.animated?.front_default;
    if (animated)
        return { src: animated, animated: true };
    if (pokemon.sprites.front_default) {
        return { src: pokemon.sprites.front_default, animated: false };
    }
    return null;
}
// GIFs têm tamanhos variados: amplia em múltiplos inteiros para manter os pixels nítidos
function fitSprite(pokemon) {
    const img = cardContainer.querySelector(".sprite.is-animated");
    if (!img)
        return;
    const apply = () => {
        const scale = Math.max(1, Math.min(4, Math.floor(Math.min(180 / img.naturalWidth, 150 / img.naturalHeight))));
        img.style.width = `${img.naturalWidth * scale}px`;
    };
    if (img.complete && img.naturalWidth > 0)
        apply();
    else
        img.addEventListener("load", apply, { once: true });
    // Se o GIF falhar, volta para o sprite estático
    img.addEventListener("error", () => {
        const fallback = pokemon.sprites.front_default;
        if (!fallback)
            return;
        img.src = fallback;
        img.style.width = "";
        img.classList.replace("is-animated", "is-static");
    }, { once: true });
}
// ---------- Renderização ----------
function renderCard(pokemon) {
    const tipos = pokemon.types
        .map(({ type }) => `<span class="type ${type.name}">${type.name}</span>`)
        .join("");
    const spriteData = getSprite(pokemon);
    const sprite = spriteData
        ? `<div class="stage">
                <img class="sprite ${spriteData.animated ? "is-animated" : "is-static"}"
                     src="${spriteData.src}" alt="Imagem do ${pokemon.name}" />
           </div>`
        : `<p class="message">Sem imagem disponível</p>`;
    cardContainer.innerHTML = `
        <div class="pokemon-card">
            <h2>${pokemon.name}</h2>
            ${sprite}
            <div class="types">${tipos}</div>
        </div>`;
    fitSprite(pokemon);
}
// ---------- Busca ----------
async function searchPokemon() {
    const query = inputElement.value.trim().toLowerCase();
    if (!query) {
        showMessage("Por favor, digite o nome de um Pokémon", true);
        return;
    }
    controller?.abort(); // cancela a busca anterior ainda em andamento
    controller = new AbortController();
    const { signal } = controller;
    searchButton.disabled = true;
    showMessage("Buscando Pokémon...");
    try {
        renderCard(await getPokemon(query, signal));
    }
    catch (erro) {
        if (erro instanceof DOMException && erro.name === "AbortError")
            return;
        console.error("Erro na busca", erro);
        const mensagem = erro instanceof Error ? erro.message : "Não encontramos o Pokémon";
        showMessage(mensagem, true);
    }
    finally {
        if (!signal.aborted)
            searchButton.disabled = false;
    }
}
// ---------- Eventos ----------
searchButton.addEventListener("click", searchPokemon);
inputElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter")
        searchPokemon();
});
export {};
