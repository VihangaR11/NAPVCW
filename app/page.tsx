"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  cases,
  divisionSummary,
  monthlyTrend,
  recentActivity,
  type CaseRecord,
} from "./data";

type ViewKey =
  | "executive"
  | "registry"
  | "legal"
  | "protection"
  | "assistance";

type AccessScope = "division" | "registry" | "all";

function publicAsset(filename: string) {
  return `${import.meta.env.BASE_URL}${filename.replace(/^\/+/, "")}`;
}

type DemoEmployee = {
  epfNumber: string;
  password: string;
  name: string;
  initials: string;
  designation: string;
  division: string;
  homeView: ViewKey;
  scope: AccessScope;
};

const demoEmployees: DemoEmployee[] = [
  {
    epfNumber: "100245",
    password: "Legal@123",
    name: "N. Perera",
    initials: "NP",
    designation: "Legal Officer",
    division: "Legal Division",
    homeView: "legal",
    scope: "division",
  },
  {
    epfNumber: "100318",
    password: "Protect@123",
    name: "S. Fernando",
    initials: "SF",
    designation: "Protection Officer",
    division: "Protection Division",
    homeView: "protection",
    scope: "division",
  },
  {
    epfNumber: "100412",
    password: "Assist@123",
    name: "R. Silva",
    initials: "RS",
    designation: "Assistance Officer",
    division: "Assistance Division",
    homeView: "assistance",
    scope: "division",
  },
  {
    epfNumber: "800001",
    password: "Board@123",
    name: "Board Secretary",
    initials: "BS",
    designation: "Board Secretary",
    division: "Board Secretariat",
    homeView: "registry",
    scope: "registry",
  },
  {
    epfNumber: "900001",
    password: "DG@123",
    name: "Director General",
    initials: "DG",
    designation: "Director General",
    division: "Executive Management",
    homeView: "executive",
    scope: "all",
  },
];

const views: Array<{
  key: ViewKey;
  label: string;
  short: string;
  eyebrow: string;
  title: string;
  description: string;
}> = [
  {
    key: "executive",
    label: "Executive overview",
    short: "EO",
    eyebrow: "Director General workspace",
    title: "Case flow overview",
    description:
      "A concise view of operational workload, urgent matters and actions requiring management attention.",
  },
  {
    key: "registry",
    label: "Case registry",
    short: "CR",
    eyebrow: "Board Secretary workspace",
    title: "Registration and routing",
    description:
      "Monitor complaints awaiting registration, DG instructions, routing and division acknowledgement.",
  },
  {
    key: "legal",
    label: "Legal division",
    short: "LD",
    eyebrow: "Law and Law Enforcement",
    title: "Legal case tracking",
    description:
      "Track assignments, observation deadlines, reminders, reviews, Board papers and panel inquiries.",
  },
  {
    key: "protection",
    label: "Protection services",
    short: "PS",
    eyebrow: "Protection workspace",
    title: "Protection and threat assessments",
    description:
      "Monitor urgent protection requests, interim notices, threat assessments and protection decisions.",
  },
  {
    key: "assistance",
    label: "Assistance services",
    short: "AS",
    eyebrow: "Assistance workspace",
    title: "Assistance request tracking",
    description:
      "Review assistance classifications, X2/X3 requirements, referrals and service completion.",
  },
];

const metricDefinitions: Record<
  ViewKey,
  Array<{
    label: string;
    value: string;
    note: string;
    tone: "navy" | "amber" | "red" | "green";
  }>
