// Workspaces — org-level list view. Columns: Name, Created on, Created by, Members.

const WORKSPACES_DATA = [
  { name: "Finance Department",  createdOn: "Jan 14, 2026", createdBy: "Annemarie Selaya",  members: 12 },
  { name: "HR Internal",         createdOn: "Feb 03, 2026", createdBy: "Annemarie Selaya",  members: 8  },
  { name: "Sales & Marketing",   createdOn: "Feb 18, 2026", createdBy: "Priya Ravindran",   members: 24 },
  { name: "Data Science Core",   createdOn: "Mar 02, 2026", createdBy: "Marcus Chen",       members: 17 },
  { name: "Clinical Research",   createdOn: "Mar 11, 2026", createdBy: "Dr. Ana Okafor",    members: 6  },
  { name: "Legal & Compliance",  createdOn: "Mar 24, 2026", createdBy: "Annemarie Selaya",  members: 9  },
  { name: "Customer Insights",   createdOn: "Apr 02, 2026", createdBy: "Priya Ravindran",   members: 14 },
  { name: "Engineering Platform",createdOn: "Apr 09, 2026", createdBy: "Marcus Chen",       members: 31 },
  { name: "Procurement",         createdOn: "Apr 17, 2026", createdBy: "Annemarie Selaya",  members: 5  },
];

function initialsOf(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const WorkspacesList = () => {
  const [q, setQ] = React.useState("");
  const [sortKey, setSortKey] = React.useState("createdOn");
  const [sortDir, setSortDir] = React.useState("desc");

  const toggleSort = (k) => {
    if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  };

  const sorted = [...WORKSPACES_DATA]
    .filter(w => w.name.toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortKey === "createdOn") { av = new Date(av); bv = new Date(bv); }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const sortInd = (k) => {
    if (sortKey !== k) return null;
    return <Icon name={sortDir === "asc" ? "arrow_upward" : "arrow_downward"} size={16} style={{ color: "white" }} />;
  };

  return (
    <>
      <PageHeader
        title="Workspaces"
        subtitle="Governance domains across your org"
        actions={
          <Button variant="primary" icon="add" onClick={() => { window.location.href = "CreateWorkspace.html"; }}>Create workspace</Button>
        }
      />
      <div className="scroll">
        <div className="page-body">
          <div className="filter-bar">
            <label className="search-field">
              <input
                placeholder="Search workspaces"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Icon name="search" size={18} />
            </label>
            <div className="spacer" />
            <span className="meta-right">{sorted.length} workspace{sorted.length === 1 ? "" : "s"}</span>
          </div>

          <div className="table-wrap">
            <table className="wf-table">
              <colgroup>
                <col style={{ width: "42%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "24%" }} />
                <col style={{ width: "14%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="sortable" onClick={() => toggleSort("name")}>
                    <span className="th-inner">Name {sortInd("name")}</span>
                  </th>
                  <th className="sortable" onClick={() => toggleSort("createdOn")}>
                    <span className="th-inner">Created on {sortInd("createdOn")}</span>
                  </th>
                  <th className="sortable" onClick={() => toggleSort("createdBy")}>
                    <span className="th-inner">Created by {sortInd("createdBy")}</span>
                  </th>
                  <th className="sortable" onClick={() => toggleSort("members")}>
                    <span className="th-inner">Members {sortInd("members")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(w => (
                  <tr key={w.name}>
                    <td>
                      <div className="member-cell">
                        <span className="ws-initials" style={{ width: 28, height: 28, flex: "0 0 28px", fontSize: 12, borderRadius: 4 }}>
                          {initialsOf(w.name)}
                        </span>
                        <a className="link" href="Workflows.html">{w.name}</a>
                      </div>
                    </td>
                    <td className="cell-muted">{w.createdOn}</td>
                    <td>{w.createdBy}</td>
                    <td className="cell-muted" style={{ fontVariantNumeric: "tabular-nums" }}>{w.members}</td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr><td colSpan={4} style={{ color: "var(--opq-ink-400)", textAlign: "center", padding: "32px 0" }}>
                    No workspaces match "{q}"
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { WorkspacesList });
