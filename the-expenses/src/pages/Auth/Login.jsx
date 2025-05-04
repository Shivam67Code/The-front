import React, { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiCheck, FiArrowRight, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Too Weak",
    color: "gray",
    message: "Enter your password",
    width: "0%"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const { updateUser, login } = useContext(UserContext);
  const navigate = useNavigate();

  const formControls = useAnimationControls();
  const titleControls = useAnimationControls();
  const headingControls = useAnimationControls();

  useEffect(() => {
    const animationSequence = async () => {
      await titleControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
      });

      await headingControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
      });

      await formControls.start("visible");
    };

    animationSequence();
  }, [titleControls, headingControls, formControls]);

  const checkPasswordStrength = useCallback((pass) => {
    if (!pass) {
      return { score: 0, label: "Too Weak", color: "gray", message: "Enter your password", width: "0%" };
    }

    let score = 0;

    if (pass.length > 6) score += 1;
    if (pass.length > 8) score += 1;

    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    let strengthInfo = { score, width: `${Math.min(100, (score / 6) * 100)}%` };

    if (score <= 2) {
      strengthInfo = {
        ...strengthInfo,
        label: "Weak",
        color: "red-500",
        message: "Try adding numbers or symbols"
      };
    } else if (score <= 4) {
      strengthInfo = {
        ...strengthInfo,
        label: "Fair",
        color: "amber-500",
        message: "Add uppercase letters for stronger password"
      };
    } else if (score <= 5) {
      strengthInfo = {
        ...strengthInfo,
        label: "Good",
        color: "yellow-500",
        message: "Almost there! Try adding special characters"
      };
    } else {
      strengthInfo = {
        ...strengthInfo,
        label: "Strong",
        color: "green-500",
        message: "Great password! Very secure"
      };
    }

    return strengthInfo;
  }, []);

  useEffect(() => {
    setIsEmailValid(email.length > 0 && validateEmail(email));
  }, [email]);

  useEffect(() => {
    setIsPasswordValid(password.length >= 7);
    setPasswordStrength(checkPasswordStrength(password));
  }, [password, checkPasswordStrength]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { email, password });
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
      console.log('Login response:', response);

      // Save token to local storage with consistent naming
      localStorage.setItem('token', response.data.token);
      
      // Use the login function from context which will store user data
      login(response.data);
      
      // Show success state before redirecting
      setLoginSuccess(true);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Login error details:', error.response || error);
      setError(error.response?.data?.message || 'Something went wrong. Please try again later.');
      shakeError();
    } finally {
      setIsLoading(false);
    }
  };

  const shakeError = () => {
    const errorElement = document.getElementById("error-message");
    if (errorElement) {
      errorElement.classList.add("animate-shake");
      setTimeout(() => {
        errorElement.classList.remove("animate-shake");
      }, 820);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
        when: "beforeChildren",
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      filter: "blur(5px)",
      transition: { duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      }
    }
  };

  const backgroundVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        {loginSuccess ? (
          <motion.div
            className="flex flex-col items-center justify-center h-full"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { scale: 0, opacity: 0 },
              visible: {
                scale: 1,
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  duration: 0.6
                }
              },
              exit: {
                scale: 1.5,
                opacity: 0,
                transition: { duration: 0.4 }
              }
            }}
            key="success"
          >
            <div className={`rounded-full p-4 bg-green-100 mb-6 ${animationComplete ? 'animate-dissolve' : ''}`}>
              <motion.div
                className="rounded-full bg-green-500 p-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <FiCheck className="text-white w-12 h-12" />
              </motion.div>
            </div>
            <motion.h2
              className="text-2xl font-bold text-gray-800 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Login Successful!
            </motion.h2>
            <motion.p
              className="text-gray-600 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Redirecting you to dashboard...
            </motion.p>
          </motion.div>
        ) : (
          <div className="relative flex flex-col justify-start h-full overflow-hidden">
            <motion.div
              className="absolute -top-10 -right-10 w-64 h-64 bg-green-50 rounded-full opacity-30 blur-3xl"
              variants={backgroundVariants}
              initial="hidden"
              animate="visible"
              style={{ transformOrigin: "center center" }}
            />

            <motion.div
              className="absolute bottom-20 -left-10 w-48 h-48 bg-blue-50 rounded-full opacity-30 blur-3xl"
              variants={backgroundVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              style={{ transformOrigin: "center center" }}
            />

            <motion.h1
              className="text-3xl font-bold mb-2 text-gray-800 relative z-10"
              initial={{ opacity: 0, y: -20 }}
              animate={titleControls}
              variants={floatingVariants}
              animates="animate"
            >
              <span className="relative">
                Expense Tracker
                <motion.span
                  className="absolute -bottom-1 left-0 h-1 bg-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{
                    delay: 0.8,
                    duration: 0.8,
                    ease: [0.25, 1, 0.5, 1]
                  }}
                ></motion.span>
              </span>
            </motion.h1>

            <motion.div
              className="mt-12 relative z-10"
              variants={containerVariants}
              initial="hidden"
              animate={formControls}
            >
              <motion.div
                className="mb-8 perspective-1000"
                initial={{ opacity: 0, y: 20 }}
                animate={headingControls}
              >
                <motion.h2
                  className="text-2xl md:text-3xl font-bold text-gray-800 mb-2"
                  initial={{ rotateX: -20, transformPerspective: "1000px" }}
                  animate={{ rotateX: 0 }}
                  transition={{
                    delay: 0.5,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  <motion.span
                    initial={{ backgroundSize: "0% 100%" }}
                    animate={{ backgroundSize: "100% 100%" }}
                    transition={{ delay: 1, duration: 0.8 }}
                    style={{
                      backgroundImage: "linear-gradient(transparent 60%, rgba(34, 197, 94, 0.2) 40%)",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "0% 100%",
                      display: "inline-block"
                    }}
                  >
                    Welcome Back
                  </motion.span>
                  <motion.span
                    className="text-green-500 ml-1"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 1.2,
                      type: "spring",
                      stiffness: 500,
                      damping: 10
                    }}
                  >.</motion.span>
                </motion.h2>
                <motion.p
                  className="text-sm text-gray-600 mt-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                >
                  Please enter your details to access your account
                </motion.p>
              </motion.div>

              <motion.form
                onSubmit={handleLogin}
                className="space-y-6"
                variants={containerVariants}
              >
                <motion.div
                  className="relative"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.01,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className={`flex items-center border-2 ${emailFocused ? 'border-green-500 shadow-lg shadow-green-100/60 dark:shadow-green-900/30' : 'border-gray-300'} 
                    ${isEmailValid && email.length > 0 ? 'bg-gradient-to-r from-green-50 to-transparent dark:from-green-900/20 dark:to-transparent' : ''} 
                    rounded-lg overflow-hidden transition-all duration-300 transform ${emailFocused ? 'scale-[1.01]' : 'scale-100'}`}>
                    <div className={`pl-4 py-3.5 transition-all duration-300 
                      ${emailFocused ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: emailFocused ? [0, -10, 10, -10, 10, 0] : 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <FiMail className="w-5 h-5" />
                      </motion.div>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      placeholder="Enter your email"
                      aria-label="Email address"
                      autoComplete="email"
                      className={`flex-1 px-3 py-3.5 bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none placeholder:text-gray-400 
                        transition-all duration-300 ${isEmailValid && email.length > 0 ? 'font-medium' : ''}`}
                    />
                    <AnimatePresence mode="wait">
                      {isEmailValid && email.length > 0 && (
                        <motion.div
                          className="pr-4 text-green-500 dark:text-green-400"
                          initial={{ opacity: 0, scale: 0.8, x: -10 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.8, x: 10 }}
                          transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.3 }}
                          >
                            <FiCheck className="h-5 w-5" />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {emailFocused && (
                      <motion.span
                        className="absolute -top-2 left-4 px-1.5 text-xs font-medium text-green-600 bg-white dark:bg-gray-800 dark:text-green-400"
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      >
                        Email Address
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  className="relative"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.01,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className={`flex items-center border-2 ${passwordFocused ? 'border-green-500 shadow-lg shadow-green-100/60 dark:shadow-green-900/30' : 'border-gray-300'} 
                    ${isPasswordValid && password.length > 0 ? 'bg-gradient-to-r from-green-50 to-transparent dark:from-green-900/20 dark:to-transparent' : ''} 
                    rounded-lg overflow-hidden transition-all duration-300 transform ${passwordFocused ? 'scale-[1.01]' : 'scale-100'}`}>
                    <div className={`pl-4 py-3.5 transition-all duration-300 
                      ${passwordFocused ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: passwordFocused ? [0, -10, 10, -10, 10, 0] : 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <FiLock className="w-5 h-5" />
                      </motion.div>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      placeholder="Min 7 characters"
                      aria-label="Password"
                      autoComplete="current-password"
                      className={`flex-1 px-3 py-3.5 bg-transparent text-gray-800 dark:text-gray-100 focus:outline-none placeholder:text-gray-400 
                        transition-all duration-300 ${isPasswordValid && password.length > 0 ? 'font-medium' : ''}`}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className={`pr-4 transition-colors duration-300 hover:text-green-600 ${passwordFocused ? 'text-green-500' : 'text-gray-400'}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <AnimatePresence mode="wait">
                        {showPassword ? (
                          <motion.div
                            initial={{ rotate: -20, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 20, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            key="eye-off"
                          >
                            <FiEyeOff className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ rotate: 20, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -20, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            key="eye"
                          >
                            <FiEye className="w-5 h-5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                  <AnimatePresence>
                    {passwordFocused && (
                      <motion.span
                        className="absolute -top-2 left-4 px-1.5 text-xs font-medium text-green-600 bg-white dark:bg-gray-800 dark:text-green-400"
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      >
                        Password
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {password.length > 0 && (
                      <motion.div
                        className="mt-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <FiShield className={`w-4 h-4 mr-1 text-${passwordStrength.color}`} />
                            <span className={`text-xs font-medium text-${passwordStrength.color}`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{passwordStrength.message}</span>
                        </div>

                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-${passwordStrength.color} rounded-full`}
                            initial={{ width: "0%" }}
                            animate={{ width: passwordStrength.width }}
                            transition={{ type: "spring", stiffness: 100, damping: 25 }}
                          ></motion.div>
                        </div>

                        <div className="flex justify-between mt-1">
                          {[1, 2, 3, 4].map((segment) => (
                            <motion.div
                              key={segment}
                              className={`h-1 w-1 rounded-full ${
                                passwordStrength.score >= segment * 1.5
                                  ? `bg-${passwordStrength.color}`
                                  : 'bg-gray-300'
                              }`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: segment * 0.1 }}
                            ></motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div className="flex items-center justify-between" variants={itemVariants}>
                  <div className="flex items-center">
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="opacity-0 absolute block w-6 h-6 cursor-pointer"
                      />
                      <label
                        htmlFor="rememberMe"
                        className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-300 ease-in-out
                          ${rememberMe ? 'bg-green-500' : ''}`}
                      >
                        <motion.span
                          className="block h-6 w-6 rounded-full bg-white shadow transform"
                          animate={{
                            translateX: rememberMe ? 16 : 0,
                            backgroundColor: rememberMe ? "#ffffff" : "#ffffff"
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        ></motion.span>
                      </label>
                    </div>
                    <label htmlFor="rememberMe" className="ml-3 text-sm text-gray-600 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      id="error-message"
                      className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md"
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: 10, height: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <div className="flex items-center">
                        <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600
                    text-white rounded-lg font-medium tracking-wide text-sm transition-all duration-300 
                    transform hover:scale-[1.01] active:scale-95 relative overflow-hidden
                    ${isLoading ? 'cursor-wait opacity-90' : 'cursor-pointer'}
                    border border-green-500/30 hover:border-green-600/50
                    shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30`}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 12px 25px -5px rgba(22, 163, 74, 0.4)",
                  }}
                  whileTap={{ 
                    scale: 0.98,
                    boxShadow: "0 5px 15px -3px rgba(22, 163, 74, 0.2)",
                  }}
                  initial={{ boxShadow: "0 6px 15px -3px rgba(22, 163, 74, 0.25)" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ["0%", "100%"],
                      opacity: [0, 0.1, 0]
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatDelay: 3,
                      duration: 1.5,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <motion.div className="relative z-10">
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <motion.div 
                          className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 0.8,
                            ease: "linear" 
                          }}
                        />
                        <span>Logging in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-2 tracking-wider">LOGIN</span>
                        <motion.div
                          animate={{ 
                            x: ["0%", "15%", "0%"],
                          }}
                          transition={{
                            repeat: Infinity,
                            repeatDelay: 1.5,
                            duration: 1,
                            ease: "easeInOut"
                          }}
                        >
                          <FiArrowRight className="h-4 w-4" />
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.span
                    className="absolute top-0 left-0 w-32 h-full bg-white opacity-20 transform rotate-12"
                    animate={{
                      translateX: ["-100%", "200%"]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                      repeatDelay: 1
                    }}
                  />
                </motion.button>

                <motion.p
                  className="text-center text-sm text-gray-600"
                  variants={itemVariants}
                >
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-green-600 font-medium hover:text-green-800 
                      transition-all duration-300 relative group"
                  >
                    <span>Sign Up</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.p>
              </motion.form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default Login;