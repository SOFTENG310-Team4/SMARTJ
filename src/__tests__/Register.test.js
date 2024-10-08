import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import mongoose from "mongoose";
import { registerUser } from "../services/ProfileService";

jest.mock("../services/ProfileService", () => ({
  registerUser: jest.fn(),
}));

describe("Register", () => {
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

  const setup = () => {
    return render(
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders registration form correctly", () => {
    setup();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  test("registers a new user", async () => {
    registerUser.mockResolvedValueOnce({
      message: "User created successfully",
    });

    setup();
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Register" }));
    });

    expect(registerUser).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  test("shows an error message when registration fails", async () => {
    registerUser.mockResolvedValueOnce({
      message: "Same email already in use",
    });
    jest.spyOn(window, "alert").mockImplementation(() => {});

    setup();
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "a@a.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Register" }));
    });

    expect(registerUser).toHaveBeenCalledWith({
      email: "a@a.com",
      password: "password123",
      name: "Test User",
    });
    expect(window.alert).toHaveBeenCalledWith("Same email already in use");
  });
});
