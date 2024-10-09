/**
 * @jest-environment jsdom
 */

import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MyProfile from "../js/pages/MyProfile";
import Login from "../js/pages/Login";
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
  getProfile: jest.fn(),
  logout: jest.fn(),
  updateProfile: jest.fn(),
  deleteProfile: jest.fn(),
}));

describe("MyProfile", () => {
  const setup = () => {
    return render(
      <MemoryRouter initialEntries={["/my-profile"]}>
        <Routes>
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/login" element={<Login />} />
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

  test("renders profile details correctly", async () => {
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

    localStorageMock.setItem("token", "fake-jwt-token");
    setup();

    await waitFor(() => {
      expect(screen.getByText("Welcome! Test User")).toBeInTheDocument();
    });
  });

  test("allows editing profile", async () => {
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

    localStorageMock.setItem("token", "fake-jwt-token");
    setup();

    fireEvent.click(await screen.findByText("Edit"));
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Updated User" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Welcome! Updated User")).toBeInTheDocument();
    });
  });
});
