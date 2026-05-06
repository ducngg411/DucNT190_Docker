import UserTable from "./UserTable";

export default function UserList({ users, loading, error, onEdit, onDelete }) {
  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="user-list">
      <h2>Users ({users.length})</h2>
      <UserTable users={users} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
