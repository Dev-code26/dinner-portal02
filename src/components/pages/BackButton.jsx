import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="flex items-center gap-2 text-gray-700 hover:text-black"
    >
      <span className="text-2xl">←</span>
      <span className="font-medium">Back</span>
    </button>
  );
}

export default BackButton;
