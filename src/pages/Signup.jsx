"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, User, Phone, Eye, EyeOff, Leaf } from "lucide-react"
import axios from "axios"
import { useLanguage } from "../context/LanguageContext"
import OTPVerification from "../components/OTPVerification"
import "../styles/Signup.css"

const Signup = () => {
  const [step, setStep] = useState(1) // 1: signup, 2: OTP verification
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const response = await axios.post("/api/auth/signup", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      })

      if (response.data.success) {
        setStep(2) // Move to OTP verification
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleOTPSuccess = () => {
    navigate("/login")
  }

  if (step === 2) {
    return (
      <OTPVerification
        email={formData.email}
        phone={formData.phone}
        onSuccess={handleOTPSuccess}
        onBack={() => setStep(1)}
      />
    )
  }

  return (
    <div className="signup-container">
      <motion.div
        className="signup-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <motion.div
          className="signup-logo"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="signup-logo-icon">
            <Leaf className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="signup-logo-title">EcoFinds</h1>
          <p className="signup-logo-subtitle">{t("sustainableMarketplace")}</p>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          className="signup-form"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="signup-form-title">{t("createAccount")}</h2>

          {error && (
            <motion.div className="signup-error" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="signup-form-group">
              <label className="signup-form-label">{t("fullName")}</label>
              <div className="signup-input-wrapper">
                <User className="signup-input-icon" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="signup-input"
                  placeholder={t("enterFullName")}
                  required
                />
              </div>
            </div>

            <div className="signup-form-group">
              <label className="signup-form-label">{t("email")}</label>
              <div className="signup-input-wrapper">
                <Mail className="signup-input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="signup-input"
                  placeholder={t("enterEmail")}
                  required
                />
              </div>
            </div>

            <div className="signup-form-group">
              <label className="signup-form-label">{t("phoneNumber")}</label>
              <div className="signup-input-wrapper">
                <Phone className="signup-input-icon" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="signup-input"
                  placeholder={t("enterPhoneNumber")}
                  required
                />
              </div>
            </div>

            <div className="signup-form-group">
              <label className="signup-form-label">{t("password")}</label>
              <div className="signup-input-wrapper">
                <Lock className="signup-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="signup-input"
                  placeholder={t("enterPassword")}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="signup-password-toggle">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="signup-form-group">
              <label className="signup-form-label">{t("confirmPassword")}</label>
              <div className="signup-input-wrapper">
                <Lock className="signup-input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="signup-input"
                  placeholder={t("confirmPassword")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="signup-password-toggle"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="signup-submit-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? t("creatingAccount") : t("createAccount")}
            </motion.button>
          </form>

          <div className="signup-footer">
            <p className="signup-footer-text">
              {t("alreadyHaveAccount")}{" "}
              <Link to="/login" className="signup-footer-link">
                {t("signIn")}
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Signup
