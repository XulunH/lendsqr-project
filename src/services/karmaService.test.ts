import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { isBlacklisted } from './karmaService.js';

vi.mock('axios');

describe('karmaService.isBlacklisted', () => {
  beforeEach(() => {
    process.env.ADJUTOR_API_KEY = 'test-key';
    vi.resetAllMocks();
  });

  it('returns true when the identity IS found in the blacklist', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: { data: { karma_identity: 'bad@example.com' } },
    });
    await expect(isBlacklisted('bad@example.com')).resolves.toBe(true);
  });

  it('returns false when the identity is NOT found (404)', async () => {
    vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } });
    await expect(isBlacklisted('good@example.com')).resolves.toBe(false);
  });
});