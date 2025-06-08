"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import "../styles/BannerSlideshow.css"

const BannerSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { t } = useLanguage()

  const banners = [
    {
      id: 1,
      title: t("sustainableShopping"),
      subtitle: t("shopEcoFriendly"),
      image: "/placeholder.svg?height=400&width=800",
      cta: t("shopNow"),
      bgColor: "bg-green-600",
    },
    {
      id: 2,
      title: t("auctionDeals"),
      subtitle: t("bidOnItems"),
      image: "/placeholder.svg?height=400&width=800",
      cta: t("startBidding"),
      bgColor: "bg-blue-600",
    },
    {
      id: 3,
      title: t("sellYourItems"),
      subtitle: t("earnMoney"),
      image: "/placeholder.svg?height=400&width=800",
      cta: t("startSelling"),
      bgColor: "bg-purple-600",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [banners.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <div className="banner-slideshow">
      <div className="banner-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className={`banner-slide ${banners[currentSlide].bgColor}`}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
          >
            <div className="banner-content">
              <div className="banner-text">
                <motion.h2
                  className="banner-title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {banners[currentSlide].title}
                </motion.h2>
                <motion.p
                  className="banner-subtitle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {banners[currentSlide].subtitle}
                </motion.p>
                <motion.button
                  className="banner-cta"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {banners[currentSlide].cta}
                </motion.button>
              </div>
              <div className="banner-image">
                <img
                  src={banners[currentSlide].image || "/placeholder.svg"}
                  alt={banners[currentSlide].title}
                  className="banner-img"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button className="banner-nav banner-nav-prev" onClick={prevSlide}>
          <ChevronLeft className="banner-nav-icon" />
        </button>
        <button className="banner-nav banner-nav-next" onClick={nextSlide}>
          <ChevronRight className="banner-nav-icon" />
        </button>

        {/* Dots Indicator */}
        <div className="banner-dots">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`banner-dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BannerSlideshow
