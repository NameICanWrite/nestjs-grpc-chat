import { registerAs } from '@nestjs/config';

export default registerAs('throttle', () => ({
  ttl: process.env.THROTTLE_TTL,
  limit: process.env.THROTTLE_LIMIT,
}));
