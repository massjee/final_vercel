"use client"
import { motion } from "framer-motion"
import { Heart, Star, Clock, MapPin, Gavel } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import "../styles/ProductCard.css"

const ProductCard = ({ product, onClick }) => {
  const { t } = useLanguage()

  const getEcoScore = (score) => {
    if (score >= 80) return { color: "excellent", label: t("excellent") }
    if (score >= 60) return { color: "good", label: t("good") }
    return { color: "fair", label: t("fair") }
  }

  const ecoScore = getEcoScore(product.ecoScore || 75)

  return (
    <motion.div
      className="product-card"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="product-card-image-container">
        <img
          src={product.image || "/placeholder.svg?height=200&width=300"}
          alt={product.title}
          className="product-card-image"
        />

        {/* Auction Badge */}
        {product.isAuction && (
          <div className="product-card-auction-badge">
            <Gavel className="product-card-auction-icon" />
            {t("auction")}
          </div>
        )}

        {/* Eco Score Badge */}
        <div className={`product-card-eco-badge ${ecoScore.color}`}>🌱 {product.ecoScore || 75}</div>

        {/* Favorite Button */}
        <button
          className="product-card-favorite-btn"
          onClick={(e) => {
            e.stopPropagation()
            // Handle favorite toggle
          }}
        >
          <Heart className="product-card-favorite-icon" />
        </button>
      </div>

      {/* Content */}
      <div className="product-card-content">
        <h3 className="product-card-title">{product.title}</h3>

        <p className="product-card-description">{product.description}</p>

        {/* Price and Auction Info */}
        <div className="product-card-price-section">
          {product.isAuction ? (
            <div>
              <div className="product-card-auction-info">
                <span className="product-card-current-bid">₹{product.currentBid || product.startingPrice}</span>
                <span className="product-card-bid-count">
                  {product.bidCount || 0} {t("bids")}
                </span>
              </div>
              <div className="product-card-time-remaining">
                <Clock className="product-card-time-icon" />
                {product.timeRemaining || "2d 5h"}
              </div>
            </div>
          ) : (
            <span className="product-card-price">₹{product.price}</span>
          )}
        </div>

        {/* Seller Info */}
        <div className="product-card-seller-info">
          <div className="product-card-seller">
            <div className="product-card-seller-avatar"></div>
            <span>{product.seller?.name || "Anonymous"}</span>
          </div>
          <div className="product-card-rating">
            <Star className="product-card-rating-icon" />
            <span>{product.seller?.rating || "4.5"}</span>
          </div>
        </div>

        {/* Location */}
        <div className="product-card-location">
          <MapPin className="product-card-location-icon" />
          <span>{product.location || "Mumbai, India"}</span>
        </div>

        {/* Condition */}
        <div className="product-card-condition">
          <span className="product-card-condition-badge">{product.condition || t("likeNew")}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
