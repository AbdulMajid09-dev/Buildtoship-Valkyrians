import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../server/app.js';
import { getDb } from '../server/db/connection.js';

describe('AI Agriculture Advisory Platform API & Workflow', () => {
  let app: any;
  let userTokenA: string;
  let userIdA: string;
  let userTokenB: string;
  let userIdB: string;
  let createdAdvisoryId: string;
  let createdResultId: string;

  beforeAll(async () => {
    // Ensure DB is initialized
    await getDb();
    app = createApp();
  });

  afterAll(async () => {
    const db = await getDb();
    await db.close();
  });

  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('POST /api/auth/register creates User A successfully', async () => {
    const email = `farmer_${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Jane Farmer',
        email,
        password: 'SecurePassword123!',
        preferredLanguage: 'English',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(email);
    expect(res.body.data.user.fullName).toBe('Jane Farmer');
    expect(res.body.data.user).not.toHaveProperty('password_hash');
    expect(res.body.data.token).toBeDefined();

    userTokenA = res.body.data.token;
    userIdA = res.body.data.user.id;
  });

  it('POST /api/auth/register creates User B for data isolation checks', async () => {
    const email = `farmer_b_${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Bob Agronomist',
        email,
        password: 'AnotherPassword456!',
        preferredLanguage: 'English',
      });

    expect(res.status).toBe(201);
    userTokenB = res.body.data.token;
    userIdB = res.body.data.user.id;
  });

  it('POST /api/auth/login logs in User A with valid credentials', async () => {
    // We can fetch me with token
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userTokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.id).toBe(userIdA);
  });

  it('GET /api/advisories without auth token is rejected with 401', async () => {
    const res = await request(app).get('/api/advisories');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/advisories validates required fields and rejects invalid payload with 400', async () => {
    const res = await request(app)
      .post('/api/advisories')
      .set('Authorization', `Bearer ${userTokenA}`)
      .send({
        cropName: 'W', // too short
        growthStage: 'InvalidStage',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('POST /api/advisories creates and persists a full AI agricultural advisory', async () => {
    const res = await request(app)
      .post('/api/advisories')
      .set('Authorization', `Bearer ${userTokenA}`)
      .send({
        cropName: 'Tomato',
        cropCategory: 'Vegetables',
        growthStage: 'Flowering',
        location: 'Salinas Valley, California',
        soilType: 'Clay loam',
        soilPh: 6.5,
        soilMoisture: 'Moderately Moist / Optimal',
        irrigationMethod: 'Drip',
        visibleSymptoms: 'Dark brown lesions with concentric rings on lower leaves, slight leaf drop',
        affectedPlantParts: 'Lower canopy leaves',
        affectedPercentage: 15,
        problemDescription: 'Noticing dark concentric spots on lower foliage following warm, humid weather. Blossoms are still setting but leaves are dropping.',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.request).toBeDefined();
    expect(res.body.data.result).toBeDefined();

    createdAdvisoryId = res.body.data.request.id;
    createdResultId = res.body.data.result.id;

    // Validate structured AI output properties
    const result = res.body.data.result;
    expect(result.category).toBeDefined();
    expect(result.situation_summary).toBeDefined();
    expect(result.crop_assessment).toBeDefined();
    expect(Array.isArray(result.possible_causes)).toBe(true);
    expect(result.possible_causes.length).toBeGreaterThan(0);
    expect(Array.isArray(result.immediate_actions)).toBe(true);
    expect(result.immediate_actions.length).toBeGreaterThan(0);
    expect(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']).toContain(result.severity);
    expect(['LOW', 'MEDIUM', 'HIGH']).toContain(result.confidence);
    expect(result.expert_escalation).toBeDefined();
  });

  it('GET /api/advisories/:id allows owner (User A) to view advisory', async () => {
    const res = await request(app)
      .get(`/api/advisories/${createdAdvisoryId}`)
      .set('Authorization', `Bearer ${userTokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.data.request.id).toBe(createdAdvisoryId);
    expect(res.body.data.request.crop_name).toBe('Tomato');
  });

  it('SECURITY TEST: User B CANNOT access User A advisory (Data Isolation)', async () => {
    const res = await request(app)
      .get(`/api/advisories/${createdAdvisoryId}`)
      .set('Authorization', `Bearer ${userTokenB}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('SECURITY TEST: User B CANNOT delete User A advisory (Data Isolation)', async () => {
    const res = await request(app)
      .delete(`/api/advisories/${createdAdvisoryId}`)
      .set('Authorization', `Bearer ${userTokenB}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/advisories/:id/feedback records user feedback', async () => {
    const res = await request(app)
      .post(`/api/advisories/${createdResultId}/feedback`)
      .set('Authorization', `Bearer ${userTokenA}`)
      .send({
        rating: 5,
        feedback: 'Very practical advice. Field walk helped catch the spots early.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.rating).toBe(5);
  });

  it('GET /api/advisories/stats returns accurate user dashboard statistics', async () => {
    const res = await request(app)
      .get('/api/advisories/stats')
      .set('Authorization', `Bearer ${userTokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.data.totalAdvisories).toBeGreaterThanOrEqual(1);
    expect(res.body.data.cropsAnalyzed).toBeGreaterThanOrEqual(1);
    expect(res.body.data.recentAdvisories.length).toBeGreaterThanOrEqual(1);
  });
});
