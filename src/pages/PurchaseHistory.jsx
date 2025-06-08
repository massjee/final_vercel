"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Package, Star, MessageCircle, RotateCcw, Download } from "lucide-react"
import axios from "axios"
import { useLanguage } from "../context/LanguageContext"

const PurchaseHistory = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all") // all, delivered, pending, cancelled
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState(null)

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    try {
      const response = await axios.get("/api/purchases")
      setPurchases(response.data.purchases || [])
    } catch (error) {
      console.error("Error fetching purchases:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPurchases = purchases.filter((purchase) => {
    if (filter === "all") return true
    return purchase.status === filter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleReviewSubmit = async (rating, comment) => {
    try {
      await axios.post(`/api/purchases/${selectedPurchase._id}/review`, {
        rating,
        comment,
      })

      // Update purchase status
      setPurchases((prev) =>
        prev.map((purchase) => (purchase._id === selectedPurchase._id ? { ...purchase, hasReview: true } : purchase)),
      )

      setShowReviewModal(false)
      setSelectedPurchase(null)
    } catch (error) {
      console.error("Error submitting review:", error)
    }
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
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Package className="w-6 h-6 mr-3" />
                {t("purchaseHistory")}
              </h1>
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              {[
                { key: "all", label: t("all") },
                { key: "delivered", label: t("delivered") },
                { key: "pending", label: t("pending") },
                { key: "cancelled", label: t("cancelled") },
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === filterOption.key
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {filteredPurchases.length === 0 ? (
          <motion.div className="text-center py-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("noPurchases")}</h2>
            <p className="text-gray-600 mb-8">{t("noPurchasesMessage")}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              {t("startShopping")}
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredPurchases.map((purchase, index) => (
              <motion.div
                key={purchase._id}
                className="bg-white rounded-2xl shadow-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {t("order")} #{purchase.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t("orderedOn")} {new Date(purchase.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(purchase.status)}`}>
                      {t(purchase.status)}
                    </span>
                    <span className="text-lg font-bold text-green-600">₹{purchase.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {purchase.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image || "/placeholder.svg?height=64&width=64"}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.product.title}</h4>
                        <p className="text-sm text-gray-600">{item.product.condition}</p>
                        <p className="text-sm text-gray-600">
                          {t("quantity")}: {item.quantity} × ₹{item.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {purchase.status === "delivered" && !purchase.hasReview && (
                    <button
                      onClick={() => {
                        setSelectedPurchase(purchase)
                        setShowReviewModal(true)
                      }}
                      className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      {t("writeReview")}
                    </button>
                  )}

                  <button
                    onClick={() => navigate(`/chat/${purchase.seller._id}`)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {t("contactSeller")}
                  </button>

                  {purchase.status === "delivered" && (
                    <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {t("buyAgain")}
                    </button>
                  )}

                  <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    {t("downloadInvoice")}
                  </button>
                </div>

                {/* Tracking Info */}
                {purchase.trackingNumber && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>{t("trackingNumber")}:</strong> {purchase.trackingNumber}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      {t("estimatedDelivery")}: {new Date(purchase.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedPurchase && (
        <ReviewModal
          purchase={selectedPurchase}
          onClose={() => {
            setShowReviewModal(false)
            setSelectedPurchase(null)
          }}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  )
}

// Review Modal Component
const ReviewModal = ({ purchase, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { t } = useLanguage()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) return

    setSubmitting(true)
    try {
      await onSubmit(rating, comment)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("writeReview")}</h3>

          <form onSubmit={handleSubmit}>
            {/* Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("rating")}</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1 transition-colors ${
                      rating >= star ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"
                    }`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("comment")}</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t("shareYourExperience")}
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                disabled={rating === 0 || submitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? t("submitting") : t("submitReview")}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default PurchaseHistory
