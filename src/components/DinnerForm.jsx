import { useForm } from "react-hook-form";
import { doc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./pages/BackButton";
import IInvsys from "../assets/IInvsys.png";

function DinnerForm() {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      name: localStorage.getItem("name") || "",
      team: localStorage.getItem("team") || "",
      dinner: localStorage.getItem("dinner") || "yes",
    },
  });

  const [menu, setMenu] = useState("");
  const navigate = useNavigate();
  const watchedValues = watch();
  const lastMenuRef = useRef(""); // 🚨 prevent duplicate notifications

  /* 💾 Persist form values locally */
  useEffect(() => {
    localStorage.setItem("name", watchedValues.name || "");
    localStorage.setItem("team", watchedValues.team || "");
    localStorage.setItem("dinner", watchedValues.dinner || "yes");
  }, [watchedValues]);

  /* 🔔 Request notification permission */
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  /* 🔥 Live dinner menu + desktop notification (one-time per update) */
  useEffect(() => {
    const todayId = new Date().toISOString().split("T")[0];
    const ref = doc(db, "dinnerMenu", todayId);

    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;

      const newMenu = snap.data().menu;
      if (!newMenu || lastMenuRef.current === newMenu) return;

      setMenu(newMenu);
      lastMenuRef.current = newMenu;

      if (Notification.permission === "granted") {
        navigator.serviceWorker.ready
          .then((reg) => {
            reg.showNotification("🍽 Dinner Updated!", {
              body: `Today's dinner: ${newMenu}\nSubmit before 3:30 PM.`,
              icon: "/vite.svg",
              tag: "dinner-update", // ensures only 1 notification
              renotify: false,
            });
          })
          .catch(() => {
            // fallback if SW not ready
            new Notification("🍽 Dinner Updated!", {
              body: `Today's dinner: ${newMenu}\nSubmit before 3:30 PM.`,
              icon: "/vite.svg",
            });
          });
      }
    });

    return () => unsub();
  }, []);

  /* 🔐 Auth guard */
  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/dinner_menu");
    }
  }, [navigate]);

  /* ✅ Submit dinner request */
  const onSubmit = async (data) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];
      const docId = `${user.uid}_${today}`;

      await setDoc(
        doc(db, "dinnerRequests", docId),
        {
          uid: user.uid,
          email: user.email,
          name: data.name,
          team: data.team,
          dinner: data.dinner,
          date: today,
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );

      alert("Dinner request saved ✅");
      localStorage.clear();
      reset();
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <img
        src={IInvsys}
        alt="IInvsys"
        className="absolute top-4 left-4 h-12"
      />

      <div className="absolute top-20 left-4">
        <BackButton />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-gray-200 p-6 rounded shadow space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Dinner Allocation</h2>
        <p className="text-center font-semibold">
          🍽 Tonight’s Dinner: {menu || "Not updated yet"}
        </p>

        <input
          {...register("name", { required: true })}
          placeholder="Your Name"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
        />

        <input
          {...register("team", { required: true })}
          placeholder="Your Team"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
        />

        <select
          {...register("dinner")}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
        >
          <option value="yes">Yes, I want dinner</option>
          <option value="no">No, I don’t</option>
        </select>

        <button className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition">
          Submit
        </button>
      </form>
    </div>
  );
}

export default DinnerForm;
