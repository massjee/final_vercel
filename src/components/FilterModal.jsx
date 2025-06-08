"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Filter, DollarSign, MapPin, Star, Calendar } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import "../styles/FilterModal.css"

const FilterModal = ({ onClose, onApplyFilters }) => {
  const { t } = useLanguage()
  const [filters, setFilters] = useState({
    priceRange: { min: "", max: "" },
    condition: "",
    location: "",
    rating: "",
    datePosted: "",
    category: "",
    isAuction: false,
    ecoScore: "",
  })

  const conditions = [
    { value: "", label: t("anyCondition") },
    { value: "new", label: t("new") },
    { value: "like-new", label: t("likeNew") },
    { value: "good", label: t("good") },
    { value: "fair", label: t("fair") },
    { value: "poor", label: t("poor") },
  ]

  const dateOptions = [
    { value: "", label: t("anytime") },
    { value: "today", label: t("today") },
    { value: "week", label: t("thisWeek") },
    { value: "month", label: t("thisMonth") },
  ]

  const ratingOptions = [
    { value: "", label: t("anyRating") },
    { value: "4", label: "4+ ⭐" },
    { value: "3", label: "3+ ⭐" },
    { value: "2", label: "2+ ⭐" },
  ]

  const ecoScoreOptions = [
    { value: "", label: t("anyEcoScore") },
    { value: "80", label: "80+ (Excellent)" },
    { value: "60", label: "60+ (Good)" },
    { value: "40", label: "40+ (Fair)" },
  ]

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handlePriceChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value,
      },
    }))
  }

  const handleApply = () => {
    onApplyFilters(filters)
    onClose()
  }

  const handleReset = () => {
    setFilters({
      priceRange: { min: "", max: "" },
      condition: "",
      location: "",
      rating: "",
      datePosted: "",
      category: "",
      isAuction: false,
      ecoScore: "",
    })
  }

  return (
    <AnimatePresence>
      <div className="filter-modal-overlay" onClick={onClose}>
        <motion.div
          className="filter-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="filter-modal-header">
            <div className="filter-modal-title">
              <Filter className="filter-modal-title-icon" />
              <h2>{t("filters")}</h2>
            </div>
            <button className="filter-modal-close" onClick={onClose}>
              <X className="filter-modal-close-icon" />
            </button>
          </div>

          {/* Content */}
          <div className="filter-modal-content">
            {/* Price Range */}
            <div className="filter-section">
              <label className="filter-label">
                <DollarSign className="filter-label-icon" />
                {t("priceRange")}
              </label>
              <div className="filter-price-inputs">
                <input
                  type="number"
                  placeholder={t("minPrice")}
                  value={filters.priceRange.min}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  className="filter-input"
                />
                <span className="filter-price-separator">-</span>
                <input
                  type="number"
                  placeholder={t("maxPrice")}
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>

            {/* Condition */}
            <div className="filter-section">
              <label className="filter-label">{t("condition")}</label>
              <select
                value={filters.condition}
                onChange={(e) => handleFilterChange("condition", e.target.value)}
                className="filter-select"
              >
                {conditions.map((condition) => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="filter-section">
              <label className="filter-label">
                <MapPin className="filter-label-icon" />
                {t("location")}
              </label>
              <input
                type="text"
                placeholder={t("enterLocation")}
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="filter-input"
              />
            </div>

            {/* Seller Rating */}
            <div className="filter-section">
              <label className="filter-label">
                <Star className="filter-label-icon" />
                {t("sellerRating")}
              </label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
                className="filter-select"
              >
                {ratingOptions.map((rating) => (
                  <option key={rating.value} value={rating.value}>
                    {rating.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Posted */}
            <div className="filter-section">
              <label className="filter-label">
                <Calendar className="filter-label-icon" />
                {t("datePosted")}
              </label>
              <select
                value={filters.datePosted}
                onChange={(e) => handleFilterChange("datePosted", e.target.value)}
                className="filter-select"
              >
                {dateOptions.map((date) => (
                  <option key={date.value} value={date.value}>
                    {date.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Eco Score */}
            <div className="filter-section">
              <label className="filter-label">🌱 {t("ecoScore")}</label>
              <select
                value={filters.ecoScore}
                onChange={(e) => handleFilterChange("ecoScore", e.target.value)}
                className="filter-select"
              >
                {ecoScoreOptions.map((score) => (
                  <option key={score.value} value={score.value}>
                    {score.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Auction Only */}
            <div className="filter-section">
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.isAuction}
                  onChange={(e) => handleFilterChange("isAuction", e.target.checked)}
                  className="filter-checkbox"
                />
                <span>{t("auctionItemsOnly")}</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="filter-modal-footer">
            <button className="filter-btn filter-btn-reset" onClick={handleReset}>
              {t("reset")}
            </button>
            <button className="filter-btn filter-btn-apply" onClick={handleApply}>
              {t("applyFilters")}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default FilterModal
