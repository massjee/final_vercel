"use client"
import { Bell, Search, User } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useLanguage } from "../context/LanguageContext"
import "../styles/Navbar.css"

const Navbar = () => {
  const { user } = useAuth()
  const { t } = useLanguage()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Search Bar - Hidden on mobile, shown on larger screens */}
        <div className="navbar-search">
          <div className="navbar-search-wrapper">
            <Search className="navbar-search-icon" />
            <input type="text" placeholder={t("searchProducts")} className="navbar-search-input" />
          </div>
        </div>

        {/* Right Side - Notifications and Profile */}
        <div className="navbar-actions">
          {/* Notifications */}
          <button className="navbar-notification-btn">
            <Bell className="navbar-notification-icon" />
            <span className="navbar-notification-badge">3</span>
          </button>

          {/* Profile */}
          <div className="navbar-profile">
            <div className="navbar-profile-avatar">
              <User className="navbar-profile-avatar-icon" />
            </div>
            <div className="navbar-profile-info">
              <p className="navbar-profile-name">{user?.name}</p>
              <p className="navbar-profile-email">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
