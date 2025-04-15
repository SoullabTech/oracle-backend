import { Client } from '@notionhq/client';
import { env } from '../lib/config';
import { logger } from '../utils/logger';
import type { NotionPage, KnowledgeEntry } from '../types/knowledge';

const notion = new Client({
  auth: env.NOTION_TOKEN,
});

export async function fetchNotionPages(databaseId: string): Promise<NotionPage[]> {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'Status',
            select: {
              equals: 'Ready for Import',
            },
          },
        ],
      },
    });

    const pages = await Promise.all(
      response.results.map(async (page: any) => {
        const content = await getPageContent(page.id);
        return {
          id: page.id,
          title: page.properties.Name?.title[0]?.plain_text || 'Untitled',
          content,
          properties: page.properties,
        };
      })
    );

    logger.info('Fetched Notion pages', {
      metadata: {
        databaseId,
        pageCount: pages.length,
      },
    });

    return pages;
  } catch (error) {
    logger.error('Error fetching Notion pages:', error);
    throw new Error('Failed to fetch Notion pages');
  }
}

async function getPageContent(pageId: string): Promise<string> {
  try {
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
    });

    return blocks.results
      .map((block: any) => {
        switch (block.type) {
          case 'paragraph':
            return block.paragraph.rich_text
              .map((text: any) => text.plain_text)
              .join('');
          case 'heading_1':
          case 'heading_2':
          case 'heading_3':
            return `\n${block[block.type].rich_text
              .map((text: any) => text.plain_text)
              .join('')}\n`;
          case 'bulleted_list_item':
          case 'numbered_list_item':
            return `\n- ${block[block.type].rich_text
              .map((text: any) => text.plain_text)
              .join('')}`;
          default:
            return '';
        }
      })
      .filter(Boolean)
      .join('\n');
  } catch (error) {
    logger.error('Error fetching page content:', error);
    throw new Error('Failed to fetch page content');
  }
}

export function transformToKnowledgeEntry(page: NotionPage): KnowledgeEntry {
  const category = page.properties.Category?.select?.name || 'general';
  const element = page.properties.Element?.select?.name;
  const confidence = page.properties.Confidence?.number || 0.7;
  const tags = page.properties.Tags?.multi_select?.map((tag: any) => tag.name) || [];

  return {
    title: page.title,
    content: page.content,
    category,
    element,
    confidence,
    source: 'notion',
    validation_status: 'pending',
    metadata: {
      notionId: page.id,
      lastSynced: new Date().toISOString(),
      tags,
      properties: page.properties,
    },
  };
}

export async function updateNotionStatus(pageId: string, status: string): Promise<void> {
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        Status: {
          select: {
            name: status,
          },
        },
        LastSynced: {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });

    logger.info('Updated Notion page status', {
      metadata: {
        pageId,
        status,
      },
    });
  } catch (error) {
    logger.error('Error updating Notion page status:', error);
    throw new Error('Failed to update Notion page status');
  }
}