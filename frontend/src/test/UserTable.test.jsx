import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UserTable from "../components/UserTable";

const mockUsers = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

describe("UserTable", () => {
  it("renders empty state when no users", () => {
    render(<UserTable users={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  it("renders list of users", () => {
    render(<UserTable users={mockUsers} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
  });

  it("calls onEdit with correct user", () => {
    const onEdit = vi.fn();
    render(<UserTable users={mockUsers} onEdit={onEdit} onDelete={vi.fn()} />);
    fireEvent.click(screen.getAllByText("Edit")[0]);
    expect(onEdit).toHaveBeenCalledWith(mockUsers[0]);
  });

  it("calls onDelete with correct user", () => {
    const onDelete = vi.fn();
    render(<UserTable users={mockUsers} onEdit={vi.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getAllByText("Delete")[0]);
    expect(onDelete).toHaveBeenCalledWith(mockUsers[0]);
  });
});
