import mongoose from "mongoose";

const componentSchema=new mongoose.Schema({
    
    componentName:{
        type:String,
        required:true,
        unique:true
    },
    quantity:{
        type:Number,
        required:true
    }
    
})

const userComp=mongoose.model("users",componentSchema);

export default userComp;