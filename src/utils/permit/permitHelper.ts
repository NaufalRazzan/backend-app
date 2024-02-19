import { configDotenv } from 'dotenv';
import { Permit } from 'permitio';

configDotenv()
export const permit = new Permit({
  pdp: process.env.PDP,
  token: process.env.PDP_TOKEN
})