> = {
  executive: [
    {
      label: "Active cases",
      value: "128",
      note: "Across four operational areas",
      tone: "navy",
    },
    {
      label: "Urgent matters",
      value: "09",
      note: "3 require attention today",
      tone: "red",
    },
    {
      label: "Overdue actions",
      value: "14",
      note: "Down 6% from last week",
      tone: "amber",
    },
    {
      label: "Closed this month",
      value: "23",
      note: "82% within target period",
      tone: "green",
    },
  ],
  registry: [
    {
      label: "New complaints",
      value: "17",
      note: "Received during July",
      tone: "navy",
    },
    {
      label: "Awaiting DG",
      value: "06",
      note: "2 marked as urgent",
      tone: "red",
    },
    {
      label: "Ready to route",
      value: "08",
      note: "Classification completed",
      tone: "amber",
    },
    {
      label: "Acknowledged",
      value: "31",
      note: "96% routing acknowledgement",
      tone: "green",
    },
  ],
  legal: [
    {
      label: "Active legal cases",
      value: "52",
      note: "21 assigned to IO/LO teams",
      tone: "navy",
    },
    {
      label: "Observations overdue",
      value: "07",
      note: "Reminder action required",
      tone: "red",
    },
    {
      label: "Under review",
      value: "11",
      note: "AD or Director review",
      tone: "amber",
    },
    {
      label: "Board matters",
      value: "05",
      note: "2 panel inquiries scheduled",
      tone: "green",
    },
  ],
  protection: [
    {
      label: "Active requests",
      value: "34",
      note: "6 high-priority cases",
      tone: "navy",
    },
    {
      label: "Urgent protection",
      value: "06",
      note: "Interim action monitored",
      tone: "red",
    },
    {
      label: "Assessments pending",
      value: "12",
      note: "4 beyond expected date",
      tone: "amber",
    },
    {
      label: "Under review",
      value: "08",
      note: "Protection continuation review",
      tone: "green",
    },
  ],
  assistance: [
    {
      label: "Open requests",
      value: "29",
      note: "Across seven assistance types",
      tone: "navy",
    },
    {
      label: "Urgent support",
      value: "04",
      note: "Medical or counselling need",
      tone: "red",
    },
    {
      label: "Referral pending",
      value: "09",
      note: "Provider response required",
      tone: "amber",
    },
    {
      label: "Completed",
      value: "18",
      note: "During the current month",
      tone: "green",
    },
  ],
};

const viewDivision: Partial<Record<ViewKey, string>> = {
  legal: "Legal",
  protection: "Protection",
  assistance: "Assistance",
};

