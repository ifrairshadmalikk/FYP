import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  passengers: {
    total: Number,
    picked: Number,
    percentage: Number,
  },
  drivers: {
    total: Number,
    active: Number,
    percentage: Number,
  },
  delay: {
    vansLate: Number,
    onTime: Number,
    percentage: Number,
  },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Stats", statsSchema);
