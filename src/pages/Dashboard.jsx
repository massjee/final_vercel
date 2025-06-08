"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Plus, Search, Filter, Heart, ShoppingCart, MessageCircle, User, Globe, Leaf } from "lucide-react"
import axios from "axios"
import Navbar from "../components/Navbar"
import ProductCard from "../components/ProductCard"
import BannerSlideshow from "../components/BannerSlideshow"
import FilterModal from "../components/FilterModal"
import { useLanguage } from "../context/LanguageContext"
import { useAuth } from "../context/AuthContext"

const Dashboard = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigate = useNavigate()
  const { t, currentLanguage, changeLanguage } = useLanguage()
  const { user } = useAuth()

  const categories = [
    { id: "all", name: t("allCategories"), icon: "🏷️" },
    { id: "electronics", name: t("electronics"), icon: "📱" },
    { id: "clothing", name: t("clothing"), icon: "👕" },
    { id: "furniture", name: t("furniture"), icon: "🪑" },
    { id: "books", name: t("books"), icon: "📚" },
    { id: "sports", name: t("sports"), icon: "⚽" },
    { id: "toys", name: t("toys"), icon: "🧸" },
  ]

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchQuery, selectedCategory])

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products")
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredProducts(filtered)
  }

  const handleProductClick = (product) => {
    if (product.isAuction) {
      navigate(`/auction/${product._id}`)
    } else {
      navigate(`/product/${product._id}`)
    }
  }

  const sidebarItems = [
    { icon: Plus, label: t("sell"), action: () => navigate("/add-product"), highlight: true },
    { icon: Heart, label: t("favorites"), action: () => navigate("/favorites") },
    { icon: ShoppingCart, label: t("cart"), action: () => navigate("/cart") },
    { icon: MessageCircle, label: t("messages"), action: () => navigate("/messages") },
    { icon: User, label: t("profile"), action: () => navigate("/profile") },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <motion.div
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6">
            {/* Logo */}
            <div className="flex items-center mb-8">
              <Leaf className="w-8 h-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">EcoFinds</h1>
            </div>

            {/* Language Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-2" />
                {t("language")}
              </label>
              <select
                value={currentLanguage}
                onChange={(e) => changeLanguage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="gu">ગુજરાતી</option>
              </select>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-2">
              {sidebarItems.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={item.action}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    item.highlight ? "bg-green-600 text-white hover:bg-green-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </motion.button>
              ))}
            </nav>

            {/* User Profile */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-800">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
          >
            <div className="w-6 h-6 flex flex-col justify-center">
              <span className="block w-full h-0.5 bg-gray-600 mb-1"></span>
              <span className="block w-full h-0.5 bg-gray-600 mb-1"></span>
              <span className="block w-full h-0.5 bg-gray-600"></span>
            </div>
          </button>

          <div className="p-4 lg:p-6">
            {/* Search and Filter Bar */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t("searchProducts")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  {t("filters")}
                </button>
              </div>

              {/* Category Tabs */}
              <div className="flex overflow-x-auto space-x-2 mt-4 pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Banner Slideshow */}
            <BannerSlideshow />

            {/* Products Grid */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t("featuredProducts")}</h2>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                      <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <ProductCard product={product} onClick={() => handleProductClick(product)} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">{t("noProductsFound")}</h3>
                  <p className="text-gray-500">{t("tryDifferentSearch")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <FilterModal
          onClose={() => setShowFilters(false)}
          onApplyFilters={(filters) => {
            // Apply filters logic here
            setShowFilters(false)
          }}
        />
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}

export default Dashboard
