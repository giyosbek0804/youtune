import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function LoginButton({ onLogin }) {
  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/youtube.readonly",
    onSuccess: async (tokenResponse) => {
      console.log("✅ Login successful!");
      console.log("Access Token:", tokenResponse.access_token);

      // Notify parent or store token
      if (onLogin) onLogin(tokenResponse.access_token);
    },
    onError: (error) => console.error("❌ Login failed:", error),
  });

  return (
    <button
      onClick={() => login()}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
    >
      Sign in with Google
    </button>
  );
}

export default LoginButton;
