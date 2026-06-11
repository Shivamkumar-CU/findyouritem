import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BASE_URL = "http://localhost:8000";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.phone || !form.password) { setError("Sare fields required hain"); return; }
    if (!validateEmail(form.email)) { setError("Valid email daalo (e.g. abc@example.com)"); return; }
    if (!validatePhone(form.phone)) { setError("Valid 10 digit phone number daalo"); return; }
    if (form.password.length < 6) { setError("Password minimum 6 characters ka hona chahiye"); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/register`, form);
      login(res.data.user, res.data.token);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10"
      style={{ background: "linear-gradient(135deg, #FF6B35 0%, #EC4899 50%, #A855F7 100%)" }}>
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #FFE66D, transparent)" }} />
      <div className="absolute bottom-[-80px] left-[-80px] w-80 h-80 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #4ECDC4, transparent)" }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="text-5xl">🔍</Link>
          <h1 className="text-3xl font-black text-white mt-2">Lost & Found</h1>
          <p className="text-white text-opacity-80 text-sm mt-1">Create your free account</p>
        </div>

        <div className="glass-card rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-black text-gray-800 mb-1">Register</h2>
          <p className="text-gray-500 text-sm mb-6">Join the community today</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "name", label: "Full Name", type: "text", placeholder: "Shivam Kumar" },
              { name: "email", label: "Email Address", type: "email", placeholder: "abc@example.com" },
              { name: "phone", label: "Mobile Number", type: "tel", placeholder: "10 digit number", maxLength: 10 },
              { name: "password", label: "Password", type: "password", placeholder: "Min 6 characters" },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-gray-700 font-bold text-sm mb-1 block">{field.label}</label>
                <input
                  name={field.name} type={field.type} placeholder={field.placeholder}
                  value={form[field.name]} onChange={handleChange}
                  required maxLength={field.maxLength}
                  className="w-full border-2 border-gray-200 bg-gray-50 px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-white transition font-medium"
                />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-4 rounded-xl font-black text-lg disabled:opacity-50">
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-5 text-sm font-medium">
            Already have an account?{" "}
            <Link to="/login" className="font-black hover:underline" style={{ color: "#FF6B35" }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}