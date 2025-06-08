"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Users, Package, AlertTriangle, TrendingUp, Search, Eye, CheckCircle, XCircle } from "lucide-react"
import axios from "axios"
import { useLanguage } from "../context/LanguageContext"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const [activeTab, setActiveTab] = useState("overview")
  const [complaints, setComplaints] = useState([])
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, complaintsRes, usersRes, productsRes] = await Promise.all([
        axios.get("/api/admin/stats"),
        axios.get("/api/admin/complaints"),
        axios.get("/api/admin/users"),
        axios.get("/api/admin/products"),
      ])

      setStats(statsRes.data)
      setComplaints(complaintsRes.data)
      setUsers(usersRes.data)
      setProducts(productsRes.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplaintAction = async (complaintId, action, assignee = null) => {
    try {
      await axios.put(`/api/admin/complaints/${complaintId}`, {
        action,
        assignee,
      })

      // Refresh complaints
      const response = await axios.get("/api/admin/complaints")
      setComplaints(response.data)
    } catch (error) {
      console.error("Error updating complaint:", error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">{t("adminDashboard")}</h1>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { key: "overview", label: t("overview") },
                { key: "complaints", label: t("complaints") },
                { key: "users", label: t("users") },
                { key: "products", label: t("products") },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    activeTab === tab.key ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">{t("totalUsers")}</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">{t("totalProducts")}</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">{t("pendingComplaints")}</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.pendingComplaints}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">{t("resolvedComplaints")}</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.resolvedComplaints}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("recentActivity")}</h3>
              <div className="space-y-4">
                {complaints.slice(0, 5).map((complaint, index) => (
                  <div key={complaint._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{complaint.title}</p>
                      <p className="text-sm text-gray-600">
                        {t("reportedBy")} {complaint.reporter.name} •{" "}
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(complaint.status)}`}
                    >
                      {t(complaint.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Complaints Tab */}
        {activeTab === "complaints" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t("searchComplaints")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">{t("allStatuses")}</option>
                  <option value="pending">{t("pending")}</option>
                  <option value="in-progress">{t("inProgress")}</option>
                  <option value="resolved">{t("resolved")}</option>
                  <option value="rejected">{t("rejected")}</option>
                </select>
              </div>
            </div>

            {/* Complaints List */}
            <div className="space-y-4">
              {filteredComplaints.map((complaint, index) => (
                <motion.div
                  key={complaint._id}
                  className="bg-white rounded-2xl shadow-lg p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{complaint.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(complaint.status)}`}
                        >
                          {t(complaint.status)}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-3">{complaint.description}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          {t("reportedBy")}: {complaint.reporter.name}
                        </span>
                        <span>
                          {t("date")}: {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                        {complaint.assignee && (
                          <span>
                            {t("assignedTo")}: {complaint.assignee.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        /* View details */
                      }}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {t("viewDetails")}
                    </button>

                    {complaint.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleComplaintAction(complaint._id, "accept")}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {t("accept")}
                        </button>

                        <button
                          onClick={() => handleComplaintAction(complaint._id, "reject")}
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          {t("reject")}
                        </button>
                      </>
                    )}

                    {complaint.status === "in-progress" && (
                      <button
                        onClick={() => handleComplaintAction(complaint._id, "resolve")}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {t("markResolved")}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-6">{t("userManagement")}</h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("name")}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("email")}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("joinDate")}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("status")}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? t("active") : t("inactive")}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 mr-3">{t("view")}</button>
                        <button className="text-red-600 hover:text-red-800">
                          {user.isActive ? t("suspend") : t("activate")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-6">{t("productManagement")}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div key={product._id} className="border border-gray-200 rounded-lg p-4">
                  <img
                    src={product.image || "/placeholder.svg?height=200&width=300"}
                    alt={product.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-semibold text-gray-800 mb-2">{product.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">₹{product.price?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mb-3">
                    {t("seller")}: {product.seller?.name}
                  </p>

                  <div className="flex space-x-2">
                    <button className="flex-1 text-xs bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                      {t("view")}
                    </button>
                    <button className="flex-1 text-xs bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors">
                      {t("remove")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