function LegacyLoginPage({
  onLogin,
}: {
  onLogin: (employee: DemoEmployee) => void;
}) {
  const [epfNumber, setEpfNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const employee = demoEmployees.find(
      (record) =>
        record.epfNumber === epfNumber.trim() && record.password === password,
    );

    if (!employee) {
      setError("The EPF number or password is incorrect. Use a demonstration account below.");
      return;
    }

    setError("");
    onLogin(employee);
  }

  function useDemoAccount(employee: DemoEmployee) {
    setEpfNumber(employee.epfNumber);
    setPassword(employee.password);
    setError("");
  }

  return (
    <main className="login-page">
      <section className="login-introduction">
        <div className="login-brand">
          <div className="login-emblem" aria-hidden="true">
            NW
          </div>
          <div>
            <p>National Authority</p>
            <strong>NAPVCW</strong>
          </div>
        </div>

        <div className="login-message">
          <p className="login-kicker">Digital Case Flow Management System</p>
          <h1>Secure access to coordinated case services.</h1>
          <p>
            One protected workspace for complaint registration, legal action,
            protection services, assistance and executive oversight.
          </p>

          <div className="login-capabilities">
            <div>
              <span>01</span>
              <p>
                <strong>Division-based access</strong>
                Employees are routed directly to their assigned operational division.
              </p>
            </div>
            <div>
              <span>02</span>
              <p>
                <strong>Management oversight</strong>
                Authorized senior officers can review cross-division statistics.
              </p>
            </div>
            <div>
              <span>03</span>
              <p>
                <strong>Accountability by design</strong>
                Future production actions will be attributable to an authenticated user.
              </p>
            </div>
          </div>
        </div>

        <p className="login-classification">
          Prototype environment · demonstration information only
        </p>
      </section>

      <section className="login-form-section">
        <div className="login-form-wrap">
          <div className="login-form-heading">
            <span className="secure-badge">Authorized personnel</span>
            <h2>Sign in to DCFMS</h2>
            <p>Use your EPF number and assigned password.</p>
          </div>

          <form className="login-form" onSubmit={submitLogin}>
            <label>
              <span>Username / EPF number</span>
              <div className="login-input">
                <i aria-hidden="true">ID</i>
                <input
                  autoComplete="username"
                  inputMode="numeric"
                  name="username"
                  onChange={(event) => setEpfNumber(event.target.value)}
                  placeholder="Enter EPF number"
                  value={epfNumber}
                />
              </div>
            </label>

            <label>
              <span>Password</span>
              <div className="login-input">
                <i aria-hidden="true">••</i>
                <input
                  autoComplete="current-password"
                  name="password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  className="password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className="login-options">
              <label className="remember-option">
                <input type="checkbox" />
                <span>Remember EPF number</span>
              </label>
              <button className="forgot-button" type="button">
                Forgot password?
              </button>
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button className="login-submit" type="submit">
              Sign in securely
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <div className="demo-accounts">
            <div className="demo-heading">
              <div>
                <strong>Demonstration accounts</strong>
                <span>Select an account to fill the login form.</span>
              </div>
              <span>Prototype</span>
            </div>
            <div className="demo-account-grid">
              {demoEmployees.map((employee) => (
                <button
                  key={employee.epfNumber}
                  onClick={() => useDemoAccount(employee)}
                  type="button"
                >
                  <span>{employee.initials}</span>
                  <div>
                    <strong>{employee.designation}</strong>
                    <small>
                      EPF {employee.epfNumber} · {employee.password}
                    </small>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <p className="login-notice">
            This screen demonstrates the proposed access flow. Production
            authentication, password hashing and authorization will be enforced
            securely on the server.
          </p>
        </div>
      </section>
    </main>
  );
}

function LoginPage({
  onLogin,
}: {
  onLogin: (employee: DemoEmployee) => void;
}) {
  const [activePanel, setActivePanel] = useState<
    "signin" | "signup" | "help" | "about"
  >("signin");
  const [epfNumber, setEpfNumber] = useState("");
  const [password, setPassword] = useState("");
  const [registeredAccounts, setRegisteredAccounts] = useState<DemoEmployee[]>(
    [],
  );
  const [signupEpf, setSignupEpf] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [accountMessage, setAccountMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPasswords, setShowSignupPasswords] = useState(false);
  const [rememberEpf, setRememberEpf] = useState(false);
  const [error, setError] = useState("");
  const [resetEpf, setResetEpf] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const employee = [...demoEmployees, ...registeredAccounts].find(
      (record) =>
        record.epfNumber === epfNumber.trim() && record.password === password,
    );

    if (!employee) {
      setError("The EPF number or password is incorrect. Use a demonstration account below.");
      setIsSubmitting(false);
      return;
    }

    setError("");
    setTimeout(() => onLogin(employee), 550);
  }

  function openSignUp() {
    setActivePanel("signup");
    setSignupError("");
    setAccountMessage("");
  }

  function createAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEpf = signupEpf.trim();
    const meetsPasswordRules =
      signupPassword.length >= 5 &&
      /[a-z]/.test(signupPassword) &&
      /[A-Z]/.test(signupPassword) &&
      /\d/.test(signupPassword);

    if (!/^\d+$/.test(normalizedEpf)) {
      setSignupError("Enter a valid EPF number using numbers only.");
      return;
    }

    if (
      [...demoEmployees, ...registeredAccounts].some(
        (account) => account.epfNumber === normalizedEpf,
      )
    ) {
      setSignupError("An account already exists for this EPF number. Please sign in.");
      return;
    }

    if (!meetsPasswordRules) {
      setSignupError(
        "Password must contain at least 5 characters, including uppercase, lowercase and a number.",
      );
      return;
    }

    if (signupPassword !== confirmPassword) {
      setSignupError("The two passwords do not match. Please re-enter them.");
      return;
    }

    const newAccount: DemoEmployee = {
      epfNumber: normalizedEpf,
      password: signupPassword,
      name: `Employee ${normalizedEpf}`,
      initials: "EP",
      designation: "Registered Employee",
      division: "Registry Division (prototype)",
      homeView: "registry",
      scope: "registry",
    };

    setRegisteredAccounts((current) => [...current, newAccount]);
    setEpfNumber(normalizedEpf);
    setPassword("");
    setSignupEpf("");
    setSignupPassword("");
    setConfirmPassword("");
    setSignupError("");
    setAccountMessage(
      "Account created successfully. Enter your new password to sign in.",
    );
    setActivePanel("signin");
  }

  function useDemoAccount(employee: DemoEmployee) {
    setActivePanel("signin");
    setEpfNumber(employee.epfNumber);
    setPassword(employee.password);
    setError("");
  }

  function requestPasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const employee = demoEmployees.find(
      (record) => record.epfNumber === resetEpf.trim(),
    );

    setResetMessage(
      employee
        ? `A demonstration reset request has been recorded for EPF ${employee.epfNumber}.`
        : "This EPF number is not in the demonstration employee directory.",
    );
  }

  return (
    <main
      className={`login-page login-${isDark ? "dark" : "light"} ${
        sidebarCollapsed ? "login-sidebar-collapsed" : ""
      }`}
    >
      <aside className="login-sidebar">
        <div className="login-sidebar-brand">
          <img
                src={publicAsset("sri-lanka-government-emblem.png")}
            alt="Sri Lanka Government emblem"
          />
          <div className="login-sidebar-title">
            <strong>DCFMS</strong>
            <span>Government service</span>
          </div>
          <button
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="login-collapse"
            onClick={() => setSidebarCollapsed((current) => !current)}
            type="button"
          >
            {sidebarCollapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="login-navigation" aria-label="Login navigation">
          <button
            className={activePanel === "signin" ? "login-nav-active" : ""}
            onClick={() => setActivePanel("signin")}
            type="button"
          >
            <i aria-hidden="true">SI</i>
            <span>Sign in</span>
          </button>
          <button
            className={activePanel === "signup" ? "login-nav-active" : ""}
            onClick={openSignUp}
            type="button"
          >
            <i aria-hidden="true">SU</i>
            <span>Sign up</span>
          </button>
          <button
            className={activePanel === "help" ? "login-nav-active" : ""}
            onClick={() => setActivePanel("help")}
            type="button"
          >
            <i aria-hidden="true">AH</i>
            <span>Access help</span>
          </button>
          <button
            className={activePanel === "about" ? "login-nav-active" : ""}
            onClick={() => setActivePanel("about")}
            type="button"
          >
            <i aria-hidden="true">IN</i>
            <span>System overview</span>
          </button>
        </nav>

        <div className="login-sidebar-authority">
              <img
                src={publicAsset("napvcw-emblem.png")}
                alt="NAPVCW emblem"
              />
          <div>
            <strong>NAPVCW</strong>
            <span>Authorized employee access</span>
          </div>
        </div>
      </aside>

      <section className="login-stage">
        <header className="login-topbar">
          <div className="login-topbar-identity">
              <img
                src={publicAsset("napvcw-emblem.png")}
                alt=""
                aria-hidden="true"
              />
            <div>
              <p>
                National Authority for the Protection of Victims of Crime and Witnesses
              </p>
              <h1>Digital Case Flow Management System</h1>
            </div>
          </div>
          <button
            aria-label={isDark ? "Use light theme" : "Use dark theme"}
            className="login-theme-toggle"
            onClick={() => setIsDark((current) => !current)}
            type="button"
          >
            <span aria-hidden="true">{isDark ? "☀" : "☾"}</span>
            <small>{isDark ? "Light" : "Dark"}</small>
          </button>
        </header>

        <div className="login-stage-content">
          {activePanel === "signin" && (
            <section className="login-card" aria-labelledby="login-title">
              <div className="login-card-seals" aria-hidden="true">
                <span>
                  <img
                    src={publicAsset("sri-lanka-government-emblem.png")}
                    alt=""
                  />
                </span>
                <i />
                <span>
                  <img src={publicAsset("napvcw-emblem.png")} alt="" />
                </span>
              </div>

              <div className="login-form-heading">
                <span className="secure-badge">Authorized personnel only</span>
                <h2 id="login-title">Employee sign in</h2>
                <p>Enter your EPF number and assigned password to continue.</p>
              </div>

              <form className="login-form" onSubmit={submitLogin}>
                <label>
                  <span>Username / EPF number</span>
                  <div className="login-input">
                    <i aria-hidden="true">ID</i>
                    <input
                      autoComplete="username"
                      inputMode="numeric"
                      name="username"
                      onChange={(event) => setEpfNumber(event.target.value)}
                      placeholder="Enter EPF number"
                      required
                      value={epfNumber}
                    />
                  </div>
                </label>

                <label>
                  <span>Password</span>
                  <div className="login-input">
                    <i aria-hidden="true">PW</i>
                    <input
                      autoComplete="current-password"
                      name="password"
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter password"
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                    />
                    <button
                      className="password-toggle"
                      onClick={() => setShowPassword((current) => !current)}
                      type="button"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>

                <div className="login-options">
                  <label className="remember-option">
                    <input
                      checked={rememberEpf}
                      onChange={(event) => setRememberEpf(event.target.checked)}
                      type="checkbox"
                    />
                    <span>Remember EPF number</span>
                  </label>
                  <button
                    className="forgot-button"
                    onClick={() => setActivePanel("help")}
                    type="button"
                  >
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <p className="login-error" role="alert">
                    {error}
                  </p>
                )}

                {accountMessage && (
                  <p className="account-success" role="status">
                    {accountMessage}
                  </p>
                )}

                <button
                  className="login-submit"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Verifying access…" : "Sign in securely"}
                  <span aria-hidden="true">→</span>
                </button>
              </form>

              <div className="account-switch">
                <span>Do not have an account?</span>
                <button onClick={openSignUp} type="button">
                  Create account
                </button>
              </div>

              <details className="demo-accounts">
                <summary>
                  <div>
                    <strong>Demonstration accounts</strong>
                    <span>Select a fictional role for the presentation.</span>
                  </div>
                  <i>Prototype</i>
                </summary>
                <div className="demo-account-grid">
                  {demoEmployees.map((employee) => (
                    <button
                      key={employee.epfNumber}
                      onClick={() => useDemoAccount(employee)}
                      type="button"
                    >
                      <span>{employee.initials}</span>
                      <div>
                        <strong>{employee.designation}</strong>
                        <small>
                          EPF {employee.epfNumber} · {employee.password}
                        </small>
                      </div>
                    </button>
                  ))}
                </div>
              </details>

              <p className="login-notice">
                Prototype authentication only. Production credentials and role
                authorization will be validated securely on the server.
              </p>
            </section>
          )}

          {activePanel === "signup" && (
            <section className="login-card signup-card" aria-labelledby="signup-title">
              <div className="login-card-seals" aria-hidden="true">
                <span>
                  <img
                    src={publicAsset("sri-lanka-government-emblem.png")}
                    alt=""
                  />
                </span>
                <i />
                <span>
                  <img src={publicAsset("napvcw-emblem.png")} alt="" />
                </span>
              </div>

              <div className="login-form-heading">
                <span className="secure-badge">Employee registration</span>
                <h2 id="signup-title">Create your account</h2>
                <p>
                  Register with your EPF number. Your division and permissions
                  will be verified against the employee directory in production.
                </p>
              </div>

              <form className="login-form" onSubmit={createAccount}>
                <label>
                  <span>EPF number</span>
                  <div className="login-input">
                    <i aria-hidden="true">ID</i>
                    <input
                      autoComplete="username"
                      inputMode="numeric"
                      name="signup-epf"
                      onChange={(event) => setSignupEpf(event.target.value)}
                      pattern="[0-9]+"
                      placeholder="Enter EPF number"
                      required
                      value={signupEpf}
                    />
                  </div>
                </label>

                <label>
                  <span>Create password</span>
                  <div className="login-input">
                    <i aria-hidden="true">PW</i>
                    <input
                      autoComplete="new-password"
                      minLength={5}
                      name="signup-password"
                      onChange={(event) => setSignupPassword(event.target.value)}
                      placeholder="Create a strong password"
                      required
                      type={showSignupPasswords ? "text" : "password"}
                      value={signupPassword}
                    />
                    <button
                      className="password-toggle"
                      onClick={() =>
                        setShowSignupPasswords((current) => !current)
                      }
                      type="button"
                    >
                      {showSignupPasswords ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>

                <div className="password-rules" aria-label="Password requirements">
                  <span className={signupPassword.length >= 5 ? "rule-met" : ""}>
                    5+ characters
                  </span>
                  <span className={/[a-z]/.test(signupPassword) ? "rule-met" : ""}>
                    Lowercase
                  </span>
                  <span className={/[A-Z]/.test(signupPassword) ? "rule-met" : ""}>
                    Uppercase
                  </span>
                  <span className={/\d/.test(signupPassword) ? "rule-met" : ""}>
                    Number
                  </span>
                </div>

                <label>
                  <span>Re-enter password</span>
                  <div className="login-input">
                    <i aria-hidden="true">PW</i>
                    <input
                      autoComplete="new-password"
                      minLength={5}
                      name="confirm-password"
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Re-enter your password"
                      required
                      type={showSignupPasswords ? "text" : "password"}
                      value={confirmPassword}
                    />
                  </div>
                </label>

                {signupError && (
                  <p className="login-error" role="alert">
                    {signupError}
                  </p>
                )}

                <button className="login-submit" type="submit">
                  Create account
                  <span aria-hidden="true">→</span>
                </button>
              </form>

              <div className="account-switch">
                <span>Already have an account?</span>
                <button onClick={() => setActivePanel("signin")} type="button">
                  Return to sign in
                </button>
              </div>

              <p className="login-notice">
                Prototype registration only. This account remains available
                until the page is refreshed.
              </p>
            </section>
          )}

          {activePanel === "help" && (
            <section className="login-card login-support-card" aria-labelledby="help-title">
              <span className="support-icon" aria-hidden="true">AH</span>
              <div className="login-form-heading">
                <span className="secure-badge">Account assistance</span>
                <h2 id="help-title">Restore employee access</h2>
                <p>
                  Enter the EPF number linked to your account. A system
                  administrator must approve every production reset.
                </p>
              </div>
              <form className="login-form" onSubmit={requestPasswordReset}>
                <label>
                  <span>Employee EPF number</span>
                  <div className="login-input">
                    <i aria-hidden="true">ID</i>
                    <input
                      inputMode="numeric"
                      onChange={(event) => setResetEpf(event.target.value)}
                      placeholder="Enter EPF number"
                      required
                      value={resetEpf}
                    />
                  </div>
                </label>
                {resetMessage && (
                  <p className="reset-message" role="status">
                    {resetMessage}
                  </p>
                )}
                <button className="login-submit" type="submit">
                  Request reset assistance
                  <span aria-hidden="true">→</span>
                </button>
              </form>
              <button
                className="back-to-login"
                onClick={() => setActivePanel("signin")}
                type="button"
              >
                ← Return to employee sign in
              </button>
            </section>
          )}

          {activePanel === "about" && (
            <section className="login-card login-overview-card" aria-labelledby="about-title">
              <div className="login-form-heading">
                <span className="secure-badge">System overview</span>
                <h2 id="about-title">Access follows responsibility.</h2>
                <p>
                  DCFMS routes each authenticated employee to the information
                  required for their official duties.
                </p>
              </div>
              <div className="access-model-list">
                <article>
                  <span>01</span>
                  <div>
                    <strong>Division employees</strong>
                    <p>View and manage cases assigned to their own division only.</p>
                  </div>
                </article>
                <article>
                  <span>02</span>
                  <div>
                    <strong>Board Secretariat</strong>
                    <p>Register complaints and coordinate authorized case routing.</p>
                  </div>
                </article>
                <article>
                  <span>03</span>
                  <div>
                    <strong>Senior authorities</strong>
                    <p>Review major statistics and authorized cross-division oversight.</p>
                  </div>
                </article>
              </div>
              <button
                className="login-submit"
                onClick={() => setActivePanel("signin")}
                type="button"
              >
                Continue to sign in
                <span aria-hidden="true">→</span>
              </button>
            </section>
          )}
        </div>

        <footer className="login-footer">
          <span>National Authority for the Protection of Victims of Crime and Witnesses</span>
          <span>DCFMS prototype · demonstration information only</span>
        </footer>
      </section>
    </main>
  );
}

