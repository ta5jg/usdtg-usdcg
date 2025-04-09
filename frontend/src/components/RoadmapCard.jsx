import { useState, useEffect } from "react";
import clsx from "clsx";
import { useSwipeable } from "react-swipeable";

export default function RoadmapCard({ apiUrl = "", isAdmin = false }) {
  const [roadmap, setRoadmap] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedItems, setEditedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (apiUrl) {
          const res = await fetch(apiUrl);
          const data = await res.json();
          setRoadmap(data);
        } else {
          const data = [
            {
              quarter: "Q2 2025",
              status: "completed",
              items: ["Token launch", "DEX liquidity"],
              icon: "🚀",
            },
            {
              quarter: "Q3 2025",
              status: "in-progress",
              items: ["CoinGecko listing", "CoinMarketCap listing"],
              icon: "📊",
            },
            {
              quarter: "Q4 2025",
              status: "upcoming",
              items: ["Wallet integrations", "Platform build"],
              icon: "🔒",
            },
          ];
          setRoadmap(data);
        }
      } catch (err) {
        console.error("Error loading roadmap:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  const statusColors = {
    completed: "border-green-500 text-green-400",
    "in-progress": "border-yellow-500 text-yellow-400",
    upcoming: "border-gray-500 text-gray-400",
  };

  const bulletColors = {
    completed: "bg-green-400",
    "in-progress": "bg-yellow-400",
    upcoming: "bg-gray-400",
  };

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setExpanded((prev) => (prev + 1) % roadmap.length),
    onSwipedRight: () =>
      setExpanded((prev) => (prev - 1 + roadmap.length) % roadmap.length),
    trackMouse: true,
  });

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-md">
      {loading ? (
        <div className="text-white text-sm">Loading roadmap...</div>
      ) : (
        <ol
          {...handlers}
          className="relative border-s border-zinc-700 pl-6 space-y-6 overflow-x-auto"
        >
          {roadmap.map(({ quarter, items, status, icon }, index) => (
            <li key={quarter} className="ps-6 relative group">
              <div
                className={`absolute w-3 h-3 rounded-full -start-1.5 top-2 border-2 ${
                  bulletColors[status] || "bg-white"
                }`}
              />
              <button
                onClick={() =>
                  setExpanded(expanded === index ? null : index)
                }
                className="focus:outline-none transition-all duration-300 ease-in-out"
                aria-expanded={expanded === index}
              >
                <span
                  className={clsx(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium",
                    status === "completed" &&
                      "bg-green-600/20 text-green-300",
                    status === "in-progress" &&
                      "bg-yellow-600/20 text-yellow-300",
                    status === "upcoming" &&
                      "bg-gray-500/30 text-gray-300"
                  )}
                >
                  <span>{icon}</span>
                  <span>{quarter}</span>
                </span>
              </button>

              {isAdmin && (
                <div className="mt-2">
                  <button
                    onClick={() => {
                      if (editingIndex === index) {
                        setEditingIndex(null);
                        setEditedItems([]);
                      } else {
                        setEditingIndex(index);
                        setEditedItems(items);
                      }
                    }}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    {editingIndex === index ? "Cancel" : "Edit"}
                  </button>
                </div>
              )}

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden transform-gpu ${
                  expanded === index
                    ? "max-h-96 mt-2 opacity-100 scale-100"
                    : "max-h-0 opacity-0 scale-95"
                }`}
              >
                {editingIndex === index ? (
                  <div className="mt-2 space-y-2">
                    {editedItems.map((val, i) => (
                      <input
                        key={i}
                        value={val}
                        onChange={(e) => {
                          const updated = [...editedItems];
                          updated[i] = e.target.value;
                          setEditedItems(updated);
                        }}
                        className="w-full rounded bg-zinc-800 text-white px-3 py-1 text-sm border border-zinc-700"
                      />
                    ))}
                    {/* Save işlemleri admin panelden yapılacaktır. */}
                  </div>
                ) : (
                  <ul
                    className={`border-2 rounded-lg p-4 mt-2 ${
                      statusColors[status] || "text-white"
                    } list-disc pl-6 space-y-1 text-sm bg-transparent`}
                  >
                    {items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}