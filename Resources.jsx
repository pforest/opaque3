// Resources list — same shell as Workflows; columns: Name / Type / Registered by / Last updated.

const RESOURCES = [
  { name: "HR Policies Corpus",      type: "Data Sources", registeredBy: "Annemarie Selaya", updated: "18 Apr 2026" },
  { name: "Claude Sonnet 4.5",       type: "Models",       registeredBy: "Platform",         updated: "14 Apr 2026" },
  { name: "Salesforce CRM",          type: "Data Sources", registeredBy: "Deborah Mercy",    updated: "12 Apr 2026" },
  { name: "Web Search",              type: "Agent Tools",  registeredBy: "Platform",         updated: "11 Apr 2026" },
  { name: "Confluence Wiki",         type: "Data Sources", registeredBy: "Priya Manikandan", updated: "09 Apr 2026" },
  { name: "SQL Query Tool",          type: "Agent Tools",  registeredBy: "Jordan Bellamy",   updated: "07 Apr 2026" },
  { name: "Claude Haiku 4.5",        type: "Models",       registeredBy: "Platform",         updated: "04 Apr 2026" },
  { name: "Employee Handbook PDFs",  type: "Data Sources", registeredBy: "Annemarie Selaya", updated: "02 Apr 2026" },
  { name: "Jira Issues",             type: "Data Sources", registeredBy: "Noah Westergaard", updated: "29 Mar 2026" },
  { name: "Code Interpreter",        type: "Agent Tools",  registeredBy: "Devon Oduya",      updated: "26 Mar 2026" },
  { name: "Zendesk Tickets",         type: "Data Sources", registeredBy: "Maya Ramirez",     updated: "22 Mar 2026" },
  { name: "Google Drive",            type: "Data Sources", registeredBy: "Jordan Bellamy",   updated: "18 Mar 2026" },
  { name: "Claude Opus 4",           type: "Models",       registeredBy: "Platform",         updated: "14 Mar 2026" },
  { name: "Slack Export",            type: "Data Sources", registeredBy: "Evan McMillon",    updated: "10 Mar 2026" },
  { name: "Email Sender",            type: "Agent Tools",  registeredBy: "Devon Oduya",      updated: "06 Mar 2026" },
  { name: "Vendor Contracts",        type: "Data Sources", registeredBy: "Priya Manikandan", updated: "02 Mar 2026" },
  { name: "Calendar API",            type: "Agent Tools",  registeredBy: "Annemarie Selaya", updated: "26 Feb 2026" },
  { name: "Finance Ledger",          type: "Data Sources", registeredBy: "Deborah Mercy",    updated: "22 Feb 2026" },
  { name: "GPT-4o (fallback)",       type: "Models",       registeredBy: "Platform",         updated: "18 Feb 2026" },
  { name: "GitHub Issues",           type: "Data Sources", registeredBy: "Noah Westergaard", updated: "14 Feb 2026" },
  { name: "Markdown Renderer",       type: "Agent Tools",  registeredBy: "Jordan Bellamy",   updated: "10 Feb 2026" },
  { name: "Product Docs",            type: "Data Sources", registeredBy: "Jordan Bellamy",   updated: "06 Feb 2026" },
  { name: "Benefits Portal Data",    type: "Data Sources", registeredBy: "Annemarie Selaya", updated: "02 Feb 2026" },
  { name: "Llama 3.1 405B",          type: "Models",       registeredBy: "Platform",         updated: "28 Jan 2026" },
  { name: "HTTP Fetch",              type: "Agent Tools",  registeredBy: "Devon Oduya",      updated: "24 Jan 2026" },
  { name: "Notion Workspace",        type: "Data Sources", registeredBy: "Maya Ramirez",     updated: "20 Jan 2026" },
  { name: "Image OCR",               type: "Agent Tools",  registeredBy: "Priya Manikandan", updated: "16 Jan 2026" },
  { name: "Security Policies",       type: "Data Sources", registeredBy: "Noah Westergaard", updated: "12 Jan 2026" },
  { name: "Claude Sonnet 3.7",       type: "Models",       registeredBy: "Platform",         updated: "08 Jan 2026" },
  { name: "Weather API",             type: "Agent Tools",  registeredBy: "Evan McMillon",    updated: "04 Jan 2026" },
];

const RESOURCE_ROWS_PER_PAGE = 10;
const TYPE_FILTERS = ["All types", "Data Sources", "Agent Tools", "Models"];

const TYPE_ICONS = {
  "Data Sources": "database",
  "Agent Tools":  "construction",
  "Models":       "network_intel_node",
};

const TypeCell = ({ type }) => (
  <span className="type-cell">
    <Icon name={TYPE_ICONS[type] || "category"} size={18} />
    <span>{type}</span>
  </span>
);

const ResourcesList = () => {
  const [page, setPage] = React.useState(1);
  const [sort, setSort] = React.useState({ field: null, dir: "asc" });
  const [query, setQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("All types");

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
    let list = RESOURCES.filter(r => {
      if (typeFilter !== "All types" && r.type !== typeFilter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.registeredBy.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q)
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
  }, [query, sort, typeFilter]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / RESOURCE_ROWS_PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const startIdx = (safePage - 1) * RESOURCE_ROWS_PER_PAGE;
  const rows = filtered.slice(startIdx, startIdx + RESOURCE_ROWS_PER_PAGE);
  const rangeFrom = total === 0 ? 0 : startIdx + 1;
  const rangeTo = Math.min(startIdx + RESOURCE_ROWS_PER_PAGE, total);

  return (
    <>
      <div className="page-header">
        <div className="title-row">
          <h1>Resources</h1>
        </div>
      </div>
      <div className="scroll">
        <div className="page-body">
          <div className="filter-bar">
            <label className="search-field">
              <input
                placeholder="Search..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              />
              <Icon name="search" size={18} />
            </label>
            <div className="type-filters">
              {TYPE_FILTERS.map(t => (
                <button
                  key={t}
                  className={`type-filter${typeFilter === t ? " active" : ""}`}
                  onClick={() => { setTypeFilter(t); setPage(1); }}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="spacer" />
            <Button variant="primary" icon={null} size="sm">Add resource</Button>
          </div>

          <div className="table-wrap">
            <table className="opq-table wf-table">
              <thead>
                <tr>
                  <SortHeader label="Name"          field="name"         sort={sort} onSort={onSort} />
                  <SortHeader label="Type"          field="type"         sort={sort} onSort={onSort} />
                  <SortHeader label="Registered by" field="registeredBy" sort={sort} onSort={onSort} />
                  <SortHeader label="Last updated"  field="updated"      sort={sort} onSort={onSort} last />
                  <th className="actions-col"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name}>
                    <td>
                      <a className="link" href="#" onClick={(e) => e.preventDefault()}>{r.name}</a>
                    </td>
                    <td><TypeCell type={r.type} /></td>
                    <td>{r.registeredBy}</td>
                    <td>{r.updated}</td>
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
                      No resources match your filters.
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

Object.assign(window, { ResourcesList });
