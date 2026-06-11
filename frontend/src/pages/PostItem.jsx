import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LocationPicker from "../components/LocationPicker";

const BASE_URL = "http://localhost:8000";

export default function PostItem() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "lost",
    category: "other",
    location: "",
    date: "",
    secretQuestion: "",
    secretAnswer: "",
  });
  const [coordinates, setCoordinates] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => data.append(key, form[key]));
      if (image) data.append("image", image);
      if (coordinates) {
        data.append("lat", coordinates.lat);
        data.append("lng", coordinates.lng);
      }
      await axios.post(`${BASE_URL}/api/items`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Post an Item</h2>
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            {["lost", "found"].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm({ ...form, type: t })}
                className={`flex-1 py-3 rounded-xl font-semibold capitalize transition ${
                  form.type === t
                    ? t === "lost"
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t === "lost" ? "🔴 Lost Item" : "🟢 Found Item"}
              </button>
            ))}
          </div>

          <input
            name="title"
            placeholder="Item Title *"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            name="description"
            placeholder="Description *"
            value={form.description}
            onChange={handleChange}
            rows={3}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="wallet">Wallet</option>
            <option value="phone">Phone</option>
            <option value="keys">Keys</option>
            <option value="bag">Bag</option>
            <option value="documents">Documents</option>
            <option value="other">Other</option>
          </select>

          <input
            name="location"
            placeholder="Location (type karo ya map pe click karo) *"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <LocationPicker
            onLocationSelect={(address, coords) => {
              setForm((prev) => ({ ...prev, location: address }));
              setCoordinates(coords);
            }}
          />

          {coordinates && (
            <p className="text-green-600 text-sm font-semibold">
              ✅ Location selected on map!
            </p>
          )}

          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="border-t pt-4">
            <p className="text-gray-600 font-semibold mb-2">
              🔐 Verification Question
            </p>
            <input
              name="secretQuestion"
              placeholder="Secret Question *"
              value={form.secretQuestion}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
            />
            <input
              name="secretAnswer"
              placeholder="Answer *"
              value={form.secretAnswer}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-2">
              📷 Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl"
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-3 w-full h-48 object-cover rounded-xl"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Item 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}