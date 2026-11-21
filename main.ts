interface Pokemon {
    name: string;
    sprites: {
        front_default: string | null;
        other?: { showdown?: { front_default: string | null } };
        versions?: {
            "generation-v"?: {
                "black-white"?: { animated?: { front_default: string | null } };
            };
        };
    };
    types: Array<{ type: { name: string } }>;
}

const API_URL = "https://pokeapi.co/api/v2";

const getElemento = <T extends HTMLElement>(id: string) =>
    document.getElementById(id) as T;

const inputElement = getElemento<HTMLInputElement>("pokemonInput");
const searchButton = getElemento<HTMLButtonElement>("searchBtn");
const cardContainer = getElemento<HTMLDivElement>("pokemonCard");

// Cache: evita repetir requisições para o que já foi buscado
const pokemonCache = new Map<string, Pokemon>();

let controller: AbortController | null = null;

// ---------- Utilidades ----------

async function fetchJson<T>(url: string, signal: AbortSignal): Promise<T> {
    const res = await fetch(url, { signal });
    if (!res.ok) {
        throw new Error(
            res.status === 404
                ? "Pokémon não encontrado!"
                : `Erro na requisição (${res.status})`
        );
    }
    return res.json() as Promise<T>;
}

function mostraMensagem(text: string, isError = false) {
    cardContainer.innerHTML = `<p class="message${isError ? " error" : ""}">${text}</p>`;
}

// ---------- Acesso à API ----------

async function getPokemon(query: string, signal: AbortSignal): Promise<Pokemon> {
    const cached = pokemonCache.get(query);
    if (cached) return cached;

    const pokemon = await fetchJson<Pokemon>(`${API_URL}/pokemon/${query}`, signal);
    pokemonCache.set(query, pokemon);
    pokemonCache.set(pokemon.name, pokemon);
    return pokemon;
}

// ---------- Sprites ----------

// Prefere o GIF animado (Showdown, depois Geração V) e cai para o sprite estático
function getSprite(pokemon: Pokemon): { src: string; animated: boolean } | null {
    const animated =
        pokemon.sprites.other?.showdown?.front_default ??
        pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.animated?.front_default;

    if (animated) return { src: animated, animated: true };
    if (pokemon.sprites.front_default) {
        return { src: pokemon.sprites.front_default, animated: false };
    }
    return null;
}

// GIFs têm tamanhos variados: amplia em múltiplos inteiros para manter os pixels nítidos
function fitSprite(pokemon: Pokemon) {
    const img = cardContainer.querySelector<HTMLImageElement>(".sprite.is-animated");
    if (!img) return;

    const apply = () => {
        const scale = Math.max(
            1,
            Math.min(4, Math.floor(Math.min(180 / img.naturalWidth, 150 / img.naturalHeight)))
        );
        img.style.width = `${img.naturalWidth * scale}px`;
    };

    if (img.complete && img.naturalWidth > 0) apply();
    else img.addEventListener("load", apply, { once: true });

    // Se o GIF falhar, volta para o sprite estático
    img.addEventListener(
        "error",
        () => {
            const fallback = pokemon.sprites.front_default;
            if (!fallback) return;
            img.src = fallback;
            img.style.width = "";
            img.classList.replace("is-animated", "is-static");
        },
        { once: true }
    );
}

// ---------- Renderização ----------

function renderCard(pokemon: Pokemon) {
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
        mostraMensagem("Por favor, digite o nome de um Pokémon", true);
        return;
    }

    controller?.abort(); // cancela a busca anterior ainda em andamento
    controller = new AbortController();
    const { signal } = controller;

    searchButton.disabled = true;
    mostraMensagem("Buscando Pokémon...");

    try {
        renderCard(await getPokemon(query, signal));
    } catch (erro) {
        if (erro instanceof DOMException && erro.name === "AbortError") return;

        console.error("Erro na busca", erro);
        const mensagem = erro instanceof Error ? erro.message : "Não encontramos o Pokémon";
        mostraMensagem(mensagem, true);
    } finally {
        if (!signal.aborted) searchButton.disabled = false;
    }
}

// ---------- Eventos ----------

searchButton.addEventListener("click", searchPokemon);

inputElement.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchPokemon();
});
