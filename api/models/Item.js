const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['electronics', 'clothing', 'books', 'home', 'sports', 'other']
    },
    inStock: {
        type: Boolean,
        default: true
    },
    quantity: {
        type: Number,
        default: 0,
        min: [0, 'Quantity cannot be negative']
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
itemSchema.index({ category: 1 });
itemSchema.index({ title: 'text', description: 'text' }); // Text search index

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;