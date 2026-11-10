import 'dotenv/config';

function required(name: 'E2E_USERNAME' | 'E2E_PASSWORD'): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required. Copy .env.example to .env or set it in the environment.`);
  }
  return value;
}

export const env = {
  baseUrl: (process.env.BASE_URL ?? 'https://opensource-demo.orangehrmlive.com').replace(/\/$/, ''),
  username: () => required('E2E_USERNAME'),
  password: () => required('E2E_PASSWORD'),
  retainTrace: process.env.PW_RETAIN_TRACE === 'true',
} as const;
