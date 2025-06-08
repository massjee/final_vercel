"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Star,
  Package,
  Heart,
  MessageCircle,
  LogOut,
} from "lucide-react"
import axios from "axios"
import { useLanguage } from "../context/LanguageContext"
import { useAuth } from "../context/AuthContext"

const UserProfile = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { user, logout } = useAuth()

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    avatar: null,
  })
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({
    totalListings: 0,
    totalSales: 0,
    rating: 0,
    reviewCount: 0,
  })

  useEffect(() => {
    fetchProfile()
    fetchStats()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/profile")
      setProfile(response.data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get("/api/profile/stats")
      setStats(response.data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const formData = new FormData()
      Object.keys(profile).forEach((key) => {
        if (profile[key] !== null) {
          formData.append(key, profile[key])
        }
      })

      const response = await axios.put("/api/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setProfile(response.data)
      setEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfile((prev) => ({ ...prev, avatar: file }))
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">{t("myProfile")}</h1>
            </div>

            <div className="flex items-center space-x-3">
              {editing ? (
                <>
                  <button
                    onClick={() => setEditing(false)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? t("saving") : t("save")}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {t("edit")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-6 mb-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center overflow-hidden">
                    {profile.avatar ? (
                      <img
                        src={typeof profile.avatar === "string" ? profile.avatar : URL.createObjectURL(profile.avatar)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>

                  {editing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                      <Camera className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>

                {/* Name and Rating */}
                <div className="flex-1">
                  {editing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                      className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-gray-300 focus:border-green-500 outline-none w-full"
                      placeholder={t("fullName")}
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
                  )}

                  <div className="flex items-center mt-2">
                    <Star className="w-5 h-5 text-yellow-500 mr-1" />
                    <span className="font-semibold">{stats.rating.toFixed(1)}</span>
                    <span className="text-gray-600 ml-2">
                      ({stats.reviewCount} {t("reviews")})
                    </span>
                  </div>

                  <div className="flex items-center mt-1">
                    <Shield className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">{t("verifiedUser")}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  {editing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:border-green-500 outline-none py-1"
                      placeholder={t("email")}
                    />
                  ) : (
                    <span className="text-gray-700">{profile.email}</span>
                  )}
                </div>

                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  {editing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:border-green-500 outline-none py-1"
                      placeholder={t("phoneNumber")}
                    />
                  ) : (
                    <span className="text-gray-700">{profile.phone}</span>
                  )}
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                  {editing ? (
                    <textarea
                      value={profile.address}
                      onChange={(e) => setProfile((prev) => ({ ...prev, address: e.target.value }))}
                      className="flex-1 bg-transparent border-b border-gray-300 focus:border-green-500 outline-none py-1 resize-none"
                      placeholder={t("address")}
                      rows="2"
                    />
                  ) : (
                    <span className="text-gray-700">{profile.address || t("noAddressProvided")}</span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("about")}</h3>
              {editing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder={t("tellAboutYourself")}
                  rows="4"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{profile.bio || t("noBioProvided")}</p>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("statistics")}</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">{t("totalListings")}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{stats.totalListings}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-600 mr-3" />
                    <span className="text-gray-700">{t("totalSales")}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{stats.totalSales}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 text-red-600 mr-3" />
                    <span className="text-gray-700">{t("favorites")}</span>
                  </div>
                  <span className="font-semibold text-gray-800">12</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageCircle className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">{t("messages")}</span>
                  </div>
                  <span className="font-semibold text-gray-800">5</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("quickActions")}</h3>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/add-product")}
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Package className="w-5 h-5 mr-2" />
                  {t("addNewListing")}
                </button>

                <button
                  onClick={() => navigate("/purchases")}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Star className="w-5 h-5 mr-2" />
                  {t("viewPurchases")}
                </button>

                <button
                  onClick={() => navigate("/favorites")}
                  className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  {t("viewFavorites")}
                </button>
              </div>
            </motion.div>

            {/* Logout */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                {t("logout")}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
