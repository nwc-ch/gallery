import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { GoogleIdentityService } from './google-identity.service.js';

describe('GoogleIdentityService', () => {
  const profile = {
    iss: 'https://accounts.google.com',
    aud: 'test-client',
    sub: 'google-123',
    iat: 1,
    exp: 2,
    email: 'person@example.com',
    email_verified: true,
  };

  beforeEach(() => {
    vi.stubEnv('GOOGLE_CLIENT_ID', 'test-client');
    vi.stubEnv('GOOGLE_CLIENT_SECRET', 'test-secret');
    vi.spyOn(OAuth2Client.prototype, 'getToken').mockResolvedValue({
      tokens: { id_token: 'google-token' },
      res: null,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('exchanges the code with PKCE and verifies the token against our client ID', async () => {
    const exchange = vi.spyOn(OAuth2Client.prototype, 'getToken');
    const verify = vi
      .spyOn(OAuth2Client.prototype, 'verifyIdToken')
      .mockResolvedValue(new LoginTicket('', profile));
    expect(
      await new GoogleIdentityService().verify('code', 'verifier'),
    ).toEqual(profile);
    expect(exchange).toHaveBeenCalledWith({
      code: 'code',
      codeVerifier: 'verifier',
    });
    expect(verify).toHaveBeenCalledWith({
      idToken: 'google-token',
      audience: 'test-client',
    });
  });

  it('rejects an email address Google has not verified', async () => {
    vi.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockResolvedValue(
      new LoginTicket('', { ...profile, email_verified: false }),
    );
    await expect(
      new GoogleIdentityService().verify('code', 'verifier'),
    ).rejects.toThrow();
  });

  it('rejects a token that fails Google signature, issuer, audience or expiry validation', async () => {
    vi.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockRejectedValue(
      new Error('Invalid token'),
    );
    await expect(
      new GoogleIdentityService().verify('code', 'verifier'),
    ).rejects.toThrow('Invalid token');
  });
});
