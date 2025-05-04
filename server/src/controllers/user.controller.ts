// src/controllers/user.controller.ts
import { Request, Response } from "express";
import User from "../models/User";

// Get all users (excluding password)
export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: err,
    });
  }
};

// Get a user's profile by ID (excluding password)
export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to get profile",
      error: err,
    });
  }
};
