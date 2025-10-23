import express from "express";
import Manager from "../models/Manager.js";
import Stats from "../models/Stats.js";

const router = express.Router();

// Get manager profile
router.get("/manager", async (req, res) => {
  const manager = await Manager.findOne();
  res.json(manager);
});

// Get today's stats
router.get("/stats", async (req, res) => {
  const stats = await Stats.findOne().sort({ date: -1 });
  res.json(stats);
});

// Get quick actions (static for now)
router.get("/actions", (req, res) => {
  const actions = [
    { id: "1", label: "Ride Planner", icon: "calendar", nav: "CreatePoll", color: "#8E44AD", description: "Plan new routes" },
    { id: "2", label: "Responses", icon: "chatbubble", nav: "ViewResponse", color: "#3498DB", description: "View poll results" },
    { id: "3", label: "Assign Route", icon: "map", nav: "AssignRoute", color: "#27AE60", description: "Assign drivers" },
    { id: "4", label: "Live Tracking", icon: "location", nav: "VanTracking", color: "#E74C3C", description: "Real-time tracking" },
    { id: "5", label: "Smart Schedule", icon: "time", nav: "SmartScheduling", color: "#F39C12", description: "Optimize schedules" },
  ];
  res.json(actions);
});

export default router;
