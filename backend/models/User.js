import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    phone: { type: String, unique: true },
    password: String,
    name: { type: String, default: "User" },
    complaintTickets:[String],
    isAdmin: { type: Boolean, default: false },
    chatId: { type: String, unique: true, sparse: true }
});

export default mongoose.model('User', UserSchema);