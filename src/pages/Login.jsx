"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, Leaf } from "lucide-react"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { useLanguage } from "../context/LanguageContext"
import "../styles/Login.css"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const { login } = useAuth()
  const { t } = useLanguage()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post("/api/auth/login", formData)
      const { token, user } = response.data

      login(token, user)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
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

  return (
    <div className="login-container">
      <motion.div
        className="login-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <motion.div
          className="login-logo"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="login-logo-icon">
            <Leaf className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="login-logo-title">EcoFinds</h1>
          <p className="login-logo-subtitle">{t("sustainableMarketplace")}</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          className="login-form"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="login-form-title">{t("welcomeBack")}</h2>

          {error && (
            <motion.div className="login-error" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label className="login-form-label">{t("email")}</label>
              <div className="login-input-wrapper">
                <Mail className="login-input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="login-input"
                  placeholder={t("enterEmail")}
                  required
                />
              </div>
            </div>

            <div className="login-form-group">
              <label className="login-form-label">{t("password")}</label>
              <div className="login-input-wrapper">
                <Lock className="login-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="login-input"
                  placeholder={t("enterPassword")}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="login-password-toggle">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="login-submit-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? t("signingIn") : t("signIn")}
            </motion.button>
          </form>

          <div className="login-footer">
            <p className="login-footer-text">
              {t("dontHaveAccount")}{" "}
              <Link to="/signup" className="login-footer-link">
                {t("signUp")}
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login
