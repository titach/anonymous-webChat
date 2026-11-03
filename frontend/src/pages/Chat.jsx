import { useEffect, useRef, useState } from "react";
import DesignAsset from "../components/DesignAsset";
import Button from "../components/Button";
import ExitRoomDialog from "../components/ExitRoomDialog";
import { useModeration } from "../hooks/useModeration";
import ModerationStatus from "../components/ModerationStatus";

export default function Chat({ room, messages, clientId, send, request }) {
  const [draft, setDraft] = useState("");
  const [confirmExit, setConfirmExit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const bottom = useRef(null);
  const owner = room.ownerId === clientId;
  const connected = room.count === 2;
  const check = useModeration(draft, "message", request, connected);
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "nearest" });
  }, [messages]);
  async function submit(event) {
    event.preventDefault();
    if (!check.allowed || !connected || submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const reply = await request("message", { text: draft.trim() });
      if (reply.ok) setDraft("");
      else setSubmitError(reply.message);
    } finally {
      setSubmitting(false);
    }
  }
  const exit = confirmExit && (
    <ExitRoomDialog
      owner={owner}
      onCancel={() => setConfirmExit(false)}
      onConfirm={() => send("leave")}
    />
  );
  if (!connected)
    return (
      <main className="waiting-page">
        <div className="page-heading">
          <span className="eyebrow">เปิดพื้นที่เล็ก ๆ ให้หัวใจ</span>
          <h1>{room.title}</h1>
          <p className="muted">
            ห้องของคุณแสดงในรายการแล้ว ไม่ต้องส่งรหัสให้ใคร
          </p>
        </div>
        <section className="waiting-panel" aria-label="ห้องสนทนา">
          <div className="waiting-cloud">
            <DesignAsset name="clouds" />
          </div>
          <span className="status waiting-status" role="status">
            กำลังรอเพื่อนใหม่ · {room.count}/2 คน
          </span>
          <h2>เผื่อใครสักคน… ก็กำลังมองหาห้องนี้</h2>
          <p>ค่อย ๆ หายใจ เดี๋ยวบทสนทนาดี ๆ ก็เริ่มขึ้น</p>
        </section>
        <div className="waiting-actions">
          <Button variant="danger" onClick={() => setConfirmExit(true)}>
            {owner ? "ปิดห้อง" : "ออกจากห้อง"}
          </Button>
        </div>
        {exit}
      </main>
    );
  return (
    <main className="chat-page">
      <div className="chat-layout">
        <section className="chat-panel" aria-label="ห้องสนทนา">
          <header className="chat-header">
            <DesignAsset name="chat" />
            <div className="room-info">
              <h1>{room.title}</h1>
              <span className="chat-presence">
                <span className="dot" />
                พร้อมคุยแล้ว · {room.count}/2 คน
              </span>
            </div>
            <Button
              variant="danger"
              className="exit-button"
              onClick={() => setConfirmExit(true)}
            >
              {owner ? "ปิดห้อง" : "ออกจากห้อง"}
            </Button>
          </header>
          <p className="conversation-note">
            วันนี้ · บทสนทนาเล็ก ๆ ของคนแปลกหน้า
          </p>
          <div
            className="conversation"
            role="log"
            aria-label="ข้อความสนทนา"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {!messages.length && (
              <div className="chat-empty">
                <div className="empty-cloud">
                  <DesignAsset name="clouds" />
                </div>
                <h2>เริ่มด้วยคำว่า “สวัสดี” ก็ได้นะ</h2>
                <p>อีกคนเข้ามาแล้ว เริ่มบทสนทนาได้เลย</p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-row ${message.senderId === clientId ? "mine" : ""}`}
              >
                <div className="message-bubble">
                  <span className="message-author">
                    {message.senderId === clientId ? "คุณ" : "คนแปลกหน้า"}
                  </span>
                  <p>{message.text}</p>
                </div>
                <time dateTime={new Date(message.at).toISOString()}>
                  {new Date(message.at).toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
            ))}
            <div ref={bottom} />
          </div>
          <form className="composer" onSubmit={submit}>
            <label className="sr-only" htmlFor="message">
              ข้อความ
            </label>
            <textarea
              id="message"
              rows={2}
              maxLength={1000}
              value={draft}
              disabled={submitting}
              aria-describedby="message-moderation"
              aria-invalid={check.status === "blocked"}
              onChange={(event) => {
                setDraft(event.target.value);
                setSubmitError("");
              }}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  submit(event);
                }
              }}
              placeholder="พิมพ์สิ่งที่อยากเล่า…"
            />
            <div className="composer-tools">
              <span className="composer-hint">
                Enter เพื่อส่ง · Shift + Enter ขึ้นบรรทัดใหม่
              </span>
              <Button
                disabled={!check.allowed || submitting}
                aria-label="ส่งข้อความ"
              >
                {submitting ? "กำลังส่ง…" : "ส่งข้อความ"}
              </Button>
            </div>
            <span className="char-count">{draft.length} / 1,000 ตัวอักษร</span>
          </form>
          <div className="chat-moderation">
            <ModerationStatus id="message-moderation" check={check} warnMessage="ข้อความนี้อาจเป็นไปในเชิงลบ แต่คุณยังส่งข้อความได้ตามปกติหากไม่พบการรังแก" />
            {submitError && (
              <p role="alert" className="error-text">
                {submitError}
              </p>
            )}
            <p className="moderation-disclosure">
              ข้อความที่พิมพ์จะส่งให้ AI for Thai ตรวจการรังแกและอารมณ์ข้อความ
            </p>
          </div>
        </section>
        <aside className="chat-aside">
          <div className="aside-cloud">
            <DesignAsset name="clouds" />
          </div>
          <h2>
            แชร์ได้ทุกเรื่องราว
            <br />
            แม้กระทั่ง<span className="accent">ความลับ</span>
          </h2>
          <p>
            ที่นี่ไม่มีใครตัดสินคุณ
            <br />
            แค่รับฟัง และให้เกียรติกันก็พอ
          </p>
          <ul>
            <li>♡ แค่เราสองคน</li>
            <li>♡ ไม่ต้องบอกชื่อ</li>
            <li>♡ ออกได้เมื่อพร้อม</li>
          </ul>
        </aside>
      </div>
      <p className="chat-footnote">
        ข้อความอยู่ในหน่วยความจำชั่วคราว ไม่บันทึกลงฐานข้อมูล ·
        เมื่อผู้เข้าร่วมออก บทสนทนาจะถูกล้างก่อนรับคนใหม่
      </p>
      {exit}
    </main>
  );
}
