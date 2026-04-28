// Create Workspace — form surface: Name, Description, Policy baseline (placeholder),
// Resource bindings, Members. Submit routes back to Workspaces list.

const AVAILABLE_RESOURCES = [
  { name: "HR Policies Corpus",      type: "Data Sources" },
  { name: "Claude Sonnet 4.5",       type: "Models" },
  { name: "Salesforce CRM",          type: "Data Sources" },
  { name: "Web Search",              type: "Agent Tools" },
  { name: "Confluence Wiki",         type: "Data Sources" },
  { name: "SQL Query Tool",          type: "Agent Tools" },
  { name: "Claude Haiku 4.5",        type: "Models" },
  { name: "Employee Handbook PDFs",  type: "Data Sources" },
  { name: "Jira Issues",             type: "Data Sources" },
  { name: "Code Interpreter",        type: "Agent Tools" },
  { name: "Claude Opus 4",           type: "Models" },
  { name: "Google Drive",            type: "Data Sources" },
  { name: "Email Sender",            type: "Agent Tools" },
  { name: "Calendar API",            type: "Agent Tools" },
];

const AVAILABLE_MEMBERS = [
  { name: "Annemarie Selaya", email: "annemarie@opaque.co", role: "Owner" },
  { name: "Evan McMillon",    email: "evan@opaque.co",      role: "Global Admin" },
  { name: "Deborah Mercy",    email: "deborah@opaque.co",   role: "Global Admin" },
  { name: "Priya Manikandan", email: "priya@opaque.co",     role: "Member" },
  { name: "Jordan Bellamy",   email: "jordan@opaque.co",    role: "Member" },
  { name: "Maya Ramirez",     email: "maya@opaque.co",      role: "Member" },
  { name: "Noah Westergaard", email: "noah@opaque.co",      role: "Member" },
  { name: "Devon Oduya",      email: "devon@opaque.co",     role: "Member" },
  { name: "Kiran Patel",      email: "kiran@opaque.co",     role: "Member" },
  { name: "Ben Tatsumi",      email: "ben@opaque.co",       role: "Member" },
];

const RESOURCE_TYPE_ICONS = {
  "Data Sources": "database",
  "Agent Tools":  "construction",
  "Models":       "network_intel_node",
};

