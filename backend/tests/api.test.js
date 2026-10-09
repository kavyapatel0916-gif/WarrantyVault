'use strict';
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const request = require('supertest');

const TEST_UPLOAD_DIR = path.join(__dirname, 'test-uploads');
process.env.UPLOAD_DIR = TEST_UPLOAD_DIR;
process.env.MONGO_URI = 'mongodb://localhost:27017/warrantyvault_test';
process.env.JWT_SECRET = 'a_very_secret_test_key_for_testing_purposes_12345';
process.env.NODE_ENV = 'test';

const { createApp } = require('../src/app');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const Receipt = require('../src/models/Receipt');
const ServiceRecord = require('../src/models/ServiceRecord');

describe('WarrantyVault API Integration Tests', () => {
  let app;
  let userA, cookieA;
  let userB, cookieB;

  beforeAll(async () => {
    if (!fs.existsSync(TEST_UPLOAD_DIR)) {
      fs.mkdirSync(TEST_UPLOAD_DIR, { recursive: true });
    }
    await mongoose.connect(process.env.MONGO_URI);
    app = createApp();
  });

  afterAll(async () => {
    try {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    } catch (e) {
      // Ignore cleanup error
    }
    if (fs.existsSync(TEST_UPLOAD_DIR)) {
      fs.rmSync(TEST_UPLOAD_DIR, { recursive: true, force: true });
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Receipt.deleteMany({});
    await ServiceRecord.deleteMany({});

    // Register User A
    const resA = await request(app)
      .post('/api/auth/register')
      .send({ name: 'User Alpha', email: 'alpha@example.com', password: 'password123' });
    userA = resA.body.data.user;
    cookieA = resA.headers['set-cookie'];

    // Register User B
    const resB = await request(app)
      .post('/api/auth/register')
      .send({ name: 'User Beta', email: 'beta@example.com', password: 'password456' });
    userB = resB.body.data.user;
    cookieB = resB.headers['set-cookie'];
  });

  describe('1. Authentication Flow', () => {
    it('rejects duplicate email with 409', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Duplicate', email: 'alpha@example.com', password: 'password123' });
      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('EMAIL_EXISTS');
    });

    it('rejects short passwords (< 8 chars)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Short', email: 'short@example.com', password: '123' });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('rejects login with wrong password (401)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'alpha@example.com', password: 'wrongpassword' });
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('logs in successfully and returns user without passwordHash', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'alpha@example.com', password: 'password123' });
      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe('alpha@example.com');
      expect(res.body.data.user.passwordHash).toBeUndefined();
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('accessing /api/auth/me without auth returns 401', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHENTICATED');
    });

    it('accessing /api/auth/me with cookie returns current user', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookieA);
      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe('alpha@example.com');
    });

    it('logout clears the auth cookie', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookieA);
      expect(res.status).toBe(200);
      const setCookie = res.headers['set-cookie']?.[0] || '';
      expect(setCookie).toMatch(/token=;/);
    });
  });

  describe('2. Product Management and Warranty Calculation', () => {
    it('creates product and computes warrantyExpiryDate correctly', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Cookie', cookieA)
        .send({
          name: 'MacBook Pro',
          brand: 'Apple',
          category: 'Computers',
          purchaseDate: '2024-01-31',
          warrantyMonths: 1, // Leap year 2024 -> 2024-02-29
          purchasePrice: 199999,
        });

      expect(res.status).toBe(201);
      const prod = res.body.data.product;
      expect(prod.name).toBe('MacBook Pro');
      expect(prod.warrantyExpiryDate).toBe('2024-02-29');
      expect(prod.warrantyStatus).toBe('expired');
    });

    it('rejects product with missing required fields', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Cookie', cookieA)
        .send({
          name: 'Missing fields',
        });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('retrieves products only for the logged-in user', async () => {
      // Create product for user A
      await request(app)
        .post('/api/products')
        .set('Cookie', cookieA)
        .send({
          name: 'Alpha Phone',
          brand: 'Pixel',
          category: 'Electronics',
          purchaseDate: '2025-01-01',
          warrantyMonths: 12,
          purchasePrice: 65000,
        });

      // User A lists products
      const resA = await request(app).get('/api/products').set('Cookie', cookieA);
      expect(resA.status).toBe(200);
      expect(resA.body.data.products.length).toBe(1);
      expect(resA.body.data.products[0].name).toBe('Alpha Phone');

      // User B lists products -> empty
      const resB = await request(app).get('/api/products').set('Cookie', cookieB);
      expect(resB.status).toBe(200);
      expect(resB.body.data.products.length).toBe(0);
    });

    it('denies User B from accessing, modifying, or deleting User A product (404/denied)', async () => {
      const createRes = await request(app)
        .post('/api/products')
        .set('Cookie', cookieA)
        .send({
          name: 'Alpha Tablet',
          brand: 'iPad',
          category: 'Computers',
          purchaseDate: '2025-05-15',
          warrantyMonths: 24,
          purchasePrice: 50000,
        });
      const prodId = createRes.body.data.product._id;

      // User B tries to view
      const viewRes = await request(app).get(`/api/products/${prodId}`).set('Cookie', cookieB);
      expect(viewRes.status).toBe(404);

      // User B tries to update
      const updateRes = await request(app)
        .patch(`/api/products/${prodId}`)
        .set('Cookie', cookieB)
        .send({ name: 'Hacked Name' });
      expect(updateRes.status).toBe(404);

      // User B tries to delete
      const delRes = await request(app).delete(`/api/products/${prodId}`).set('Cookie', cookieB);
      expect(delRes.status).toBe(404);
    });

    it('updates product and recalculates warranty end date', async () => {
      const createRes = await request(app)
        .post('/api/products')
        .set('Cookie', cookieA)
        .send({
          name: 'Smart TV',
          brand: 'LG',
          category: 'Appliances',
          purchaseDate: '2025-01-31',
          warrantyMonths: 1, // 2025-02-28
          purchasePrice: 45000,
        });
      const prodId = createRes.body.data.product._id;
      expect(createRes.body.data.product.warrantyExpiryDate).toBe('2025-02-28');

      // Update warrantyMonths to 2 -> 2025-03-31
      const updateRes = await request(app)
        .patch(`/api/products/${prodId}`)
        .set('Cookie', cookieA)
        .send({ warrantyMonths: 2 });
      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data.product.warrantyExpiryDate).toBe('2025-03-31');
    });

    it('deletes product and cascades to child receipts and services', async () => {
      const prodRes = await request(app)
        .post('/api/products')
        .set('Cookie', cookieA)
        .send({
          name: 'Refrigerator',
          brand: 'Whirlpool',
          category: 'Appliances',
          purchaseDate: '2025-01-01',
          warrantyMonths: 24,
          purchasePrice: 30000,
        });
      const prodId = prodRes.body.data.product._id;

      // Add service record
      await request(app)
        .post(`/api/products/${prodId}/services`)
        .set('Cookie', cookieA)
        .send({
          serviceDate: '2025-06-01',
          description: 'Initial installation and inspection',
          status: 'completed',
        });

      // Delete product
      const delRes = await request(app).delete(`/api/products/${prodId}`).set('Cookie', cookieA);
      expect(delRes.status).toBe(200);

      // Verify product is gone
      const getRes = await request(app).get(`/api/products/${prodId}`).set('Cookie', cookieA);
      expect(getRes.status).toBe(404);

      // Verify service record was deleted in cascade
      const services = await ServiceRecord.find({ productId: prodId });
      expect(services.length).toBe(0);
    });
  });

  describe('3. Receipt Uploads and Security', () => {
    let testProductId;

    beforeEach(async () => {
      const prodRes = await request(app)
        .post('/api/products')
        .set('Cookie', cookieA)
        .send({
          name: 'Receipt Test Phone',
          brand: 'OnePlus',
          category: 'Electronics',
          purchaseDate: '2025-01-01',
          warrantyMonths: 12,
          purchasePrice: 40000,
        });
      testProductId = prodRes.body.data.product._id;
    });

    it('rejects unsupported file extension/MIME type (.txt or .exe)', async () => {
      const res = await request(app)
        .post(`/api/products/${testProductId}/receipts`)
        .set('Cookie', cookieA)
        .attach('receipt', Buffer.from('executable content'), 'test.exe');

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('INVALID_FILE_TYPE');
    });

    it('uploads valid JPEG/PNG receipt and allows downloading', async () => {
      const fakeJpg = Buffer.from('fake jpg content');
      const res = await request(app)
        .post(`/api/products/${testProductId}/receipts`)
        .set('Cookie', cookieA)
        .attach('receipt', fakeJpg, 'invoice.jpg');

      expect(res.status).toBe(201);
      const receipt = res.body.data.receipt;
      expect(receipt.originalName).toBe('invoice.jpg');
      expect(receipt.mimeType).toBe('image/jpeg');
      expect(receipt.storagePath).toBeUndefined(); // private, select: false

      // Download the uploaded receipt as User A
      const dlRes = await request(app)
        .get(`/api/receipts/${receipt._id}/download`)
        .set('Cookie', cookieA);
      expect(dlRes.status).toBe(200);
      expect(dlRes.headers['content-disposition']).toMatch(/invoice\.jpg/);

      // User B tries to download User A receipt -> denied (404)
      const dlResB = await request(app)
        .get(`/api/receipts/${receipt._id}/download`)
        .set('Cookie', cookieB);
      expect(dlResB.status).toBe(404);
    });

    it('rejects upload to another user product', async () => {
      const fakeJpg = Buffer.from('fake jpg content');
      const res = await request(app)
        .post(`/api/products/${testProductId}/receipts`)
        .set('Cookie', cookieB)
        .attach('receipt', fakeJpg, 'bill.jpg');
      expect(res.status).toBe(404);
    });
  });

  describe('4. Service Records CRUD', () => {
    let testProductId;

    beforeEach(async () => {
      const prodRes = await request(app)
        .post('/api/products')
        .set('Cookie', cookieA)
        .send({
          name: 'Washing Machine',
          brand: 'Bosch',
          category: 'Appliances',
          purchaseDate: '2025-01-01',
          warrantyMonths: 24,
          purchasePrice: 38000,
        });
      testProductId = prodRes.body.data.product._id;
    });

    it('adds, lists, updates, and deletes service records', async () => {
      // Add
      const addRes = await request(app)
        .post(`/api/products/${testProductId}/services`)
        .set('Cookie', cookieA)
        .send({
          serviceDate: '2025-04-10',
          provider: 'Bosch Official Center',
          description: 'Motor belt maintenance check',
          cost: 1500,
          status: 'completed',
        });
      expect(addRes.status).toBe(201);
      const svcId = addRes.body.data.service._id;

      // List
      const listRes = await request(app)
        .get(`/api/products/${testProductId}/services`)
        .set('Cookie', cookieA);
      expect(listRes.status).toBe(200);
      expect(listRes.body.data.services.length).toBe(1);

      // Update
      const updateRes = await request(app)
        .patch(`/api/services/${svcId}`)
        .set('Cookie', cookieA)
        .send({ cost: 1800, notes: 'Replaced rubber gasket' });
      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data.service.cost).toBe(1800);
      expect(updateRes.body.data.service.notes).toBe('Replaced rubber gasket');

      // User B tries to update User A service record -> denied
      const failUpdate = await request(app)
        .patch(`/api/services/${svcId}`)
        .set('Cookie', cookieB)
        .send({ cost: 0 });
      expect(failUpdate.status).toBe(404);

      // Delete
      const delRes = await request(app)
        .delete(`/api/services/${svcId}`)
        .set('Cookie', cookieA);
      expect(delRes.status).toBe(200);
    });
  });

  describe('5. Dashboard Metrics and Reminders', () => {
    it('returns accurate summary counts and upcoming list from database', async () => {
      const today = new Date().toISOString().slice(0, 10);

      // Expired product (bought long ago, 0 months warranty)
      await request(app)
        .post('/api/products')
        .set('Cookie', cookieA)
        .send({
          name: 'Old Headphones',
          brand: 'Sony',
          category: 'Accessories',
          purchaseDate: '2023-01-01',
          warrantyMonths: 6, // Expired in 2023
          purchasePrice: 5000,
        });

      // Active product (bought recently, 36 months warranty)
      await request(app)
        .post('/api/products')
        .set('Cookie', cookieA)
        .send({
          name: 'New Monitor',
          brand: 'Dell',
          category: 'Computers',
          purchaseDate: today,
          warrantyMonths: 36, // Expires in 3 years
          purchasePrice: 25000,
        });

      const dashRes = await request(app)
        .get('/api/dashboard/summary')
        .set('Cookie', cookieA);

      expect(dashRes.status).toBe(200);
      const summary = dashRes.body.data.summary;
      expect(summary.total).toBe(2);
      expect(summary.expired).toBe(1);
      expect(summary.active).toBe(1);
    });
  });
});
