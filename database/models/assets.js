const mongoose = require("mongoose")

const aasets = mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId ,
    },
    profileUrl:{type:String},
    resumeUrl:{type:String}
})

module.exports = mongoose.model("User_assets", aasets)