import mongoose from 'mongoose';

const trainSchema = new mongoose.Schema({
    trainCode:String,
    trainDepartureDate: Date,
    station:String,
    category:Object
});
export default mongoose.model('trainData', trainSchema);