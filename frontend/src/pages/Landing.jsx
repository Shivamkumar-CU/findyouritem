import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #FF6B35 0%, #EC4899 50%, #A855F7 100%)" }}>

      {/* Background blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #FFE66D, transparent)" }} />
      <div className="absolute bottom-[-80px] left-[-80px] w-80 h-80 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #4ECDC4, transparent)" }} />

      {/* Floating cards */}
      <div className="absolute top-20 left-10 rounded-2xl p-3 hidden md:block shadow-lg"
        style={{ background: "white", transform: "rotate(-8deg)" }}>
        <p className="font-black text-gray-800 text-xs">📱 Phone Found!</p>
        <p className="text-gray-500 text-xs mt-0.5">Central Park, NY</p>
      </div>
      <div className="absolute top-40 right-16 rounded-2xl p-3 hidden md:block shadow-lg"
        style={{ background: "white", transform: "rotate(6deg)" }}>
        <p className="font-black text-gray-800 text-xs">👛 Wallet Lost</p>
        <p className="text-gray-500 text-xs mt-0.5">MG Road, Bangalore</p>
      </div>
      <div className="absolute bottom-40 right-10 rounded-2xl p-3 hidden md:block shadow-lg"
        style={{ background: "white", transform: "rotate(-4deg)" }}>
        <p className="font-black text-gray-800 text-xs">🔑 Keys Found!</p>
        <p className="text-gray-500 text-xs mt-0.5">Sector 17, Chandigarh</p>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">🔍</div>
          <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
            Lost & Found
          </h1>
          <p className="text-white text-lg font-medium mb-4"
            style={{ opacity: 0.9 }}>
            Reconnect with your lost belongings
          </p>

          {/* Feature badges */}
          <div className="flex gap-3 justify-center flex-wrap">
            <span className="text-xs font-black px-4 py-2 rounded-full shadow-md"
              style={{ background: "white", color: "#FF6B35" }}>
              📍 Location Based
            </span>
            <span className="text-xs font-black px-4 py-2 rounded-full shadow-md"
              style={{ background: "white", color: "#EC4899" }}>
              🔐 Verified Claims
            </span>
            <span className="text-xs font-black px-4 py-2 rounded-full shadow-md"
              style={{ background: "white", color: "#A855F7" }}>
              🤝 Community Driven
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl p-8 w-full max-w-md shadow-2xl"
          style={{ background: "white" }}>

          <p className="text-gray-700 text-center text-base font-bold mb-6">
            Join thousands reconnecting with lost items
          </p>

          <Link to="/register"
            className="block w-full py-4 rounded-2xl font-black text-center text-lg text-white mb-4 shadow-lg"
            style={{ background: "linear-gradient(135deg, #FF6B35, #EC4899)" }}>
            Create Free Account
          </Link>

          <Link to="/login"
            className="block w-full py-4 rounded-2xl font-bold text-center text-lg"
            style={{ background: "#F3F4F6", color: "#374151" }}>
            Login to Account
          </Link>

          <p className="text-center text-sm mt-5" style={{ color: "#9CA3AF" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-black"
              style={{ color: "#FF6B35" }}>
              Login here
            </Link>
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-6 w-full max-w-md">
          {[
            { num: "500+", label: "Items Posted" },
            { num: "300+", label: "Items Found" },
            { num: "1000+", label: "Happy Users" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-black text-white">{stat.num}</p>
              <p className="text-xs font-semibold mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}