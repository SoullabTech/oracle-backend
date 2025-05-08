import Header from '@/components/Header';
import ConstellationHistory from '@/components/ConstellationHistory';
import { SacredFooter } from '@/components/SacredFooter';
import { PageTransition } from '@/components/PageTransition';

export default function ConstellationArchivePage() {
  return (
    <PageTransition>
      <Header />
      <main className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 via-pink-50 to-yellow-50 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-indigo-700">🌀 Your Constellation Rituals</h1>
          <p className="text-purple-600 italic">
            These are the echoes of your sacred work — ancestral healing, elemental insight, and field transformation.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <ConstellationHistory />
        </div>
      </main>
      <SacredFooter />
    </PageTransition>
  );
}
