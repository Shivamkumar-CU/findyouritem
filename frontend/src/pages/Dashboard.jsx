import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = "https://findyouritem-1.onrender.com";

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [myItems, setMyItems] = useState([]);
  const [incomingClaims, setIncomingClaims] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("items");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [itemsRes, incomingRes, myClaimsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/items/my`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/api/items/claims`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/api/items/my-claims`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setMyItems(itemsRes.data);
      setIncomingClaims(incomingRes.data);
      setMyClaims(myClaimsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    const loadData = async () => {
      await fetchData();
    };
    loadData();
  }, [token]);

  const handleClaimAction = async (claimId, action) => {
    try {
      await axios.put(
        `${BASE_URL}/api/items/claims/${claimId}`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIncomingClaims((prev) =>
        prev.map((c) => (c._id === claimId ? { ...c, status: action } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`${BASE_URL}/api/auth/delete-account`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      navigate("/");
    } catch (err) {
      console.error(err);
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-gray-400 text-xl">Loading...</div>
    );

  const pendingClaims = incomingClaims.filter(
    (c) => c.status === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

      {/* Header */}
<div className="rounded-3xl shadow-lg p-6 mb-6 flex justify-between items-center flex-wrap gap-3"
  style={{ background: "linear-gradient(135deg, #FF6B35, #EC4899)" }}>
  <div>
    <h2 className="text-3xl font-black text-white">My Dashboard</h2>
    <p className="text-white text-opacity-80 mt-1 font-medium">
      Welcome back, {user?.name} 👋
    </p>
  </div>
  <div className="flex gap-3 flex-wrap">
    <Link to="/post"
      className="bg-white text-orange-500 px-5 py-3 rounded-xl font-black hover:bg-orange-50 transition shadow-md">
      + Post Item
    </Link>
    <button onClick={() => setShowDeleteModal(true)}
      className="bg-white bg-opacity-20 text-white border border-white border-opacity-30 px-4 py-3 rounded-xl font-bold hover:bg-opacity-30 transition text-sm">
      Delete Account
    </button>
  </div>
</div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{myItems.length}</p>
            <p className="text-gray-500 text-sm mt-1">Posted Items</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-yellow-500">{pendingClaims}</p>
            <p className="text-gray-500 text-sm mt-1">Pending Claims</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-3xl font-bold text-green-500">
              {incomingClaims.filter((c) => c.status === "approved").length}
            </p>
            <p className="text-gray-500 text-sm mt-1">Resolved</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab("items")}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              activeTab === "items"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-300"
            }`}
          >
            My Items ({myItems.length})
          </button>
          <button
            onClick={() => setActiveTab("incoming")}
            className={`px-6 py-2 rounded-full font-semibold transition relative ${
              activeTab === "incoming"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-300"
            }`}
          >
            Incoming Claims ({incomingClaims.length})
            {pendingClaims > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingClaims}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("myclaims")}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              activeTab === "myclaims"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-300"
            }`}
          >
            My Claims ({myClaims.length})
          </button>
        </div>

        {/* My Items Tab */}
        {activeTab === "items" && (
          <div className="bg-white rounded-2xl shadow p-6">
            {myItems.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 text-lg">No items posted yet.</p>
                <Link
                  to="/post"
                  className="mt-3 inline-block text-blue-600 font-semibold hover:underline"
                >
                  Post your first item
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center border border-gray-100 rounded-xl px-4 py-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              item.type === "lost"
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {item.type}
                          </span>
                          {item.status === "resolved" && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-600">
                              Resolved
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-gray-700 mt-0.5">
                          {item.title}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {item.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/item/${item._id}`}
                        className="text-blue-500 text-sm border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50 transition"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="text-red-500 text-sm border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Incoming Claims Tab */}
        {activeTab === "incoming" && (
          <div className="bg-white rounded-2xl shadow p-6">
            {incomingClaims.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 text-lg">No claims received yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {incomingClaims.map((claim) => (
                  <div
                    key={claim._id}
                    className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-gray-800">
                          {claim.item?.title}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Claimed by:{" "}
                          <span className="font-semibold">
                            {claim.claimant?.name}
                          </span>
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          claim.status === "approved"
                            ? "bg-green-100 text-green-600"
                            : claim.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {claim.status === "approved"
                          ? "Approved"
                          : claim.status === "rejected"
                          ? "Rejected"
                          : "Pending"}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
                      <p>
                        <span className="font-semibold text-gray-600">
                          Lost at:
                        </span>{" "}
                        {new Date(claim.lostTime).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-600">
                          Contents:
                        </span>{" "}
                        {claim.itemContents}
                      </p>
                      {claim.specialMarks && (
                        <p>
                          <span className="font-semibold text-gray-600">
                            Special Marks:
                          </span>{" "}
                          {claim.specialMarks}
                        </p>
                      )}
                      {claim.presenceProof && (
                        <div>
                          <p className="font-semibold text-gray-600 mb-1">
                            Presence Proof:
                          </p>
                          <img
                            src={claim.presenceProof}
                            alt="proof"
                            className="w-40 h-28 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>

                    {claim.status === "approved" && (
                      <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3">
                        <p className="text-green-700 font-semibold text-sm mb-1">
                          Contact Details
                        </p>
                        <p className="text-green-700 text-sm">
                          Phone: {claim.phone}
                        </p>
                        <p className="text-green-700 text-sm">
                          Email: {claim.email}
                        </p>
                      </div>
                    )}

                    {claim.status === "pending" && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() =>
                            handleClaimAction(claim._id, "approved")
                          }
                          className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-green-600 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleClaimAction(claim._id, "rejected")
                          }
                          className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Claims Tab */}
        {activeTab === "myclaims" && (
          <div className="bg-white rounded-2xl shadow p-6">
            {myClaims.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 text-lg">
                  You have not claimed any items yet.
                </p>
                <Link
                  to="/home"
                  className="mt-3 inline-block text-blue-600 font-semibold hover:underline"
                >
                  Browse items
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myClaims.map((claim) => (
                  <div
                    key={claim._id}
                    className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-gray-800">
                          {claim.item?.title}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Type:{" "}
                          <span className="font-semibold capitalize">
                            {claim.item?.type}
                          </span>
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          claim.status === "approved"
                            ? "bg-green-100 text-green-600"
                            : claim.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {claim.status === "approved"
                          ? "Approved"
                          : claim.status === "rejected"
                          ? "Rejected"
                          : "Pending"}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-sm">
                      <p>
                        <span className="font-semibold text-gray-600">
                          Lost at:
                        </span>{" "}
                        {new Date(claim.lostTime).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-600">
                          Contents:
                        </span>{" "}
                        {claim.itemContents}
                      </p>
                    </div>

                    {claim.status === "approved" && (
                      <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3">
                        <p className="text-green-700 font-bold text-sm">
                          Your claim has been approved!
                        </p>
                        <p className="text-green-600 text-sm mt-1">
                          The owner will contact you on your provided phone/email.
                        </p>
                      </div>
                    )}

                    {claim.status === "rejected" && (
                      <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3">
                        <p className="text-red-700 font-bold text-sm">
                          Your claim has been rejected.
                        </p>
                        <p className="text-red-600 text-sm mt-1">
                          The owner did not verify your claim.
                        </p>
                      </div>
                    )}

                    {claim.status === "pending" && (
                      <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                        <p className="text-yellow-700 font-bold text-sm">
                          Claim is under review.
                        </p>
                        <p className="text-yellow-600 text-sm mt-1">
                          The owner will review and respond soon.
                        </p>
                      </div>
                    )}

                    <Link
                      to={`/item/${claim.item?._id}`}
                      className="mt-3 inline-block text-blue-500 text-sm hover:underline"
                    >
                      View Item Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-red-600 mb-2">
                Delete Account
              </h3>
              <p className="text-gray-600 mb-2">
                This action is{" "}
                <span className="font-bold">permanent</span>!
              </p>
              <ul className="text-gray-500 text-sm space-y-1 mb-6 list-disc pl-5">
                <li>Your account will be deleted</li>
                <li>All your posted items will be deleted</li>
                <li>All your claims will be deleted</li>
                <li>You can register again with the same email</li>
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deleteLoading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}