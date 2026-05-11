// Bind Resource → Workspaces modal.
// Inverse of the per-workspace resource picker in CreateWorkspace: pick one
// resource, choose 1+ workspaces to make it available in. Used from:
//   - the "Bind" link in the Unbound cell on the Resources table
//   - the row-action menu's "Manage bindings"
//   - the success step of Register Resource (passes the freshly registered name)

const BR_WORKSPACES = [
  { name: "HR Internal",        members: 8,  policy: "Standard",  description: "People ops, hiring, employee programs." },
  { name: "Finance Department", members: 12, policy: "Strict",    description: "FP&A, vendor contracts, ledger queries." },
  { name: "Sales & Marketing",  members: 16, policy: "Standard",  description: "Pipeline, campaigns, prospect research." },
  { name: "Engineering",        members: 24, policy: "Standard",  description: "Eng docs, deployment, code search." },
  { name: "Customer Support",   members: 9,  policy: "Standard",  description: "Ticket triage, knowledge-base lookup." },
  { name: "Legal & Compliance", members: 5,  policy: "Strict",    description: "Contract review, regulatory queries." },
  { name: "Product",            members: 11, policy: "Standard",  description: "Roadmap, feedback synthesis, PRDs." },
  { name: "Research",           members: 6,  policy: "Permissive", description: "Sandbox for experimental workflows." },
];

const BR_POLICY_TONE = {
  "Strict":     "warn",
  "Standard":   "info",
  "Permissive": "neutral",
};

// Per-resource defaults, so the modal pre-checks anywhere it's already bound.
const BR_INITIAL_BOUND = {
  "HR Policies Corpus":    ["HR Internal"],
  "Claude Sonnet 4.5":     ["HR Internal", "Finance Department", "Sales & Marketing"],
  "Salesforce CRM":        ["Sales & Marketing"],
  "Web Search":            ["HR Internal", "Sales & Marketing"],
  "Confluence Wiki":       ["HR Internal"],
  "SQL Query Tool":        ["Finance Department"],
  "Claude Haiku 4.5":      ["HR Internal", "Finance Department"],
  "Employee Handbook PDFs":["HR Internal"],
  "Jira Issues":           [],
  "Code Interpreter":      ["Finance Department"],
  "Zendesk Tickets":       ["Sales & Marketing"],
  "Google Drive":          ["HR Internal", "Sales & Marketing"],
  "Claude Opus 4":         [],
  "Slack Export":          ["HR Internal"],
  "Email Sender":          ["Sales & Marketing"],
  "Vendor Contracts":      ["Finance Department"],
  "Calendar API":          ["HR Internal"],
  "Finance Ledger":        ["Finance Department"],
  "GPT-4o (fallback)":     [],
  "GitHub Issues":         [],
};

const BR_TYPE_ICON = {
  "Data Sources": "database",
  "Agent Tools":  "construction",
  "Models":       "network_intel_node",
};

