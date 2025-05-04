// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// Register User
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User registered successfully",
      data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err });
  }
};

// Login User
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
};
