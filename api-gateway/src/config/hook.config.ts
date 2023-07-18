import { registerAs } from '@nestjs/config';

export default registerAs('hook', () => ({
  tokens: process.env.HOOK_TOKENS.split(';'),
}));
