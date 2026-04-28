// Workspace Settings — tabs: Policies / Members.

const POLICY_CONFIG = {
  "Runtime Integrity Policy": {
    icon: "verified_user",
    description: "Attestation requirements every workflow in this workspace must satisfy before it can execute on confidential compute.",
    fields: [
      { label: "Enforcement", type: "radio", value: "Enforce",
        options: ["Enforce", "Audit only", "Disabled"] },
      { label: "Required attestation source", type: "select", value: "Opaque Confidential Runtime v2",
        options: ["Opaque Confidential Runtime v2", "Opaque Confidential Runtime v1", "AMD SEV-SNP", "Intel TDX"] },
      { label: "Minimum runtime version", type: "text", value: "2.14.0" },
      { label: "Trusted signers", type: "tags", value: ["opaque-prod", "opaque-staging"] },
      { label: "Block on failed attestation", type: "toggle", value: true },
      { label: "Notify security on failure", type: "toggle", value: true },
    ],
  },
  "Network Policy": {
    icon: "lan",
    description: "Egress and ingress rules inherited by every workflow. Overrides are allowed only for allow-listed destinations.",
    fields: [
      { label: "Default egress", type: "radio", value: "Deny",
        options: ["Deny", "Allow-listed only", "Allow all"] },
      { label: "Allowed egress destinations", type: "tags",
        value: ["api.opaque.co", "*.salesforce.com", "internal-s3.opaque.co"] },
      { label: "Allowed ingress", type: "radio", value: "Internal VPC only",
        options: ["Internal VPC only", "Workspace members", "Public"] },
      { label: "Require mTLS for external calls", type: "toggle", value: true },
      { label: "Log all blocked requests", type: "toggle", value: true },
      { label: "Max request size (MB)", type: "text", value: "25" },
    ],
  },
};

const MEMBERS = [
  { name: "Annemarie Selaya",  email: "annemarie@opaque.co",  role: "Owner",        added: "12 Mar 2025", last: "Today" },
  { name: "Evan McMillon",     email: "evan@opaque.co",       role: "Global Admin", added: "18 Mar 2025", last: "Today" },
  { name: "Deborah Mercy",     email: "deborah@opaque.co",    role: "Global Admin", added: "02 Apr 2025", last: "Yesterday" },
  { name: "Janice Johnson",    email: "janice@opaque.co",     role: "Member",       added: "09 Apr 2025", last: "2 days ago" },
  { name: "Priya Manikandan",  email: "priya@opaque.co",      role: "Member",       added: "14 Apr 2025", last: "Today" },
  { name: "Jordan Bellamy",    email: "jordan@opaque.co",     role: "Member",       added: "22 Apr 2025", last: "4 days ago" },
  { name: "Maya Ramirez",      email: "maya@opaque.co",       role: "Member",       added: "03 May 2025", last: "1 week ago" },
  { name: "Noah Westergaard",  email: "noah@opaque.co",       role: "Member",       added: "12 May 2025", last: "Today" },
  { name: "Devon Oduya",       email: "devon@opaque.co",      role: "Member",       added: "28 May 2025", last: "Today" },
  { name: "Kiran Patel",       email: "kiran@opaque.co",      role: "Member",       added: "06 Jun 2025", last: "3 days ago" },
  { name: "Isabel Cortez",     email: "isabel@opaque.co",     role: "Member",       added: "21 Jun 2025", last: "1 week ago" },
  { name: "Ben Tatsumi",       email: "ben@opaque.co",        role: "Member",       added: "14 Jul 2025", last: "Yesterday" },
];

const Toggle = ({ on, onChange }) => (
  <button
    type="button"
    className={`opq-toggle${on ? " on" : ""}`}
    onClick={() => onChange && onChange(!on)}
  >
    <span className="opq-toggle-knob" />
  </button>
);

const PolicyField = ({ field }) => {
  const [val, setVal] = React.useState(field.value);
  if (field.type === "radio") {
    return (
      <div className="pf-control pf-radio-group">
        {field.options.map(o => (
          <button
            key={o}
            type="button"
            className={`pf-radio${val === o ? " active" : ""}`}
            onClick={() => setVal(o)}
          >
            <span className="pf-radio-dot" />
            <span>{o}</span>
          </button>
        ))}
      </div>
    );
  }
  if (field.type === "select") {
    return (
      <button type="button" className="pf-select">
        <span>{val}</span>
        <Icon name="expand_more" size={18} />
      </button>
    );
  }
  if (field.type === "text") {
    return (
      <input
        className="pf-text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
    );
  }
  if (field.type === "tags") {
    return (
      <div className="pf-tags">
        {val.map(t => (
          <span key={t} className="pf-tag">
            <span>{t}</span>
            <button type="button" className="pf-tag-x" aria-label={`Remove ${t}`}>
              <Icon name="close" size={14} />
            </button>
          </span>
        ))}
        <button type="button" className="pf-tag-add">
          <Icon name="add" size={14} />
          <span>Add</span>
        </button>
      </div>
    );
  }
  if (field.type === "toggle") {
    return <Toggle on={val} onChange={setVal} />;
  }
  return null;
};

