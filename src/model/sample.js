import mongoose from "mongoose";

const sampleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },    
    email: {
        type: String,
        required: true
    }
});

export const sampleModel = mongoose.model("sample", sampleSchema);
