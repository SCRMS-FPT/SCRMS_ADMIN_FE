import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiHome, FiArrowLeft } from "react-icons/fi";
import confetti from "canvas-confetti";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Tạo hiệu ứng confetti khi trang được tải
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    const confettiInterval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(confettiInterval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Bắn confetti từ hai bên
      confetti({
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#FF5E5B", "#D8D8D8", "#39A0ED", "#FFDB4C", "#7A28CB"],
      });
      confetti({
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#FF5E5B", "#D8D8D8", "#39A0ED", "#FFDB4C", "#7A28CB"],
      });
    }, 250);

    return () => clearInterval(confettiInterval);
  }, []);

  const goHome = () => {
    navigate("/");
  };

  const goBack = () => {
    navigate(-1);
  };

  // Variants cho animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const numberVariants = {
    hidden: { scale: 0.5, opacity: 0, rotate: -10 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.8,
        type: "spring",
        stiffness: 200,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="!w-full !h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 overflow-hidden">
      <motion.div
        className="!max-w-3xl w-full text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hình trang trí nền */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-pink-300 to-purple-300 opacity-30 blur-xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-blue-300 to-teal-300 opacity-30 blur-xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-gradient-to-r from-yellow-300 to-orange-300 opacity-20 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Số 404 */}
        <motion.div className="relative mb-8" variants={numberVariants}>
          <div className="text-[150px] md:text-[200px] font-extrabold leading-none tracking-tighter">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              4
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-pink-500">
              0
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-500">
              4
            </span>
          </div>

          {/* Hình trang trí xung quanh số 404 */}
          <motion.div
            className="absolute -top-10 -right-10 w-20 h-20 text-yellow-400"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: {
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
              scale: {
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L14.39 8.25L20 9.24L16 13.19L17.18 18.77L12 16.15L6.82 18.77L8 13.19L4 9.24L9.61 8.25L12 3Z" />
            </svg>
          </motion.div>

          <motion.div
            className="absolute -bottom-5 -left-5 w-16 h-16 text-pink-400"
            animate={{
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: {
                duration: 15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
              scale: {
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,8L10.67,8.09C9.81,7.07 7.4,4.5 5,4.5C5,4.5 3.03,7.46 4.96,11.41C4.41,12.24 4.07,12.67 4,13.66L2.07,13.95L2.28,14.93L4.04,14.67L4.18,15.38L2.61,16.32L3.08,17.21L4.53,16.32C5.68,18.76 8.59,20 12,20C15.41,20 18.32,18.76 19.47,16.32L20.92,17.21L21.39,16.32L19.82,15.38L19.96,14.67L21.72,14.93L21.93,13.95L20,13.66C19.93,12.67 19.59,12.24 19.04,11.41C20.97,7.46 19,4.5 19,4.5C16.6,4.5 14.19,7.07 13.33,8.09L12,8M9,11A1,1 0 0,1 10,12A1,1 0 0,1 9,13A1,1 0 0,1 8,12A1,1 0 0,1 9,11M15,11A1,1 0 0,1 16,12A1,1 0 0,1 15,13A1,1 0 0,1 14,12A1,1 0 0,1 15,11M12,14L13.5,17H10.5L12,14Z" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Thông báo lỗi */}
        <motion.div className="space-y-4 mb-10" variants={itemVariants}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Ôi không! Trang không tồn tại
          </h2>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời
            không khả dụng.
          </p>
        </motion.div>

        {/* Nút hành động */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <motion.button
            onClick={goHome}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-shadow"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FiHome className="text-lg" />
            <span>Về trang chủ</span>
          </motion.button>

          <motion.button
            onClick={goBack}
            className="px-8 py-3 rounded-full bg-white text-gray-700 font-medium border border-gray-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FiArrowLeft className="text-lg" />
            <span>Quay lại</span>
          </motion.button>
        </motion.div>

        {/* Hình minh họa */}
        <motion.div className="mt-16 max-w-xs mx-auto" variants={itemVariants}>
          <svg viewBox="0 0 200 120" className="w-full h-auto">
            <motion.path
              d="M20,100 Q50,50 80,100 T140,100"
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.circle
              cx="160"
              cy="100"
              r="15"
              fill="#ec4899"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
            />
            <motion.circle
              cx="160"
              cy="100"
              r="7.5"
              fill="#ffffff"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.8, duration: 0.5, type: "spring" }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
