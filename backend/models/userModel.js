// user authentication model creation 

import mongoose from "mongoose";

// development of the scheme database 
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData:{type:Object,default:{}}
}, { minimize: false })

// this indicates if there is already a model present then that would be fetched from the datbase else one would be created 
const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;