function StatusPill({ status }: { status: CaseRecord["status"] }) {
  return (
    <span className={`status status-${status.toLowerCase().replaceAll(" ", "-")}`}>
      {status}
    </span>
  );
}

export default function Home() {
  const [sessionUser, setSessionUser] = useState<DemoEmployee | null>(null);
  const [activeView, setActiveView] = useState<ViewKey>("executive");
  const [query, setQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const availableViews = useMemo(() => {
    if (!sessionUser) {
      return [];
    }

    if (sessionUser.scope === "all") {
      return views;
    }

    return views.filter((view) => view.key === sessionUser.homeView);
  }, [sessionUser]);

  const activeDefinition = views.find((view) => view.key === activeView)!;

  const visibleCases = useMemo(() => {
    const division = viewDivision[activeView];
    return cases.filter((record) => {
      const matchesDivision = division ? record.division === division : true;
      const searchable =
        `${record.id} ${record.subject} ${record.division} ${record.status} ${record.officer}`.toLowerCase();
      return matchesDivision && searchable.includes(query.toLowerCase());
    });
  }, [activeView, query]);

  function login(employee: DemoEmployee) {
    setSessionUser(employee);
    setActiveView(employee.homeView);
    setQuery("");
  }

  function logout() {
    setSessionUser(null);
    setActiveView("executive");
    setQuery("");
    setMobileNavOpen(false);
  }

  function changeView(view: ViewKey) {
    if (!availableViews.some((availableView) => availableView.key === view)) {
      return;
    }

    setActiveView(view);
    setMobileNavOpen(false);
  }

  if (!sessionUser) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            NW
          </div>
          <div>
            <p className="brand-kicker">NAPVCW</p>
            <p className="brand-name">Digital Case Flow</p>
          </div>
        </div>

        <div className="prototype-flag">
          <span className="prototype-dot" />
          Prototype · demonstration data
        </div>

        <nav className="primary-nav" aria-label="Primary navigation">
          <p className="nav-label">
            {sessionUser.scope === "all" ? "Authorized workspaces" : "Assigned workspace"}
          </p>
          {availableViews.map((view) => (
            <button
              className={`nav-item ${activeView === view.key ? "nav-item-active" : ""}`}
              key={view.key}
              onClick={() => changeView(view.key)}
              type="button"
            >
              <span className="nav-icon">{view.short}</span>
              <span>{view.label}</span>
            </button>
          ))}

          {sessionUser.scope === "all" && (
            <>
              <p className="nav-label nav-label-spaced">Management</p>
              <button className="nav-item" type="button">
                <span className="nav-icon">RP</span>
                <span>Cross-division reports</span>
              </button>
              <button className="nav-item" type="button">
                <span className="nav-icon">AD</span>
                <span>Access administration</span>
              </button>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">{sessionUser.initials}</div>
          <div className="sidebar-user">
            <strong>{sessionUser.name}</strong>
            <span>{sessionUser.designation}</span>
          </div>
          <button className="logout-button" onClick={logout} type="button">
            Sign out
          </button>
        </div>
      </aside>

      {mobileNavOpen && (
        <button
          className="nav-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
          type="button"
        />
      )}

      <main className="main">
        <header className="topbar">
          <button
            className="menu-button"
            type="button"
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>

          <label className="search">
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search case ID, division, officer or status"
              aria-label="Search cases"
            />
          </label>

          <div className="topbar-actions">
            <div className="access-badge">
              <span>{sessionUser.scope === "all" ? "Senior authority" : "Restricted access"}</span>
              <strong>{sessionUser.division}</strong>
            </div>
            <div className="data-date">
              <span>Demonstration snapshot</span>
              <strong>28 July 2026</strong>
            </div>
            <button className="notification-button" type="button" aria-label="Notifications">
              <span aria-hidden="true">!</span>
              <i>3</i>
            </button>
          </div>
        </header>

        <div className="page">
          <section className="page-heading">
            <div>
              <p className="eyebrow">{activeDefinition.eyebrow}</p>
              <h1>{activeDefinition.title}</h1>
              <p className="page-description">{activeDefinition.description}</p>
            </div>
            <div className="heading-actions">
              <button className="secondary-button" type="button">
                Export summary
              </button>
              <button className="primary-button" type="button">
                + Register complaint
              </button>
            </div>
          </section>

          <section className="metrics-grid" aria-label="Key performance indicators">
            {metricDefinitions[activeView].map((metric) => (
              <article className={`metric-card metric-${metric.tone}`} key={metric.label}>
                <div className="metric-topline">
                  <span>{metric.label}</span>
                  <i aria-hidden="true" />
                </div>
                <strong>{metric.value}</strong>
                <p>{metric.note}</p>
              </article>
            ))}
          </section>

          <section className="analytics-grid">
            <article className="panel trend-panel">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">Workload trend</p>
                  <h2>Complaints received</h2>
                </div>
                <button className="period-select" type="button">
                  Last 6 months <span>⌄</span>
                </button>
              </div>

              <div className="trend-summary">
                <div>
                  <strong>126</strong>
                  <span>Total complaints</span>
                </div>
                <p>
                  <span>+12.4%</span> compared with the previous period
                </p>
              </div>

              <div className="bar-chart" aria-label="Monthly complaints bar chart">
                {monthlyTrend.map((month) => (
                  <div className="bar-column" key={month.month}>
                    <span className="bar-value">{month.value}</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ height: `${(month.value / 30) * 100}%` }}
                      />
                    </div>
                    <span className="bar-label">{month.month}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel division-panel">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">Current distribution</p>
                  <h2>Cases by division</h2>
                </div>
                <button className="icon-button" type="button" aria-label="More options">
                  ···
                </button>
              </div>

              <div className="division-visual">
                <div className="donut" aria-label="128 active cases">
                  <div>
                    <strong>128</strong>
                    <span>Active</span>
                  </div>
                </div>

                <div className="division-legend">
                  {divisionSummary.map((division) => (
                    <div className="legend-row" key={division.name}>
                      <span
                        className="legend-dot"
                        style={{ background: division.color }}
                      />
                      <span>{division.name}</span>
                      <strong>{division.value}</strong>
                      <small>{division.percent}%</small>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>

          <section className="content-grid">
            <article className="panel cases-panel">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">Management attention</p>
                  <h2>Priority case register</h2>
                </div>
                <button className="text-button" type="button">
                  View all cases →
                </button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Case</th>
                      <th>Division</th>
                      <th>Status</th>
                      <th>Assigned officer</th>
                      <th>Next action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleCases.slice(0, 6).map((record) => (
                      <tr key={record.id}>
                        <td>
                          <div className="case-cell">
                            <span
                              className={`priority-mark priority-${record.priority.toLowerCase()}`}
                            />
                            <div>
                              <strong>{record.id}</strong>
                              <span>{record.subject}</span>
                            </div>
                          </div>
                        </td>
                        <td>{record.division}</td>
                        <td>
                          <StatusPill status={record.status} />
                        </td>
                        <td>{record.officer}</td>
                        <td>
                          <strong className={record.overdue ? "date-overdue" : "date-normal"}>
                            {record.nextAction}
                          </strong>
                          <span className="table-date">{record.due}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {visibleCases.length === 0 && (
                  <div className="empty-state">No demonstration cases match this search.</div>
                )}
              </div>
            </article>

            <article className="panel activity-panel">
              <div className="panel-heading">
                <div>
                  <p className="panel-kicker">Latest updates</p>
                  <h2>Recent activity</h2>
                </div>
                <button className="icon-button" type="button" aria-label="More options">
                  ···
                </button>
              </div>

              <div className="activity-list">
                {recentActivity.map((activity) => (
                  <div className="activity-item" key={`${activity.caseId}-${activity.time}`}>
                    <div className={`activity-icon activity-${activity.tone}`}>
                      {activity.initials}
                    </div>
                    <div>
                      <p>
                        <strong>{activity.action}</strong>
                        <span>{activity.caseId}</span>
                      </p>
                      <small>
                        {activity.user} · {activity.time}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
              <button className="activity-footer" type="button">
                Open complete audit timeline
              </button>
            </article>
          </section>

          <footer className="page-footer">
            <span>DCFMS prototype v0.1 · Day 1 visual foundation</span>
            <span>No real victim, witness or case information is displayed.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
