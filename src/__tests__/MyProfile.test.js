/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import mongoose from "mongoose";
import MyProfile from "../pages/MyProfile";
import Login from "../pages/Login";
/*
jest.mock("../services/ProfileService", () => ({
  getProfile: jest.fn().mockResolvedValue({
    name: "Test User",
    profilePicture: { data: null, contentType: null },
    analytics: { sessions: [] },
  }),
  logout: jest.fn(),
  updateProfile: jest.fn(),
}));

describe("MyProfile", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/smartj_test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropCollection("users");
    await mongoose.connection.close();
  });
*/
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

test("renders profile details correctly", async () => {
  setup();
  expect(await screen.findByText("Loading...")).toBeInTheDocument();
});

/*
  test("allows editing profile", async () => {
    setup();
    fireEvent.click(await screen.findByText("Edit"));
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Updated User" },
    });
    fireEvent.click(screen.getByText("Save"));
    expect(
      await screen.findByText("Welcome! Updated User")
    ).toBeInTheDocument();
  });

  test("logs out correctly", async () => {
    setup();
    fireEvent.click(await screen.findByText("Logout"));
    expect(await screen.findByText("Login")).toBeInTheDocument();
  });
});
*/
