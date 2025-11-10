const express = require("express");
const pool = require("../../configs/db");
const router = express.Router();

// 찜 추가
router.post("/add", async (req, res) => {
  const { userEmail, parkingLotCode } = req.body;

  if (!userEmail || !parkingLotCode) {
    return res.status(400).json({
      success: false,
      message: "유저 이메일과 주차장 코드가 필요합니다.",
    });
  }

  try {
    const [existing] = await pool.query(
      "SELECT * FROM favorites WHERE user_email = ? AND parking_lot_code = ?",
      [userEmail, parkingLotCode]
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "이미 찜한 주차장입니다." });
    }

    await pool.query(
      "INSERT INTO favorites (user_email, parking_lot_code) VALUES (?, ?)",
      [userEmail, parkingLotCode]
    );

    res.json({ success: true, message: "찜 목록에 추가되었습니다." });
  } catch (err) {
    console.error("찜 추가 DB 오류:", err);
    res.status(500).json({ success: false, message: "DB 오류" });
  }
});

// 찜 목록 조회
router.get("/user/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT
         f.id AS favorite_id,
         p.*
       FROM favorites f
       JOIN hotspot_parking_lots p ON f.parking_lot_code = p.prk_cd
       WHERE f.user_email = ?
       ORDER BY f.created_at DESC`,
      [userEmail]
    );
    res.json({ success: true, favorites: rows });
  } catch (err) {
    console.error("찜 목록 조회 DB 오류:", err);
    res.status(500).json({ success: false, message: "DB 오류" });
  }
});

// 찜 삭제
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM favorites WHERE id = ?", [id]);
    res.json({ success: true, message: "찜 목록에서 삭제되었습니다." });
  } catch (err) {
    console.error("찜 삭제 DB 오류:", err);
    res.status(500).json({ success: false, message: "DB 오류" });
  }
});

module.exports = router;
