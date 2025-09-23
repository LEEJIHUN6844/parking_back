const express = require("express");
const pool = require('../../configs/db');
const bcrypt = require("bcrypt");

const router = express.Router();
const saltRounds = 10;

// 회원가입
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPw = await bcrypt.hash(password, saltRounds);
    const [result] = await pool.query(
      "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPw]
    );
    res.json({ success: true, userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "DB 오류" });
  }
});

// 로그인
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM user WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ success: false, message: "유저 없음" });

    const match = await bcrypt.compare(password, rows[0].password);
    if (!match) return res.status(400).json({ success: false, message: "비밀번호 틀림" });

    res.json({ success: true, user: { id: rows[0].id, name: rows[0].name, email: rows[0].email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "DB 오류" });
  }
});

module.exports = router;
