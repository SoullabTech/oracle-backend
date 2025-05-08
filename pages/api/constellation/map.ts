return (
    <PageTransition>
      <Header />
      <main className="...">
        {/* Ceremony text */}
        <motion.div>...</motion.div>
  
        {/* Oracle Modal */}
        <motion.div>
          <OracleCeremonyModal onComplete={handleOracleChosen} />
        </motion.div>
  
        {/* Constellation Ritual Trigger */}
        <motion.div className="text-center">
          <button
            onClick={() => setConstellationOpen(true)}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"
          >
            🌌 Begin Family Constellation Ritual
          </button>
        </motion.div>
      </main>
  
      <SacredFooter />
  
      {/* Ritual Modal */}
      <ConstellationCeremonyModal
        isOpen={isConstellationOpen}
        onClose={() => setConstellationOpen(false)}
      />
    </PageTransition>
  );
  