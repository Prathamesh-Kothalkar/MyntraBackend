const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config");
const Admin = require("../model/adminModel");

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

module.exports= {
    loginAdmin,createAdmin
}