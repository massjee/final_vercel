"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Gavel, Clock, Eye, User, Star, TrendingUp, AlertCircle } from "lucide-react"
import axios from "axios"
import { useLanguage } from "../context/LanguageContext"
import { useAuth } from "../context/AuthContext"

const AuctionDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { user } = useAuth()

  const [auction, setAuction] = useState(null)
  const [bidAmount, setBidAmount] = useState("")
  const [loading, setLoading] = useState(true)
  const [bidding, setBidding] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState("")
  const [isWatching, setIsWatching] = useState(false)
  const [bidHistory, setBidHistory] = useState([])

  useEffect(() => {
    fetchAuction()
    const interval = setInterval(updateTimeRemaining, 1000)
    return () => clearInterval(interval)
  }, [id])

  const fetchAuction = async () => {
    try {
      const response = await axios.get(`/api/auctions/${id}`)
      setAuction(response.data)
      setBidAmount((response.data.currentBid + response.data.minBidIncrement).toString())
      setBidHistory(response.data.bidHistory || [])
    } catch (error) {
      console.error("Error fetching auction:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateTimeRemaining = () => {
    if (!auction?.endTime) return

    const now = new Date().getTime()
    const endTime = new Date(auction.endTime).getTime()
    const difference = endTime - now

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`)
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`)
      }
    } else {
      setTimeRemaining(t("auctionEnded"))
    }
  }

  const handlePlaceBid = async () => {
    if (!bidAmount || Number.parseFloat(bidAmount) <= auction.currentBid) {
      alert(t("bidMustBeHigher"))
      return
    }

    setBidding(true)
    try {
      const response = await axios.post(`/api/auctions/${id}/bid`, {
        amount: Number.parseFloat(bidAmount),
      })

      if (response.data.success) {
        setAuction((prev) => ({
          ...prev,
          currentBid: Number.parseFloat(bidAmount),
          bidCount: prev.bidCount + 1,
        }))
        setBidAmount((Number.parseFloat(bidAmount) + auction.minBidIncrement).toString())
        fetchAuction() // Refresh to get updated bid history
      }
    } catch (error) {
      console.error("Error placing bid:", error)
      alert(error.response?.data?.message || t("bidFailed"))
    } finally {
      setBidding(false)
    }
  }

  const handleWatchAuction = async () => {
    try {
      await axios.post(`/api/auctions/${id}/watch`)
      setIsWatching(!isWatching)
    } catch (error) {
      console.error("Error watching auction:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("auctionNotFound")}</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            {t("backToDashboard")}
          </button>
        </div>
      </div>
    )
  }

  const isAuctionActive = new Date(auction.endTime) > new Date()
  const images = auction.images || ["/placeholder.svg?height=400&width=400"]

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
              <div className="flex items-center bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                <Gavel className="w-4 h-4 mr-1" />
                {t("liveAuction")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="aspect-video">
                <img
                  src={images[0] || "/placeholder.svg?height=400&width=600"}
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Product Information */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">{auction.title}</h1>
              <p className="text-gray-600 leading-relaxed mb-6">{auction.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">{t("condition")}</p>
                  <p className="font-semibold">{auction.condition || t("likeNew")}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">{t("category")}</p>
                  <p className="font-semibold">{auction.category || t("electronics")}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">{t("startingPrice")}</p>
                  <p className="font-semibold">₹{auction.startingPrice?.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">{t("reservePrice")}</p>
                  <p className="font-semibold">
                    {auction.reservePrice ? `₹${auction.reservePrice.toLocaleString()}` : t("none")}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Bid History */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                {t("bidHistory")}
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {bidHistory.length > 0 ? (
                  bidHistory.map((bid, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{bid.bidder?.name || "Anonymous"}</p>
                          <p className="text-sm text-gray-600">{new Date(bid.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹{bid.amount.toLocaleString()}</p>
                        {index === 0 && (
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                            {t("highestBid")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">{t("noBidsYet")}</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Bidding Panel */}
          <div className="space-y-6">
            {/* Current Bid & Timer */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-2">{t("currentBid")}</p>
                <p className="text-3xl font-bold text-green-600">₹{auction.currentBid?.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {auction.bidCount || 0} {t("bids")}
                </p>
              </div>

              <div className="bg-red-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-red-600 mr-2" />
                  <span className="font-semibold text-red-600">{t("timeRemaining")}</span>
                </div>
                <p className="text-center text-2xl font-bold text-red-600">{timeRemaining}</p>
              </div>

              {isAuctionActive && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("yourBid")}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="0"
                        min={auction.currentBid + auction.minBidIncrement}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {t("minimumBid")}: ₹{(auction.currentBid + auction.minBidIncrement).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={handlePlaceBid}
                    disabled={bidding || !bidAmount}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Gavel className="w-5 h-5 mr-2" />
                    {bidding ? t("placingBid") : t("placeBid")}
                  </button>

                  <button
                    onClick={handleWatchAuction}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                      isWatching
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    {isWatching ? t("watching") : t("watchAuction")}
                  </button>
                </div>
              )}

              {!isAuctionActive && (
                <div className="text-center">
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="font-semibold text-gray-700">{t("auctionEnded")}</p>
                  </div>
                  {auction.winner && (
                    <p className="text-sm text-gray-600">
                      {t("winner")}: {auction.winner.name}
                    </p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Seller Information */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("seller")}</h3>

              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{auction.seller?.name || "Anonymous Seller"}</p>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-600">
                      {auction.seller?.rating || "4.5"} ({auction.seller?.reviewCount || "23"} {t("reviews")})
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  • {t("memberSince")} {new Date(auction.seller?.joinDate || Date.now()).getFullYear()}
                </p>
                <p>
                  • {auction.seller?.totalSales || "15"} {t("successfulSales")}
                </p>
                <p>
                  • {t("responseTime")}: {auction.seller?.responseTime || "< 1 hour"}
                </p>
              </div>
            </motion.div>

            {/* Safety Tips */}
            <motion.div
              className="bg-blue-50 rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-semibold text-blue-800 mb-3">{t("auctionTips")}</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• {t("setBidLimit")}</li>
                <li>• {t("readDescription")}</li>
                <li>• {t("checkSellerRating")}</li>
                <li>• {t("askQuestions")}</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionDetail
