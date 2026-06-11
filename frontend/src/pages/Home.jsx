import { useState, useEffect } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";
import ItemMap from "../components/ItemMap";

const BASE_URL = "http://localhost:8000";

export default function Home() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/items`, {
        params: {
          type: filter !== "all" ? filter : undefined,
          category: category !== "all" ? category : undefined,
        },
      });
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filter, category]);

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: "#FFF8F5" }}>
      <div className="relative overflow-hidden py-16 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #FF6B35 0%, #EC4899 50%, #A855F7 100%)" }}>
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FFE66D, transparent)" }} />
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white mb-2">
            Lost Something? Found Something?
          </h1>
          <p className="text-white text-opacity-80 text-lg mb-6 font-medium">
            Connect with your community to recover lost items
          </p>
          <div className="relative max-w-lg mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search for lost or found items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-5 py-4 rounded-2xl text-gray-800 text-base shadow-xl focus:outline-none font-medium"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-3 items-center">
          {[
            { val: "all", label: "All Items", emoji: "✨" },
            { val: "lost", label: "Lost", emoji: "🔴" },
            { val: "found", label: "Found", emoji: "🟢" },
          ].map((f) => (
            <button key={f.val} onClick={() => setFilter(f.val)}
              className="px-5 py-2 rounded-full font-bold text-sm transition"
              style={filter === f.val
                ? { background: "linear-gradient(135deg, #FF6B35, #EC4899)", color: "white" }
                : { background: "white", color: "#374151", border: "2px solid #E5E7EB" }}>
              {f.emoji} {f.label}
            </button>
          ))}
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-full border-2 border-gray-200 bg-white text-gray-600 font-bold text-sm focus:outline-none">
            <option value="all">All Categories</option>
            <option value="wallet">Wallet</option>
            <option value="phone">Phone</option>
            <option value="keys">Keys</option>
            <option value="bag">Bag</option>
            <option value="documents">Documents</option>
            <option value="other">Other</option>
          </select>
          <button onClick={() => setShowMap(!showMap)}
            className="px-5 py-2 rounded-full font-bold text-sm transition"
            style={showMap
              ? { background: "linear-gradient(135deg, #4ECDC4, #2ECC71)", color: "white" }
              : { background: "white", color: "#374151", border: "2px solid #E5E7EB" }}>
            {showMap ? "List View" : "Map View"}
          </button>
        </div>
      </div>

      {showMap && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <ItemMap items={filtered} />
          </div>
        </div>
      )}

      {!showMap && (
        <div className="max-w-6xl mx-auto px-4 pb-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔄</div>
              <p className="text-gray-400 text-xl font-bold">Loading items...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-400 text-xl font-bold">No items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
