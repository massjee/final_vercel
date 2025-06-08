"use client"
import { motion } from "framer-motion"
import { Leaf, Recycle } from "lucide-react"
import "../styles/SplashScreen.css"

const SplashScreen = () => {
  return (
    <motion.div
      className="splash-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="splash-content"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
      >
        <motion.div
          className="splash-logo"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <div className="splash-logo-icon">
            <Leaf className="w-16 h-16 text-white" />
            <Recycle className="w-8 h-8 splash-logo-secondary" />
          </div>
        </motion.div>

        <motion.h1
          className="splash-title"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          EcoFinds
        </motion.h1>

        <motion.p
          className="splash-subtitle"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Sustainable Ecommerce Platform
        </motion.p>

        <motion.div
          className="splash-loader"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="splash-loader-bar"></div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default SplashScreen
