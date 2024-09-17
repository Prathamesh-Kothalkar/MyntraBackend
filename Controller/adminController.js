const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config");
const Admin = require("../model/adminModel");
const User = require('../model/userModel');
const Order = require('../model/orderModel')

const createAdmin = async (req, res) => {

    try {
        const { name, email, phone, password } = req.body;

        const isAdminExist = await Admin.findOne({ email });
        if (isAdminExist) {
            return res.status(400).json({
                message: "Admin already exists with the same Email-ID"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            name,
            email,
            phone,
            password: hashedPassword
        });

        if (!admin) {
            return res.status(500).json({
                message: "Error while creating a Admin"
            });
        }

        const adminId = admin._id;
        const token = jwt.sign({ adminId }, JWT_SECRET);

        res.status(201).json({
            message: "Admin created successfully",
            token: token
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const adminId = Admin._id;
        const token = jwt.sign({ adminId }, JWT_SECRET);

        res.status(200).json({
            message: "Sign-in successful",
            token: token
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

const allUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json( users )
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

const allOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
}

const dashBoardAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate({ path: 'orders.items.items.productId', model: 'Product' });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
}

const dashboard = async (req, res) => {
    try {
        const users = await User.find({});
        function groupUsersByMonth(users) {
            const groupedUsers = {};
            users.forEach(user => {
              const createdAtDate = new Date(user.createdAt);
              const monthIndex = createdAtDate.getMonth();
              const monthName = createdAtDate.toLocaleString('en-US', { month: 'long' });
              if (!groupedUsers[monthIndex]) {
                groupedUsers[monthIndex] = {
                  monthName,
                  users: []
                };
              }
              groupedUsers[monthIndex].users.push({"name": user.name,"email": user.email, "phone": user.phone});
            });
            return Object.values(groupedUsers);
          }
        res.json(groupUsersByMonth(users));
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch Data" });
    }
}

const updateOrderStatus = async (req, res) => {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findOneAndUpdate(
            { 'orders._id': orderId, 'orders.items._id': itemId },
            { $set: { 'orders.$.orderStatus': status } },
            { new: true }
        );
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Failed to update order status" });
    }
}

module.exports= {
    loginAdmin,createAdmin, allUsers, allOrders, updateOrderStatus, dashboard, dashBoardAllOrders
}