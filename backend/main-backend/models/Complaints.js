import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
    user_Id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Storing reference to User's _id
    phone: String,
    name: String,
    gender: String,
    age: Number,
    pnr: String,
    trainCode: String,
    trainName: String,
    trainDepartureDate: String,
    media: [String],
    description: String,
    type: String,
    subtype: String,
    employeeWorking: String,
    resolved: { type: Number, default: 0 }, // 0 = Not resolved, 1 = Resolved
    severity: String
}, { timestamps: true });

export default mongoose.model('Complaints', complaintSchema);
