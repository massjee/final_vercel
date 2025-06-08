"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, CreditCard } from "lucide-react"
import axios from "axios"
import { useLanguage } from "../context/LanguageContext"

const Cart = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState({})

  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    try {
      const response = await axios.get("/api/cart")
      setCartItems(response.data.items || [])
    } catch (error) {
      console.error("Error fetching cart items:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    setUpdating((prev) => ({ ...prev, [itemId]: true }))

    try {
      await axios.put(`/api/cart/item/${itemId}`, { quantity: newQuantity })
      setCartItems((prev) => prev.map((item) => (item._id === itemId ? { ...item, quantity: newQuantity } : item)))
    } catch (error) {
      console.error("Error updating quantity:", error)
    } finally {
      setUpdating((prev) => ({ ...prev, [itemId]: false }))
    }
  }

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`/api/cart/item/${itemId}`)
      setCartItems((prev) => prev.filter((item) => item._id !== itemId))
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const handleCheckout = () => {
    navigate("/checkout")
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
          <div className="flex items-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <ShoppingBag className="w-6 h-6 mr-3" />
              {t("shoppingCart")} ({cartItems.length})
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <motion.div className="text-center py-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("emptyCart")}</h2>
            <p className="text-gray-600 mb-8">{t("emptyCartMessage")}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              {t("startShopping")}
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-lg p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image || "/placeholder.svg?height=80&width=80"}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{item.product.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.product.condition}</p>
                      <p className="text-lg font-bold text-green-600">₹{item.product.price.toLocaleString()}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updating[item._id]}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-8 text-center font-semibold">{item.quantity}</span>

                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={updating[item._id]}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm text-gray-600">{t("itemTotal")}</span>
                    <span className="font-bold text-gray-800">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 h-fit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">{t("orderSummary")}</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("subtotal")}</span>
                  <span className="font-semibold">₹{calculateTotal().toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">{t("shipping")}</span>
                  <span className="font-semibold text-green-600">{t("free")}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">{t("tax")}</span>
                  <span className="font-semibold">₹{Math.round(calculateTotal() * 0.18).toLocaleString()}</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800">{t("total")}</span>
                    <span className="text-lg font-bold text-green-600">
                      ₹{Math.round(calculateTotal() * 1.18).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {t("proceedToCheckout")}
              </button>

              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  {t("continueShopping")}
                </button>
              </div>

              {/* Security Info */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 text-center">🔒 {t("secureCheckout")}</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
