import { registerAs } from '@nestjs/config';

export default registerAs('crm', () => ({
  host: process.env.CRM_OAUTH_HOST,
  clientId: {
    local: process.env.CRM_OAUTH_CLIENT_ID_LOCAL,
    dev: process.env.CRM_OAUTH_CLIENT_ID_DEV,
    dev_v2: process.env.CRM_OAUTH_CLIENT_ID_DEV_V2,
    prod: process.env.CRM_OAUTH_CLIENT_ID_PROD,
  },
  clientSecret: {
    local: process.env.CRM_OAUTH_CLIENT_SECRET_LOCAL,
    dev: process.env.CRM_OAUTH_CLIENT_SECRET_DEV,
    dev_v2: process.env.CRM_OAUTH_CLIENT_SECRET_DEV_V2,
    prod: process.env.CRM_OAUTH_CLIENT_SECRET_PROD,
  },
}));
