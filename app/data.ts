export type CaseRecord = {
  id: string;
  subject: string;
  division: "Legal" | "Protection" | "Assistance" | "Board Secretariat";
  status:
    | "Awaiting response"
    | "Under review"
    | "Urgent action"
    | "Board pending"
    | "In progress"
    | "Referral pending";
  officer: string;
  nextAction: string;
  due: string;
  overdue: boolean;
  priority: "High" | "Medium" | "Normal";
};

export const cases: CaseRecord[] = [
  {
    id: "DCFMS-2026-0027",
    subject: "Protected Person A",
    division: "Protection",
    status: "Urgent action",
    officer: "P. Officer 02",
    nextAction: "Interim notice",
    due: "Today, 2:00 PM",
    overdue: true,
    priority: "High",
  },
  {
    id: "DCFMS-2026-0024",
    subject: "Anonymous Complainant C",
    division: "Legal",
    status: "Awaiting response",
    officer: "IO 03 / LO 01",
    nextAction: "Reminder 1",
    due: "28 Jul 2026",
    overdue: false,
    priority: "Medium",
  },
  {
    id: "DCFMS-2026-0021",
    subject: "Protected Witness B",
    division: "Legal",
    status: "Board pending",
    officer: "LO 02",
    nextAction: "Board paper review",
    due: "29 Jul 2026",
    overdue: false,
    priority: "High",
  },
  {
    id: "DCFMS-2026-0018",
    subject: "Assistance Applicant D",
    division: "Assistance",
    status: "Referral pending",
    officer: "A. Officer 01",
    nextAction: "Provider response",
    due: "30 Jul 2026",
    overdue: false,
    priority: "Normal",
  },
  {
    id: "DCFMS-2026-0014",
    subject: "Protected Person E",
    division: "Protection",
    status: "Under review",
    officer: "P. Officer 01",
    nextAction: "Review assessment",
    due: "31 Jul 2026",
    overdue: false,
    priority: "Medium",
  },
  {
    id: "DCFMS-2026-0011",
    subject: "Anonymous Complainant F",
    division: "Board Secretariat",
    status: "In progress",
    officer: "Board Secretary",
    nextAction: "DG instruction",
    due: "01 Aug 2026",
    overdue: false,
    priority: "Normal",
  },
  {
    id: "DCFMS-2026-0009",
    subject: "Protected Witness G",
    division: "Legal",
    status: "Under review",
    officer: "AD Legal",
    nextAction: "Legal review",
    due: "02 Aug 2026",
    overdue: false,
    priority: "Medium",
  },
  {
    id: "DCFMS-2026-0006",
    subject: "Assistance Applicant H",
    division: "Assistance",
    status: "In progress",
    officer: "A. Officer 02",
    nextAction: "X2 status update",
    due: "04 Aug 2026",
    overdue: false,
    priority: "Normal",
  },
];

export const monthlyTrend = [
  { month: "Feb", value: 14 },
  { month: "Mar", value: 18 },
  { month: "Apr", value: 16 },
  { month: "May", value: 22 },
  { month: "Jun", value: 26 },
  { month: "Jul", value: 30 },
];

export const divisionSummary = [
  { name: "Legal", value: 52, percent: 41, color: "#1d4ed8" },
  { name: "Protection", value: 34, percent: 27, color: "#0f766e" },
  { name: "Assistance", value: 29, percent: 23, color: "#d97706" },
  { name: "Board Secretariat", value: 13, percent: 9, color: "#94a3b8" },
];

export const recentActivity = [
  {
    initials: "BS",
    action: "Case routed to Protection",
    caseId: "DCFMS-2026-0027",
    user: "Board Secretary",
    time: "12 minutes ago",
    tone: "blue",
  },
  {
    initials: "IO",
    action: "Observation reminder recorded",
    caseId: "DCFMS-2026-0024",
    user: "Investigation Officer 03",
    time: "48 minutes ago",
    tone: "amber",
  },
  {
    initials: "DP",
    action: "Threat assessment requested",
    caseId: "DCFMS-2026-0014",
    user: "Director - Protection",
    time: "1 hour ago",
    tone: "green",
  },
  {
    initials: "LO",
    action: "Board paper submitted for review",
    caseId: "DCFMS-2026-0021",
    user: "Legal Officer 02",
    time: "2 hours ago",
    tone: "violet",
  },
];
