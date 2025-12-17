import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Check,
  CheckCheck,
} from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

const socket = io("http://localhost:3000");

const Messages = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) => [...prev]);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on("receiveChatMessage", (msg) => {
      if (!selectedChat) return;

      if (String(msg.listingId) !== String(selectedChat.listingId)) return;

      const isFromOtherUser =
        (msg.sender === "buyer" &&
          String(msg.buyerId) === String(selectedChat.otherUserId)) ||
        (msg.sender === "seller" &&
          String(msg.sellerId) === String(selectedChat.otherUserId));

      if (isFromOtherUser) {
        setMessages((prev) => [...prev, msg]);
      }

      // Always update sidebar preview (last message + time)
      setConversations((prev) =>
        prev.map((c) =>
          String(c.listingId) === String(msg.listingId)
            ? { ...c, lastMessage: msg.message, time: new Date() }
            : c
        )
      );
    });

    return () => socket.off("receiveChatMessage");
  }, [selectedChat]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser) return;
      try {
        const res = await axios.get(
          "http://localhost:3000/api/message/conversations",
          { withCredentials: true }
        );
        setConversations(res.data);
      } catch (err) {
        console.log("Failed to load chats", err);
      }
    };
    fetchConversations();
  }, [currentUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !currentUser) return;

    console.log("selected chat", selectedChat);

    const messageData = {
      listingId: selectedChat.listingId,
      buyerId: selectedChat.buyerId,
      sellerId: selectedChat.sellerId,
      message: newMessage.trim(),
      sender: currentUser._id === selectedChat.buyerId ? "buyer" : "seller",
    };

    const tempId = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        ...messageData,
        _id: tempId,
        createdAt: new Date(),
        senderId: currentUser._id, // for UI
      },
    ]);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/message/send",
        messageData,
        { withCredentials: true }
      );

      setMessages((prev) => prev.map((m) => (m._id === tempId ? res.data : m)));
      socket.emit("sendChatMessage", res.data);
    } catch (err) {
      toast.error("Failed to send message");
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    }

    setNewMessage("");
  };

  const filteredConversations = conversations.filter((chat) =>
    chat.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diff = now - msgDate;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000)
      return msgDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    return msgDate.toLocaleDateString();
  };

  const timeAgo = (date) => {
    if (!date) return "";

    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return "Just now";

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    return past.toLocaleDateString(); // fallback
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 mt-20">
      {/* Sidebar */}
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-xl shadow-2xl flex flex-col border-r border-gray-200 dark:bg-gray-800/90 dark:border-gray-700">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Messages
          </h1>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(
            (chat) => (
              console.log("chatting", chat),
              (
                <div
                  key={chat.id}
                  onClick={async () => {
                    setSelectedChat(chat);
                    try {
                      const res = await axios.get(
                        `http://localhost:3000/api/message/chat/${chat.listingId}/${chat.otherUserId}`,
                        { withCredentials: true }
                      );
                      setMessages(res.data.messages || []);
                    } catch (err) {
                      setMessages([]);
                    }
                  }}
                  className={`p-3 flex items-center gap-3 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 ${
                    selectedChat?.id === chat.id
                      ? "bg-yellow-50/50 dark:bg-yellow-900/20"
                      : ""
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {chat.otherUserName?.[0] || "?"}
                    </div>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-semibold text-gray-900 dark:text-white truncate text-lg">
                        {chat.otherUserName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {timeAgo(chat.time)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>

                  {chat.unread > 0 && (
                    <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {chat.unread}
                    </div>
                  )}
                </div>
              )
            )
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50/70 dark:bg-gray-900/50">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white/90 backdrop-blur-xl shadow-md px-6 py-4 border-b border-gray-200 dark:bg-gray-800/90 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedChat.otherUserName[0]}
                    </div>
                    {selectedChat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedChat.otherUserName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedChat.online
                        ? "Active now"
                        : `Active ${timeAgo(selectedChat.time)}`
                        }
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors dark:hover:bg-gray-700">
                  <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="w-24 h-24 bg-gray-200 border-2 border-dashed rounded-xl mb-4" />
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMyMessage =
                    msg.sender === "me" ||
                    (msg.sender === "buyer" &&
                      currentUser?._id === msg.buyerId?._id) ||
                    (msg.sender === "seller" &&
                      currentUser?._id === msg.sellerId?._id);

                  return (
                    <div
                      key={msg._id || i}
                      className={`flex ${
                        isMyMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`group relative max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm transition-all ${
                          isMyMessage
                            ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
                            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <p className="text-sm lg:text-base break-words">
                          {msg.message || msg.text}
                        </p>
                        <div
                          className={`flex items-center gap-1 mt-1 text-xs ${
                            isMyMessage
                              ? "text-yellow-100"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          <span>
                            {formatTime(msg.createdAt || msg.timestamp)}
                          </span>
                          {isMyMessage && (
                            <>
                              {msg.isRead ? (
                                <CheckCheck className="h-3.5 w-3.5" />
                              ) : (
                                <Check className="h-3.5 w-3.5" />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSend}
              className="bg-white/90 backdrop-blur-xl shadow-lg p-4 border-t border-gray-200 dark:bg-gray-800/90 dark:border-gray-700"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-2.5 hover:bg-gray-100 rounded-full transition-colors dark:hover:bg-gray-700"
                >
                  <Paperclip className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-lg"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gray-200 border-2 border-dashed rounded-xl mb-6" />
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                Select a chat
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Choose from your conversations to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
