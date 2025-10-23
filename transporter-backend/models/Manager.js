import mongoose from "mongoose";

const managerSchema = new mongoose.Schema({
  name: String,
  role: String,
  phone: String,
  experience: String,
  rating: Number,
  totalRoutes: Number,
  completedTrips: Number,
  avatar: String
});

export default mongoose.model("Manager", managerSchema);
