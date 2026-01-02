import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";

const today = new Date().toISOString().split("T")[0];

// ⏰ DINNER WINDOW
const START_HOUR = 14; // 2:30 PM
const START_MIN = 30;
const END_HOUR = 15;   // 3:30 PM
const END_MIN = 30;

function Update() {
  const user = auth.currentUser;

  const [menu, setMenu] = useState("");
  const [status, setStatus] = useState(null);
  const [submittedAt, setSubmittedAt] = useState(null);
  const [loading, setLoading] = useState(true);

  const [timeMsg, setTimeMsg] = useState("");
  const [allowed, setAllowed] = useState(false);

  /* 🍽️ FETCH MENU */
  useEffect(() => {
    getDoc(doc(db, "dinnerMenu", today)).then((snap) => {
      if (snap.exists()) setMenu(snap.data().menu);
    });
  }, []);

  /* 🔒 CHECK IF ALREADY SUBMITTED */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "dinnerRequests"),
      where("uid", "==", user.uid),
      where("date", "==", today)
    );

    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const d = snap.docs[0].data();
        setStatus(d.dinner);
        setSubmittedAt(d.timestamp?.toDate());
      }
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  /* ⏳ COUNTDOWN (2:30 – 3:30 ONLY) */
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      const start = new Date();
      start.setHours(START_HOUR, START_MIN, 0);

      const end = new Date();
      end.setHours(END_HOUR, END_MIN, 0);

      if (now < start) {
        setAllowed(false);
        setTimeMsg("⏳ Requests start at 2:30 PM");
      } 
      else if (now >= start && now <= end) {
        setAllowed(true);

        const diff = end - now;
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);

        setTimeMsg(`⏰ ${mins}m ${secs}s left`);
      } 
      else {
        setAllowed(false);
        setTimeMsg("❌ Time’s up (after 3:30 PM)");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* 📤 SUBMIT */
  const submit = async (choice) => {
    if (!allowed) return;

    await addDoc(collection(db, "dinnerRequests"), {
      uid: user.uid,
      name: user.displayName || "Employee",
      team: "Unknown",
      dinner: choice,
      date: today,
      timestamp: serverTimestamp(),
    });
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* <h2 className="text-2xl font-bold mb-2">🍽️ Today’s Dinner</h2> */}
      {/* <p className="text-lg mb-4">{menu || "Not updated yet"}</p> */}

      {/* ⏳ TIMER */}
      <div className="mb-4 font-semibold text-blue-600">
        {timeMsg}
      </div>
    </div>
  );
}

export default Update;
