import DesignAsset from "../components/DesignAsset";
import Button from "../components/Button";

export default function Home({ ready, count, onCreate, onBrowse }) {
  return (
    <>
      <section className="hero-section" aria-labelledby="home-title">
        <div className="hero-copy">
          <span className="eyebrow peach-pill">วันนี้ ใจอยากเล่าอะไรบ้าง?</span>
          <h1 id="home-title">
            คนแปลกหน้า
            <br />
            ที่อาจทำให้คุณ<span className="accent">สบายใจ</span>
          </h1>
          <p className="hero-description">
            ไม่ต้องรู้จักกันมาก่อน ก็เป็นผู้ฟังที่ดีให้กันได้
            <br />
            เลือกเปิดห้องของคุณ หรือเป็นใครสักคนที่อยู่ตรงนี้
          </p>
        </div>
        <div className="hero-art">
          <DesignAsset name="clouds" alt="เมฆน้อยสองคนยิ้มให้กัน" />
        </div>
      </section>
      <section className="action-grid" aria-label="เริ่มต้นสนทนา">
        <article className="action-card create-card">
          <div className="card-kicker">
            <DesignAsset name="plus" />
            <span>01 / เปิดพื้นที่ให้เรื่องของคุณ</span>
          </div>
          <h2>วันนี้อยากเล่า</h2>
          <p>
            มีเรื่องในใจใช่ไหม? สร้างห้องเล็ก ๆ<br />
            แล้วรอใครสักคนเข้ามารับฟัง
          </p>
          <Button disabled={!ready || count >= 100} onClick={onCreate}>
            สร้างห้องของฉัน ＋
          </Button>
          {count >= 100 && (
            <small role="status">
              ครบ 100 ห้องแล้ว กรุณารอให้มีห้องปิดก่อน
            </small>
          )}
        </article>
        <article className="action-card join-card">
          <div className="card-kicker">
            <DesignAsset name="chat" />
            <span>02 / เป็นความสบายใจให้ใครสักคน</span>
          </div>
          <h2>วันนี้อยากฟัง</h2>
          <p>
            เลือกเรื่องที่คุณอยากคุย
            <br />
            บางคนอาจกำลังรอคุณอยู่พอดี
          </p>
          <Button variant="white" onClick={onBrowse}>
            เลือกห้องสนทนา →
          </Button>
        </article>
      </section>
      <section className="principles" aria-label="คำมั่นของพื้นที่นี้">
        <div>
          <DesignAsset name="heart" />
          <span>
            <strong>แค่เราสองคน</strong>ห้องเล็ก ๆ สำหรับบทสนทนา 1 ต่อ 1
          </span>
        </div>
        <div>
          <DesignAsset name="shield" />
          <span>
            <strong>เป็นตัวเองได้เต็มที่</strong>ไม่ต้องสมัครสมาชิกหรือบอกชื่อ
          </span>
        </div>
        <div>
          <DesignAsset name="conversation" />
          <span>
            <strong>คุยกันอย่างอ่อนโยน</strong>ช่วยกันให้พื้นที่นี้อบอุ่นเสมอ
          </span>
        </div>
      </section>
    </>
  );
}
