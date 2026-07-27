"use client";

import { useMemo, useState } from "react";
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

function StatusPill({ status }: { status: CaseRecord["status"] }) {
  return (
    <span className={`status status-${status.toLowerCase().replaceAll(" ", "-")}`}>
      {status}
    </span>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState<ViewKey>("executive");
  const [query, setQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  function changeView(view: ViewKey) {
    setActiveView(view);
    setMobileNavOpen(false);
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
          <p className="nav-label">Workspaces</p>
          {views.map((view) => (
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

          <p className="nav-label nav-label-spaced">System</p>
          <button className="nav-item" type="button">
            <span className="nav-icon">RP</span>
            <span>Reports</span>
          </button>
          <button className="nav-item" type="button">
            <span className="nav-icon">AD</span>
            <span>Administration</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">VS</div>
          <div>
            <strong>V. S. Rathnayake</strong>
            <span>Prototype administrator</span>
          </div>
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
            <div className="data-date">
              <span>Demonstration snapshot</span>
              <strong>27 July 2026</strong>
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
