import mongoose  from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    email :{
        type : String,
        required :true,
        unique : true,
        validate : [validator.isEmail, 'Please provide a valid email']
    },
    password : {
        type : String,
        required : true
    },
    img : {
        type : String,
        default : "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
    }
}, {timestamps : true});

const User = mongoose.model('User', userSchema);

export default User;