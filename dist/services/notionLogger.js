// src/services/notionLogger.ts
import fetch from 'node-fetch';
const NOTION_API_URL = 'https://api.notion.com/v1/pages';
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
export async function notionLogger(content) {
    try {
        await fetch(NOTION_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                parent: { database_id: NOTION_DATABASE_ID },
                properties: {
                    Title: {
                        title: [{ text: { content: content.title || 'Log Entry' } }]
                    },
                    Data: {
                        rich_text: [{ text: { content: JSON.stringify(content, null, 2) } }]
                    }
                }
            })
        });
    }
    catch (err) {
        console.error('notionLogger error:', err);
    }
}
