const mongoose = require("mongoose")

const theme = mongoose.Schema({
    
    themename:{
        require: [true, "themename  required"],
        type:String
    },
  
    themeimage: {
        require: [true, "themeimage  required"],
        type:String
    },
    themeurl:{
        require: [true, "themenameurl  required"],
        type:String
    },
})

module.exports = mongoose.model("themes", theme)
