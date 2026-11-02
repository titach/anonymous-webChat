import { useEffect, useRef } from "react";
import DesignAsset from "./DesignAsset";
import Button from "./Button";

export default function ExitRoomDialog({ owner, onCancel, onConfirm }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal exit-modal"
      aria-labelledby="exit-title"
      onCancel={onCancel}
    >
      <div className="modal-body">
        <div className="exit-cloud">
          <DesignAsset name="clouds" />
        </div>
        <h2 id="exit-title">พักบทสนทนาไว้ตรงนี้ไหม?</h2>
        <p className="muted">
          {owner
            ? "เมื่อคุณปิดห้อง ห้องจะหายจากรายการ และข้อความของทั้งสองคนจะถูกลบ"
            : "เมื่อออก ข้อความจะถูกล้าง และห้องจะเปิดรับคนใหม่"}
        </p>
        <div className="dialog-actions">
          <Button variant="secondary" autoFocus onClick={onCancel}>
            คุยต่อ
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {owner ? "ยืนยันปิดห้อง" : "ยืนยันออกจากห้อง"}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
