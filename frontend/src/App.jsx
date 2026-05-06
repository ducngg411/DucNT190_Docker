import UsersPage from "./pages/UsersPage";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>User Management Service</h1>
      </header>
      <main className="app-main">
        <UsersPage />
      </main>
    </div>
  );
}
