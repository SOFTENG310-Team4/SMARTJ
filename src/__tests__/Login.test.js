/**
 * @jest-environment jsdom
 */

import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import MyProfile from "../pages/MyProfile";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  registerUser,
  loginUser,
  getProfile,
} from "../services/ProfileService";

jest.mock("../services/ProfileService", () => ({
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

  test("renders login form correctly", () => {
    setup();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  /*
  test("logs in a user and loads profile", async () => {
    loginUser.mockResolvedValueOnce({
      email: "test@example.com",
      token: "fake-jwt-token",
    });

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
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
    });

    // Wait for the loading to finish and profile to be displayed
    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

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
  */
});
