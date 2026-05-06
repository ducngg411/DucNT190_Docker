import { useState } from "react";
import { userApi } from "../api/userApi";
import { useUsers } from "../hooks/useUsers";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";

export default function UsersPage() {
  const { users, loading, error, refetch } = useUsers();
  const [editingUser, setEditingUser] = useState(null);
  const [notification, setNotification] = useState(null);

  function showNotification(message, type = "success") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }

  async function handleCreate(formData) {
    try {
      await userApi.create(formData);
      await refetch();
      showNotification("User created successfully");
    } catch (err) {
      showNotification(err.response?.data?.detail || "Failed to create user", "error");
    }
  }

  async function handleUpdate(formData) {
    try {
      await userApi.update(editingUser.id, formData);
      setEditingUser(null);
      await refetch();
      showNotification("User updated successfully");
    } catch (err) {
      showNotification(err.response?.data?.detail || "Failed to update user", "error");
    }
  }

  async function handleDelete(user) {
    if (!window.confirm(`Delete user "${user.name}"?`)) return;
    try {
      await userApi.delete(user.id);
      await refetch();
      showNotification("User deleted successfully");
    } catch (err) {
      showNotification(err.response?.data?.detail || "Failed to delete user", "error");
    }
  }

  return (
    <div className="page">
      <h1>User Management</h1>

      {notification && (
        <div className={`alert alert-${notification.type}`}>{notification.message}</div>
      )}

      <UserForm
        onSubmit={editingUser ? handleUpdate : handleCreate}
        editingUser={editingUser}
        onCancel={() => setEditingUser(null)}
      />

      <UserList
        users={users}
        loading={loading}
        error={error}
        onEdit={setEditingUser}
        onDelete={handleDelete}
      />
    </div>
  );
}
