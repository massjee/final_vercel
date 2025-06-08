"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import SplashScreen from "./components/SplashScreen"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import AddProduct from "./pages/AddProduct"
import ProductDetail from "./pages/ProductDetail"
import AuctionDetail from "./pages/AuctionDetail"
import Chat from "./pages/Chat"
import Cart from "./pages/Cart"
import PurchaseHistory from "./pages/PurchaseHistory"
import UserProfile from "./pages/UserProfile"
import AdminDashboard from "./pages/AdminDashboard"
import { LanguageProvider } from "./context/LanguageContext"
import { AuthProvider } from "./context/AuthContext"
import "./App.css"

function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-gray-50">
            <AnimatePresence mode="wait">
              {showSplash ? (
                <SplashScreen key="splash" />
              ) : (
                <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/add-product" element={<AddProduct />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/auction/:id" element={<AuctionDetail />} />
                    <Route path="/chat/:sellerId" element={<Chat />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/purchases" element={<PurchaseHistory />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Routes>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
