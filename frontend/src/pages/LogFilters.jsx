export default function LogFilters({ filterUser, setFilterUser, filterDate, setFilterDate, filterKeyword, setFilterKeyword }) {
    return (
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
          placeholder="Filter by user"
          className="p-2 rounded bg-zinc-800 text-white border border-zinc-700"
        />
        <input
          type="text"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          placeholder="Filter by date"
          className="p-2 rounded bg-zinc-800 text-white border border-zinc-700"
        />
        <input
          type="text"
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
          placeholder="Search keyword"
          className="p-2 rounded bg-zinc-800 text-white border border-zinc-700"
        />
      </div>
    );
  }