"use client"
import { createContext, useContext, useState } from "react"

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

const translations = {
  en: {
    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    search: "Search",
    filter: "Filter",
    filters: "Filters",
    reset: "Reset",
    apply: "Apply",
    applyFilters: "Apply Filters",
    language: "Language",

    // Navigation
    home: "Home",
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",

    // Product related
    products: "Products",
    product: "Product",
    featuredProducts: "Featured Products",
    searchProducts: "Search products...",
    noProductsFound: "No products found",
    tryDifferentSearch: "Try a different search term",
    addNewProduct: "Add New Product",
    productTitle: "Product Title",
    enterProductTitle: "Enter product title",
    productDescription: "Product Description",
    enterProductDescription: "Enter product description",
    productImages: "Product Images",
    clickToUploadImages: "Click to upload images",
    supportedFormats: "PNG, JPG, GIF up to 10MB",

    // Categories
    allCategories: "All Categories",
    electronics: "Electronics",
    clothing: "Clothing",
    furniture: "Furniture",
    books: "Books",
    sports: "Sports",
    toys: "Toys",
    homeGarden: "Home & Garden",
    automotive: "Automotive",
    selectCategory: "Select Category",
    category: "Category",

    // Conditions
    condition: "Condition",
    selectCondition: "Select Condition",
    new: "New",
    likeNew: "Like New",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
    anyCondition: "Any Condition",

    // Pricing
    price: "Price",
    priceRange: "Price Range",
    minPrice: "Min Price",
    maxPrice: "Max Price",

    // Location
    location: "Location",
    enterLocation: "Enter location",

    // Auction
    auction: "Auction",
    auctions: "Auctions",
    enableAuction: "Enable Auction",
    auctionSettings: "Auction Settings",
    startingPrice: "Starting Price",
    reservePrice: "Reserve Price",
    optional: "Optional",
    auctionDuration: "Auction Duration",
    day: "Day",
    days: "Days",
    currentBid: "Current Bid",
    bids: "Bids",
    bidNow: "Bid Now",
    placeBid: "Place Bid",
    auctionItemsOnly: "Auction Items Only",

    // User actions
    sell: "Sell",
    buy: "Buy",
    bid: "Bid",
    favorites: "Favorites",
    cart: "Cart",
    messages: "Messages",

    // Ratings and reviews
    rating: "Rating",
    sellerRating: "Seller Rating",
    anyRating: "Any Rating",
    excellent: "Excellent",

    // Time
    datePosted: "Date Posted",
    anytime: "Anytime",
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",

    // Eco features
    ecoScore: "Eco Score",
    anyEcoScore: "Any Eco Score",
    sustainableShopping: "Sustainable Shopping",
    shopEcoFriendly: "Shop eco-friendly products",

    // Actions
    shopNow: "Shop Now",
    startBidding: "Start Bidding",
    startSelling: "Start Selling",
    sellYourItems: "Sell Your Items",
    earnMoney: "Earn money from unused items",
    auctionDeals: "Auction Deals",
    bidOnItems: "Bid on unique items",

    // Forms
    createListing: "Create Listing",
    createAuction: "Create Auction",
    creatingListing: "Creating Listing...",
    description: "Description",
  },

  hi: {
    // Common
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफलता",
    cancel: "रद्द करें",
    save: "सेव करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    search: "खोजें",
    filter: "फिल्टर",
    filters: "फिल्टर",
    reset: "रीसेट",
    apply: "लागू करें",
    applyFilters: "फिल्टर लागू करें",
    language: "भाषा",

    // Navigation
    home: "होम",
    dashboard: "डैशबोर्ड",
    profile: "प्रोफाइल",
    settings: "सेटिंग्स",
    logout: "लॉगआउट",

    // Product related
    products: "उत्पाद",
    product: "उत्पाद",
    featuredProducts: "फीचर्ड उत्पाद",
    searchProducts: "उत्पाद खोजें...",
    noProductsFound: "कोई उत्पाद नहीं मिला",
    tryDifferentSearch: "अलग खोज शब्द आज़माएं",
    addNewProduct: "नया उत्पाद जोड़ें",
    productTitle: "उत्पाद शीर्षक",
    enterProductTitle: "उत्पाद शीर्षक दर्ज करें",
    productDescription: "उत्पाद विवरण",
    enterProductDescription: "उत्पाद विवरण दर्ज करें",
    productImages: "उत्पाद चित्र",
    clickToUploadImages: "चित्र अपलोड करने के लिए क्लिक करें",
    supportedFormats: "PNG, JPG, GIF 10MB तक",

    // Categories
    allCategories: "सभी श्रेणियां",
    electronics: "इलेक्ट्रॉनिक्स",
    clothing: "कपड़े",
    furniture: "फर्नीचर",
    books: "किताबें",
    sports: "खेल",
    toys: "खिलौने",
    homeGarden: "घर और बगीचा",
    automotive: "ऑटोमोटिव",
    selectCategory: "श्रेणी चुनें",
    category: "श्रेणी",

    // Continue with more Hindi translations...
    condition: "स्थिति",
    selectCondition: "स्थिति चुनें",
    new: "नया",
    likeNew: "नए जैसा",
    good: "अच्छा",
    fair: "ठीक",
    poor: "खराब",
    anyCondition: "कोई भी स्थिति",
  },

  gu: {
    // Common
    loading: "લોડ થઈ રહ્યું છે...",
    error: "ભૂલ",
    success: "સફળતા",
    cancel: "રદ કરો",
    save: "સેવ કરો",
    delete: "ડિલીટ કરો",
    edit: "એડિટ કરો",
    search: "શોધો",
    filter: "ફિલ્ટર",
    filters: "ફિલ્ટર",
    reset: "રીસેટ",
    apply: "લાગુ કરો",
    applyFilters: "ફિલ્ટર લાગુ કરો",
    language: "ભાષા",

    // Navigation
    home: "હોમ",
    dashboard: "ડેશબોર્ડ",
    profile: "પ્રોફાઇલ",
    settings: "સેટિંગ્સ",
    logout: "લોગઆઉટ",

    // Product related
    products: "ઉત્પાદનો",
    product: "ઉત્પાદન",
    featuredProducts: "ફીચર્ડ ઉત્પાદનો",
    searchProducts: "ઉત્પાદનો શોધો...",
    noProductsFound: "કોઈ ઉત્પાદન મળ્યું નથી",
    tryDifferentSearch: "અલગ શોધ શબ્દ અજમાવો",
    addNewProduct: "નવું ઉત્પાદન ઉમેરો",
    productTitle: "ઉત્પાદન શીર્ષક",
    enterProductTitle: "ઉત્પાદન શીર્ષક દાખલ કરો",
    productDescription: "ઉત્પાદન વર્ણન",
    enterProductDescription: "ઉત્પાદન વર્ણન દાખલ કરો",
    productImages: "ઉત્પાદન ચિત્રો",
    clickToUploadImages: "ચિત્રો અપલોડ કરવા માટે ક્લિક કરો",
    supportedFormats: "PNG, JPG, GIF 10MB સુધી",

    // Categories
    allCategories: "બધી શ્રેણીઓ",
    electronics: "ઇલેક્ટ્રોનિક્સ",
    clothing: "કપડાં",
    furniture: "ફર્નિચર",
    books: "પુસ્તકો",
    sports: "રમતગમત",
    toys: "રમકડાં",
    homeGarden: "ઘર અને બગીચો",
    automotive: "ઓટોમોટિવ",
    selectCategory: "શ્રેણી પસંદ કરો",
    category: "શ્રેણી",
  },
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState("en")

  const changeLanguage = (language) => {
    setCurrentLanguage(language)
  }

  const t = (key) => {
    return translations[currentLanguage][key] || translations.en[key] || key
  }

  return <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>{children}</LanguageContext.Provider>
}
