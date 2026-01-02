import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import BackButton from "./BackButton";
import * as XLSX from "xlsx"; // ✅ NEW
import IInvsys from "../../assets/IInvsys.png";


function Dashboard() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [menu, setMenu] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [checkingAuth, setCheckingAuth] = useState(true);

  /* 🔒 AUTH */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/admin");
      else setCheckingAuth(false);
    });
    return () => unsub();
  }, [navigate]);

  /* 🍽 MENU */
  useEffect(() => {
    const ref = doc(db, "dinnerMenu", selectedDate);

    const unsub = onSnapshot(ref, async (snap) => {
      if (snap.exists()) {
        setMenu(snap.data().menu);
      } else {
        await setDoc(ref, { menu: "", date: selectedDate });
        setMenu("");
      }
    });

    return () => unsub();
  }, [selectedDate]);

  /* 📥 REQUESTS */
  useEffect(() => {
    const q = query(
      collection(db, "dinnerRequests"),
      where("date", "==", selectedDate),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setRequests(data);
    });

    return () => unsub();
  }, [selectedDate]);

  /* 🍽 UPDATE MENU */
  const updateMenu = async () => {
    if (!menu.trim()) return alert("Menu empty ❌");

    await setDoc(doc(db, "dinnerMenu", selectedDate), {
      menu,
      date: selectedDate,
      updatedAt: serverTimestamp(),
    });

    alert("Menu updated ✅");
  };

  /* ✏️ EDIT */
  const editRequest = async (r) => {
    const val = prompt("Update dinner (yes / no)", r.dinner);
    if (val !== "yes" && val !== "no") return;

    await updateDoc(doc(db, "dinnerRequests", r.id), {
      dinner: val,
      timestamp: serverTimestamp(),
    });
  };

  /* 🗑 DELETE */
  const deleteRequest = async (id) => {
    if (!window.confirm("Delete this request?")) return;
    await deleteDoc(doc(db, "dinnerRequests", id));
  };

  /* 🔓 LOGOUT */
  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  /* ⏰ TIME FORMAT */
  const formatTime = (ts) => {
    if (!ts) return "-";
    return ts.toDate().toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });
  };

  /* ✅ YES COUNT */
  const yesCount = requests.filter((r) => r.dinner === "yes").length;

  /* 👥 YES COUNT PER TEAM */
  const yesByTeam = requests
    .filter((r) => r.dinner === "yes")
    .reduce((acc, r) => {
      acc[r.team] = (acc[r.team] || 0) + 1;
      return acc;
    }, {});

  /* 📥 DOWNLOAD EXCEL */
  const downloadExcel = () => {
    if (requests.length === 0) {
      alert("No data to download ❌");
      return;
    }

    const data = requests.map((r) => ({
      Name: r.name,
      Team: r.team,
      Dinner: r.dinner.toUpperCase(),
      "Dinner Menu":menu||"Not Updated",
      Date: r.date,
      "Submitted Time": r.timestamp
        ? r.timestamp.toDate().toLocaleString("en-IN")
        : "-",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dinner Requests");

    XLSX.writeFile(wb, `Dinner_Requests_${selectedDate}.xlsx`);
  };

  if (checkingAuth) return <div>Loading…</div>;

  return (
    
    <div className="p-6 mt-10 bg-white min-h-screen">
        <img
                    src={IInvsys}
                    alt="IInvsys"
                    className="absolute top-4 left-6 h-12"
                  />
                  <div className="absolute top-15 left-6">
                   <BackButton />
                  </div>
      <h2 className="text-2xl font-bold mt-10">Admin Dashboard</h2>

      {/* 🍽 MENU */}
      <div className="bg-white p-4 mb-6 rounded shadow">
        <h3 className="font-semibold mb-2">
          🍽 Dinner for {selectedDate}
        </h3>
        <input
          className="border p-2 mr-2"
          value={menu}
          onChange={(e) => setMenu(e.target.value)}
        />
        <button
          onClick={updateMenu}
          className="bg-blue-900 text-white px-4 py-1 rounded"
        >
          Update
        </button>
      </div>

      {/* 📅 DATE */}
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="border p-2 mb-4"
      />

      {/* 📊 SUMMARY */}
      <div className="bg-white p-4 mb-4 rounded shadow">
        <p className="text-lg font-semibold">
          Total YES:{" "}
          <span className="text-green-600">{yesCount}</span>
        </p>

        {Object.entries(yesByTeam).map(([team, count]) => (
          <p key={team}>
            {team}: <strong>{count}</strong>
          </p>
        ))}
      </div>

      {/* ⬇️ DOWNLOAD */}
      <button
        onClick={downloadExcel}
        className="mb-4 bg-green-700 text-white px-4 py-2 rounded"
      >
        ⬇️ Download Excel
      </button>

      {/* 📋 TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th>Name</th>
              <th>Team</th>
              <th>Dinner</th>
              <th>Submitted Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((r) => (
                <tr key={r.id} className="text-center border-b">
                  <td>{r.name}</td>
                  <td>{r.team}</td>
                  <td>{r.dinner}</td>
                  <td className="text-sm text-gray-600">
                    {formatTime(r.timestamp)}
                  </td>
                  <td className="space-x-2">
                    <button
                      onClick={() => editRequest(r)}
                      className="bg-black  text-white px-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRequest(r.id)}
                      className="bg-black text-white px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No requests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={logout}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
