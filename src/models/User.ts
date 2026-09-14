// Author(s): Alma Isaksson
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: { // Hashed
        type: String,
        required: true
    },
    is_admin: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("users", UsersSchema);