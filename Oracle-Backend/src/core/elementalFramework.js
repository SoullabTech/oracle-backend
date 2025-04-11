"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectElement = detectElement;
exports.adjustGuidance = adjustGuidance;
var elementKeywords = {
    fire: ['fire', 'ignite', 'flame', 'burn', 'spark'],
    water: ['water', 'flow', 'ocean', 'river', 'tide'],
    earth: ['earth', 'ground', 'soil', 'rock', 'stability'],
    air: ['air', 'breeze', 'wind', 'sky', 'clarity'],
    aether: ['aether', 'spirit', 'soul', 'mystic', 'cosmos']
};
function detectElement(query) {
    var lowerQuery = query.toLowerCase();
    var bestElement = 'aether';
    var bestCount = 0;
    for (var _i = 0, _a = Object.entries(elementKeywords); _i < _a.length; _i++) {
        var _b = _a[_i], element = _b[0], keywords = _b[1];
        var count = keywords.reduce(function (acc, keyword) {
            return acc + (lowerQuery.includes(keyword) ? 1 : 0);
        }, 0);
        if (count > bestCount) {
            bestCount = count;
            bestElement = element;
        }
    }
    return bestElement;
}
function adjustGuidance(query, baseGuidance) {
    var element = detectElement(query);
    var adjustment = '';
    switch (element) {
        case 'fire':
            adjustment = "Let the flames of passion light your path.";
            break;
        case 'water':
            adjustment = "Allow the flow of emotions to guide your healing.";
            break;
        case 'earth':
            adjustment = "Ground yourself in stability and take practical steps.";
            break;
        case 'air':
            adjustment = "Seek clarity and let your thoughts soar.";
            break;
        case 'aether':
            adjustment = "Embrace your inner spirit and connect with the cosmos.";
            break;
    }
    return "".concat(baseGuidance, " ").concat(adjustment, " (Element: ").concat(element, ")");
}
