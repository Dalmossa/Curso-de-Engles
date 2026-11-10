/**
 * P2.10 Load Test — 1k concurrent users
 * 
 * Targets: p95 < 200ms, error rate < 0.1%
 * Runs against PostgreSQL (not PGlite) to test real contention
 * 
 * Usage:
 *   k6 run --env BASE_URL=https://api.example.com tests/load/k6-load-test.js
 *   k6 run --env BASE_URL=http://localhost:3000 --vus 1000 --duration 5m tests/load/k6-load-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { randomUUID } from 'crypto';

// Custom metrics
const errorRate = new Rate('error_rate');
const latency = Trend('latency');
const requests = Counter('requests_total');

// Test configuration
export const options = {
  scenarios: {
    // Ramp up to 1000 VUs over 2 minutes, hold for 5 minutes, ramp down
    load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 1000 },  // Ramp up to 1000 VUs
        { duration: '5m', target: 1000 },  // Stay at 1000 VUs
        { duration: '1m', target: 0 },     // Ramp down
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    // P2.10 acceptance criteria
    'http_req_duration{type:api}': ['p(95)<200'],     // p95 < 200ms
    'error_rate': ['rate<0.001'],                      // error rate < 0.1%
    'http_req_failed': ['rate<0.001'],                 // failed requests < 0.1%
  },
};

// Base URL from environment
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

// Test data
const testUsers = Array.from({ length: 100 }, (_, i) => ({
  email: `loadtest${i}@example.com`,
  password: 'LoadTest123!',
  learnerId: `learner-${i}`,
}));

function getAuthHeaders(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export function setup() {
  // Create test users and get auth tokens
  console.log('Setting up test users...');
  const tokens = [];
  
  for (const user of testUsers) {
    // Register user
    const registerRes = http.post(`${BASE_URL}${API_PREFIX}/auth/register`, JSON.stringify({
      email: user.email,
      password: user.password,
      displayName: `Load Test User ${user.learnerId}`,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (registerRes.status === 201 || registerRes.status === 409) {
      // Login to get token
      const loginRes = http.post(`${BASE_URL}${API_PREFIX}/auth/login`, JSON.stringify({
        email: user.email,
        password: user.password,
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (loginRes.status === 200) {
        const body = loginRes.json();
        tokens.push({
          learnerId: user.learnerId,
          token: body.access_token || body.token,
        });
      }
    }
  }
  
  console.log(`Created ${tokens.length} test users with tokens`);
  return { tokens };
}

export default function (data) {
  const token = data.tokens[Math.floor(Math.random() * data.tokens.length)]?.token;
  if (!token) {
    console.error('No token available');
    return;
  }

  const headers = getAuthHeaders(token);
  
  // Scenario 1: Get learner profile (10% of requests)
  if (Math.random() < 0.1) {
    const start = Date.now();
    const res = http.get(`${BASE_URL}${API_PREFIX}/learners/me/profile`, { headers });
    latency.add(Date.now() - start);
    requests.add(1);
    check(res, { 'profile 200': (r) => r.status === 200 }) || errorRate.add(1);
    sleep(0.1);
  }
  
  // Scenario 2: Get mastery (20% of requests)
  if (Math.random() < 0.2) {
    const start = Date.now();
    const res = http.get(`${BASE_URL}${API_PREFIX}/learners/me/mastery`, { headers });
    latency.add(Date.now() - start);
    requests.add(1);
    check(res, { 'mastery 200': (r) => r.status === 200 }) || errorRate.add(1);
    sleep(0.1);
  }
  
  // Scenario 3: Get next activity (30% of requests)
  if (Math.random() < 0.3) {
    const start = Date.now();
    const res = http.get(`${BASE_URL}${API_PREFIX}/learners/me/next`, { headers });
    latency.add(Date.now() - start);
    requests.add(1);
    check(res, { 'next 200': (r) => r.status === 200 }) || errorRate.add(1);
    sleep(0.1);
  }
  
  // Scenario 4: Submit practice (25% of requests)
  if (Math.random() < 0.25) {
    const start = Date.now();
    const res = http.post(
      `${BASE_URL}${API_PREFIX}/learners/me/practice`,
      JSON.stringify({
        learner_id: data.tokens[0].learnerId,
        pack_id: 'pack_les_a1_greetings_v1',
        responses: [
          { item_id: 'vocab.greetings.good_morning', response: 'A', response_time_ms: 1000 },
          { item_id: 'vocab.greetings.good_evening', response: 'B', response_time_ms: 1200 },
        ],
      }),
      { headers }
    );
    latency.add(Date.now() - start);
    requests.add(1);
    check(res, { 'practice 200': (r) => r.status === 200 }) || errorRate.add(1);
    sleep(0.2);
  }
  
  // Scenario 5: Get lesson content (15% of requests)
  if (Math.random() < 0.15) {
    const lessonIds = [
      'les_a1_alphabet_sounds',
      'les_a1_greetings',
      'les_a1_present_simple',
      'les_a2_greetings_intro',
      'les_a2_email_basics',
    ];
    const lessonId = lessonIds[Math.floor(Math.random() * lessonIds.length)];
    
    const start = Date.now();
    const res = http.get(`${BASE_URL}${API_PREFIX}/content/lessons/${lessonId}`, { headers });
    latency.add(Date.now() - start);
    requests.add(1);
    check(res, { 'lesson 200': (r) => r.status === 200 }) || errorRate.add(1);
    sleep(0.1);
  }
  
  // Scenario 6: Get next activity with context (budget) (10% of requests)
  if (Math.random() < 0.1) {
    const start = Date.now();
    const res = http.get(`${BASE_URL}${API_PREFIX}/learners/me/next?time_budget_minutes=15`, { headers });
    latency.add(Date.now() - start);
    requests.add(1);
    check(res, { 'next with budget 200': (r) => r.status === 200 }) || errorRate.add(1);
    sleep(0.1);
  }
}

export function teardown(data) {
  console.log('Load test completed');
  console.log(`Total requests: ${requests.count}`);
  console.log(`Error rate: ${errorRate.rate * 100}%`);
  console.log(`p95 latency: ${latency.values.p95}ms`);
}
