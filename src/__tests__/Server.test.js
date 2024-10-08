/**
 * @jest-environment node
 */

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../Server");

let connection;
let token;

describe("Server Endpoints", () => {
  beforeAll(async () => {
    connection = await mongoose.createConnection(
      "mongodb://localhost:27017/smartj_test",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    // Register a user and get a token for authenticated routes
    await request(app).post("/api/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });
    const loginRes = await request(app).post("/api/login").send({
      email: "test@example.com",
      password: "password123",
    });
    token = loginRes.body.token;
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
      email: "newuser@example.com",
      password: "password123",
      name: "New User",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe("User created successfully");
  });

  test("Login a user", async () => {
    const res = await request(app).post("/api/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
  });

  test("Get user profile", async () => {
    const res = await request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe("Test User");
  });

  test("Update user profile", async () => {
    const res = await request(app)
      .put("/api/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        profile: JSON.stringify({ name: "Updated User" }),
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe("Updated User");
  });

  test("Delete user profile", async () => {
    const res = await request(app)
      .delete("/api/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("User deleted successfully");
  });
});
