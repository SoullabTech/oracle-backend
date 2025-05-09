export function checkBadges(userHistory) {
    const badges = [];
    if (userHistory.fireRituals >= 3)
        badges.push("Initiate of Flame");
    if (userHistory.shadowEntries >= 3)
        badges.push("Shadow Walker");
    return badges;
}
