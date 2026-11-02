import { useState } from "react";
import Icon from "./Icon";
import DesignAsset from "./DesignAsset";
import Button from "./Button";
import { useModeration } from "../hooks/useModeration";
import ModerationStatus from "./ModerationStatus";

// Keep the existing component entry point while presenting the full-page Figma form.
export default function CreateRoomDialog({
  count,
  onClose,
  onCreate,
  request,
}) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const check = useModeration(title, "title", request);
  const full = count >= 100;
  async function submit(event) {
    event.preventDefault();
    if (!check.allowed || full || submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const reply = await onCreate(title.trim());
      if (!reply.ok) setSubmitError(reply.message);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <section className="create-page" aria-labelledby="create-title">
      <div className="create-form-card">
        <span className="eyebrow lavender-pill">
          พื้นที่ของคุณ กำลังจะเริ่มต้น
        </span>
        <h1 id="create-title">วันนี้อยากเล่าเรื่องอะไร?</h1>
        <p className="muted">ตั้งหัวข้อให้ใครสักคนรู้ ว่าคุณอยากคุยเรื่องไหน</p>
        <form onSubmit={submit}>
          <label htmlFor="room-title">หัวข้อห้องสนทนา</label>
          <input
            id="room-title"
            autoFocus
            value={title}
            disabled={submitting}
            aria-describedby="title-moderation title-disclosure"
            aria-invalid={check.status === "blocked"}
            onChange={(event) => {
              setTitle(event.target.value);
              setSubmitError("");
            }}
            maxLength={80}
            placeholder="เช่น อยากมีคนฟังเรื่องของวันนี้"
            required
          />
          <div className="field-note">
            <span>ใช้หัวข้อแทนข้อมูลส่วนตัว</span>
            <span>{title.length} / 80 ตัวอักษร</span>
          </div>
          <ModerationStatus id="title-moderation" check={check} />
          <p id="title-disclosure" className="moderation-disclosure">
            ชื่อห้องที่พิมพ์จะส่งให้ AI for Thai ตรวจการรังแกและอารมณ์ข้อความ
          </p>
          <div className="gentle-note">
            <DesignAsset name="shield" />
            <p>
              ห้องนี้มีที่สำหรับคุณและผู้ฟังอีก 1 คน
              <br />
              เมื่อคุณปิดห้อง บทสนทนาจะถูกลบ
            </p>
          </div>
          {submitError && (
            <p role="alert" className="error-text">
              {submitError}
            </p>
          )}
          {full && (
            <p role="alert" className="error-text">
              ครบ 100 ห้องแล้ว กรุณารอให้มีห้องปิดก่อน
            </p>
          )}
          <Button
            className="full-width"
            disabled={full || !check.allowed || submitting}
          >
            {submitting ? "กำลังสร้างห้อง…" : "สร้างห้องและรอคนเข้าร่วม"}
          </Button>
        </form>
        <button
          className="text-button back-button"
          disabled={submitting}
          onClick={onClose}
        >
          <Icon name="arrow" /> กลับหน้าหลัก
        </button>
      </div>
    </section>
  );
}
