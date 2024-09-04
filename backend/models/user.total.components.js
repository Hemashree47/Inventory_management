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

const userComponents=mongoose.model("components",componentSchema);

export default userComponents;