import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// The source and compiled layouts both place this file two levels below backend/.
const envFile = fileURLToPath(new URL('../../.env', import.meta.url));
if (existsSync(envFile)) process.loadEnvFile(envFile);
