import { registerAs } from '@nestjs/config';

export default registerAs('file', () => ({
  baseURL: process.env.HTTP_FILE_SERVICE_HOST,
}));
