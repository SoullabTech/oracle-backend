// File: /src/services/archetypeService.ts
// Layer: 🔁 Backend (Archetype Symbol Map)
const archetypeMap = {
    Phoenix: "The Initiator — A being of fire and renewal, guiding you through endings and rebirths.",
    Mirror: "The Reflector — Reveals what is hidden in the self through the presence of others.",
    Labyrinth: "The Seeker — One who journeys inward to find purpose and integration.",
    Ocean: "The Mystic — Deep emotional intelligence and communion with the unseen.",
    Flame: "The Visionary — Bringer of inspiration and sacred purpose.",
    Star: "The Oracle — Guardian of cosmic truths and evolutionary insight.",
    Wind: "The Messenger — Deliverer of insight and initiator of movement.",
};
export function getArchetypeForSymbol(symbol) {
    return archetypeMap[symbol] || "The Unknown — A symbol yet to reveal its true face.";
}
export function listAllArchetypes() {
    return Object.entries(archetypeMap).map(([key, description]) => ({ symbol: key, description }));
}
