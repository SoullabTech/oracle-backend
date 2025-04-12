import { describe, it, expect, beforeEach } from 'vitest';
import { storeMemory, retrieveMemory, updateMemory, deleteMemory } from '../../core/agent/memoryManager';
import type { MemoryItem } from '../../types';

describe('Memory Manager', () => {
  const testMemory: MemoryItem = {
    id: 'test-1',
    content: 'Test memory content',
    timestamp: Date.now()
  };

  beforeEach(async () => {
    // Clear any existing memories by retrieving and deleting them
    const memories = await retrieveMemory();
    for (const memory of memories) {
      await deleteMemory(memory.id);
    }
  });

  it('should store and retrieve a memory', async () => {
    await storeMemory(testMemory);
    const memories = await retrieveMemory();
    expect(memories).toHaveLength(1);
    expect(memories[0]).toEqual(testMemory);
  });

  it('should update a memory', async () => {
    await storeMemory(testMemory);
    const newContent = 'Updated content';
    const updated = await updateMemory(testMemory.id, newContent);
    expect(updated).toBe(true);
    
    const memories = await retrieveMemory();
    expect(memories[0].content).toBe(newContent);
  });

  it('should delete a memory', async () => {
    await storeMemory(testMemory);
    const deleted = await deleteMemory(testMemory.id);
    expect(deleted).toBe(true);
    
    const memories = await retrieveMemory();
    expect(memories).toHaveLength(0);
  });

  it('should handle updating non-existent memory', async () => {
    const updated = await updateMemory('non-existent', 'New content');
    expect(updated).toBe(false);
  });

  it('should handle deleting non-existent memory', async () => {
    const deleted = await deleteMemory('non-existent');
    expect(deleted).toBe(false);
  });
});