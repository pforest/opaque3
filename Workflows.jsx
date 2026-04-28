// Workflows list — matches the attached design. 30 rows / pagination (10 per page).

const WORKFLOWS = [
  { name: "Employee HR Assist",     createdBy: "Annemarie Selaya",  status: "Running", updated: "14 Apr 2026" },
  { name: "Employee HR Assist V2",   createdBy: "Evan McMillon",     status: "Needs attention", updated: "12 Feb 2026" },
  { name: "Financial RAG",           createdBy: "Deborah Mercy",     status: "Running", updated: "24 Jan 2026" },
  { name: "HR RAG v1",               createdBy: "Janice Johnson",    status: "Running", updated: "24 Jan 2026" },
  { name: "Legal Doc Review",        createdBy: "Priya Manikandan",  status: "Running", updated: "22 Jan 2026" },
  { name: "Marketing Copilot",       createdBy: "Jordan Bellamy",    status: "Draft",   updated: "18 Jan 2026" },
  { name: "Sales Intel",             createdBy: "Maya Ramirez",      status: "Running", updated: "15 Jan 2026" },
  { name: "Contract Summarizer",     createdBy: "Priya Manikandan",  status: "Needs attention", updated: "12 Jan 2026" },
  { name: "Support Triage Agent",    createdBy: "Noah Westergaard",  status: "Draft",   updated: "09 Jan 2026" },
  { name: "Recruiter Screener",      createdBy: "Annemarie Selaya",  status: "Running", updated: "07 Jan 2026" },
  { name: "Procurement Advisor",     createdBy: "Devon Oduya",       status: "Draft",   updated: "04 Jan 2026" },
  { name: "Benefits Q&A",            createdBy: "Annemarie Selaya",  status: "Running", updated: "29 Dec 2025" },
  { name: "Policy Change Auditor",   createdBy: "Priya Manikandan",  status: "Needs attention", updated: "22 Dec 2025" },
  { name: "Onboarding Guide",        createdBy: "Jordan Bellamy",    status: "Draft",   updated: "18 Dec 2025" },
  { name: "Expense Classifier",      createdBy: "Maya Ramirez",      status: "Running", updated: "14 Dec 2025" },
  { name: "Vendor Risk Review",      createdBy: "Noah Westergaard",  status: "Needs attention", updated: "09 Dec 2025" },
  { name: "Incident Retro Drafter",  createdBy: "Devon Oduya",       status: "Draft",   updated: "05 Dec 2025" },
  { name: "Internal Search",         createdBy: "Annemarie Selaya",  status: "Running", updated: "02 Dec 2025" },
  { name: "Release Notes Writer",    createdBy: "Jordan Bellamy",    status: "Draft",   updated: "27 Nov 2025" },
  { name: "Meeting Minutes",         createdBy: "Maya Ramirez",      status: "Running", updated: "22 Nov 2025" },
  { name: "Data Room Assistant",     createdBy: "Priya Manikandan",  status: "Running", updated: "18 Nov 2025" },
  { name: "Compensation Modeler",    createdBy: "Devon Oduya",       status: "Draft",   updated: "14 Nov 2025" },
  { name: "Security Review Bot",     createdBy: "Noah Westergaard",  status: "Needs attention", updated: "09 Nov 2025" },
  { name: "KB Curator",              createdBy: "Annemarie Selaya",  status: "Draft",   updated: "04 Nov 2025" },
  { name: "Product Feedback Miner",  createdBy: "Jordan Bellamy",    status: "Running", updated: "30 Oct 2025" },
  { name: "Earnings Narrative",      createdBy: "Deborah Mercy",     status: "Running", updated: "26 Oct 2025" },
  { name: "Audit Log Explainer",     createdBy: "Evan McMillon",     status: "Draft",   updated: "22 Oct 2025" },
  { name: "Board Deck Drafter",      createdBy: "Janice Johnson",    status: "Running", updated: "17 Oct 2025" },
  { name: "Support KB Sync",         createdBy: "Maya Ramirez",      status: "Draft",   updated: "12 Oct 2025" },
  { name: "Deal Desk Assistant",     createdBy: "Devon Oduya",       status: "Running", updated: "07 Oct 2025" },
];

const ROWS_PER_PAGE = 10;

const STATUS_COLORS = {
  "Running":         "var(--opq-emerald-400)",
  "Draft":           "var(--opq-ink-400)",
  "Needs attention": "var(--opq-signal-red)",
};

const StatusCell = ({ status }) => (
  <span className="status-cell">
    <span
      className="status-dot"
      style={{ background: STATUS_COLORS[status] || "var(--opq-ink-400)" }}
    />
    <span>{status}</span>
  </span>
);

