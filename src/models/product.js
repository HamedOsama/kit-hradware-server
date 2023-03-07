const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 5
    },
    brand:{
        type: String,
        required: true,
        trim: true,
    },
    images: [{
        type: String,
        // required:true
    }],
    sellPrice: {
        type: Number,
        maxLength: [8, "Price cannot exceed 8 characters"],
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    properties: [{
        title: {
            type: String,
            required: true,
            trim: true
        },
        value: {
            type: String,
            required: true,
            trim: true
        }
    }],
    quantity: {
        type: Number,
        default: 0,
        maxLength: [5, "Stock cannot exceed 5 characters"]
    },
    rate: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 0,
    },
    
},{ timestamps: true })
const Product = mongoose.model('products', productSchema)
module.exports = Product