export default function UserTable({ users, onEdit, onDelete }) {
  if (users.length === 0) {
    return <p className="empty-state">No users found. Create one above.</p>;
  }

  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td className="actions">
              <button className="btn btn-edit" onClick={() => onEdit(user)}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={() => onDelete(user)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
