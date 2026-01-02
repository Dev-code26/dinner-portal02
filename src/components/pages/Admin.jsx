import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BackButton from "./BackButton";
import IInvsys from "../../assets/IInvsys.png";

function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch {
      alert("Invalid admin credentials !!");
    }
  };

  return (
    
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <img
              src={IInvsys}
              alt="IInvsys"
              className="absolute top-4 left-4 h-12"
            />
      <div className="absolute top-20 left-4">
  <BackButton />
</div>

      <div className="bg-white p-6 rounded shadow w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">Admin Login</h2>
        <input
          placeholder="Email"
          className="  w-full border border-gray-300 p-2 rounded
    focus:outline-none
    focus:border-blue-900
    focus:ring-1 focus:ring-blue-900"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="  w-full border border-gray-300 p-2 rounded
    focus:outline-none
    focus:border-blue-900
    focus:ring-1 focus:ring-blue-900"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={login}
          className="bg-blue-900 text-white w-full py-2 rounded"
        >
          Login
        </button>
    

      </div>
    </div>
  );
}

export default Admin;
