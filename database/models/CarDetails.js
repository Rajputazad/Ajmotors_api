const mongoose = require("mongoose")

const theme = mongoose.Schema({
    
    imagedetails:[],
  
    carname: {
        require: [true, "carname  required"],
        type:String
    },
    model:{
        require: [true, "model  required"],
        type:String
    },
    kilometers:{
        require: [true, "history  required"],
        type:String
    },
    service:{
        require: [true, "service  required"],
        type:String
    },
    registration:{
        require: [true, "registration  required"],
        type:String
    },
    owner:{
        require: [true, "owner  required"],
        type:String
    },
    fuel:{
        require: [true, "fuel  required"],
        type:String
    },
    transmission:{
        require: [true, "transmission  required"],
        type:String
    },
    insurance:{
        require: [true, "insurance  required"],
        type:String
    },
    price:{
        require: [true, "price  required"],
        type:String
    },
    description:{
        require: [true, "description  required"],
        type:String
    },
    numberplate:{
        require: [true, "description  required"],
        type:String
    }
})

module.exports = mongoose.model("CarDetails", theme)
