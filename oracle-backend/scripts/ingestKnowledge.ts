import 'dotenv/config';
import { fetchNotionPages, transformToKnowledgeEntry, updateNotionStatus } from '../src/services/notionService';
import { storeKnowledge } from '../src/services/knowledgeBaseService';
import { logger } from '../src/utils/logger';
import { env } from '../src/lib/config';

async function ingestKnowledge() {
  try {
    logger.info('Starting knowledge ingestion');

    // Fetch pages from Notion
    const pages = await fetchNotionPages(env.NOTION_DATABASE_ID);

    // Transform and store each page
    const results = await Promise.allSettled(
      pages.map(async (page) => {
        try {
          const entry = transformToKnowledgeEntry(page);
          const id = await storeKnowledge(entry);

          // Update Notion page status
          await updateNotionStatus(page.id, 'Imported');

          return { id, notionId: page.id };
        } catch (error) {
          // Update Notion page status to indicate error
          await updateNotionStatus(page.id, 'Import Failed');
          throw error;
        }
      })
    );

    // Log results
    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    logger.info('Knowledge ingestion completed', {
      metadata: {
        total: pages.length,
        successful,
        failed,
      },
    });

    // Log any errors
    results
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .forEach((result) => {
        logger.error('Failed to store knowledge entry:', result.reason);
      });

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    logger.error('Error during knowledge ingestion:', error);
    process.exit(1);
  }
}

ingestKnowledge()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));