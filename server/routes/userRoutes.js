const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET /api/users - return all users except admin
router.get('/', async (req, res) => {
    try {
        const users = await User.find({ email: { $ne: 'admin@gmail.com' } }).select('-password'); // Exclude password
        res.status(200).json({ users });
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/users/:id - Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update fields if provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        console.error('Error updating user:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
