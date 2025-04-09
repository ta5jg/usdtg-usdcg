export default function AdminPanel({ roadmap, setRoadmap, role }) {
  const handleAddStep = () => {
    const newStep = {
      quarter: `QX ${new Date().getFullYear()}`,
      status: "upcoming",
      items: ["New roadmap item"],
      icon: "🆕",
    };
    setRoadmap([...roadmap, newStep]);
  };

  const handleDelete = (index) => {
    const updated = [...roadmap];
    updated.splice(index, 1);
    setRoadmap(updated);
  };

  const handleMove = (index, dir) => {
    const updated = [...roadmap];
    const target = index + dir;
    if (target < 0 || target >= roadmap.length) return;
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setRoadmap(updated);
  };

  if (role === "viewer") {
    return (
      <div className="p-4 border border-zinc-700 bg-zinc-800 text-white rounded-md">
        <h2 className="text-xl font-semibold mb-4">Viewer Mode</h2>
        <p className="text-zinc-400">You have read-only access.</p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-zinc-700 bg-zinc-800 text-white rounded-md">
      <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>

      {role !== "viewer" && (
        <button
          onClick={handleAddStep}
          className="mb-4 px-4 py-2 rounded bg-green-600 hover:bg-green-500"
        >
          + Add Roadmap Step
        </button>
      )}

      <ul className="space-y-2">
        {roadmap.map((step, idx) => (
          <li
            key={idx}
            className="border border-zinc-600 p-3 rounded flex justify-between items-center"
          >
            <div>
              <span className="font-semibold mr-2">{step.icon}</span>
              <span>{step.quarter}</span> —{" "}
              <span className="italic text-sm">{step.status}</span>
              <div className="text-sm text-zinc-300">
                {step.items.join(", ")}
              </div>
            </div>
            {role === "admin" && (
              <div className="flex gap-2">
                <button onClick={() => handleMove(idx, -1)}>⬆️</button>
                <button onClick={() => handleMove(idx, 1)}>⬇️</button>
                <button onClick={() => handleDelete(idx)}>🗑️</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}