import mongoose from 'mongoose';

const trainSchema = new mongoose.Schema({
    trainCode:String,
    trainName:String,
    source:String,
    destination:String,
});
export default mongoose.model('trainData', trainSchema);