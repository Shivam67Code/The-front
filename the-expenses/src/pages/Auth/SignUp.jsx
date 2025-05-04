import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from "../../components/layouts/AuthLayout";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { UserContext } from '../../context/userContext';
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { validateEmail } from "../../utils/helper";
import { FiShield, FiMail, FiUser, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Focus state for enhanced UI
  const [fullNameFocused, setFullNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  // Validation states
  const [isFullNameValid, setIsFullNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  
  // Refs for focus management
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  
  // Add password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Too Weak",
    color: "gray",
    message: "Enter your password",
    width: "0%"
  });

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  // Validate full name
  useEffect(() => {
    setIsFullNameValid(fullName.length >= 2);
  }, [fullName]);
  
  // Validate email
  useEffect(() => {
    setIsEmailValid(email.length > 0 && validateEmail(email));
  }, [email]);
  
  // Auto-focus on form steps
  useEffect(() => {
    if (formStep === 0 && fullNameRef.current) {
      fullNameRef.current.focus();
    } else if (formStep === 1 && emailRef.current) {
      emailRef.current.focus();
    } else if (formStep === 2 && passwordRef.current) {
      passwordRef.current.focus();
    }
  }, [formStep]);
  
  // Password strength checker
  const checkPasswordStrength = useCallback((pass) => {
    if (!pass) {
      return { score: 0, label: "Too Weak", color: "gray", message: "Enter your password", width: "0%" };
    }
    
    // Calculate password strength
    let score = 0;
    
    // Length check
    if (pass.length > 6) score += 1;
    if (pass.length > 8) score += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(pass)) score += 1; // Has uppercase
    if (/[a-z]/.test(pass)) score += 1; // Has lowercase
    if (/[0-9]/.test(pass)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(pass)) score += 1; // Has special char
    
    // Calculate overall strength
    let strengthInfo = { score, width: `${Math.min(100, (score/6) * 100)}%` };
    
    // Determine label, color and message based on score
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
  
  // Update password strength when password changes
  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
  }, [password, checkPasswordStrength]);
  
  // Handle next step in form
  const handleNextStep = () => {
    if (formStep === 0 && !isFullNameValid) {
      setError("Please enter your full name");
      return;
    }
    
    if (formStep === 1 && !isEmailValid) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (formStep === 2 && (password.length < 7 || passwordStrength.score < 3)) {
      setError("Please create a stronger password");
      return;
    }
    
    setError(null);
    
    if (formStep < 3) {
      setFormStep(formStep + 1);
    }
  };
  
  // Handle previous step in form
  const handlePrevStep = () => {
    if (formStep > 0) {
      setFormStep(formStep - 1);
    }
  };
  
  // Handle Sign Up Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Basic form validation
    if (!fullName) {
      setError("Please enter your name");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (!password || password.length < 7) {
      setError("Password must be at least 7 characters");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    // Sign Up API Call   
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password
      });
      const { token, user } = response.data;
      
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        setFormStep(4); // Success step
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      setIsLoading(false);
    }
  };

  // Animation variants for framer motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 24
      }
    }
  };
  
  const buttonVariants = {
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 25px rgba(34, 197, 94, 0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.98 }
  };
  
  // Progress indicator with Dr. Doom-inspired design
  const ProgressIndicator = () => (
    <div className="w-full flex justify-center mb-6">
      <div className="flex items-center justify-between w-full max-w-xs relative">
        {[0, 1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div 
              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center 
                ${formStep > step ? 'bg-green-600 border-green-600' : formStep === step ? 'border-green-600' : 'border-gray-300'} 
                transition-all duration-500 ${formStep >= step ? 'shadow-lg shadow-green-200' : ''}`}
            >
              {formStep > step ? (
                <FiCheck className="text-white" />
              ) : (
                <span className={formStep === step ? 'text-green-600 font-medium' : 'text-gray-500'}>
                  {step + 1}
                </span>
              )}
            </div>
            {step < 3 && (
              <div className={`h-0.5 w-16 mt-4 -mx-2 
                ${formStep > step ? 'bg-green-500' : 'bg-gray-200'} 
                transition-all duration-700 absolute left-${8 + step * 16}`}>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
  return (
    <AuthLayout>
      <div className="flex flex-col justify-start h-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <h1 className="text-2xl font-bold mb-1 text-gray-800">
            <span className="text-green-600">S</span>
            <span className="text-green-700">K</span>
            <span className="text-gray-800">'s</span> Expense Tracker
          </h1>
        </motion.div>
        
        <motion.div 
          className="mt-8 md:mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <ProgressIndicator />
          
          <motion.h2 
            className="text-2xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {formStep === 0 && "Begin Your Journey"}
            {formStep === 1 && "Secure Your Access"}
            {formStep === 2 && "Fortify Your Defenses"}
            {formStep === 3 && "Complete Your Dominion"}
            {formStep === 4 && "Kingdom Awaits"}
          </motion.h2>
          
          <motion.p 
            className="text-sm text-gray-600 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {formStep === 0 && "First, tell us who you are"}
            {formStep === 1 && "Add your email for account access"}
            {formStep === 2 && "Create a powerful password worthy of DOOM"}
            {formStep === 3 && "Review your information before proceeding"}
            {formStep === 4 && "Success! Redirecting to your dashboard..."}
          </motion.p>
          
          <motion.form 
            onSubmit={(e) => e.preventDefault()}
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Step 1: Name and Profile */}
            {formStep === 0 && (
              <motion.div className="space-y-5" variants={itemVariants}>
                <motion.div variants={itemVariants}>
                  <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
                </motion.div>
                
                <motion.div className="relative" variants={itemVariants}>
                  <div className={`flex items-center border ${fullNameFocused ? 'border-green-500 shadow-lg shadow-green-100' : 'border-gray-300'} 
                    ${isFullNameValid && fullName.length > 0 ? 'bg-green-50' : ''} rounded-lg overflow-hidden 
                    transition-all duration-300 transform ${fullNameFocused ? 'scale-[1.01]' : 'scale-100'}`}>
                    <div className={`pl-4 py-3 transition-colors duration-300 ${fullNameFocused ? 'text-green-600' : 'text-gray-400'}`}>
                      <FiUser className="w-5 h-5" />
                    </div>
                    <input
                      ref={fullNameRef}
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={() => setFullNameFocused(true)}
                      onBlur={() => setFullNameFocused(false)}
                      placeholder="Your Full Name"
                      className={`flex-1 px-3 py-3 bg-transparent text-gray-800 focus:outline-none placeholder:text-gray-400 
                        transition-all duration-300 ${isFullNameValid && fullName.length > 0 ? 'font-medium' : ''}`}
                    />
                    {isFullNameValid && fullName.length > 0 && (
                      <motion.div 
                        className="pr-4 text-green-500"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                  {fullNameFocused && (
                    <motion.span 
                      className="absolute -top-2 left-4 px-1 text-xs font-medium text-green-600 bg-white"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      Full Name
                    </motion.span>
                  )}
                </motion.div>
                
                <motion.div 
                  className="mt-4"
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <motion.button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full py-3.5 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium 
                      tracking-wide text-sm transition-all duration-300 flex items-center justify-center space-x-2
                      shadow-md hover:shadow-xl hover:shadow-green-200"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    disabled={!isFullNameValid}
                  >
                    <span className="relative">CONTINUE</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
            
            {/* Step 2: Email */}
            {formStep === 1 && (
              <motion.div className="space-y-5" variants={itemVariants}>
                <motion.div className="relative" variants={itemVariants}>
                  <div className={`flex items-center border ${emailFocused ? 'border-green-500 shadow-lg shadow-green-100' : 'border-gray-300'} 
                    ${isEmailValid && email.length > 0 ? 'bg-green-50' : ''} rounded-lg overflow-hidden 
                    transition-all duration-300 transform ${emailFocused ? 'scale-[1.01]' : 'scale-100'}`}>
                    <div className={`pl-4 py-3 transition-colors duration-300 ${emailFocused ? 'text-green-600' : 'text-gray-400'}`}>
                      <FiMail className="w-5 h-5" />
                    </div>
                    <input
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      placeholder="your.email@example.com"
                      className={`flex-1 px-3 py-3 bg-transparent text-gray-800 focus:outline-none placeholder:text-gray-400 
                        transition-all duration-300 ${isEmailValid && email.length > 0 ? 'font-medium' : ''}`}
                    />
                    {isEmailValid && email.length > 0 && (
                      <motion.div 
                        className="pr-4 text-green-500"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                  {emailFocused && (
                    <motion.span 
                      className="absolute -top-2 left-4 px-1 text-xs font-medium text-green-600 bg-white"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      Email Address
                    </motion.span>
                  )}
                </motion.div>
                
                <motion.div 
                  className="flex space-x-3 mt-4"
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <motion.button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-1/4 py-3.5 border border-gray-300 text-gray-700 rounded-lg font-medium 
                      tracking-wide text-sm transition-all duration-300 flex items-center justify-center
                      hover:bg-gray-50 active:scale-95"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleNextStep}
                    className="w-3/4 py-3.5 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium 
                      tracking-wide text-sm transition-all duration-300 flex items-center justify-center space-x-2
                      shadow-md hover:shadow-xl hover:shadow-green-200"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    disabled={!isEmailValid}
                  >
                    <span className="relative">CONTINUE</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
            
            {/* Step 3: Password */}
            {formStep === 2 && (
              <motion.div className="space-y-5" variants={itemVariants}>
                <motion.div className="relative" variants={itemVariants}>
                  <div className={`flex items-center border ${passwordFocused ? 'border-green-500 shadow-lg shadow-green-100' : 'border-gray-300'} 
                    rounded-lg overflow-hidden transition-all duration-300 transform ${passwordFocused ? 'scale-[1.01]' : 'scale-100'}`}>
                    <div className={`pl-4 py-3 transition-colors duration-300 ${passwordFocused ? 'text-green-600' : 'text-gray-400'}`}>
                      <FiLock className="w-5 h-5" />
                    </div>
                    <input
                      ref={passwordRef}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      placeholder="Create powerful password"
                      className={`flex-1 px-3 py-3 bg-transparent text-gray-800 focus:outline-none placeholder:text-gray-400 
                        transition-all duration-300`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`pr-4 transition-colors duration-300 hover:text-green-600 ${passwordFocused ? 'text-green-500' : 'text-gray-400'}`}
                    >
                      {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordFocused && (
                    <motion.span 
                      className="absolute -top-2 left-4 px-1 text-xs font-medium text-green-600 bg-white"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      Password
                    </motion.span>
                  )}
                  
                  {/* Password Strength Indicator - DOOM Themed */}
                  {password.length > 0 && (
                    <motion.div 
                      className="mt-4 space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <div className={`mr-2 p-1 rounded-full bg-${passwordStrength.color}/20`}>
                            <FiShield className={`w-4 h-4 text-${passwordStrength.color}`} />
                          </div>
                          <span className={`text-xs font-bold uppercase tracking-wider text-${passwordStrength.color}`}>
                            {passwordStrength.label} Defense
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 italic">{passwordStrength.message}</span>
                      </div>
                      
                      <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                          className={`absolute top-0 left-0 h-full rounded-full bg-${passwordStrength.color}`}
                          initial={{ width: "0%" }}
                          animate={{ width: passwordStrength.width }}
                          transition={{ duration: 0.5 }}
                        >
                          {/* Animated energy pulse */}
                          <span className={`absolute top-0 right-0 h-full w-6 animate-pulse bg-gradient-to-r from-transparent to-${passwordStrength.color}`}></span>
                        </motion.div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {[
                          { req: password.length > 6, text: "7+ Chars" },
                          { req: /[A-Z]/.test(password), text: "Uppercase" },
                          { req: /[0-9]/.test(password), text: "Number" },
                          { req: /[^A-Za-z0-9]/.test(password), text: "Special" }
                        ].map((item, i) => (
                          <div key={i} className={`flex items-center ${item.req ? 'text-green-600' : 'text-gray-400'}`}>
                            <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeOpacity="0.4" />
                              {item.req && <circle cx="6" cy="6" r="3" fill="currentColor" />}
                            </svg>
                            <span className="text-xs">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
                
                <motion.div 
                  className="flex space-x-3 mt-4"
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <motion.button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-1/4 py-3.5 border border-gray-300 text-gray-700 rounded-lg font-medium 
                      tracking-wide text-sm transition-all duration-300 flex items-center justify-center
                      hover:bg-gray-50 active:scale-95"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleNextStep}
                    className="w-3/4 py-3.5 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium 
                      tracking-wide text-sm transition-all duration-300 flex items-center justify-center space-x-2
                      shadow-md hover:shadow-xl hover:shadow-green-200"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    disabled={password.length < 7 || passwordStrength.score < 3}
                  >
                    <span className="relative">CONTINUE</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
            
            {/* Step 4: Final Review */}
            {formStep === 3 && (
              <motion.div 
                className="space-y-5 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                variants={itemVariants}
              >
                <motion.div
                  className="flex justify-center -mt-10 mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    delay: 0.3
                  }}
                >
                  <div className="relative">
                    {profilePic ? (
                      <img
                        src={URL.createObjectURL(profilePic)}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-green-100"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-500 text-2xl font-bold">
                        {fullName ? fullName.charAt(0).toUpperCase() : "S"}
                      </div>
                    )}
                    <motion.div 
                      className="absolute -right-2 -bottom-2 bg-green-500 text-white p-1.5 rounded-full"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                    >
                      <FiCheck className="w-5 h-5" />
                    </motion.div>
                  </div>
                </motion.div>
                
                <motion.div className="space-y-4" variants={itemVariants}>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800">{fullName}</h3>
                    <p className="text-gray-600">{email}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex items-center">
                      <div className="bg-green-100 p-1.5 rounded-full">
                        <FiUser className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-700">Full Name</span>
                        <p className="text-sm text-gray-600">{fullName}</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex items-center">
                      <div className="bg-green-100 p-1.5 rounded-full">
                        <FiMail className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-700">Email</span>
                        <p className="text-sm text-gray-600">{email}</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex items-center">
                      <div className="bg-green-100 p-1.5 rounded-full">
                        <FiShield className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-700">Password Strength</span>
                        <div className="flex items-center mt-1">
                          <span className={`inline-block w-2 h-2 rounded-full bg-${passwordStrength.color} mr-1`}></span>
                          <span className={`text-xs font-medium text-${passwordStrength.color}`}>{passwordStrength.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div className="pt-4 space-y-3" variants={itemVariants}>
                  <p className="text-xs text-gray-500 text-center">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                  </p>
                  
                  <motion.div className="flex space-x-3">
                    <motion.button
                      type="button"
                      onClick={handlePrevStep}
                      className="w-1/4 py-3.5 border border-gray-300 text-gray-700 rounded-lg font-medium 
                        tracking-wide text-sm transition-all duration-300 flex items-center justify-center
                        hover:bg-gray-50 active:scale-95"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleSignUp}
                      className="w-3/4 py-3.5 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium 
                        tracking-wide text-sm transition-all duration-300 flex items-center justify-center space-x-2
                        shadow-md hover:shadow-xl hover:shadow-green-200"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <>
                          <span className="relative">CREATE ACCOUNT</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                          </svg>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
            
            {/* Step 5: Success */}
            {formStep === 4 && (
              <motion.div 
                className="flex flex-col items-center justify-center py-10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </motion.div>
                
                <motion.h3 
                  className="text-2xl font-bold text-gray-800 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Account Created!
                </motion.h3>
                
                <motion.p 
                  className="text-gray-600 text-center max-w-sm mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Welcome, {fullName}! Your financial command center awaits. Redirecting to your dashboard...
                </motion.p>
                
                <motion.div 
                  className="relative w-full h-1.5 bg-gray-200 rounded-full overflow-hidden"
                  initial={{ width: "80%" }}
                  animate={{ width: "100%" }}
                >
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-green-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.2 }}
                  />
                </motion.div>
              </motion.div>
            )}
            
            {/* Error Display */}
            {error && formStep < 4 && (
              <motion.div 
                className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Login Link */}
            {formStep < 4 && (
              <motion.p 
                className="text-center text-sm text-gray-600 mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                Already have an account?{" "}
                <Link to="/login" className="text-green-600 font-medium hover:text-green-800 
                  transition-all duration-300 hover:underline relative overflow-hidden group inline-flex items-center">
                  <span>Log In</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.p>
            )}
          </motion.form>
        </motion.div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;