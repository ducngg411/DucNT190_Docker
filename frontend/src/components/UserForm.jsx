import { useState, useEffect } from "react";

const emptyForm = { name: "", email: "" };

export default function UserForm({ onSubmit, editingUser, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingUser) {
      setForm({ name: editingUser.name, email: editingUser.email });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editingUser]);

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Invalid email format";
    }
    return errs;
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
    if (!editingUser) setForm(emptyForm);
  }

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h2>{editingUser ? "Edit User" : "Create User"}</h2>

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter full name"
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email address"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingUser ? "Update" : "Create"}
        </button>
        {editingUser && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
