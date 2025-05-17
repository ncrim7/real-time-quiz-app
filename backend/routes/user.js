const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: "Kullanıcı kaydedildi." });
  } catch (error) {
    res.status(500).json({ error: "Kayıt başarısız." });
  }
});

module.exports = router;
