import { useNavigate } from "react-router-dom";
import IInvsys from "../../assets/IInvsys.png";
import { useEffect } from "react";


function Home() {
  const navigate = useNavigate();
useEffect(() => {
  if ("Notification" in window) {
    Notification.requestPermission();
  }
}, []);

  return (
    <div className="min-h-screen bg-white relative flex items-center justify-center">

      {/* 🏢 LOGO */}
      <img
        src={IInvsys}
        alt="IInvsys"
        className="absolute top-4 left-4 h-12"
      />

      {/* 🔐 LOGIN CARD */}
      <div className="bg-gray-300  p-6 rounded shadow space-y-4 w-80 text-center">
        <h2 className="text-xl font-bold">Dinner Portal</h2>

        {/* EMPLOYEE */}
       <button
  onClick={() => navigate("/employee")}
  className="
          w-full bg-white text-black py-2 rounded
              hover:bg-blue-900
              active:bg-blue-900
              focus:outline-none focus:ring-0
              transition-colors duration-200"
>
  Log-in For Employee
</button>


        {/* ADMIN */}
        <button
          onClick={() => navigate("/admin")}
          className="
              w-full bg-white text-black py-2 rounded
              hover:bg-blue-900
              active:bg-blue-900
              focus:outline-none focus:ring-0
              transition-colors duration-200"
        >
          Log-in For Admin
        </button>
      </div>
    </div>
  );
}

export default Home;
