const User = require("../models/User");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(req.body);
        const oldUser = await User.findOne({ email });
        console.log(oldUser);
        if (oldUser) {
            return res.status(400).json({
                success: false,
                message: "User already exist"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashPassword });
        res.status(201).json({
            success: true,
            message: "User registration success"
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Unable to register user",
            error: err.message
        })
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email ID"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(403).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            { id: user._id }, process.env.SECRET_KEY, { expiresIn: "15m" }
        );

        res.status(201).json({
            success: true,
            message: "Login Success",
            token,
            user: {
                name: user.name,
                email: user.email
            }
        });
    }
    catch (err) {
        console.log(err);
    }
};

const profile = (req, res) => {
    res.json({
        success: true,
        message: "Profile Fetched",
        user: req.user
    });
};

const logout = (req, res) => {
    res.json({
        success: true,
        message: "Logout Success, Please remove token."
    })
};

module.exports = { register, login, profile, logout };