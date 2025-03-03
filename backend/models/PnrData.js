import mongoose from "mongoose";

const PnrDataSchema = new mongoose.Schema({
  pnrNumber: {
    type: String,
    required: true,
    unique: true, // Ensure each PNR is unique
    trim: true,
    minlength: 10, // PNR must be at least 10 characters
    maxlength: 10, // PNR must be exactly 10 characters
  },
  trainCode: {
    type: String,
    required: true,
    trim: true,
  },
  trainName: {
    type: String,
    required: true,
    trim: true,
  },
  trainDepartureDate: {
    type: Date,
    required: true,
  },
  source: {
    type: String,
    required: true,
    trim: true,
  },
  destination: {
    type: String,
    required: true,
    trim: true,
  },
  bookingStatus: {
    type: String,
    required: true,
    enum: ["CONFIRMED", "WAITLIST", "CANCELLED"], // Allowed booking statuses
    default: "CONFIRMED",
  },
  passengerInfo: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      age: {
        type: Number,
        required: true,
        min: 1, // Age must be at least 1
      },
      gender: {
        type: String,
        required: true,
        enum: ["M", "F", "O"], // Allowed gender values
      },
      seatNumber: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically set the update date
  },
});

// Update the `updatedAt` field before saving the document
PnrDataSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model
const PnrData = mongoose.model("PnrData", PnrDataSchema);

export default PnrData;
