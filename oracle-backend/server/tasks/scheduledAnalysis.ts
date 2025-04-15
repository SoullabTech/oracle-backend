import cron from 'node-cron';
import { analyzeFeedback, updatePersonalityWeights } from '../../src/services/feedbackAnalysisService';
import { logger } from '../../src/utils/logger';

// Run analysis every 6 hours
const ANALYSIS_SCHEDULE = '0 */6 * * *';

export function initializeScheduledAnalysis() {
  cron.schedule(ANALYSIS_SCHEDULE, async () => {
    try {
      logger.info('Starting scheduled feedback analysis');

      const end = new Date();
      const start = new Date(end.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours

      // Run analysis
      const analysis = await analyzeFeedback({ start, end });

      // Update weights based on analysis
      await updatePersonalityWeights(analysis);

      logger.info('Completed scheduled feedback analysis', {
        metadata: {
          timeframe: { start, end },
          totalFeedback: analysis.totalFeedback,
          averageRating: analysis.averageRating,
        },
      });
    } catch (error) {
      logger.error('Error in scheduled analysis:', error);
    }
  });

  logger.info('Initialized scheduled feedback analysis');
}