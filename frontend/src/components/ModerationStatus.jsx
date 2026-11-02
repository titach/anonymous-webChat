export default function ModerationStatus({ check, id }) {
  return (
    <div id={id}>
      <div
        className={`moderation-status ${check.status}`}
        role="status"
        aria-live="polite"
      >
        {check.status === "checking" && "กำลังตรวจข้อความ…"}
        {check.status === "allowed" && "ตรวจข้อความแล้ว พร้อมใช้งาน"}
        {(check.status === "blocked" || check.status === "error") &&
          check.message}
        {check.status === "error" && (
          <button type="button" className="text-button" onClick={check.retry}>
            ลองตรวจใหม่
          </button>
        )}
      </div>
      {check.sentiment?.negative && (
        <p className="sentiment-warning" role="status" aria-live="polite">
          ข้อความนี้อาจเป็นไปในเชิงลบ คุณยังสร้างห้องหรือส่งข้อความได้ตามปกติ
          หากไม่พบการรังแก
        </p>
      )}
      {check.sentiment?.status === "error" && (
        <p className="sentiment-note" role="status">
          ตรวจอารมณ์ข้อความไม่ได้ในขณะนี้ แต่ยังใช้งานได้ตามปกติ
        </p>
      )}
    </div>
  );
}
