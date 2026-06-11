import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const BASE_URL = "http://localhost:8000";

export default function ItemDetail() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [claimStatus, setClaimStatus] = useState("");
  const [proofPreview, setProofPreview] = useState(null);

  const [claimForm, setClaimForm] = useState({
    lostTime: "",
    itemContents: "",
    specialMarks: "",
    phone: "",
    email: "",
  });
  const [proofFile, setProofFile] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/items/${id}`).then((res) => {
      setItem(res.data);
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e) =>
    setClaimForm({ ...claimForm, [e.target.name]: e.target.value });

  const handleProof = (e) => {
    const file = e.target.files[0];
    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

  const validateDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    return year >= 1900 && year <= new Date().getFullYear();
  };

  const handleClaim = async () => {
    setClaimStatus("");

    if (!claimForm.lostTime) {
      setClaimStatus("❌ Lost time required hai");
      return;
    }

    if (!validateDate(claimForm.lostTime)) {
      setClaimStatus("❌ Valid date daalo (year 4 digits hona chahiye)");
      return;
    }

    if (!claimForm.itemContents) {
      setClaimStatus("❌ Item contents required hai");
      return;
    }

    if (!claimForm.phone) {
      setClaimStatus("❌ Phone number required hai");
      return;
    }

    if (!validatePhone(claimForm.phone)) {
      setClaimStatus("❌ Valid 10 digit phone number daalo");
      return;
    }

    if (!claimForm.email) {
      setClaimStatus("❌ Email required hai");
      return;
    }

    if (!validateEmail(claimForm.email)) {
      setClaimStatus("❌ Valid email daalo (e.g. abc@example.com)");
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(claimForm).forEach((key) =>
        data.append(key, claimForm[key])
      );
      if (proofFile) data.append("presenceProof", proofFile);
      await axios.post(`${BASE_URL}/api/items/${id}/claim`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setClaimStatus("✅ Claim submitted! Owner will review and contact you.");
    } catch (err) {
      setClaimStatus(
        err.response?.data?.message || "❌ Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-gray-400 text-xl">Loading...</div>
    );
  if (!item)
    return (
      <div className="text-center py-20 text-gray-400 text-xl">
        Item not found.
      </div>
    );

  const isOwner = user && item.postedBy?._id === user._id;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Item Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-6">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              item.type === "lost"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}>
              {item.type === "lost" ? "🔴 Lost" : "🟢 Found"}
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mt-3">
              {item.title}
            </h2>
            <p className="text-gray-600 mt-2">{item.description}</p>
            <div className="mt-4 space-y-2 text-gray-500 text-sm">
              <p>📍 Location: {item.location}</p>

              {/* Map Preview */}
              {item.coordinates?.lat && item.coordinates?.lng && (
                <div className="mt-3">
                  <p className="font-semibold text-gray-600 mb-2">
                    🗺️ Location on Map:
                  </p>
                  <MapContainer
                    center={[item.coordinates.lat, item.coordinates.lng]}
                    zoom={15}
                    style={{ width: "100%", height: "200px" }}
                    zoomControl={false}
                    dragging={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[
                        item.coordinates.lat,
                        item.coordinates.lng,
                      ]}
                    />
                  </MapContainer>
                </div>
              )}

              <p>📂 Category: {item.category}</p>
              <p>📅 Date: {new Date(item.date).toLocaleDateString()}</p>
              <p>👤 Posted by: {item.postedBy?.name}</p>
            </div>
          </div>
        </div>

        {/* Claim Form */}
        {token && !isOwner && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-blue-700 mb-1">
              🙋 Claim This Item
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              Prove that this item belongs to you. Owner will review and
              contact you.
            </p>
            <div className="space-y-4">

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  ⏰ When did you lose it?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="lostTime"
                  value={claimForm.lostTime}
                  onChange={handleChange}
                  max={new Date().toISOString().slice(0, 16)}
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  📸 Proof that you were there
                  <span className="text-gray-400 text-xs ml-1">
                    (optional)
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProof}
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl"
                />
                {proofPreview && (
                  <img
                    src={proofPreview}
                    alt="proof"
                    className="mt-2 w-full h-40 object-cover rounded-xl"
                  />
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  🧾 What was inside the item?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="itemContents"
                  placeholder="Example: Red wallet with ₹500 note, Aadhar card, blue debit card"
                  value={claimForm.itemContents}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  🔍 Any special marks or features?
                  <span className="text-gray-400 text-xs ml-1">
                    (optional)
                  </span>
                </label>
                <input
                  name="specialMarks"
                  placeholder="Example: Scratch on back, broken zipper"
                  value={claimForm.specialMarks}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="border-t pt-4">
                <p className="text-gray-700 font-semibold mb-3">
                  📞 Your Contact Details
                  <span className="text-gray-400 text-xs ml-1">
                    (shown to owner only after approval)
                  </span>
                </p>
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number * (10 digits)"
                  value={claimForm.phone}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address * (e.g. abc@example.com)"
                  value={claimForm.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <button
                onClick={handleClaim}
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Claim 🚀"}
              </button>

              {claimStatus && (
                <p className={`text-center font-semibold ${
                  claimStatus.includes("✅")
                    ? "text-green-600"
                    : "text-red-600"
                }`}>
                  {claimStatus}
                </p>
              )}
            </div>
          </div>
        )}

        {!token && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-center">
            <p className="text-yellow-700 font-semibold">
              🔐 Please login to claim this item
            </p>
          </div>
        )}

        {isOwner && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
            <p className="text-blue-700 font-semibold">
              ✅ This is your posted item. Check Dashboard for claims.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}