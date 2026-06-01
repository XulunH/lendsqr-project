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
    }); //karma id found
    await expect(isBlacklisted('bad@example.com')).resolves.toBe(true);
  });

  it('returns false when the server returns 200 but no karma record (test mode)', async () => {
    vi.mocked(axios.get).mockResolvedValue({
        data: { data: null },   // 200 OK, but no karma id found, which happens under test mode 
    });
    await expect(isBlacklisted('anyone@example.com')).resolves.toBe(false);
});

  it('returns false when the identity is NOT found (404)', async () => {
    vi.mocked(axios.get).mockRejectedValue({ response: { status: 404 } });
    await expect(isBlacklisted('good@example.com')).resolves.toBe(false);
  });
});