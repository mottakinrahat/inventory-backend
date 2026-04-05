import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET || process.env.jwt_secret,
    expires_in: process.env.EXPIRES_IN || process.env.expires_in,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET || process.env.refresh_token_secret,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN || process.env.refresh_token_expires_in,
  },
  reset_pass: {
    token_secret: process.env.RESET_PASS_TOKEN || process.env.reset_pass_token || process.env.reset_pass_token_secret,
    token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN || process.env.reset_pass_token_expires_in,
    link: process.env.RESET_PASS_LINK || process.env.reset_pass_link,
  },
  frontend_url: process.env.FRONTEND_URL || process.env.frontend_url,
};
