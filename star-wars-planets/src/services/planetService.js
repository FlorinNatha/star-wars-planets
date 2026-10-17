//This file is responsible for communicating with the Star Wars API
const API_BASE_URL = "https://swapi.dev/api/planets/";

async function fetchJSON(url, signal) {
    const response = await fetch(url, { signal });

    if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
    }

    return response.json();
}

//getPlanets() fetches a page of planets.
export async function getPlanets(url = API_BASE_URL, signal) {
    return fetchJSON(url, signal);
}

//searchPlanets() searches planets by name.
export async function searchPlanets(query, signal) {
    const url = new URL(API_BASE_URL);

    url.searchParams.set("search", query);

    return fetchJSON(url.toString(), signal);
}
//getPlanetDetails() fetches a single planet’s details using its ID.
export async function getPlanetDetails(id, signal) {
    const url = `${API_BASE_URL}${encodeURIComponent(id)}/`;

    return fetchJSON(url, signal);
}