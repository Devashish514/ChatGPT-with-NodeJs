//content, email, hastags[], topics[], metadata[],
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            default: ""
        },
        content: {
            type: String,
            trim: true,
        },
        hashtags: {
            type: Object,
            default: [],
        },
        metadata: {
            type: Object,
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
