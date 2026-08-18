// ...existing code...
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const DEFAULT_USER = {
  id: "user-self",
  name: "UChat User",
  avatar: "https://i.pravatar.cc/150?img=56",
  online: true
};

const OTHER_USER = {
  id: "user-2",
  name: "Alex Other",
  avatar: "https://i.pravatar.cc/150?img=10",
  online: true
};
const STATIC_CONTACTS = [
  {
    id: "contact-1",
    name: "Amit Kumar",
    avatar: "https://i.pravatar.cc/150?img=32",
    online: true,
    lastMessage: "I'll send the file in a moment.",
    lastTime: "11:20",
    type: "private"
  },
  {
    id: "contact-2",
    name: "Priya Singh",
    avatar: "https://i.pravatar.cc/150?img=47",
    online: false,
    lastMessage: "Great, thanks!",
    lastTime: "09:42",
    type: "private"
  },
  {
    id: "contact-3",
    name: "Rohan Mehta",
    avatar: "https://i.pravatar.cc/150?img=12",
    online: true,
    lastMessage: "Let's meet tomorrow.",
    lastTime: "Yesterday",
    type: "private"
  }
];

const STATIC_GROUPS = [
  {
    id: "group-1",
    name: "Project Crew",
    avatar: null,
    online: false,
    lastMessage: "Update: we are ready for the demo.",
    lastTime: "Today",
    type: "group",
    memberCount: 5
  },
  {
    id: "group-2",
    name: "Design Team",
    avatar: null,
    online: false,
    lastMessage: "Can someone review the mockups?",
    lastTime: "Yesterday",
    type: "group",
    memberCount: 8
  }
];

const STATIC_CONVERSATIONS = [
  {
    id: "contact-1",
    name: "Amit Kumar",
    avatar: "https://i.pravatar.cc/150?img=32",
    online: true,
    lastMessage: "I'll send the file in a moment.",
    lastTime: "11:20",
    type: "private"
  },
  {
    id: "group-1",
    name: "Project Crew",
    avatar: null,
    online: false,
    lastMessage: "Update: we are ready for the demo.",
    lastTime: "Today",
    type: "group",
    memberCount: 5
  }
];

const STATIC_MESSAGES = {
  "contact-1": [
    {
      id: "msg-1",
      chatId: "contact-1",
      from: "contact-1",
      to: "user-self",
      text: "Hi, can you review the documents?",
      createdAt: "2026-08-06T09:15:00.000Z",
      type: "text",
      deletedFor: [],
      deletedForEveryone: false
    },
    {
      id: "msg-2",
      chatId: "contact-1",
      from: "user-self",
      to: "contact-1",
      text: "Sure, I will check and get back.",
      createdAt: "2026-08-06T09:20:00.000Z",
      type: "text",
      deletedFor: [],
      deletedForEveryone: false
    }
  ],
  "contact-2": [
    {
      id: "msg-3",
      chatId: "contact-2",
      from: "contact-2",
      to: "user-self",
      text: "Great work on the report!",
      createdAt: "2026-08-05T14:10:00.000Z",
      type: "text",
      deletedFor: [],
      deletedForEveryone: false
    }
  ],
  "group-1": [
    {
      id: "msg-4",
      chatId: "group-1",
      from: "contact-3",
      to: "group-1",
      text: "We will start the stand-up in 10 minutes.",
      createdAt: "2026-08-06T10:05:00.000Z",
      type: "text",
      deletedFor: [],
      deletedForEveryone: false
    }
  ]
};

