"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Send, Paperclip, ImageIcon, MoreVertical, Phone, Video } from "lucide-react"
import axios from "axios"
import { useLanguage } from "../context/LanguageContext"
import { useAuth } from "../context/AuthContext"

const Chat = () => {
  const { sellerId } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { user } = useAuth()
  const messagesEndRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [seller, setSeller] = useState(null)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    fetchChatData()
    // Set up real-time messaging (WebSocket or polling)
    const interval = setInterval(fetchMessages, 3000) // Poll every 3 seconds
    return () => clearInterval(interval)
  }, [sellerId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchChatData = async () => {
    try {
      const [chatResponse, sellerResponse] = await Promise.all([
        axios.get(`/api/chat/${sellerId}`),
        axios.get(`/api/users/${sellerId}`),
      ])

      setMessages(chatResponse.data.messages || [])
      setSeller(sellerResponse.data)
    } catch (error) {
      console.error("Error fetching chat data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/chat/${sellerId}`)
      setMessages(response.data.messages || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    const messageText = newMessage
    setNewMessage("")

    // Optimistically add message to UI
    const tempMessage = {
      _id: Date.now(),
      text: messageText,
      sender: user._id,
      timestamp: new Date(),
      temp: true,
    }
    setMessages((prev) => [...prev, tempMessage])

    try {
      const response = await axios.post(`/api/chat/${sellerId}/message`, {
        text: messageText,
      })

      // Replace temp message with real one
      setMessages((prev) =>
        prev.map((msg) => (msg.temp && msg._id === tempMessage._id ? { ...response.data, temp: false } : msg)),
      )
    } catch (error) {
      console.error("Error sending message:", error)
      // Remove temp message on error
      setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id))
      setNewMessage(messageText) // Restore message text
    } finally {
      setSending(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await axios.post(`/api/chat/${sellerId}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setMessages((prev) => [...prev, response.data])
    } catch (error) {
      console.error("Error uploading image:", error)
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">{seller?.name?.charAt(0) || "S"}</span>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">{seller?.name || "Seller"}</h2>
                  <p className="text-sm text-gray-600">{typing ? t("typing") : t("online")}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">{t("startConversation")}</h3>
                <p className="text-gray-500">{t("sendFirstMessage")}</p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isOwn = message.sender === user._id
                const showAvatar = index === 0 || messages[index - 1].sender !== message.sender

                return (
                  <motion.div
                    key={message._id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`flex max-w-xs lg:max-w-md ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                      {showAvatar && !isOwn && (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                          <span className="text-white text-sm font-semibold">{seller?.name?.charAt(0) || "S"}</span>
                        </div>
                      )}

                      <div className={`${showAvatar && !isOwn ? "" : "ml-10"} ${isOwn ? "mr-2" : ""}`}>
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isOwn ? "bg-blue-600 text-white" : "bg-white text-gray-800 border border-gray-200"
                          } ${message.temp ? "opacity-70" : ""}`}
                        >
                          {message.type === "image" ? (
                            <img
                              src={message.imageUrl || "/placeholder.svg"}
                              alt="Shared image"
                              className="max-w-full h-auto rounded-lg"
                            />
                          ) : (
                            <p className="text-sm">{message.text}</p>
                          )}
                        </div>

                        <p className={`text-xs text-gray-500 mt-1 ${isOwn ? "text-right" : "text-left"}`}>
                          {formatTime(message.timestamp)}
                          {message.temp && " • " + t("sending")}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <div className="flex space-x-2">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <label
                  htmlFor="image-upload"
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-5 h-5" />
                </label>

                <button
                  type="button"
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t("typeMessage")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={sending}
                />
              </div>

              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
