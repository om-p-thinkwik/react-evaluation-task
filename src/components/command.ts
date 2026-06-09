export type Command = {
  id: string;
  label: string;
  group: "Navigation" | "Create" | "Settings" | "Recent";
  keywords?: string[]; // extra terms to match against
  action: () => void | Promise<void>;
};

export function searchCommands(query: string): Promise<Command[]> {
  const delay = 150 + Math.random() * 600; //150–750ms, varies per call
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = query.trim().toLowerCase();
      const matched = ALL_COMMANDS.filter((c) => {
        const haystack = [c.label, ...(c.keywords ?? [])]
          .join(" ")
          .toLowerCase();
        return q === "" ? true : haystack.includes(q);
      });
      resolve(matched);
    }, delay);
  });
}

const noop = () => {};

export const ALL_COMMANDS: Command[] = [
  {
    id: "nav-dashboard",
    label: "Go to Dashboard",
    group: "Navigation",
    keywords: ["home", "overview"],
    action: noop,
  },
  {
    id: "nav-projects",
    label: "Go to Projects",
    group: "Navigation",
    keywords: ["work"],
    action: noop,
  },
  {
    id: "nav-inbox",
    label: "Go to Inbox",
    group: "Navigation",
    keywords: ["messages", "notifications"],
    action: noop,
  },
  {
    id: "nav-calendar",
    label: "Go to Calendar",
    group: "Navigation",
    keywords: ["schedule", "events"],
    action: noop,
  },
  {
    id: "nav-reports",
    label: "Go to Reports",
    group: "Navigation",
    keywords: ["analytics", "metrics"],
    action: noop,
  },
  {
    id: "create-task",
    label: "Create Task",
    group: "Create",
    keywords: ["new", "todo"],
    action: noop,
  },
  {
    id: "create-project",
    label: "Create Project",
    group: "Create",
    keywords: ["new"],
    action: noop,
  },
  {
    id: "create-doc",
    label: "Create Document",
    group: "Create",
    keywords: ["new", "note", "page"],
    action: noop,
  },
  {
    id: "create-invoice",
    label: "Create Invoice",
    group: "Create",
    keywords: ["new", "billing"],
    action: noop,
  },
  {
    id: "create-contact",
    label: "Add Contact",
    group: "Create",
    keywords: ["new", "person", "customer"],
    action: noop,
  },
  {
    id: "set-profile",
    label: "Edit Profile",
    group: "Settings",
    keywords: ["account", "me"],
    action: noop,
  },
  {
    id: "set-theme",
    label: "Toggle Theme",
    group: "Settings",
    keywords: ["dark", "light", "appearance"],
    action: noop,
  },
  {
    id: "set-members",
    label: "Manage Members",
    group: "Settings",
    keywords: ["team", "users", "permissions"],
    action: noop,
  },
  {
    id: "set-billing",
    label: "Billing Settings",
    group: "Settings",
    keywords: ["subscription", "payment", "plan"],
    action: noop,
  },
  {
    id: "set-integrations",
    label: "Manage Integrations",
    group: "Settings",
    keywords: ["apps", "connectors", "api"],
    action: noop,
  },
  {
    id: "recent-q3-report",
    label: "Q3 Financial Report",
    group: "Recent",
    keywords: ["document"],
    action: noop,
  },
  {
    id: "recent-onboarding",
    label: "Onboarding Checklist",
    group: "Recent",
    keywords: ["task"],
    action: noop,
  },
  {
    id: "recent-roadmap",
    label: "Product Roadmap",
    group: "Recent",
    keywords: ["document", "planning"],
    action: noop,
  },
];
