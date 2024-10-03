/**
 * @jest-environment node
 */

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../Server"); // Adjust the path if necessary

let connection;

describe("Server Endpoints", () => {
  beforeAll(async () => {
    connection = await mongoose.createConnection(
      "mongodb://localhost:27017/smartj_test",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection("users");
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the users collection before each test
    await connection.collection("users").deleteMany({});
  });

  test("Register a new user", async () => {
    const res = await request(app).post("/api/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe("User created successfully");
  });
});
