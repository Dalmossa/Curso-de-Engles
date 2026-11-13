#!/usr/bin/env node
/**
 * Script para renovar o token JWT de desenvolvimento (ITS_API_TOKEN) e o ITS_LEARNER_ID
 * no arquivo .env.local do frontend.
 *
 * Uso: node scripts/refresh-token.mjs
 * Ou via npm: npm run token:refresh
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const ENV_PATH = resolve(process.cwd(), '.env.local');
const DEFAULT_API_BASE_URL = 'http://localhost:3000/api/v1';
const DEV_EMAIL = 'dev@its.local';
const DEV_PASSWORD = 'dev12345';

/**
 * Lê e parseia o arquivo .env.local
 * @returns {Record<string, string>} Objeto com as variáveis de ambiente
 */
function parseEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }
  const content = readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    env[key] = value;
  }
  return env;
}

/**
 * Escreve o objeto de variáveis de volta no arquivo .env.local
 * Preserva comentários e ordem original onde possível
 */
function writeEnvFile(filePath, env) {
  let content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const updatedKeys = new Set();

  // Atualiza linhas existentes
  const newLines = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return line;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) return line;
    const key = trimmed.slice(0, eqIndex).trim();
    if (key in env) {
      updatedKeys.add(key);
      return `${key}=${env[key]}`;
    }
    return line;
  });

  // Adiciona chaves novas que não existiam
  for (const [key, value] of Object.entries(env)) {
    if (!updatedKeys.has(key)) {
      newLines.push(`${key}=${value}`);
    }
  }

  writeFileSync(filePath, newLines.join('\n') + '\n', 'utf8');
}

/**
 * Decodifica o payload de um JWT (base64url)
 */
function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');
    const payload = parts[1];
    // base64url -> base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // Padding
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch (e) {
    throw new Error(`Failed to decode JWT: ${e.message}`);
  }
}

/**
 * Faz login na API e retorna o token e learner ID
 */
async function loginAndGetToken(apiBaseUrl) {
  const loginUrl = `${apiBaseUrl}/auth/login`;
  console.log(`[refresh-token] Fazendo login em ${loginUrl}...`);

  try {
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: DEV_EMAIL, password: DEV_PASSWORD }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Login failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    // A API pode retornar access_token OU accessToken (verificar ambos)
    const accessToken = data.access_token ?? data.accessToken;
    if (!accessToken) {
      throw new Error('No access_token or accessToken in response');
    }

    // Decodifica o JWT para obter o sub (learner ID)
    const payload = decodeJwtPayload(accessToken);
    const learnerId = payload.sub ?? payload.learnerId;
    if (!learnerId) {
      throw new Error('No sub or learnerId in JWT payload');
    }

    console.log(`[refresh-token] Login successful! Learner ID: ${learnerId}`);
    return { accessToken, learnerId };
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      throw new Error(
        `Não foi possível conectar ao backend em ${apiBaseUrl}.\n` +
        `Certifique-se de que o backend NestJS está rodando na porta 3000:\n` +
        `  cd ../.. && DB_HOST=localhost DB_PORT=5433 DB_USERNAME=postgres DB_PASSWORD=postgres \\\n` +
        `  DB_NAME=its_platform DB_SSL=false DB_SYNCHRONIZE=false DB_LOGGING=false \\\n` +
        `  DB_POOL_MAX=20 PORT=3000 NODE_ENV=development CORS_ORIGIN=http://localhost:3100 \\\n` +
        `  OTEL_SERVICE_NAME=its-platform-api OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317 \\\n` +
        `  OTEL_METRIC_EXPORT_INTERVAL_MS=30000 APP_VERSION=0.1.0 npm run start:dev`
      );
    }
    throw error;
  }
}

/**
 * Função principal
 */
async function main() {
  console.log('[refresh-token] Iniciando renovação de token de desenvolvimento...\n');

  // 1. Lê .env.local atual
  const currentEnv = parseEnvFile(ENV_PATH);
  const apiBaseUrl = currentEnv.ITS_API_BASE_URL || DEFAULT_API_BASE_URL;

  console.log(`[refresh-token] API Base URL: ${apiBaseUrl}`);

  // 2. Faz login e obtém novo token
  let result;
  try {
    result = await loginAndGetToken(apiBaseUrl);
  } catch (error) {
    console.error(`\n[refresh-token] ERRO: ${error.message}\n`);
    process.exit(1);
  }

  // 3. Atualiza as variáveis
  currentEnv.ITS_API_TOKEN = result.accessToken;
  currentEnv.ITS_LEARNER_ID = result.learnerId;

  // 4. Escreve de volta no .env.local
  writeEnvFile(ENV_PATH, currentEnv);

  console.log('\n[refresh-token] ✅ Token renovado com sucesso!');
  console.log(`   ITS_API_TOKEN: ${result.accessToken.slice(0, 20)}...`);
  console.log(`   ITS_LEARNER_ID: ${result.learnerId}`);
  console.log('\nAgora você pode iniciar o frontend com: npm run dev');
}

main().catch((err) => {
  console.error('[refresh-token] Erro inesperado:', err);
  process.exit(1);
});