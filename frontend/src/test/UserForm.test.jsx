import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UserForm from "../components/UserForm";

describe("UserForm", () => {
  it("renders create form when no editingUser", () => {
    render(<UserForm onSubmit={vi.fn()} editingUser={null} onCancel={vi.fn()} />);
    expect(screen.getByText("Create User")).toBeInTheDocument();
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
  });

  it("renders edit form when editingUser is provided", () => {
    const user = { id: 1, name: "Alice", email: "alice@example.com" };
    render(<UserForm onSubmit={vi.fn()} editingUser={user} onCancel={vi.fn()} />);
    expect(screen.getByText("Edit User")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", () => {
    render(<UserForm onSubmit={vi.fn()} editingUser={null} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByText("Create"));
    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("calls onSubmit with form data", () => {
    const onSubmit = vi.fn();
    render(<UserForm onSubmit={onSubmit} editingUser={null} onCancel={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Test User" } });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByText("Create"));
    expect(onSubmit).toHaveBeenCalledWith({ name: "Test User", email: "test@example.com" });
  });
});
