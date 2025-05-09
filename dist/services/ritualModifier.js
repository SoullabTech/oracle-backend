export function applyTarotInfluence(ritual, card) {
    if (card.name === "The Tower") {
        ritual.journal = "What is crumbling that needs to fall?";
        ritual.movement = "Shake loose & surrender";
    }
    if (card.name === "Temperance") {
        ritual.breath = "Alternate nostril";
        ritual.journal = "Where do I need harmony?";
    }
    return ritual;
}
