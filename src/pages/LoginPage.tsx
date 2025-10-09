import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If already logged in, go straight to dashboard
    if (localStorage.getItem("ht_logged_in") === "true") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Minimal demo validation
    if (!email || !password) {
      setError("Vul aub je e-mailadres en wachtwoord in.");
      return;
    }
    // Fake auth: mark as logged in until real backend is added
    localStorage.setItem("ht_logged_in", "true");
    // Navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="app-root">
      {/* Header (shared look) */}
      <header>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 32, height: 32, background: "#111827", color: "#fff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>🚗</div>
            <div>
              <h1>HitchTracker</h1>
              <p>Veilig & Transparant Reizen</p>
            </div>
          </div>
          <span className="badge green" style={{ border: "1px solid #a7f3d0" }}>Beveiligd</span>
        </div>
      </header>

      <main className="container">
        {/* Fake segmented tabs to mirror the look (disabled on login) */}
        <div className="tabs" aria-hidden>
          <button className="active" disabled>Dashboard</button>
          <button disabled>Veiligheid</button>
          <button disabled>Kosten</button>
          <button disabled>Geschiedenis</button>
        </div>

        <section className="card auth-card" aria-label="Inloggen">
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Inloggen</h2>
          <p style={{ marginTop: 0, color: "#6b7280", marginBottom: 16 }}>
            Log in om je ritten te volgen en veilig te delen.
          </p>

          <form className="form" onSubmit={onSubmit}>
            <div className="form-row">
              <label htmlFor="email">E-mailadres</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="naam@voorbeeld.nl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="password">Wachtwoord</label>
              <div className="password-field">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="link-button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}
                >
                  {showPassword ? "Verberg" : "Toon"}
                </button>
              </div>
            </div>

            {error && <div className="alert">{error}</div>}

            <div className="form-row row-between">
              <label className="checkbox">
                <input type="checkbox" />
                <span>Onthoud mij</span>
              </label>
              <a className="link" href="#">Wachtwoord vergeten?</a>
            </div>

            <button className="btn" type="submit">Inloggen</button>
          </form>
        </section>
      </main>
    </div>
  );
}