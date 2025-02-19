import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import signupSideImage from "../assets/login_side_image.png"; // Ensure correct path

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userData = {
      email,
      name,
      phoneNumber,
      password,
      role: "customer",
    };

    try {
      const response = await fetch("http://localhost:5050/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.isSuccess) {
        navigate("/login");
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      {/* Left-side Image */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-white">
        <img src={signupSideImage} alt="Sign Up Illustration" className="max-w-lg" />
      </div>

      {/* Right-side Sign Up Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center bg-white px-8 md:px-16 shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Join <span className="text-purple-600 font-bold">Design School</span>
        </h2>

        {/* Social Sign Ups */}
        <button className="flex items-center justify-center w-full py-3 mb-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-100">
          <FcGoogle className="mr-2 text-xl" /> Sign up with Google
        </button>
        <button className="flex items-center justify-center w-full py-3 mb-4 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700">
          <FaFacebook className="mr-2 text-xl" /> Sign up with Facebook
        </button>

        {/* OR Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Name Input */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FaUser className="absolute left-3 top-4.5 text-gray-500" />
        </div>

        {/* Email Input */}
        <div className="relative mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FaEnvelope className="absolute left-3 top-4.5 text-gray-500" />
        </div>

        {/* Phone Number Input */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <FaPhone className="absolute left-3 top-4.5 text-gray-500" />
        </div>

        {/* Password Input */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="absolute left-3 top-4.5 text-gray-500" />
          <span
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
          </span>
        </div>

        {/* Show error message if exists */}
        {errorMessage && (
          <div className="mt-4 text-red-500 text-center">{errorMessage}</div>
        )}

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
          onClick={handleSignUp}
        >
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="#" className="text-purple-600 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
