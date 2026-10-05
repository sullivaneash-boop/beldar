export const printSheets = [
  { id: "shopping", title: "Shopping list", desc: "Items still to buy for your tier, with specs and estimates." },
  { id: "materials", title: "Full material list", desc: "Every material and tool by category, with status." },
  { id: "measurements", title: "Measurement worksheet", desc: "Blank fields + your Cone Lab numbers." },
  { id: "checklist", title: "Build checklist", desc: "All tasks by phase with tick boxes." },
  { id: "makeup", title: "Makeup application sequence", desc: "PAX → powder → RMGP, station by station." },
  { id: "halloween", title: "Halloween checklist", desc: "Timed preflight list with helper names." },
  { id: "repair-card", title: "Emergency repair card", desc: "Wallet-size seam fix + safe removal." },
] as const;

export type PrintSheetId = (typeof printSheets)[number]["id"];
