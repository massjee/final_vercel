"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Heart,
  Share2,
  MessageCircle,
  Star,
  MapPin,
  Shield,
  Truck,
  Calendar,
  User,
  Flag,
} from "lucide-react"
import axios from "axios"
import { useLanguage } from "../context/LanguageContext"
import { useAuth } from "../context/AuthContext"

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`)
      setProduct(response.data)
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    try {
      await axios.post("/api/cart/add", { productId: id })
      // Show success message
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const handleToggleFavorite = async () => {
    try {
      await axios.post(`/api/favorites/toggle`, { productId: id })
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const handleChatWithSeller = () => {
    navigate(`/chat/${product.seller._id}`)
  }

  const getEcoScore = (score) => {
    if (score >= 80) return { color: "text-green-600", bg: "bg-green-100", label: t("excellent") }
    if (score >= 60) return { color: "text-yellow-600", bg: "bg-yellow-100", label: t("good") }
    return { color: "text-orange-600", bg: "bg-orange-100", label: t("fair") }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("productNotFound")}</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            {t("backToDashboard")}
          </button>
        </div>
      </div>
    )
  }

  const ecoScore = getEcoScore(product.ecoScore || 75)
  const images = product.images || ["/placeholder.svg?height=400&width=400"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t("back")}
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
              </button>

              <button className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowReportModal(true)}
                className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Flag className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-square">
                <img
                  src={images[selectedImage] || "/placeholder.svg?height=500&width=500"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? "border-green-600" : "border-gray-200"
                        }`}
                      >
                        <img
                          src={image || "/placeholder.svg?height=64&width=64"}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Title and Price */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">{product.title}</h1>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${ecoScore.bg} ${ecoScore.color}`}>
                  🌱 {product.ecoScore || 75}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-green-600">₹{product.price?.toLocaleString()}</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {product.condition || t("likeNew")}
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Seller Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("sellerInformation")}</h3>

              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{product.seller?.name || "Anonymous Seller"}</p>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-600">
                      {product.seller?.rating || "4.5"} ({product.seller?.reviewCount || "23"} {t("reviews")})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{product.location || "Mumbai, India"}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-6">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {t("listedOn")} {new Date(product.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>

              <button
                onClick={handleChatWithSeller}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {t("chatWithSeller")}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  {t("addToCart")}
                </button>

                <button className="bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                  {t("buyNow")}
                </button>
              </div>
            </div>

            {/* Safety Information */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <div className="flex items-center mb-3">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">{t("safetyTips")}</h3>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• {t("meetInPublicPlace")}</li>
                <li>• {t("inspectBeforePaying")}</li>
                <li>• {t("useSecurePayment")}</li>
                <li>• {t("reportSuspiciousActivity")}</li>
              </ul>
            </div>

            {/* Delivery Information */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center mb-3">
                <Truck className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-800">{t("deliveryOptions")}</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• {t("pickupAvailable")}</p>
                <p>• {t("localDelivery")} (₹50-100)</p>
                <p>
                  • {t("shippingAvailable")} ({t("chargesApply")})
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("reportListing")}</h3>
              <p className="text-gray-600 mb-4">{t("reportListingDescription")}</p>

              <div className="space-y-3 mb-6">
                {[
                  t("inappropriateContent"),
                  t("suspiciousActivity"),
                  t("incorrectInformation"),
                  t("prohibitedItem"),
                  t("other"),
                ].map((reason, index) => (
                  <label key={index} className="flex items-center">
                    <input type="radio" name="reportReason" className="mr-3" />
                    <span className="text-gray-700">{reason}</span>
                  </label>
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={() => {
                    // Handle report submission
                    setShowReportModal(false)
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t("submitReport")}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