const SortHeader = ({ label, field, sort, onSort, last }) => {
  const active = sort.field === field;
  const dirIcon = active && sort.dir === "desc" ? "arrow_downward" : "arrow_upward";
  return (
    <th
      className={`sortable${last ? " last" : ""}`}
      onClick={() => onSort(field)}
    >
      <span className="th-inner">
        <span>{label}</span>
        <span className={`sort-ind material-symbols-outlined${active ? " active" : ""}`}>{dirIcon}</span>
      </span>
    </th>
  );
};

const Pagination = ({ page, pageCount, total, rangeFrom, rangeTo, onChange }) => (
  <div className="pagination">
    <div className="pg-right">
      <span className="pg-label">Rows per page:</span>
      <button className="rows-select" type="button">
        <span>10</span>
        <Icon name="arrow_drop_down" size={18} />
      </button>
      <span className="pg-range">{rangeFrom}-{rangeTo} of {total}</span>
      <div className="pg-arrows">
        <button className="page-btn" disabled={page === 1} onClick={() => onChange(page - 1)} title="Previous">
          <Icon name="chevron_left" size={18} />
        </button>
        <button className="page-btn" disabled={page === pageCount} onClick={() => onChange(page + 1)} title="Next">
          <Icon name="chevron_right" size={18} />
        </button>
      </div>
    </div>
  </div>
);

const WorkflowsList = () => {
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState({ field: null, dir: "asc" });
  const [query, setQuery] = React.useState("");

  const onSort = (field) => {
    setSort((s) =>
      s.field === field
        ? { field, dir: s.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" }
    );
    setPage(1);
  };

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = WORKFLOWS.filter(w => {
      if (!q) return true;
      return (
        w.name.toLowerCase().includes(q) ||
        w.createdBy.toLowerCase().includes(q) ||
        w.status.toLowerCase().includes(q)
      );
    });
    if (sort.field) {
      const dir = sort.dir === "asc" ? 1 : -1;
      list = [...list].sort((a, b) => {
        const av = a[sort.field] || "";
        const bv = b[sort.field] || "";
        return av < bv ? -1 * dir : av > bv ? 1 * dir : 0;
      });
    }
    return list;
  }, [query, sort]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / ROWS_PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const startIdx = (safePage - 1) * ROWS_PER_PAGE;
  const rows = filtered.slice(startIdx, startIdx + ROWS_PER_PAGE);
  const rangeFrom = total === 0 ? 0 : startIdx + 1;
  const rangeTo = Math.min(startIdx + ROWS_PER_PAGE, total);

  return (
    <>
      <div className="page-header">
        <div className="title-row">
          <h1>Workflows</h1>
        </div>
      </div>
      <div className="scroll">
        <div className="page-body">
          <div className="metric-row">
            <div className="card metric-tile">
              <div className="val">12</div>
              <div className="lbl">
                <span className="status-dot" style={{ background: "var(--opq-emerald-400)" }} />
                <span>Running</span>
              </div>
            </div>
            <div className="card metric-tile">
              <div className="val">2</div>
              <div className="lbl">
                <span className="status-dot" style={{ background: "var(--opq-signal-red)" }} />
                <span>Needs attention</span>
              </div>
            </div>
            <div className="card metric-tile">
              <div className="val">4</div>
              <div className="lbl">
                <span className="status-dot" style={{ background: "var(--opq-ink-400)" }} />
                <span>Draft</span>
              </div>
            </div>
          </div>

          <div className="filter-bar">
            <label className="search-field">
              <input
                placeholder="Search..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              />
              <Icon name="search" size={18} />
            </label>
            <div className="spacer" />
            <Button variant="primary" icon={null} size="sm">New workflow</Button>
          </div>

          <div className="table-wrap">
            <table className="opq-table wf-table">
              <thead>
                <tr>
                  <SortHeader label="Name"         field="name"      sort={sort} onSort={onSort} />
                  <SortHeader label="Status"       field="status"    sort={sort} onSort={onSort} />
                  <SortHeader label="Created by"   field="createdBy" sort={sort} onSort={onSort} />
                  <SortHeader label="Last updated" field="updated"   sort={sort} onSort={onSort} last />
                  <th className="actions-col"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((w) => (
                  <tr key={w.name}>
                    <td>
                      <a className="link" href="#" onClick={(e) => e.preventDefault()}>{w.name}</a>
                    </td>
                    <td><StatusCell status={w.status} /></td>
                    <td>{w.createdBy}</td>
                    <td>{w.updated}</td>
                    <td className="actions-col">
                      <button className="icon-btn" title="More">
                        <Icon name="more_vert" size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "48px 12px", color: "var(--opq-ink-400)" }}>
                      No workflows match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <Pagination
              page={safePage}
              pageCount={pageCount}
              total={total}
              rangeFrom={rangeFrom}
              rangeTo={rangeTo}
              onChange={(p) => setPage(Math.max(1, Math.min(pageCount, p)))}
            />
          </div>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { WorkflowsList, SortHeader, Pagination, StatusCell });
