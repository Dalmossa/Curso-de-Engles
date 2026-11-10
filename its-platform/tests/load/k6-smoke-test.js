/**
 * P2.10 Smoke Test — Quick validation before full load test
 * 
 * Usage: k6 run tests/load/k6-smoke-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('error_rate');

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    'http_req_duration': ['p(95)<500'],
    'error_rate': ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

export function setup() {
  const loginRes = http.post(`${BASE_URL}${API_PREFIX}/auth/login`, JSON.stringify({
    email: 'smoke@test.example.com',
    password: 'SmokeTest123!',
  }), { headers: { 'Content-Type': 'application/json' } });
  
  if (loginRes.status === 200) {
    return { token: loginRes.json().access_token };
  }
  return { token: null };
}

export default function (data) {
  if (!data.token) return;
  
  const headers = { Authorization: `Bearer ${data.token}`, 'Content-Type': 'application/json' };
  
  const endpoints = [
    { path: '/learners/me/profile', weight: 0.3 },
    { path: '/learners/me/mastery', weight: 0.2 },
    { path: '/learners/me/next', weight: 0.3 },
    { path: '/content/lessons/les_a1_greetings', weight: 0.2 },
  ];
  
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const res = http.get(`${BASE_URL}${API_PREFIX}${endpoint.path}`, { headers: { Authorization: `Bearer ${data.token}` } });
  
  check(res, { 'status 200': (r) => r.status === 200 }) || errorRate.add(1);
  sleep(0.5);
}

export function teardown() {
  console.log('Smoke test completed');
}
