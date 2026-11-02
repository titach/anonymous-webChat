import { useState } from "react";
import Button from "../components/Button";
import DesignAsset from "../components/DesignAsset";
import Icon from "../components/Icon";

export default function Rooms({ rooms, ready, onBack, onCreate, onJoin }) {
  const [query, setQuery] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const available = rooms.filter((room) => room.count < 2).length;
  const filtered = rooms.filter(
    (room) =>
      room.title
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()) &&
      (!availableOnly || room.count < 2),
  );
  return (
    <section className="rooms-page">
      <div className="page-heading">
        <span className="eyebrow">ค้นหาบทสนทนาที่พอดีกับใจ</span>
        <h1>วันนี้อยากคุยเรื่องไหนดี?</h1>
        <p className="muted">เลือกห้องที่ว่าง แล้วเข้าไปทักทายกันได้เลย</p>
      </div>
      <div className="room-toolbar">
        <label className="search-field">
          <Icon name="search" />
          <input
            aria-label="ค้นหาหัวข้อห้อง"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหาหัวข้อที่อยากคุย…"
          />
        </label>
        <Button onClick={onCreate} disabled={!ready || rooms.length >= 100}>
          ＋ สร้างห้อง
        </Button>
      </div>
      <div className="list-caption">
        <div className="filter-tabs" role="group" aria-label="กรองห้อง">
          <button
            className={`filter-tab ${!availableOnly ? "selected" : ""}`}
            aria-pressed={!availableOnly}
            onClick={() => setAvailableOnly(false)}
          >
            ห้องทั้งหมด {rooms.length}
          </button>
          <button
            className={`filter-tab ${availableOnly ? "selected" : ""}`}
            aria-pressed={availableOnly}
            onClick={() => setAvailableOnly(true)}
          >
            เฉพาะห้องว่าง {available}
          </button>
        </div>
        <span>เปิดอยู่ {rooms.length} / 100 ห้อง</span>
      </div>
      {filtered.length ? (
        <div className="room-list">
          {filtered.map((room) => (
            <article key={room.id} className="room-card">
              <div className="room-card-top">
                <DesignAsset name="chat" />
                <h2>{room.title}</h2>
                <span className={`status ${room.count === 2 ? "full" : ""}`}>
                  {room.count === 2 ? "เต็มแล้ว" : "ว่างอยู่"} · {room.count}/2
                </span>
              </div>
              <div className="room-card-bottom">
                <p>
                  {room.count === 2
                    ? "ตอนนี้มีคนรับฟังอยู่แล้ว"
                    : "พื้นที่เล็ก ๆ สำหรับบทสนทนาดี ๆ"}
                </p>
                <Button
                  variant="secondary"
                  disabled={!ready || room.count === 2}
                  onClick={() => onJoin(room.id)}
                >
                  {room.count === 2 ? "ห้องเต็ม" : "เข้าร่วมห้อง →"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-cloud">
            <DesignAsset name="clouds" />
          </div>
          <h2>
            {rooms.length
              ? "ยังไม่พบห้องที่ตรงกัน"
              : "บทสนทนาแรก อาจเริ่มจากคุณ"}
          </h2>
          <p>
            {rooms.length
              ? "ลองเปลี่ยนคำค้น หรือดูห้องทั้งหมดอีกครั้ง"
              : "ยังไม่มีห้องในตอนนี้ ลองสร้างห้องเพื่อเริ่มบทสนทนาแรก"}
          </p>
          {!rooms.length && (
            <Button onClick={onCreate} disabled={!ready}>
              สร้างห้องแรก ＋
            </Button>
          )}
        </div>
      )}
      <button className="text-button back-button" onClick={onBack}>
        ← กลับหน้าหลัก
      </button>
    </section>
  );
}
