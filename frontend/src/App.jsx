import { useState } from "react";
import { useChat } from "./hooks/useChat";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Chat from "./pages/Chat";
import CreateRoomDialog from "./components/CreateRoomDialog";
import DesignAsset from "./components/DesignAsset";
import Button from "./components/Button";
import "./App.css";

export default function App() {
  const chat = useChat();
  const [page, setPage] = useState("home");
  const [creating, setCreating] = useState(false);
  const navigate = (next) => {
    if (!chat.room) {
      setCreating(false);
      setPage(next);
    }
  };
  return (
    <div className="app-shell">
      <header className="site-header">
        <button
          className="brand"
          onClick={() => navigate("home")}
          aria-label="พักใจ หน้าหลัก"
        >
          <DesignAsset name="logo" />
          <span>พักใจ</span>
        </button>
        <span className="brand-sub">พื้นที่เล็ก ๆ ที่ใจได้พัก</span>
        {!chat.room && (
          <Button
            variant="secondary"
            className="header-browse"
            onClick={() => navigate("rooms")}
          >
            เลือกห้องสนทนา
          </Button>
        )}
        <span className="anonymous-label">ไม่ต้องบอกชื่อ</span>
      </header>
      {!chat.ready && (
        <div className="connection-banner" role="status">
          <span className="dot" />
          กำลังเชื่อมต่อเซิร์ฟเวอร์…
        </div>
      )}
      {chat.error && (
        <div className="notice error" role="alert">
          {chat.error}
          <button className="text-button" onClick={chat.clearError}>
            ปิดข้อความ
          </button>
        </div>
      )}
      {chat.notice && (
        <div className="notice" role="status">
          {chat.notice}
          <button className="text-button" onClick={chat.clearNotice}>
            รับทราบ
          </button>
        </div>
      )}
      {chat.room ? (
        <Chat
          key={chat.room.id}
          room={chat.room}
          messages={chat.messages}
          clientId={chat.clientId}
          send={chat.send}
          request={chat.request}
        />
      ) : (
        <main>
          {creating ? (
            <CreateRoomDialog
              count={chat.rooms.length}
              request={chat.request}
              onClose={() => setCreating(false)}
              onCreate={async (title) => {
                const reply = await chat.request("create", { title });
                if (reply.ok) setCreating(false);
                return reply;
              }}
            />
          ) : page === "home" ? (
            <Home
              ready={chat.ready}
              count={chat.rooms.length}
              onCreate={() => setCreating(true)}
              onBrowse={() => navigate("rooms")}
            />
          ) : (
            <Rooms
              rooms={chat.rooms}
              ready={chat.ready}
              onBack={() => navigate("home")}
              onCreate={() => setCreating(true)}
              onJoin={(roomId) => chat.send("join", { roomId })}
            />
          )}
        </main>
      )}
      <footer className="site-footer">
        <span>พักใจ ♡ ให้ทุกความรู้สึกมีคนรับฟัง</span>
        <span>ไม่สมัครสมาชิก · ไม่มีรหัสห้อง · แค่เราสองคน</span>
      </footer>
    </div>
  );
}
