import { Link } from "react-router-dom";

export default function ItemCard({ item }) {
  const categoryEmojis = {
    wallet: "👛", phone: "📱", keys: "🔑",
    bag: "🎒", documents: "📄", other: "📦"
  };

  return (
    <div className="card-hover bg-white rounded-3xl overflow-hidden shadow-md border border-gray-100">
      {/* Image */}
      <div className="relative">
        {item.image ? (
          <img src={item.image} alt={item.title}
            className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 flex items-center justify-center text-6xl"
            style={{ background: "linear-gradient(135deg, #FFF8F5, #FFE4D6)" }}>
            {categoryEmojis[item.category] || "📦"}
          </div>
        )}
        {/* Badge */}
        <span className={`absolute top-3 left-3 text-xs font-black px-3 py-1 rounded-full shadow-md ${
          item.type === "lost" ? "lost-badge" : "found-badge"
        }`}>
          {item.type === "lost" ? "LOST" : "FOUND"}
        </span>
        {item.status === "resolved" && (
          <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full shadow-md">
            RESOLVED
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-black text-gray-800 line-clamp-1 flex-1">
            {item.title}
          </h3>
          <span className="text-lg ml-2">{categoryEmojis[item.category] || "📦"}</span>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3 font-medium">
          {item.description}
        </p>
        <div className="space-y-1 mb-3">
          <p className="text-gray-400 text-xs font-semibold flex items-center gap-1">
            <span>📍</span>
            <span className="line-clamp-1">{item.location}</span>
          </p>
          <p className="text-gray-400 text-xs font-semibold">
            📅 {new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <Link to={`/item/${item._id}`}
          className="btn-primary block text-center py-2 rounded-xl text-sm font-black">
          View Details →
        </Link>
      </div>
    </div>
  );
}