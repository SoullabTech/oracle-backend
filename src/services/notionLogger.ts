import { Client } from '@notionhq/client';
import { env } from '../lib/config.js';

// Initialize Notion client with integration token
const notion = new Client({ auth: env.NOTION_TOKEN });

// ID of the Notion database where insights will be logged
const INSIGHTS_DATABASE_ID = env.NOTION_INSIGHTS_DATABASE_ID;

type LogInsightParams = {
  title: string;
  content: string;
};

/**
 * Logs an insight to a configured Notion database.
 * @param params.title - Title of the insight entry
 * @param params.content - Detailed content of the insight
 * @returns The created page ID
 */
export async function logInsightToNotion(params: LogInsightParams): Promise<{ id: string }> {
  const { title, content } = params;

  // Create a new page in the database
  const response = await notion.pages.create({
    parent: { database_id: INSIGHTS_DATABASE_ID },
    properties: {
      Name: {
        title: [
          {
            text: { content: title }
          }
        ]
      }
    },
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              text: { content }
            }
          ]
        }
      }
    ]
  });

  return { id: response.id };
}
