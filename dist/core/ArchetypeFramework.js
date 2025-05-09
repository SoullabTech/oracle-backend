"use strict";
// /src/core/ArchetypeFramework.ts
class ArchetypeFramework {
    userProfile;
    elements = ["fire", "water", "earth", "air", "aether"];
    constructor(userProfile) {
        this.userProfile = userProfile;
    }
    getArchetype() {
        const scores = this.userProfile.elementalScores;
        const dominantElement = this.elements.reduce((prev, curr) => scores[curr] > scores[prev] ? curr : prev);
        return this.mapToArchetype(dominantElement);
    }
    mapToArchetype(element) {
        switch (element) {
            case "fire":
                return "Visionary";
            case "water":
                return "Healer";
            case "earth":
                return "Builder";
            case "air":
                return "Philosopher";
            case "aether":
                return "Seeker";
            default:
                return "Unknown";
        }
    }
}
