import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import dotenv from "dotenv";
import admin from '../firebaseAdmin.js'; // already initialized here

dotenv.config();
const router = express.Router();

// Traditional email/password login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role, company: user.company },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// User registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      company,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration Error:", err.message, err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔐 Google login endpoint
router.post('/google-login', async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name } = decodedToken;

    if (!email) return res.status(400).json({ message: "Invalid Google account" });

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: "", // empty since it's a Google account
        role: "user",
        company: "",
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id,name:user.name, role: user.role, company: user.company },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Google login error:", err.message);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

export default router;
