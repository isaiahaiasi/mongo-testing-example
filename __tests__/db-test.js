const express = require('express');
const request = require('supertest');
const initMongoServer = require('../mongoConfigTesting');
const Item = require('../models/item')

// init app
const app = express();


// get all items
app.use('/items', async (req, res, next) => {
  const items = await Item.find({});
  res.json(items)
})

// init db server
const dbServerCleanupPromise = initMongoServer();

beforeAll(async () => {
  // populate db
  await Promise.all([
    new Item({ name: 'Item 1'}).save(),
    new Item({ name: 'Item 2'}).save(),
  ])
});

afterAll(async () => {
  // teardown db server
  const dbServerCleanupFn = await dbServerCleanupPromise;
  await dbServerCleanupFn();
})

// run a test to try to connect to the server
describe("Test routes", () => {
  test("Returns response",  async () => {
    const response = await request(app)
      .get("/items")
      .expect("Content-Type", /json/);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe('Item 1')
  });
})
