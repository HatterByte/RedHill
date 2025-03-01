import mongoose from 'mongoose';

const trainstatusSchema = new mongoose.Schema({
    train_code:String,
    train_name:String,
    stations:[String]
});
export default mongoose.model('trainstatus', trainstatusSchema);