const cwInitials = (name) => {
  const parts = name.trim().split(/\s+/);
  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const SectionHeader = ({ num, title, description }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
      <span style={{
        width: 24, height: 24, borderRadius: 999,
        background: "var(--opq-ink-800)", color: "var(--opq-ink-200)",
        fontSize: 12, fontWeight: 500,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>{num}</span>
      <h2 style={{ fontSize: 18, fontWeight: 500, color: "white", margin: 0 }}>{title}</h2>
    </div>
    {description && (
      <p style={{ color: "var(--opq-ink-300)", fontSize: 13, lineHeight: 1.55, margin: "4px 0 0 36px", maxWidth: 720 }}>
        {description}
      </p>
    )}
  </div>
);

const CreateWorkspace = () => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [resourceFilter, setResourceFilter] = React.useState("All types");
  const [resourceQuery, setResourceQuery] = React.useState("");
  const [memberQuery, setMemberQuery] = React.useState("");
  const [boundResources, setBoundResources] = React.useState(new Set());
  const [addedMembers, setAddedMembers] = React.useState(new Set(["annemarie@opaque.co"]));
  const [memberRoles, setMemberRoles] = React.useState({ "annemarie@opaque.co": "Owner" });

  const toggleResource = (n) => {
    setBoundResources(prev => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n); else next.add(n);
      return next;
    });
  };
  const toggleMember = (email) => {
    setAddedMembers(prev => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email); else next.add(email);
      return next;
    });
    setMemberRoles(prev => ({ ...prev, [email]: prev[email] || "Member" }));
  };

  const filteredResources = AVAILABLE_RESOURCES.filter(r => {
    if (resourceFilter !== "All types" && r.type !== resourceFilter) return false;
    if (resourceQuery && !r.name.toLowerCase().includes(resourceQuery.toLowerCase())) return false;
    return true;
  });
  const filteredMembers = AVAILABLE_MEMBERS.filter(m => {
    if (!memberQuery) return true;
    const q = memberQuery.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
  });

  const canSubmit = name.trim().length > 0;

  return (
    <>
      <PageHeader
        title="Create workspace"
        subtitle={
          <span>
            <a className="link" href="Workspaces.html" style={{ color: "var(--opq-emerald-400)", textDecoration: "none" }}>Workspaces</a>
            <span style={{ color: "var(--opq-ink-400)" }}> / </span>
            <span style={{ color: "var(--opq-ink-300)" }}>New</span>
          </span>
        }
        actions={
          <>
            <a href="Workspaces.html" style={{ textDecoration: "none" }}>
              <Button variant="secondary">Cancel</Button>
            </a>
            <Button variant="primary" onClick={() => { if (canSubmit) window.location.href = "Workspaces.html"; }}>
              Create workspace
            </Button>
          </>
        }
      />
      <div className="scroll">
        <div className="page-body" style={{ maxWidth: 900 }}>

          {/* 1. Name + Description */}
          <section className="policy-card">
            <SectionHeader num="1" title="Details" description="Human-readable identifiers that appear across the workspace list, trust artifacts, and the studio header." />
            <div className="policy-fields" style={{ marginLeft: 36 }}>
              <div className="policy-field" style={{ gridTemplateColumns: "220px 1fr" }}>
                <div className="pf-label">Name <span style={{ color: "var(--opq-error-500)" }}>*</span></div>
                <div className="pf-body">
                  <input
                    className="pf-text"
                    style={{ width: 420 }}
                    placeholder="e.g. HR Internal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="policy-field" style={{ gridTemplateColumns: "220px 1fr", alignItems: "start" }}>
                <div className="pf-label">Description</div>
                <div className="pf-body">
                  <textarea
                    className="pf-text"
                    style={{ width: 420, height: 80, padding: "10px 12px", resize: "vertical", lineHeight: "20px" }}
                    placeholder="What this workspace is for, and who should operate in it."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 2. Policy baseline (placeholder) */}
          <section className="policy-card">
            <SectionHeader num="2" title="Policy baseline" description="Workflows created in this workspace inherit this baseline. The enforcement ceiling model ships in 3.0 GA — for now, the workspace will use org-level defaults." />
            <div style={{
              marginLeft: 36,
              border: "1px dashed var(--opq-ink-700)", borderRadius: 6,
              padding: "20px 24px", color: "var(--opq-ink-300)", fontSize: 13, lineHeight: 1.55,
              background: "transparent",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <Icon name="hourglass_top" size={22} style={{ color: "var(--opq-ink-400)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: "white", fontSize: 14, marginBottom: 4 }}>Inherits org defaults</div>
                <div>Full policy baseline configuration will be available at 3.0 GA. You'll be able to review and override inherited policies from Workspace Settings once the workspace exists.</div>
              </div>
              <Button variant="secondary" size="sm">Preview defaults</Button>
            </div>
          </section>

          {/* 3. Resource bindings */}
          <section className="policy-card">
            <SectionHeader
              num="3"
              title="Resource bindings"
              description="Choose which org-registered resources to enable in this workspace. Only bound resources appear in the Studio node menu when builders compose workflows here."
            />
            <div style={{ marginLeft: 36 }}>
              <div className="filter-bar" style={{ marginBottom: 12 }}>
                <label className="search-field" style={{ width: 260 }}>
                  <input
                    placeholder="Search resources"
                    value={resourceQuery}
                    onChange={(e) => setResourceQuery(e.target.value)}
                  />
                  <Icon name="search" size={18} />
                </label>
                <div className="type-filters">
                  {["All types", "Data Sources", "Agent Tools", "Models"].map(t => (
                    <button
                      key={t}
                      className={`type-filter${resourceFilter === t ? " active" : ""}`}
                      onClick={() => setResourceFilter(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="spacer" />
                <span className="meta-right">{boundResources.size} bound</span>
              </div>
              <div style={{ border: "1px solid var(--opq-ink-800)", borderRadius: 6, maxHeight: 320, overflow: "auto" }}>
                {filteredResources.map((r, i) => {
                  const bound = boundResources.has(r.name);
                  return (
                    <label
                      key={r.name}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 16px",
                        borderTop: i === 0 ? "none" : "1px solid var(--opq-ink-800)",
                        cursor: "pointer",
                        background: bound ? "var(--opq-ink-850)" : "transparent",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={bound}
                        onChange={() => toggleResource(r.name)}
                        style={{ width: 16, height: 16, accentColor: "var(--opq-emerald-500)", margin: 0 }}
                      />
                      <Icon name={RESOURCE_TYPE_ICONS[r.type]} size={18} style={{ color: "var(--opq-ink-300)" }} />
                      <span style={{ color: "white", fontSize: 14, flex: 1 }}>{r.name}</span>
                      <span style={{ color: "var(--opq-ink-300)", fontSize: 12 }}>{r.type}</span>
                    </label>
                  );
                })}
                {filteredResources.length === 0 && (
                  <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--opq-ink-400)", fontSize: 13 }}>
                    No resources match your filters.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 4. Members */}
          <section className="policy-card">
            <SectionHeader
              num="4"
              title="Members"
              description="People who can operate inside this workspace. You'll be added as Owner automatically. Member roles can be adjusted here or later from Workspace Settings."
            />
            <div style={{ marginLeft: 36 }}>
              <div className="filter-bar" style={{ marginBottom: 12 }}>
                <label className="search-field" style={{ width: 260 }}>
                  <input
                    placeholder="Search by name or email"
                    value={memberQuery}
                    onChange={(e) => setMemberQuery(e.target.value)}
                  />
                  <Icon name="search" size={18} />
                </label>
                <div className="spacer" />
                <span className="meta-right">{addedMembers.size} added</span>
              </div>
              <div style={{ border: "1px solid var(--opq-ink-800)", borderRadius: 6, maxHeight: 320, overflow: "auto" }}>
                {filteredMembers.map((m, i) => {
                  const added = addedMembers.has(m.email);
                  const isYou = m.email === "annemarie@opaque.co";
                  return (
                    <div
                      key={m.email}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 16px",
                        borderTop: i === 0 ? "none" : "1px solid var(--opq-ink-800)",
                        background: added ? "var(--opq-ink-850)" : "transparent",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={added}
                        disabled={isYou}
                        onChange={() => toggleMember(m.email)}
                        style={{ width: 16, height: 16, accentColor: "var(--opq-emerald-500)", margin: 0 }}
                      />
                      <span className="member-avatar">{cwInitials(m.name)}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="member-name">
                          {m.name}
                          {isYou && <span style={{ color: "var(--opq-ink-400)", fontSize: 12, marginLeft: 8 }}>(you)</span>}
                        </div>
                        <div className="member-email">{m.email}</div>
                      </div>
                      <select
                        className="pf-select"
                        disabled={!added || isYou}
                        value={memberRoles[m.email] || "Member"}
                        onChange={(e) => setMemberRoles(prev => ({ ...prev, [m.email]: e.target.value }))}
                        style={{
                          minWidth: 160, height: 32, fontSize: 13,
                          padding: "0 10px",
                          opacity: added ? 1 : 0.5,
                          appearance: "none",
                        }}
                      >
                        <option>Owner</option>
                        <option>Global Admin</option>
                        <option>Member</option>
                      </select>
                    </div>
                  );
                })}
                {filteredMembers.length === 0 && (
                  <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--opq-ink-400)", fontSize: 13 }}>
                    No people match your search.
                  </div>
                )}
              </div>
            </div>
          </section>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 8 }}>
            <a href="Workspaces.html" style={{ textDecoration: "none" }}>
              <Button variant="secondary">Cancel</Button>
            </a>
            <Button variant="primary" onClick={() => { if (canSubmit) window.location.href = "Workspaces.html"; }}>
              Create workspace
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { CreateWorkspace });
