import UsersPage from "./pages/UsersPage";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>User Management Service</h1>
        <p className="app-author">Nguyen Trong Duc &mdash; DucNT190</p>
      </header>
      <main className="app-main">
        <UsersPage />
      </main>
    </div>
  );
}
