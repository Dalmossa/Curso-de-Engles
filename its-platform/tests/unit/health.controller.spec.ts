import { HealthController } from '../../src/health/health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  describe('health', () => {
    it('returns ok status with timestamp', () => {
      const result = controller.health();
      expect(result.status).toBe('ok');
      expect(result.timestamp).toBeDefined();
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });
  });

  describe('ready', () => {
    it('returns ok status with checks', () => {
      const result = controller.ready();
      expect(result.status).toBe('ok');
      expect(result.timestamp).toBeDefined();
      expect(result.checks).toEqual({
        database: true,
        redis: true,
        config: true,
      });
    });
  });
});