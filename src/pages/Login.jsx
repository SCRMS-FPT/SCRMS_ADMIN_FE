import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import loginSideImage from "../assets/login_side_image.png"; // Ensure this path is correct

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email.trim() !== "" && password.trim() !== "") {
      try {
        await dispatch(login({ email, password })).unwrap();
        navigate("/");
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      {/* Left-side Image */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-white">
        <img src={loginSideImage} alt="Login Illustration" className="max-w-lg" />
      </div>

      {/* Right-side Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center bg-white px-8 md:px-16 shadow-md">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Welcome to <span className="text-blue-600 font-bold">Courtsite</span>
        </h2>

        {/* Social Logins */}
        <button className="flex items-center justify-center w-full py-3 mb-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-100">
          <FcGoogle className="mr-2 text-xl" /> Login with Google
        </button>
        <button className="flex items-center justify-center w-full py-3 mb-4 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700">
          <FaFacebook className="mr-2 text-xl" /> Login with Facebook
        </button>

        {/* OR Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Email Input */}
        <div className="relative mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FaEnvelope className="absolute left-4 top-4.5 text-gray-500" />
        </div>

        {/* Password Input */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="absolute left-4 top-4.5 text-gray-500" />
          <span
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
          </span>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between items-center text-sm mb-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <a href="#" className="text-purple-600 hover:underline">Forgot Password?</a>
        </div>

        {/* Login Button */}
        <button className="w-full bg-blue-600 font-bold text-white py-3 rounded-lg hover:bg-blue-700 transition" onClick={handleLogin}>
          Login
        </button>

        {/* Register Link */}
        <p className="text-center text-sm mt-4">
          Don't have an account? <a href="#" className="text-blue-600 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