function Chat() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messagesByChat, setMessagesByChat] = useState({});
  const [messageText, setMessageText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [stickerCategory, setStickerCategory] = useState("all");
  const [recentStickers, setRecentStickers] = useState([]);
  const [showCallModal, setShowCallModal] = useState(false);
  const [callModalMode, setCallModalMode] = useState("camera"); // 'camera' | 'call'
  const [cameraStream, setCameraStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordChunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState(null);
  const audioRef = useRef(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioTime, setAudioTime] = useState(0);
  const [audioDurationState, setAudioDurationState] = useState(0);
  const [audioDurations, setAudioDurations] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarTab, setSidebarTab] = useState("chats");
  const [messageAction, setMessageAction] = useState({ open: false, message: null });
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [callState, setCallState] = useState(null);
  const [pendingCall, setPendingCall] = useState(null);

  // new: selected messages (ids) for multi-select
  const [selectedMessageIds, setSelectedMessageIds] = useState([]);
  const chatContainerRef = useRef(null);
  const sidebarListRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setCurrentUser(DEFAULT_USER);
      return;
    }
    try {
      setCurrentUser(JSON.parse(storedUser));
    } catch {
      setCurrentUser(DEFAULT_USER);
    }
  }, []);

  // attach camera stream to call modal video elements when available
  useEffect(() => {
    const local = document.getElementById("call-local-video");
    const remote = document.getElementById("call-remote-video");
    if (local && cameraStream) {
      try {
        local.srcObject = cameraStream;
        local.play().catch(() => {});
      } catch (e) {}
    }
    if (remote && cameraStream && callModalMode === "call") {
      try {
        // in this demo we mirror the local stream to remote to simulate a call
        remote.srcObject = cameraStream;
        remote.play().catch(() => {});
      } catch (e) {}
    }
  }, [cameraStream, callModalMode]);

  useEffect(() => {
    setContacts(STATIC_CONTACTS);
    setGroups(STATIC_GROUPS);
    setConversations(STATIC_CONVERSATIONS);
    setMessagesByChat(STATIC_MESSAGES);
  }, []);

  // auto-scroll to bottom when messages change or when switching chats
  useEffect(() => {
    if (!chatContainerRef.current) return;
    if (!isAtBottom) return; // do not auto-scroll when user has scrolled up
    const scrollToBottom = () => {
      try {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      } catch (e) {}
    };
    const t = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(t);
  }, [selectedChat?.id, (messagesByChat[selectedChat?.id] || []).length]);

  // listen for manual scrolling to show/hide jump-to-bottom
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      setIsAtBottom(distance < 120);
    };
    el.addEventListener("scroll", onScroll);
    // initial check
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [chatContainerRef.current]);

  const styles = {
    app: {
      minHeight: "100vh",
      background: "#eef2f7"
    },
    panel: {
      background: "#ffffff",
      boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)"
    },
    sidebarHeader: {
      padding: "24px 24px 18px",
      borderBottom: "1px solid #f1f3f5"
    },
    userAvatar: {
      width: 52,
      height: 52,
      objectFit: "cover"
    },
    searchBox: {
      borderRadius: "16px",
      border: "1px solid #dfe3e8",
      background: "#f7fafc"
    },
    tabButton: {
      borderRadius: "999px",
      minWidth: 0,
      padding: "10px 18px",
      transition: "all 0.2s ease"
    },
    chatHeader: {
      minHeight: 84,
      background: "#ffffff",
      borderBottom: "1px solid #f1f3f5",
      padding: "0 24px"
    },
    chatContainer: {
      background: "#e7e2d8",
      minHeight: "100%",
      padding: "26px 24px",
      overflowY: "auto"
    },
    messageBubble: {
      borderRadius: "22px",
      padding: "16px 20px",
      boxShadow: "0 16px 32px rgba(15, 23, 42, 0.08)"
    },
    messageInput: {
      borderRadius: "999px",
      border: "1px solid #dfe3e8"
    },
    modalBackground: {
      background: "rgba(15, 23, 42, 0.45)"
    },
    sidebarCard: {
      borderRadius: "20px",
      transition: "transform 0.2s ease",
      boxShadow: "0 12px 24px rgba(15, 23, 42, 0.04)"
    }
  };

  const getInitials = (name) => {
    const parts = (name || "").split(" ").filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const filteredSidebarItems = useMemo(() => {
    const normalized = searchTerm.toLowerCase();
    const list =
      sidebarTab === "contacts"
        ? contacts
        : sidebarTab === "groups"
        ? groups
        : conversations;
    return list.filter((item) => item.name.toLowerCase().includes(normalized));
  }, [sidebarTab, contacts, groups, conversations, searchTerm]);

  const activeMessages = selectedChat ? messagesByChat[selectedChat.id] || [] : [];

  // preload durations for audio messages so bubbles show total length
  useEffect(() => {
    try {
      (activeMessages || []).forEach((msg) => {
        if (msg.type !== "audio") return;
        if (audioDurations[msg.id]) return;
        if (!msg.fileUrl) return;
        const a = new Audio(msg.fileUrl);
        const onLoaded = () => {
          setAudioDurations((prev) => ({ ...prev, [msg.id]: a.duration || 0 }));
          a.removeEventListener("loadedmetadata", onLoaded);
        };
        a.addEventListener("loadedmetadata", onLoaded);
      });
    } catch (e) {}
  }, [activeMessages]);

  const openChat = (item) => {
    setSelectedChat(item);
    setSelectedMessageIds([]); // clear selection when switching chat
    if (!messagesByChat[item.id]) {
      setMessagesByChat((prev) => ({ ...prev, [item.id]: [] }));
    }
  };

  // helper to switch between two simulated users (two-screen simulation)
  const toggleUser = () => {
    setCurrentUser((prev) => (prev && prev.id === DEFAULT_USER.id ? OTHER_USER : DEFAULT_USER));
  };

  const openAttachMenu = () => setShowAttachMenu(true);
  const closeAttachMenu = () => setShowAttachMenu(false);

  const sendSticker = (sticker) => {
    if (!selectedChartOrSelectedChatCheck(selectedChat)) return;
    const newMessage = {
      id: `msg-${Date.now()}`,
      chatId: selectedChat.id,
      from: currentUser.id,
      to: selectedChat.id,
      text: sticker,
      createdAt: new Date().toISOString(),
      type: "sticker",
      deletedFor: [],
      deletedForEveryone: false
    };
    setMessagesByChat((prev) => ({ ...prev, [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage] }));
    setShowStickerPicker(false);
    setRecentStickers((prev) => {
      const next = [sticker, ...prev.filter((s) => s !== sticker)];
      return next.slice(0, 12);
    });
  };

  const handleAttachOption = (opt) => {
    // opt: document|photo|camera|audio|contact|poll|event|catalog|quick|sticker
    if (opt === "camera") {
      openCameraModal();
    } else if (opt === "photo" || opt === "document") {
      // reuse file input for photo/document
      fileInputRef.current?.click();
    } else if (opt === "sticker") {
      setShowStickerPicker((s) => !s);
    } else if (opt === "audio") {
      // start recording via mic
      startRecording();
    } else {
      // other options simply create a small info notification
      createNotification("Attachment", `Selected: ${opt}`, currentUser.id);
    }
    closeAttachMenu();
  };

  const openCameraModal = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setCameraStream(stream);
      setCallModalMode("camera");
      setShowCallModal(true);
    } catch (err) {
      alert("Camera access denied or not available");
    }
  };

  const closeCameraModal = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    setShowCallModal(false);
    setCallModalMode("camera");
  };

  const capturePhotoFromStream = async () => {
    if (!cameraStream || !selectedChat) return;
    const track = cameraStream.getVideoTracks()[0];
    const imageCapture = typeof ImageCapture !== "undefined" ? new ImageCapture(track) : null;
    try {
      if (imageCapture && imageCapture.takePhoto) {
        const blob = await imageCapture.takePhoto();
        const file = new File([blob], `photo-${Date.now()}.jpg`, { type: blob.type });
        setAttachment(file);
        sendMessage("file");
        // close camera/call modal after capture
        if (cameraStream) cameraStream.getTracks().forEach((t) => t.stop());
        setCameraStream(null);
        setShowCallModal(false);
        return;
      }
    } catch (e) {
      // fallback below
    }
    const video = document.querySelector("#camera-preview");
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob2) => {
      const file2 = new File([blob2], `photo-${Date.now()}.jpg`, { type: "image/jpeg" });
      setAttachment(file2);
      sendMessage("file");
      if (cameraStream) cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
      setShowCallModal(false);
    }, "image/jpeg");
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Microphone not available");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      recordChunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) recordChunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(recordChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        const file = new File([blob], `recording-${Date.now()}.webm`, { type: blob.type });
        setAttachment(file);
        // explicitly send as audio
        sendMessage("audio");
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const stopCurrentAudio = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (e) {}
      audioRef.current = null;
    }
    setPlayingAudioId(null);
    setAudioTime(0);
    setAudioDurationState(0);
  };

  const playPauseAudio = (msg) => {
    try {
      if (playingAudioId === msg.id && audioRef.current) {
        // pause
        audioRef.current.pause();
        setPlayingAudioId(null);
        return;
      }

      // stop existing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(msg.fileUrl);
      audioRef.current = audio;
      audio.onloadedmetadata = () => {
        setAudioDurationState(audio.duration || 0);
        setAudioDurations((prev) => ({ ...prev, [msg.id]: audio.duration || 0 }));
      };
      audio.ontimeupdate = () => {
        setAudioTime(audio.currentTime || 0);
      };
      audio.onended = () => {
        stopCurrentAudio();
      };
      audio.play();
      setPlayingAudioId(msg.id);
    } catch (e) {
      console.error(e);
    }
  };

  const seekAudio = (msg, fraction) => {
    if (!audioRef.current) return;
    try {
      audioRef.current.currentTime = (audioRef.current.duration || 0) * fraction;
    } catch (e) {}
  };

  const formatSeconds = (s) => {
    if (!s && s !== 0) return "0:00";
    const sec = Math.max(0, Math.floor(s || 0));
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
  };

  // preload durations for audio messages so bubbles show total length
  // preload durations handled after messages are computed

  const createNotification = (title, message, from) => {
    setNotifications((prev) => [
      { id: `${Date.now()}-${Math.random()}`, title, message, from },
      ...prev
    ]);
  };

  // sendMessage: ensure message metadata for deletion flags
  const sendMessage = (type = "text") => {
    if (!selectedChartOrSelectedChatCheck(selectedChat)) return;
    if (!messageText.trim() && !attachment && type !== "location") return;

    // determine final message type; prefer explicit audio or audio attachment
    const attachmentType = attachment?.type;
    const msgType =
      type === "audio" || (attachmentType && attachmentType.startsWith("audio"))
        ? "audio"
        : attachment
        ? "file"
        : type === "location"
        ? "location"
        : "text";

    const newMessage = {
      id: `msg-${Date.now()}`,
      chatId: selectedChat.id,
      from: currentUser.id,
      to: selectedChat.type === "group" ? selectedChat.id : selectedChat.id,
      text:
        type === "location"
          ? `Location: ${attachment ? attachment.name : "shared location"}`
          : messageText.trim() || attachment?.name || "Shared file",
      createdAt: new Date().toISOString(),
      type: msgType,
      fileName: attachment?.name,
      fileType: attachment?.type,
      fileUrl: attachment ? URL.createObjectURL(attachment) : undefined,
      deletedFor: [], // ids of users who deleted for themselves
      deletedForEveryone: false // flag if deleted for everyone
    };

    setMessagesByChat((prev) => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
    }));

    const updatedConversation = {
      ...selectedChat,
      lastMessage: newMessage.type === "file" ? attachment.name : newMessage.text,
      lastTime: "Now"
    };

    setConversations((prev) => {
      const exists = prev.find((item) => item.id === selectedChat.id);
      if (exists) {
        return prev.map((item) => (item.id === selectedChat.id ? updatedConversation : item));
      }
      return [updatedConversation, ...prev];
    });

    setMessageText("");
    setAttachment(null);

    if (selectedChat.type !== "group") {
      const reply = {
        id: `msg-reply-${Date.now()}`,
        chatId: selectedChat.id,
        from: selectedChat.id,
        to: currentUser.id,
        text: "I got your message. I will reply soon.",
        createdAt: new Date(Date.now() + 1200).toISOString(),
        type: "text",
        deletedFor: [],
        deletedForEveryone: false
      };
      setTimeout(() => {
        setMessagesByChat((prev) => ({
          ...prev,
          [selectedChat.id]: [...(prev[selectedChat.id] || []), reply]
        }));
        createNotification("New message", reply.text, selectedChat.id);
      }, 1200);
    }
  };

  // helper to avoid accidental undefined selectedChat checks
  const selectedChartOrSelectedChatCheck = (sc) => {
    return !!sc;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const openMessageAction = (message) => {
    setMessageAction({ open: true, message });
  };

  const closeMessageAction = () => {
    setMessageAction({ open: false, message: null });
  };

  // start multi-select mode and pre-select a message
  const startSelection = (message) => {
    if (!message) return;
    setSelectedMessageIds([message.id]);
    closeMessageAction();
  };

  const toggleGroupMember = (id) => {
    setSelectedGroupMembers((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  // UPDATED: do not remove message from array. mark deleted flags.
  const handleDeleteMessage = (scope) => {
    if (!messageAction.message || !selectedChat) return;
    const messageId = messageAction.message.id;

    setMessagesByChat((prev) => {
      const list = prev[selectedChat.id] || [];
      const updated = list.map((msg) => {
        if (msg.id !== messageId) return msg;
        if (scope === "everyone") {
          return { ...msg, deletedForEveryone: true };
        }
        // scope === "me"
        const deletedFor = Array.isArray(msg.deletedFor) ? [...msg.deletedFor] : [];
        if (!deletedFor.includes(currentUser.id)) deletedFor.push(currentUser.id);
        return { ...msg, deletedFor };
      });
      return { ...prev, [selectedChat.id]: updated };
    });

    // optional: notify other side when delete for everyone
    if (scope === "everyone") {
      createNotification("Message deleted", "A message was removed from the chat", selectedChat.id);
    }

    closeMessageAction();
  };

  // NEW: toggle single message selection (used by checkbox or click with modifier)
  const toggleSelectMessage = (msgId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setSelectedMessageIds((prev) => {
      if (prev.includes(msgId)) return prev.filter((id) => id !== msgId);
      return [...prev, msgId];
    });
  };

  // NEW: clear selection
  const clearSelection = () => setSelectedMessageIds([]);

  // NEW: delete selected messages (scope = "me" | "everyone")
  const deleteSelected = (scope) => {
    if (!selectedChat || selectedMessageIds.length === 0) return;

    setMessagesByChat((prev) => {
      const list = prev[selectedChat.id] || [];
      const updated = list.map((msg) => {
        if (!selectedMessageIds.includes(msg.id)) return msg;
        if (scope === "everyone") {
          return { ...msg, deletedForEveryone: true };
        } else {
          const deletedFor = Array.isArray(msg.deletedFor) ? [...msg.deletedFor] : [];
          if (!deletedFor.includes(currentUser.id)) deletedFor.push(currentUser.id);
          return { ...msg, deletedFor };
        }
      });
      return { ...prev, [selectedChat.id]: updated };
    });

    if (scope === "everyone") {
      createNotification("Message deleted", `${selectedMessageIds.length} message(s) removed`, selectedChat.id);
    }

    clearSelection();
  };

  const handleAttachFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachment(file);
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      alert("Location not available");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMessageText(`Location: ${position.coords.latitude}, ${position.coords.longitude}`);
        sendMessage("location");
      },
      () => alert("Location access denied")
    );
  };

  const createGroup = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const group = {
      id: `group-${Date.now()}`,
      name: newGroupName.trim(),
      avatar: null,
      online: false,
      lastMessage: "Group created",
      lastTime: "Now",
      type: "group",
      memberCount: (selectedGroupMembers?.length || 0) + 1,
      members: selectedGroupMembers || []
    };
    setGroups((prev) => [group, ...prev]);
    setConversations((prev) => [group, ...prev]);
    setMessagesByChat((prev) => ({ ...prev, [group.id]: [] }));
    setNewGroupName("");
    setShowCreateGroup(false);
    setSelectedGroupMembers([]);
    createNotification("Group created", `You created ${group.name}`, currentUser.id);
    // open new group and scroll into view in sidebar
    setTimeout(() => {
      setSelectedChat(group);
      try {
        const el = document.getElementById(`conv-${group.id}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch (e) {}
    }, 120);
  };

  const handleCall = (type) => {
    if (!selectedChat || selectedChat.type === "group") return;
    // create a pending call request so the other user can accept
    const callReq = {
      id: `call-${Date.now()}`,
      from: currentUser.id,
      to: selectedChat.id,
      type,
      chatId: selectedChat.id,
      chatName: selectedChat.name,
      createdAt: new Date().toISOString()
    };
    setPendingCall(callReq);
    // open the modal for the caller as a calling UI but do not request video automatically
    setShowCallModal(true);
    setCallModalMode("call");
    setCallState({ outgoing: true, type, chatName: selectedChat.name, from: currentUser.id, to: selectedChat.id });
    createNotification("Call initiated", `${type === "video" ? "Video" : "Audio"} call initiated`, selectedChat.id);
  };

  const endCall = () => {
    setCallState(null);
    setPendingCall(null);
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    setShowCallModal(false);
    setCallModalMode("camera");
  };

  const acceptCall = async () => {
    if (!pendingCall) return;
    // accept the call and open the call UI; do not start camera automatically
    setShowCallModal(true);
    setCallModalMode("call");
    setCallState({ active: true, type: pendingCall.type, chatName: pendingCall.chatName });
    setPendingCall(null);
  };

  const declineCall = () => {
    if (!pendingCall) return;
    createNotification("Call declined", `${pendingCall.chatName} declined the call`, pendingCall.from);
    setPendingCall(null);
    setCallState(null);
  };

  const enableVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCameraStream(stream);
    } catch (e) {
      alert("Camera/microphone access denied");
    }
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // show loading spinner if user not set (render after hooks to avoid conditional hooks)

  // Determine messages to display for current user:
  const displayedMessages = activeMessages.filter((msg) => {
    // if deleted for everyone -> still show placeholder
    if (msg.deletedForEveryone) return true;
    // if current user deleted for me -> hide
    if (Array.isArray(msg.deletedFor) && msg.deletedFor.includes(currentUser.id)) return false;
    return true;
  });

  // preload durations for audio messages so bubbles show total length
  useEffect(() => {
    displayedMessages.forEach((msg) => {
      if (msg.type !== "audio") return;
      if (audioDurations[msg.id]) return;
      try {
        const a = new Audio(msg.fileUrl);
        const onLoaded = () => {
          setAudioDurations((prev) => ({ ...prev, [msg.id]: a.duration || 0 }));
          a.removeEventListener("loadedmetadata", onLoaded);
        };
        a.addEventListener("loadedmetadata", onLoaded);
      } catch (e) {}
    });
  }, [displayedMessages]);

  if (!currentUser) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-success"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0" style={styles.app}>
      <div className="row g-0" style={{ minHeight: "100vh" }}>
        <div className="col-xl-4 col-lg-5 col-md-6 d-flex flex-column" style={styles.panel}>
          <div style={styles.sidebarHeader}>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="rounded-circle" style={styles.userAvatar} />
                ) : (
                  <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 52, height: 52, fontWeight: 700 }}>
                    {getInitials(currentUser.name)}
                  </div>
                )}
                <div>
                  <div className="small text-muted">Logged in as</div>
                  <strong>{currentUser.name}</strong>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary btn-sm" title="Switch user" onClick={toggleUser}>
                  <i className="bi bi-person-circle"></i>
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={logout}>
                  <i className="bi bi-box-arrow-right"></i>
                </button>
              </div>
            </div>
            <div className="mt-3">
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success">Online</span>
                <span className="text-muted small">Secure chat</span>
              </div>
            </div>
          </div>

          <div className="px-3 pb-3">
            <div className="input-group" style={styles.searchBox}>
              <span className="input-group-text bg-transparent border-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                className="form-control bg-transparent border-0"
                placeholder={`Search ${sidebarTab}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="px-3 pb-3">
            <div className="d-flex gap-2">
              {[
                { key: "chats", label: "Chats", icon: "bi-chat-dots" },
                { key: "contacts", label: "Contacts", icon: "bi-people" },
                { key: "groups", label: "Groups", icon: "bi-collection" },
                { key: "deleted", label: "Deleted", icon: "bi-trash" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`btn btn-sm ${sidebarTab === tab.key ? "btn-success text-white" : "btn-outline-secondary text-dark"}`}
                  style={styles.tabButton}
                  onClick={() => setSidebarTab(tab.key)}
                >
                  <i className={`${tab.icon} me-2`}></i>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-grow-1 overflow-auto px-3" ref={sidebarListRef}>
              <div className="list-group list-group-flush">
                {sidebarTab === "deleted" ? (
                  // show deleted messages list
                  (() => {
                    const deleted = [];
                    Object.keys(messagesByChat).forEach((chatId) => {
                      const msgs = messagesByChat[chatId] || [];
                      msgs.forEach((m) => {
                        if (m.deletedForEveryone || (Array.isArray(m.deletedFor) && m.deletedFor.includes(currentUser.id))) {
                          // find chat name
                          const chat = [...contacts, ...groups, ...conversations].find((c) => c.id === chatId);
                          deleted.push({ chatId, chatName: chat?.name || chatId, message: m });
                        }
                      });
                    });
                    if (deleted.length === 0) {
                      return <div className="text-center text-muted p-4">No deleted messages.</div>;
                    }
                    return deleted.map((d) => (
                      <div key={d.message.id} className="list-group-item d-flex justify-content-between align-items-start">
                        <div>
                          <div className="small text-muted">{d.chatName}</div>
                          <div className="fw-semibold">{d.message.type === "file" ? d.message.fileName : d.message.text}</div>
                          <div className="small text-muted">{new Date(d.message.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                          <button className="btn btn-sm btn-outline-success mb-2" onClick={() => {
                            // undo deletion for this message for current user or everyone
                            setMessagesByChat((prev) => {
                              const list = prev[d.chatId] || [];
                              const updated = list.map((msg) => {
                                if (msg.id !== d.message.id) return msg;
                                if (msg.deletedForEveryone) return { ...msg, deletedForEveryone: false };
                                const deletedFor = Array.isArray(msg.deletedFor) ? msg.deletedFor.filter((id) => id !== currentUser.id) : [];
                                return { ...msg, deletedFor };
                              });
                              return { ...prev, [d.chatId]: updated };
                            });
                          }}>Undo</button>
                          <button className="btn btn-sm btn-light" onClick={() => {
                            // permanently remove for this user view only
                            setMessagesByChat((prev) => {
                              const list = prev[d.chatId] || [];
                              const updated = list.filter((msg) => msg.id !== d.message.id);
                              return { ...prev, [d.chatId]: updated };
                            });
                          }}>Delete</button>
                        </div>
                      </div>
                    ));
                  })()
                ) : (
                  // normal sidebar (chats/contacts/groups)
                  (filteredSidebarItems.length === 0 ? (
                    <div className="text-center text-muted p-4">No {sidebarTab} found.</div>
                  ) : (
                    filteredSidebarItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        id={`conv-${item.id}`}
                        className={`list-group-item list-group-item-action d-flex align-items-start gap-3 ${selectedChat?.id === item.id ? "active" : ""}`}
                        onClick={() => openChat(item)}
                        style={styles.sidebarCard}
                      >
                        <div className="position-relative">
                          {item.avatar ? (
                            <img src={item.avatar} alt={item.name} className="rounded-circle" style={{ width: 52, height: 52, objectFit: "cover" }} />
                          ) : (
                            <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 52, height: 52, fontWeight: 700 }}>
                              {getInitials(item.name)}
                            </div>
                          )}
                          {item.type !== "group" && (
                            <span
                              className={`position-absolute bottom-0 end-0 rounded-circle border border-white ${item.online ? "bg-success" : "bg-secondary"}`}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                        <div className="text-start flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center">
                            <strong>{item.name}</strong>
                            <small className="text-muted">{item.lastTime || ""}</small>
                          </div>
                          <div className="text-muted small text-truncate">
                            {item.lastMessage || (item.type === "group" ? `${item.memberCount || 0} members` : "")}
                          </div>
                        </div>
                      </button>
                    ))
                  ))
                )}
              </div>
          </div>

          <div className="p-3 border-top">
            <button className="btn btn-outline-success w-100" onClick={() => setShowCreateGroup(true)}>
              <i className="bi bi-people-fill me-2"></i>Create group
            </button>
          </div>
        </div>

        <div className="col-xl-8 col-lg-7 col-md-6 d-flex flex-column" style={styles.panel}>
          <div className="d-flex align-items-center justify-content-between" style={styles.chatHeader}>
            {selectedChat ? (
              <>
                {selectedMessageIds.length > 0 ? (
                  // selection header
                  <div className="d-flex align-items-center gap-3 w-100 justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <button className="btn btn-light btn-sm" onClick={clearSelection}>
                        <i className="bi bi-x-lg"></i>
                      </button>
                      <div>
                        <h6 className="mb-0">{selectedMessageIds.length} selected</h6>
                        <small className="text-muted">{selectedChat.name}</small>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => deleteSelected("me")}>
                        Delete for me
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => deleteSelected("everyone")}>
                        Delete for everyone
                      </button>
                    </div>
                  </div>
                ) : (
                  // normal header
                  <div className="d-flex align-items-center gap-3 w-100 justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      {selectedChat.avatar ? (
                        <img src={selectedChat.avatar} alt={selectedChat.name} className="rounded-circle" style={styles.userAvatar} />
                      ) : (
                        <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, fontWeight: 700 }}>
                          {getInitials(selectedChat.name)}
                        </div>
                      )}
                      <div>
                        <h5 className="mb-1">{selectedChat.name}</h5>
                        <small className={selectedChat.online ? "text-success" : "text-muted"}>
                          {selectedChat.type === "group"
                            ? `${selectedChat.memberCount || 0} members`
                            : selectedChat.online
                            ? "online"
                            : "last seen recently"}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-light btn-sm" onClick={() => handleCall("audio")} disabled={!selectedChat || selectedChat.type === "group"}>
                        <i className="bi bi-telephone"></i>
                      </button>
                      <button className="btn btn-light btn-sm" onClick={() => handleCall("video")} disabled={!selectedChat || selectedChat.type === "group"}>
                        <i className="bi bi-camera-video"></i>
                      </button>
                      <button className="btn btn-light btn-sm">
                        <i className="bi bi-three-dots-vertical"></i>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div>
                <h5 className="mb-1">Welcome back</h5>
                <small className="text-muted">Select a chat to continue</small>
              </div>
            )}
          </div>

          <div style={styles.chatContainer} ref={chatContainerRef}>
            {selectedChat ? (
              <>
                {displayedMessages.length === 0 && (
                  <div className="h-100 d-flex flex-column justify-content-center align-items-center text-center text-muted py-5">
                    <i className="bi bi-chat-dots-fill fs-1 mb-3 text-success"></i>
                    <div>No messages yet. Start the conversation.</div>
                  </div>
                )}

                {displayedMessages.map((msg) => {
                  const isSelected = selectedMessageIds.includes(msg.id);
                  return (
                    <div
                      key={msg.id}
                      className={`d-flex mb-3 ${msg.from === currentUser.id ? "justify-content-end" : ""}`}
                      onClick={(e) => {
                        // toggle selection when user holds Ctrl/Cmd or when selection mode already active
                        if (e.ctrlKey || e.metaKey || selectedMessageIds.length > 0) {
                          toggleSelectMessage(msg.id, e);
                        }
                      }}
                    >
                      <div
                        className="position-relative"
                        style={{
                          ...styles.messageBubble,
                          background: msg.deletedForEveryone ? "#f0f0f0" : msg.from === currentUser.id ? "#2dce89" : "#ffffff",
                          color: msg.deletedForEveryone ? "#6c757d" : msg.from === currentUser.id ? "#fff" : "#202020",
                          borderTopRightRadius: msg.from === currentUser.id ? 4 : 20,
                          borderTopLeftRadius: msg.from === currentUser.id ? 20 : 4,
                          minWidth: 120,
                          maxWidth: "75%"
                        }}
                      >
                        {/* checkbox for selection - only visible in selection mode */}
                        {selectedMessageIds.length > 0 && (
                          <div style={{ position: "absolute", left: -36, top: 8 }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => toggleSelectMessage(msg.id, e)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )}

                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="small text-muted">
                            {msg.from === currentUser.id ? "You" : selectedChat.name}
                          </div>
                          <button
                            className="btn btn-sm btn-link text-muted p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              openMessageAction(msg);
                            }}
                          >
                            <i className="bi bi-three-dots"></i>
                          </button>
                        </div>

                        {msg.deletedForEveryone ? (
                          <div className="mb-2 fst-italic">This message was deleted</div>
                        ) : (msg.type === "audio" || (msg.type === "file" && msg.fileType && msg.fileType.startsWith("audio"))) ? (
                          <div className="mb-2 d-flex align-items-center" style={{ gap: 12 }}>
                            <button className={`btn btn-sm ${playingAudioId === msg.id ? "btn-outline-danger" : "btn-outline-primary"}`} onClick={() => playPauseAudio(msg)}>
                              <i className={`bi ${playingAudioId === msg.id ? "bi-pause-fill" : "bi-play-fill"}`}></i>
                            </button>
                            <div style={{ flex: 1 }}>
                              <div
                                className="progress"
                                style={{ height: 6, borderRadius: 6, cursor: "pointer" }}
                                onClick={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                                  if (playingAudioId === msg.id && audioRef.current) {
                                    seekAudio(msg, fraction);
                                  } else {
                                    // start playback then seek shortly after
                                    playPauseAudio(msg);
                                    setTimeout(() => seekAudio(msg, fraction), 250);
                                  }
                                }}
                              >
                                <div
                                  className="progress-bar"
                                  role="progressbar"
                                  style={{ width: `${playingAudioId === msg.id && audioDurationState ? Math.min(100, (audioTime / audioDurationState) * 100) : 0}%` }}
                                ></div>
                              </div>
                              <div className="small text-muted mt-1">
                                {playingAudioId === msg.id
                                  ? formatSeconds(audioTime)
                                  : formatSeconds(audioDurations[msg.id])}
                              </div>
                            </div>
                          </div>
                        ) : msg.type === "file" && msg.fileUrl ? (
                          <div className="mb-2">
                            <a href={msg.fileUrl} target="_blank" rel="noreferrer" className={msg.from === currentUser.id ? "text-white" : ""}>
                              <i className="bi bi-file-earmark-fill me-2"></i>
                              {msg.fileName || "Attachment"}
                            </a>
                          </div>
                        ) : msg.type === "location" ? (
                          <div className="mb-2">
                            <i className="bi bi-geo-alt-fill me-2"></i>
                            <a
                              href={`https://www.google.com/maps?q=${encodeURIComponent(msg.text.replace("Location:", "").trim())}`}
                              target="_blank"
                              rel="noreferrer"
                              className={msg.from === currentUser.id ? "text-white" : ""}
                            >
                              View location
                            </a>
                          </div>
                        ) : (
                          <div>{msg.text}</div>
                        )}

                        <div className="text-end small mt-2 text-muted">{formatTime(msg.createdAt)}</div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="h-100 d-flex flex-column justify-content-center align-items-center text-center px-4">
                <i className="bi bi-chat-dots-fill text-success" style={{ fontSize: 92 }}></i>
                <h2 className="fw-bold mt-3">Your messages appear here</h2>
                <p className="text-muted mb-0">Select a contact, group or channel to begin.</p>
              </div>
            )}
          </div>

          {selectedChat && (
            <div className="px-4 py-3 bg-white border-top" style={{ borderColor: "#f1f3f5", position: "relative" }}>
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-light rounded-pill" onClick={() => setShowAttachMenu((s) => !s)} title="Attach">
                  <i className="bi bi-plus-lg"></i>
                </button>
                <button className="btn btn-light rounded-pill" onClick={() => fileInputRef.current?.click()} title="Attach file">
                  <i className="bi bi-paperclip"></i>
                </button>
                <button className="btn btn-light rounded-pill" onClick={handleShareLocation}>
                  <i className="bi bi-geo-alt"></i>
                </button>
                <input type="file" ref={fileInputRef} hidden onChange={handleAttachFile} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type a message"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  style={styles.messageInput}
                />
                <div className="d-flex gap-2">
                  <button className="btn btn-light rounded-pill" title="Stickers/Emoji" onClick={() => setShowStickerPicker((s) => !s)}>
                    <i className="bi bi-emoji-smile"></i>
                  </button>
                  {!isRecording ? (
                    <button className="btn btn-success rounded-pill px-4" onClick={() => sendMessage()}>
                      <i className="bi bi-send-fill"></i>
                    </button>
                  ) : (
                    <button className="btn btn-danger rounded-pill px-4" onClick={stopRecording}>
                      <i className="bi bi-stop-fill"></i>
                    </button>
                  )}
                  <button
                    className={`btn ${isRecording ? "btn-warning" : "btn-light"} rounded-pill`}
                    title="Record audio"
                    onClick={() => (isRecording ? stopRecording() : startRecording())}
                  >
                    <i className="bi bi-mic-fill"></i>
                  </button>
                </div>
              </div>
              {attachment && (
                <div className="small text-muted mt-2">
                  Attached: {attachment.name} ({Math.round(attachment.size / 1024)} KB)
                </div>
              )}

              {/* Jump to bottom button when user scrolled up */}
              {!isAtBottom && (
                <button
                  className="btn btn-success position-absolute"
                  style={{ right: 24, bottom: 86, zIndex: 1080 }}
                  onClick={() => {
                    try {
                      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                      setIsAtBottom(true);
                    } catch (e) {}
                  }}
                >
                  <i className="bi bi-arrow-down"></i>
                </button>
              )}

              {/* Attach menu positioned above the input (list) */}
              {showAttachMenu && (
                <div style={{ position: "absolute", left: 16, bottom: 76, zIndex: 1060, width: 320 }}>
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <div className="mb-2 fw-bold">Attach</div>
                      <div className="d-flex flex-column">
                        {[
                          { k: "document", l: "Document", i: "bi-file-earmark" },
                          { k: "photo", l: "Photo", i: "bi-image" },
                          { k: "camera", l: "Open Camera", i: "bi-camera" },
                          { k: "audio", l: "Audio", i: "bi-mic" },
                          { k: "contact", l: "Contact", i: "bi-person" },
                          { k: "poll", l: "Poll", i: "bi-bar-chart" },
                          { k: "event", l: "Event", i: "bi-calendar-event" },
                          { k: "sticker", l: "New Sticker", i: "bi-emoji-smile" },
                          { k: "catalog", l: "Catalog", i: "bi-archive" },
                          { k: "quick", l: "Quick Reply", i: "bi-lightning" }
                        ].map((opt) => (
                          <button key={opt.k} className="btn btn-sm btn-outline-secondary text-start mb-1" onClick={() => handleAttachOption(opt.k)}>
                            <i className={`${opt.i} me-2`}></i>
                            {opt.l}
                          </button>
                        ))}
                      </div>
                      <div className="text-end mt-2">
                        <button className="btn btn-sm btn-light" onClick={() => setShowAttachMenu(false)}>Close</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* WhatsApp-like Sticker picker */}
              {showStickerPicker && (
                <div style={{ position: "absolute", left: 16, bottom: 76, zIndex: 1060, width: 360 }}>
                  <div className="shadow-sm" style={{ borderRadius: 12, background: "#fff", padding: 8 }}>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex gap-2">
                        <button className={`btn btn-sm ${stickerCategory === "recent" ? "btn-primary text-white" : "btn-light"}`} onClick={() => setStickerCategory("recent")}>Recent</button>
                        <button className={`btn btn-sm ${stickerCategory === "all" ? "btn-primary text-white" : "btn-light"}`} onClick={() => setStickerCategory("all")}>All</button>
                      </div>
                      <div>
                        <button className="btn btn-sm btn-light" onClick={() => setShowStickerPicker(false)}>Close</button>
                      </div>
                    </div>
                    <div style={{ maxHeight: 220, overflowY: "auto" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                        {(stickerCategory === "recent" ? (recentStickers.length ? recentStickers : ["No recent"]) : ["😀","😃","😂","😍","😎","🤔","😭","👍","🙏","🎉","🔥","🌟","💯","🎁","🌈","🐶","🐱","🍕","🍔","⚽"]).map((st) => (
                          st === "No recent" ? (
                            <div key={st} className="text-muted small p-2">No recent stickers</div>
                          ) : (
                            <button key={st} className="d-flex align-items-center justify-content-center bg-white" onClick={() => sendSticker(st)} style={{ borderRadius: 12, padding: 10, fontSize: 26, border: "1px solid #f0f0f0" }}>{st}</button>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* sidebarListRef attached to conversations container */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {messageAction.open && messageAction.message && (
        <div className="position-fixed bottom-0 end-0 m-3 p-3 bg-white border rounded shadow" style={{ zIndex: 1050, width: 280 }}>
          <div className="mb-3 fw-bold">Message actions</div>

          {/* Start selection (preselect this message) */}
          <button
            className="btn btn-outline-primary w-100 mb-2"
            onClick={() => startSelection(messageAction.message)}
          >
            Select messages
          </button>

          {messageAction.message.from === currentUser.id && (
            <button className="btn btn-outline-danger w-100 mb-2" onClick={() => handleDeleteMessage("everyone")}>
              Delete for everyone
            </button>
          )}
          <button className="btn btn-outline-secondary w-100 mb-2" onClick={() => handleDeleteMessage("me")}>
            Delete for me
          </button>
          <button className="btn btn-light w-100" onClick={closeMessageAction}>
            Cancel
          </button>
        </div>
      )}

      

      {/* Incoming call (for the other user) */}
      {pendingCall && pendingCall.to === currentUser.id && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1085, background: "rgba(0,0,0,0.45)" }}>
          <div className="bg-white rounded p-3" style={{ width: 360 }}>
            <h5>Incoming {pendingCall.type === "video" ? "video" : "audio"} call</h5>
            <p className="mb-3">{contacts.find((c) => c.id === pendingCall.from)?.name || pendingCall.from} is calling...</p>
            <div className="d-flex gap-2">
              <button className="btn btn-success w-100" onClick={acceptCall}>Accept</button>
              <button className="btn btn-outline-secondary w-100" onClick={declineCall}>Decline</button>
            </div>
          </div>
        </div>
      )}

      {/* Unified Call / Camera modal */}
      {showCallModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1070, background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded p-3" style={{ width: 820, maxWidth: '95%' }}>
            {callModalMode === "camera" ? (
              <>
                <h5>Camera</h5>
                <div className="mb-2">
                  <video id="call-local-video" style={{ width: "100%", height: "420px", background: "#000" }} muted />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button className="btn btn-outline-secondary" onClick={() => { if (cameraStream) cameraStream.getTracks().forEach((t)=>t.stop()); setCameraStream(null); setShowCallModal(false); }}>Close</button>
                  <button className="btn btn-success" onClick={capturePhotoFromStream}>Capture & Send</button>
                </div>
              </>
            ) : (
              <>
                <h5>{callState?.type === "video" ? "Video call" : "Call"} - {callState?.chatName}</h5>
                {!cameraStream ? (
                  <div className="d-flex flex-column align-items-center p-4">
                    <div className="mb-3 text-muted">Video is off</div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary" onClick={enableVideo}>Enable video</button>
                      <button className="btn btn-danger" onClick={endCall}>End call</button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex gap-3">
                    <div style={{ flex: 1, background: '#000', borderRadius: 8 }}>
                      <video id="call-remote-video" style={{ width: '100%', height: 480, background: '#000' }} autoPlay muted />
                    </div>
                    <div style={{ width: 220 }}>
                      <div className="mb-2">You</div>
                      <video id="call-local-video" style={{ width: '100%', height: 160, background: '#000' }} muted />
                      <div className="d-flex flex-column gap-2 mt-3">
                        <button className="btn btn-danger" onClick={endCall}>End call</button>
                        <button className="btn btn-outline-secondary" onClick={() => { /* mute toggle placeholder */ }}>Mute</button>
                        <button className="btn btn-outline-secondary" onClick={() => { /* switch camera placeholder */ }}>Flip</button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {showCreateGroup && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={styles.modalBackground}>
          <div className="bg-white rounded-4 shadow p-4" style={{ width: 360 }}>
            <h5>Create group</h5>
            <form onSubmit={createGroup}>
              <div className="mb-3">
                <label className="form-label">Group name</label>
                <input className="form-control" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Add members</label>
                <div style={{ maxHeight: 160, overflowY: "auto", border: "1px solid #eee", padding: 8, borderRadius: 8 }}>
                  {contacts.map((c) => (
                    <div key={c.id} className="form-check d-flex align-items-center justify-content-between">
                      <div>
                        <input className="form-check-input me-2" type="checkbox" id={`m-${c.id}`} checked={selectedGroupMembers.includes(c.id)} onChange={() => toggleGroupMember(c.id)} />
                        <label className="form-check-label" htmlFor={`m-${c.id}`}>{c.name}</label>
                      </div>
                      <div className="small text-muted">{c.online ? "online" : "offline"}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={() => { setShowCreateGroup(false); setSelectedGroupMembers([]); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {callState && !showCallModal && (
        <div className="position-fixed top-50 start-50 translate-middle bg-white rounded shadow p-4" style={{ zIndex: 1070, width: 340 }}>
          <h5>{callState.type === "video" ? "Video call" : "Audio call"}</h5>
          <p className="mb-3">Calling {callState.chatName}...</p>
          <button className="btn btn-danger w-100" onClick={endCall}>
            End call
          </button>
        </div>
      )}

      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        {notifications.map((item) => (
          <div key={item.id} className="toast show mb-2">
            <div className="toast-header">
              <strong className="me-auto">{item.title}</strong>
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== item.id))}></button>
            </div>
            <div className="toast-body">
              <strong>{contacts.find((c) => c.id === item.from)?.name || currentUser.name}</strong>
              <div>{item.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chat;
// ...existing code...