# EcoFinds – Sustainable Ecommerce Platform

A comprehensive secondhand marketplace built with React.js frontend, Flask backend, and MongoDB database. EcoFinds promotes sustainable commerce by enabling users to buy and sell pre-owned items through both regular listings and auction mechanisms.

## 🌐 Tech Stack

### Frontend
- **React 18.2.0** with JSX (No TypeScript)
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Router DOM** for navigation
- **Axios** for API communication
- **Vite** as build tool

### Backend
- **Flask (Python)** with JWT authentication
- **MongoDB** for database
- **Flask-CORS** for cross-origin requests

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication** with OTP verification
- 📱 **Responsive Design** for mobile and desktop
- 🌍 **Multi-language Support** (English, Hindi, Gujarati)
- 🔍 **Advanced Search & Filtering**
- ⭐ **User Ratings & Reviews System**
- 💬 **Real-time Chat** between buyers and sellers

### Product Management
- 📦 **Product Listings** with image upload
- 🏷️ **Category-based Organization**
- 🌱 **Eco Score** for sustainability rating
- 📍 **Location-based Filtering**
- 🛒 **Shopping Cart** functionality

### Auction System
- 🔨 **Live Auctions** with real-time bidding
- ⏰ **Countdown Timers** for auction duration
- 💰 **Reserve Price** settings
- 📊 **Bid History** tracking

### Trust & Safety
- 🛡️ **Dispute Resolution** system
- 👨‍💼 **Admin Dashboard** for complaint management
- 🔒 **Secure Transactions**
- 📋 **User Verification** via OTP

## 🚀 Setup Instructions

### Frontend Setup

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd ecofinds-frontend
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Start development server**
\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:5173`

### Backend Setup

1. **Install Python dependencies**
\`\`\`bash
pip install -r requirements.txt
\`\`\`

2. **Set up environment variables**
Create a `.env` file in the backend directory:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/ecofinds
JWT_SECRET_KEY=your-secret-key
FLASK_ENV=development
\`\`\`

3. **Run Flask server**
\`\`\`bash
python app.py
\`\`\`

The API will be available at `http://localhost:5000`

## 📱 Mobile Compatibility

EcoFinds is designed to work seamlessly across all devices:
- **Responsive Design** with Tailwind CSS
- **Touch-friendly Interface** for mobile users
- **Progressive Web App** capabilities
- **Optimized Performance** for slower networks

## 🌍 Multi-language Support

The platform supports three languages:
- **English** (Default)
- **हिंदी** (Hindi)
- **ગુજરાતી** (Gujarati)

Language switching is available in the sidebar and persists across sessions.

## 🔧 Development

### Project Structure
\`\`\`
src/
├── components/          # Reusable UI components
│   ├── SplashScreen.jsx
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── BannerSlideshow.jsx
│   ├── FilterModal.jsx
│   └── OTPVerification.jsx
├── pages/              # Main application pages
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── AddProduct.jsx
│   ├── ProductDetail.jsx
│   ├── AuctionDetail.jsx
│   ├── Chat.jsx
│   ├── Cart.jsx
│   ├── PurchaseHistory.jsx
│   ├── UserProfile.jsx
│   └── AdminDashboard.jsx
├── context/            # React Context providers
│   ├── AuthContext.jsx
│   └── LanguageContext.jsx
├── App.jsx             # Main application component
└── main.jsx           # Application entry point
\`\`\`

### Key Design Principles
- **Component-based Architecture** for reusability
- **Context API** for state management
- **Responsive-first Design** approach
- **Accessibility** considerations throughout
- **Performance Optimization** with lazy loading

## 🎨 UI/UX Features

### Visual Design
- **Green Color Scheme** emphasizing sustainability
- **Smooth Animations** with Framer Motion
- **Card-based Layout** for product displays
- **Intuitive Navigation** with clear visual hierarchy

### Interactive Elements
- **Hover Effects** on interactive components
- **Loading States** for better user feedback
- **Error Handling** with user-friendly messages
- **Form Validation** with real-time feedback

## 🔒 Security Features

- **JWT Token Authentication**
- **OTP Verification** for account security
- **Input Validation** on both frontend and backend
- **CORS Protection** for API security
- **Secure File Upload** handling

## 📊 Performance Optimizations

- **Code Splitting** with React Router
- **Image Optimization** for faster loading
- **Lazy Loading** for components
- **Efficient State Management**
- **Minimal Bundle Size** with tree shaking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for a sustainable future**
