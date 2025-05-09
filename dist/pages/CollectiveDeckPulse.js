import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// File: /src/pages/CollectiveDeckPulse.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useSanctumTabs } from "@/context/SanctumTabsContext";
import { fetchSymbolicMemories, storeMemoryItem } from "@/services/memoryService";
import { getSuggestedRitual } from "@/services/ritualSuggestionService";
import { getMockCosmicTone } from "@/services/cosmicTuningService";
import { InnerGuideAgent } from "@/core/agents/innerGuideAgent";
import { oracle } from "@/core/agents/mainOracleAgent";
import { TarotDeck } from "@/lib/tarotDeck";
import PulseSummary from "@/components/CollectivePulse/PulseSummary";
import PulseChart from "@/components/CollectivePulse/PulseChart";
import TrendingCards from "@/components/CollectivePulse/TrendingCards";
import SuggestedRitual from "@/components/CollectivePulse/SuggestedRitual";
import CollectiveExportPanel from "@/components/CollectivePulse/CollectiveExportPanel";
import TooltipCardInsights from "@/components/CollectivePulse/TooltipCardInsights";
import PulseArchiveViewer from "@/components/CollectivePulse/PulseArchiveViewer";
const guide = new InnerGuideAgent();
export default function CollectiveDeckPulse() {
    const [cards, setCards] = useState({});
    const [trendData, setTrendData] = useState({});
    const [filter, setFilter] = useState("7");
    const [ritualSuggestion, setRitualSuggestion] = useState(null);
    const [resonanceOptIn, setResonanceOptIn] = useState(true);
    const [badgeNotice, setBadgeNotice] = useState(null);
    const [shareSummary, setShareSummary] = useState(false);
    const [archive, setArchive] = useState([]);
    const { user } = useAuth();
    const { addTab } = useSanctumTabs();
    const router = useRouter();
    const tone = getMockCosmicTone();
    useEffect(() => {
        async function load() {
            const entries = await fetchSymbolicMemories();
            const since = new Date();
            since.setDate(since.getDate() - parseInt(filter));
            const tarotMentions = {};
            const trends = {};
            const matchTally = {};
            for (const entry of entries) {
                const created = new Date(entry.created_at);
                if (created < since)
                    continue;
                const dayIndex = Math.floor((+new Date() - +created) / (1000 * 60 * 60 * 24));
                const content = entry.content.toLowerCase();
                for (const card of Object.keys(TarotDeck)) {
                    if (content.includes(card.toLowerCase())) {
                        tarotMentions[card] = (tarotMentions[card] || 0) + 1;
                        trends[card] = trends[card] || Array(parseInt(filter)).fill(0);
                        if (trends[card][dayIndex] !== undefined)
                            trends[card][dayIndex] += 1;
                        if (user && entry.created_by === user.id && resonanceOptIn) {
                            matchTally[card] = (matchTally[card] || 0) + 1;
                        }
                    }
                }
            }
            setCards(tarotMentions);
            setTrendData(trends);
            setArchive(entries.filter(e => e.metadata?.context === "BBSWeeklyBroadcast"));
            const top = Object.entries(tarotMentions).sort((a, b) => b[1] - a[1])[0]?.[0];
            if (top) {
                const ritual = await getSuggestedRitual(top);
                setRitualSuggestion(ritual);
                const summary = `🌍 Collective Pulse: The archetype **${top}** is trending. Ritual: ${ritual}`;
                await storeMemoryItem({
                    content: summary,
                    clientId: "system-bbs",
                    element: TarotDeck[top]?.element || "Aether",
                    sourceAgent: "CollectiveDeckPulse",
                    confidence: 1,
                    metadata: {
                        context: "BBSWeeklyBroadcast",
                        card: top,
                        ritual,
                        shared: shareSummary,
                        timestamp: new Date().toISOString()
                    },
                });
            }
            if (Object.keys(matchTally).length >= 2) {
                const matched = Object.keys(matchTally).slice(0, 3);
                const journalSummary = matched.map((card) => `- ${card}: ${matchTally[card]} mentions`).join("\n");
                const reply = await guide.processQuery({
                    input: `My journal matches trending archetypes:\n${journalSummary}`,
                    userId: user?.id || "guest",
                });
                await storeMemoryItem({
                    content: reply.content,
                    clientId: user?.id,
                    element: reply.metadata?.element || "Aether",
                    sourceAgent: "InnerGuideAgent",
                    confidence: reply.confidence,
                    metadata: reply.metadata,
                });
                const story = await oracle.generateStory({
                    focusArea: "initiation journey",
                    elementalTheme: TarotDeck[matched[0]]?.element || "aether",
                    archetype: "Seeker",
                    depthLevel: 4,
                });
                await storeMemoryItem({
                    content: story.narrative,
                    clientId: user?.id,
                    element: TarotDeck[matched[0]]?.element || "Aether",
                    sourceAgent: "ArchetypeQuestSystem",
                    confidence: 0.95,
                    metadata: {
                        context: "ArchetypeQuest",
                        reflections: story.reflections,
                        symbols: story.symbols,
                        matchedCards: matched,
                    },
                });
                setBadgeNotice("🧙 Inner Guide + 🛡️ Archetype Quest initiated.");
            }
        }
        load();
    }, [filter, user, resonanceOptIn, shareSummary]);
    const topCards = Object.entries(cards)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name]) => name);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            addTab({ id: "collective-pulse", title: "📊 Collective Pulse", component: () => null });
        }
    }, []);
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsx(PulseSummary, { tone: tone, resonanceOptIn: resonanceOptIn, onToggleResonance: () => setResonanceOptIn(!resonanceOptIn), badgeNotice: badgeNotice, filter: filter, onFilterChange: setFilter }), _jsx(TrendingCards, { cards: topCards, router: router, tooltipComponent: TooltipCardInsights }), topCards.length > 0 && _jsx(PulseChart, { trendData: trendData, topCards: topCards, filter: filter }), ritualSuggestion && _jsx(SuggestedRitual, { ritual: ritualSuggestion }), _jsx(CollectiveExportPanel, { enabled: shareSummary, onToggle: () => setShareSummary(!shareSummary), topCard: topCards[0], ritual: ritualSuggestion }), _jsx(PulseArchiveViewer, { entries: archive })] }));
}
