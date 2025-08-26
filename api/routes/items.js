const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET all items
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            inStock,
            minPrice,
            maxPrice,
            search
        } = req.query;

        const filter = {};

        // Apply filters
        if (category) filter.category = category;
        if (inStock !== undefined) filter.inStock = inStock === 'true';
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        // Text search
        if (search) {
            filter.$text = { $search: search };
        }

        const items = await Item.find(filter)
            .populate('createdBy', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Item.countDocuments(filter);

        res.json({
            items,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET item by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
            .populate('createdBy', 'name email');
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create new item
router.post('/', async (req, res) => {
    try {
        const item = new Item(req.body);
        const savedItem = await item.save();
        const populatedItem = await Item.findById(savedItem._id)
            .populate('createdBy', 'name email');
        res.status(201).json(populatedItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT update item
router.put('/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('createdBy', 'name email');

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE item
router.delete('/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH update stock status
router.patch('/:id/stock', async (req, res) => {
    try {
        const { inStock, quantity } = req.body;
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        if (inStock !== undefined) item.inStock = inStock;
        if (quantity !== undefined) item.quantity = quantity;

        const updatedItem = await item.save();
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET items by category
router.get('/category/:category', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const category = req.params.category;

        const items = await Item.find({ category })
            .populate('createdBy', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Item.countDocuments({ category });

        res.json({
            items,
            category,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;