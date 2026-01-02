import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import IInvsys from "../../assets/IInvsys.png";

function Employee() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dinner_menu");
    } catch (err) {
      alert("Invalid login ❌");
    }
  };

  const signup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don’t match ❌");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created ✅");
      navigate("/dinner_menu");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
       <img
              src={IInvsys}
              alt="IInvsys"
              className="absolute top-4 left-4 h-12"
            />
      <div className="absolute top-20 left-4">
        <BackButton />
      </div>

      <div className="bg-white p-6 rounded space-y-4 w-80">
        <h2 className="text-xl font-bold text-center">
          {isSignup ? "Employee Sign Up" : "Employee Login"}
        </h2>

        <input
          className="  w-full border border-gray-300 p-2 rounded
    focus:outline-none
    focus:border-blue-900
    focus:ring-1 focus:ring-blue-900"
          placeholder="Office Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="  w-full border border-gray-300 p-2 rounded
    focus:outline-none
    focus:border-blue-900
    focus:ring-1 focus:ring-blue-900"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {isSignup && (
          <input
            type="password"
            className="border p-2 w-full"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        <button
          className="bg-blue-900 text-white w-full py-2 rounded"
          onClick={isSignup ? signup : login}
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p className="text-sm text-center">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setIsSignup(false)}
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setIsSignup(true)}
              >
              Create With Your Office Mail-id
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default Employee;

