import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function ItemMap({ items }) {
  const itemsWithCoords = items.filter(
    (item) => item.coordinates?.lat && item.coordinates?.lng
  );

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ width: "100%", height: "400px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {itemsWithCoords.map((item) => (
        <Marker
          key={item._id}
          position={[item.coordinates.lat, item.coordinates.lng]}
          icon={item.type === "lost" ? redIcon : greenIcon}
        >
          <Popup>
            <div>
              <span style={{
                fontSize: "11px", fontWeight: "bold",
                padding: "2px 8px", borderRadius: "20px",
                background: item.type === "lost" ? "#fee2e2" : "#dcfce7",
                color: item.type === "lost" ? "#dc2626" : "#16a34a"
              }}>
                {item.type === "lost" ? "🔴 Lost" : "🟢 Found"}
              </span>
              <p style={{ fontWeight: "bold", margin: "6px 0 2px" }}>{item.title}</p>
              <p style={{ fontSize: "12px", color: "#6b7280" }}>📍 {item.location}</p>
              {item.image && (
                <img src={item.image} alt={item.title}
                  style={{ width: "100%", height: "70px", objectFit: "cover", borderRadius: "6px", marginTop: "6px" }}
                />
              )}
              <Link to={`/item/${item._id}`} style={{
                display: "inline-block", marginTop: "8px",
                background: "#2563eb", color: "white",
                padding: "4px 12px", borderRadius: "8px",
                fontSize: "12px", textDecoration: "none"
              }}>
                View Details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}