/**
 * @jest-environment jsdom
 */

import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Login from "../js/pages/Login";
import MyProfile from "../js/pages/MyProfile";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { getProfile } from "../js/services/ProfileService";

const localStorageMock = (function () {
  let store = {};

  return {
    getItem: function (key) {
      return store[key];
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

jest.mock("../js/services/ProfileService", () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  getProfile: jest.fn(),
}));

describe("Login", () => {
  const setup = () => {
    return render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/my-profile" element={<MyProfile />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeAll(async () => {
    // Connect to the database
    await mongoose.connect("mongodb://localhost:27017/smartj_test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a test user
    const hashedPassword = await bcrypt.hash("password123", 10);
    await mongoose.connection.db.collection("users").insertOne({
      email: "test@example.com",
      password: hashedPassword,
      profile: {
        name: "Test User",
        profilePicture: {
          data: Buffer.from(""),
          contentType: "image/png",
        },
        analytics: {
          sessions: [],
        },
      },
    });
  });

  afterAll(async () => {
    // Clear the database of users
    await mongoose.connection.db.collection("users").deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test("renders login form correctly", () => {
    setup();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  test("logs in a user and loads profile", async () => {
    getProfile.mockResolvedValueOnce({
      name: "Test User",
      profilePicture: {
        data: "",
        contentType: "image/png",
      },
      analytics: {
        sessions: [],
      },
    });

    setup();
    localStorageMock.setItem("token", "fake-jwt-token");
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
    });

    // Check if the token is set in localStorage
    expect(localStorageMock.getItem("token")).toBe("fake-jwt-token");

    await waitFor(() => {
      expect(
        screen.getByText((content, element) => {
          return (
            element.tagName.toLowerCase() === "h1" &&
            content.includes("Welcome! Test User")
          );
        })
      ).toBeInTheDocument();
    });
  });
});
