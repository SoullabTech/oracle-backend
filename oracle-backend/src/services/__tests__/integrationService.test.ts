import { registerIntegration, getIntegrationConfig, updateIntegrationStatus } from '../integrationService';
import { supabase } from '../../lib/supabase';

jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    })),
    sql: jest.fn((strings, ...values) => ({ strings, values })),
  },
}));

describe('Integration Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerIntegration', () => {
    it('should register integration successfully', async () => {
      const mockIntegration = {
        serviceName: 'test-service',
        apiKey: 'test-key',
      };

      const mockResponse = {
        data: { id: 'test-id', ...mockIntegration },
        error: null,
      };

      (supabase.from().insert().select().single as jest.Mock).mockResolvedValue(mockResponse);

      const id = await registerIntegration(mockIntegration);
      expect(id).toBe('test-id');
    });

    it('should handle registration errors', async () => {
      const mockError = new Error('Registration failed');
      (supabase.from().insert().select().single as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(registerIntegration({
        serviceName: 'test',
        apiKey: 'test',
      })).rejects.toThrow('Failed to register integration');
    });
  });

  describe('getIntegrationConfig', () => {
    it('should get active integration config', async () => {
      const mockConfig = {
        id: 'test-id',
        service_name: 'test-service',
        api_key_hash: 'test-key',
        status: 'active',
      };

      (supabase.from().select().eq().eq().single as jest.Mock).mockResolvedValue({
        data: mockConfig,
        error: null,
      });

      const config = await getIntegrationConfig('test-service');
      expect(config).toBeDefined();
      expect(config?.serviceName).toBe('test-service');
    });
  });

  describe('updateIntegrationStatus', () => {
    it('should update integration status', async () => {
      const mockResponse = { error: null };
      (supabase.from().update().eq as jest.Mock).mockResolvedValue(mockResponse);

      await expect(updateIntegrationStatus('test-id', 'inactive')).resolves.not.toThrow();
    });
  });
});