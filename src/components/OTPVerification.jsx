"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Mail, Phone, RefreshCw } from "lucide-react"
import axios from "axios"
import { useLanguage } from "../context/LanguageContext"
import "../styles/OTPVerification.css"

const OTPVerification = ({ email, phone, onSuccess, onBack }) => {
  const [otpData, setOtpData] = useState({
    emailOTP: "",
    phoneOTP: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const { t } = useLanguage()

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post("/api/auth/verify-otp", {
        email,
        phone,
        emailOTP: otpData.emailOTP,
        phoneOTP: otpData.phoneOTP,
      })

      if (response.data.success) {
        onSuccess()
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    try {
      await axios.post("/api/auth/resend-otp", { email, phone })
      setResendTimer(60)
      setCanResend(false)
    } catch (err) {
      setError("Failed to resend OTP")
    }
  }

  const handleChange = (e) => {
    setOtpData({
      ...otpData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="otp-container">
      <motion.div
        className="otp-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="otp-form"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Header */}
          <div className="otp-header">
            <button onClick={onBack} className="otp-back-btn">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="otp-title">{t("verifyAccount")}</h2>
          </div>

          <p className="otp-description">{t("otpSentMessage")}</p>

          {error && (
            <motion.div className="otp-error" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="otp-form-content">
            {/* Email OTP */}
            <div className="otp-form-group">
              <label className="otp-form-label">
                <Mail className="otp-label-icon" />
                {t("emailOTP")}
              </label>
              <input
                type="text"
                name="emailOTP"
                value={otpData.emailOTP}
                onChange={handleChange}
                className="otp-input"
                placeholder="000000"
                maxLength="6"
                required
              />
              <p className="otp-input-info">
                {t("sentTo")} {email}
              </p>
            </div>

            {/* Phone OTP */}
            <div className="otp-form-group">
              <label className="otp-form-label">
                <Phone className="otp-label-icon" />
                {t("phoneOTP")}
              </label>
              <input
                type="text"
                name="phoneOTP"
                value={otpData.phoneOTP}
                onChange={handleChange}
                className="otp-input"
                placeholder="000000"
                maxLength="6"
                required
              />
              <p className="otp-input-info">
                {t("sentTo")} {phone}
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="otp-submit-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? t("verifying") : t("verifyAccount")}
            </motion.button>
          </form>

          {/* Resend OTP */}
          <div className="otp-resend-section">
            <p className="otp-resend-text">{t("didntReceiveOTP")}</p>
            <button onClick={handleResend} disabled={!canResend} className="otp-resend-btn">
              <RefreshCw className="otp-resend-icon" />
              {canResend ? t("resendOTP") : `${t("resendIn")} ${resendTimer}s`}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default OTPVerification