const PolicyCard = ({ name, config }) => (
  <section className="policy-card">
    <header className="policy-card-head">
      <div className="policy-card-title">
        <Icon name={config.icon} size={20} />
        <h2>{name}</h2>
      </div>
      <Chip variant="success">Enforced</Chip>
    </header>
    <p className="policy-card-desc">{config.description}</p>

    <div className="policy-fields">
      {config.fields.map(f => (
        <div key={f.label} className={`policy-field policy-field--${f.type}`}>
          <label className="pf-label">{f.label}</label>
          <div className="pf-body"><PolicyField field={f} /></div>
        </div>
      ))}
    </div>
  </section>
);

const PoliciesTab = () => (
  <div className="policies-tab">
    <div className="policies-intro">
      <h2>Baseline policies</h2>
      <p>
        These policies are inherited by every workflow in this workspace.
        Individual workflows may request overrides, but cannot weaken enforcement below the baseline.
      </p>
    </div>
    {Object.entries(POLICY_CONFIG).map(([name, config]) => (
      <PolicyCard key={name} name={name} config={config} />
    ))}
  </div>
);

const MembersTab = () => {
  const [query, setQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("All roles");
  const ROLES = ["All roles", "Owner", "Global Admin", "Member"];

  const roleChipVariant = (role) => {
    if (role === "Owner") return "success-out";
    if (role === "Global Admin") return "info";
    return "neutral";
  };

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return MEMBERS.filter(m => {
      if (roleFilter !== "All roles" && m.role !== roleFilter) return false;
      if (!q) return true;
      return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
    });
  }, [query, roleFilter]);

  const initials = (name) =>
    name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="members-tab">
      <div className="filter-bar">
        <label className="search-field">
          <input
            placeholder="Search members..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Icon name="search" size={18} />
        </label>
        <div className="type-filters">
          {ROLES.map(r => (
            <button
              key={r}
              className={`type-filter${roleFilter === r ? " active" : ""}`}
              onClick={() => setRoleFilter(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="spacer" />
        <Button variant="primary" icon={null} size="sm">Invite member</Button>
      </div>

      <div className="table-wrap">
        <table className="opq-table wf-table">
          <thead>
            <tr>
              <th className="sortable">
                <span className="th-inner"><span>Member</span>
                  <span className="sort-ind material-symbols-outlined">arrow_upward</span>
                </span>
              </th>
              <th className="sortable">
                <span className="th-inner"><span>Role</span>
                  <span className="sort-ind material-symbols-outlined">arrow_upward</span>
                </span>
              </th>
              <th className="sortable">
                <span className="th-inner"><span>Added</span>
                  <span className="sort-ind material-symbols-outlined">arrow_upward</span>
                </span>
              </th>
              <th className="sortable last">
                <span className="th-inner"><span>Last active</span>
                  <span className="sort-ind material-symbols-outlined">arrow_upward</span>
                </span>
              </th>
              <th className="actions-col"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.email}>
                <td>
                  <div className="member-cell">
                    <span className="member-avatar">{initials(m.name)}</span>
                    <div>
                      <div className="member-name">{m.name}</div>
                      <div className="member-email">{m.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <Chip variant={roleChipVariant(m.role)}>{m.role}</Chip>
                </td>
                <td className="cell-muted">{m.added}</td>
                <td className="cell-muted">{m.last}</td>
                <td className="actions-col">
                  <button className="icon-btn" title="More">
                    <Icon name="more_vert" size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "48px 12px", color: "var(--opq-ink-400)" }}>
                  No members match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const WorkspaceSettings = () => {
  const [tab, setTab] = React.useState("Policies");
  return (
    <>
      <PageHeader
        title="Workspace Settings"
        subtitle={<span style={{ color: "var(--opq-ink-400)", fontSize: 14 }}>HR Internal</span>}
        tabs={["Policies", "Members"]}
        activeTab={tab}
        onTab={setTab}
      />
      <div className="scroll">
        <div className="page-body">
          {tab === "Policies" ? <PoliciesTab /> : <MembersTab />}
        </div>
      </div>
    </>
  );
};

Object.assign(window, { WorkspaceSettings });