const BindResourceModal = ({ open, resource, onClose, onConfirm }) => {
  // resource: { name, type } — required when open
  const initial = (resource && BR_INITIAL_BOUND[resource.name]) || [];
  const [picked, setPicked] = React.useState(new Set(initial));
  const [query, setQuery] = React.useState("");
  const [confirmStep, setConfirmStep] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setPicked(new Set(initial));
    setQuery("");
    setConfirmStep(false);
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, resource && resource.name]);

  if (!open || !resource) return null;

  const initialSet = new Set(initial);
  const toggle = (n) => {
    setPicked(prev => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n); else next.add(n);
      return next;
    });
  };

  const filteredWs = BR_WORKSPACES.filter(w => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return w.name.toLowerCase().includes(q) || w.description.toLowerCase().includes(q);
  });

  // diff between current picked and initially-bound
  const added = [...picked].filter(n => !initialSet.has(n));
  const removed = [...initialSet].filter(n => !picked.has(n));
  const dirty = added.length > 0 || removed.length > 0;

  const onCommit = () => {
    onConfirm && onConfirm({
      resource: resource.name,
      bound: [...picked],
      added,
      removed,
    });
    onClose();
  };

  const onPrimary = () => {
    if (removed.length > 0 && !confirmStep) {
      setConfirmStep(true);
      return;
    }
    onCommit();
  };

  const primaryLabel = confirmStep
    ? `Yes, unbind ${removed.length}`
    : (dirty ? "Save bindings" : "Save bindings");

  return (
    <div className="rr-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rr-modal br-modal" role="dialog" aria-modal="true">
        <div className="rr-modal-head">
          <div className="rr-modal-title-row">
            <div>
              <div className="br-eyebrow">
                <Icon name={BR_TYPE_ICON[resource.type] || "category"} size={14} />
                <span>{resource.type}</span>
              </div>
              <h2 className="rr-modal-title">Bind <span className="br-resource-name">{resource.name}</span> to workspaces</h2>
            </div>
            <button className="rr-close" onClick={onClose} aria-label="Close">
              <Icon name="close" size={20} />
            </button>
          </div>
          {!confirmStep && (
            <p className="rr-helper br-helper">
              Bound workspaces can use this resource in workflows. Unbinding does not delete it
              from the org-level pool. Workflows that reference an unbound resource will fail
              their next run until rebound.
            </p>
          )}
        </div>

        <div className="rr-modal-body">
          {!confirmStep && (
            <>
              <div className="br-toolbar">
                <label className="search-field" style={{ flex: 1 }}>
                  <input
                    placeholder="Search workspaces"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <Icon name="search" size={18} />
                </label>
                <div className="br-counter">
                  <strong>{picked.size}</strong> of {BR_WORKSPACES.length} selected
                </div>
              </div>

              <div className="br-bulk">
                <button className="br-bulk-link" onClick={() => setPicked(new Set(BR_WORKSPACES.map(w => w.name)))}>
                  Select all
                </button>
                <span className="br-bulk-sep">·</span>
                <button className="br-bulk-link" onClick={() => setPicked(new Set())}>
                  Clear
                </button>
              </div>

              <ul className="br-ws-list">
                {filteredWs.map(w => {
                  const checked = picked.has(w.name);
                  const wasBound = initialSet.has(w.name);
                  let badge = null;
                  if (checked && !wasBound) badge = <span className="br-badge add">Add</span>;
                  else if (!checked && wasBound) badge = <span className="br-badge remove">Remove</span>;
                  else if (checked && wasBound) badge = <span className="br-badge bound">Bound</span>;
                  return (
                    <li key={w.name}>
                      <label className={`br-ws-row${checked ? " selected" : ""}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(w.name)}
                        />
                        <span className="br-check" aria-hidden="true">
                          {checked && <Icon name="check" size={14} />}
                        </span>
                        <div className="br-ws-info">
                          <div className="br-ws-name-row">
                            <span className="br-ws-name">{w.name}</span>
                            <span className={`chip-sm chip-${BR_POLICY_TONE[w.policy]}-out`}>{w.policy}</span>
                            {badge}
                          </div>
                          <div className="br-ws-desc">
                            {w.description} <span className="br-ws-meta">· {w.members} members</span>
                          </div>
                        </div>
                      </label>
                    </li>
                  );
                })}
                {filteredWs.length === 0 && (
                  <li className="rr-empty">No workspaces match "{query}".</li>
                )}
              </ul>

              {dirty && (
                <div className="br-diff">
                  {added.length > 0 && (
                    <div className="br-diff-line">
                      <span className="br-diff-tag add">+{added.length}</span>
                      <span>Will be added to: {added.join(", ")}</span>
                    </div>
                  )}
                  {removed.length > 0 && (
                    <div className="br-diff-line">
                      <span className="br-diff-tag remove">−{removed.length}</span>
                      <span>Will be removed from: {removed.join(", ")}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {confirmStep && (
            <div className="br-confirm">
              <div className="br-confirm-icon"><Icon name="warning" size={28} /></div>
              <div className="br-confirm-title">
                Unbind from {removed.length} workspace{removed.length === 1 ? "" : "s"}?
              </div>
              <p className="br-confirm-body">
                <strong>{resource.name}</strong> will be removed from{" "}
                {removed.map((n, i) => (
                  <React.Fragment key={n}>
                    {i > 0 && (i === removed.length - 1 ? " and " : ", ")}
                    <strong>{n}</strong>
                  </React.Fragment>
                ))}.
              </p>
              <p className="br-confirm-body">
                Any workflow in those workspaces that references this resource will fail
                its next run until you rebind it. The resource itself stays registered at
                the org level.
              </p>
            </div>
          )}
        </div>

        <div className="rr-modal-foot">
          <Button
            variant="secondary"
            size="sm"
            onClick={confirmStep ? () => setConfirmStep(false) : onClose}
          >
            {confirmStep ? "Back" : "Cancel"}
          </Button>
          <div className="rr-foot-spacer" />
          {!confirmStep && dirty && (
            <span className="br-dirty-hint">
              {added.length + removed.length} change{added.length + removed.length === 1 ? "" : "s"}
            </span>
          )}
          <button
            className={`btn ${confirmStep && removed.length > 0 ? "btn-destructive" : "btn-primary"} btn-sm${dirty ? "" : " is-disabled"}`}
            onClick={dirty ? onPrimary : undefined}
            disabled={!dirty}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { BindResourceModal });
