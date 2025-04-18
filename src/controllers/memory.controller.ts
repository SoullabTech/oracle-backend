import { Request, Response } from 'express';
import { MemoryService } from '../services/memoryService;

const service = new MemoryService();

export async function storeMemory(req: Request, res: Response) {
  try {
    const memory = await service.storeMemory(req.body);
    res.status(200).json(memory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to store memory', details: error });
  }
}

export async function getMemories(req: Request, res: Response) {
  try {
    const memories = await service.retrieveMemories(req.params.userId);
    res.status(200).json(memories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve memories', details: error });
  }
}

export async function createSharedSpace(req: Request, res: Response) {
  try {
    const space = await service.createSharedSpace(req.body);
    res.status(200).json(space);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create shared space', details: error });
  }
}

export async function listSharedSpaces(req: Request, res: Response) {
  try {
    const spaces = await service.listSharedSpaces(req.params.userId);
    res.status(200).json(spaces);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list shared spaces', details: error });
  }
}
