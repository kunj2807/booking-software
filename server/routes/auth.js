const express = require('express')
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const JWT_SECRET = "BOOKING"

const router = express.Router()


router.post('/register', [
    body('password', 'Password must be greater than 5 charactors').isLength({ min: 5 }),
    body('firstName', 'Name can not be empty').notEmpty(),
    body('email', 'Email is required and must be a valid email').notEmpty().isEmail(),
], async (req, res) => {
    let success = false

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success = false
        return res.status(400).json({ success, errors: errors.array() })
    }
    const { firstName, lastName, email, password } = req.body;
    try {
        let user = await User.findOne({ where: { email } })
        if (user) {
            success = false
            return res.status(400).json({ success, error: 'Email already exist !' })
        }

        //secure password
        const salt = bcrypt.genSaltSync(10);
        const secPass = bcrypt.hashSync(req.body.password, salt);

        //create user
        user = await User.create({
            firstName,
            lastName,
            email,
            password: secPass,
            verifiedEmail: true,
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' });

        success = true
        res.json({ success, token, user })
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Some error occures" })
    }

})


router.post('/login', [
    body('password', 'Password can not be empty').notEmpty(),
    body('email', 'Email is required and must be a valid email').notEmpty().isEmail(),
], async (req, res) => {
    let success = false
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        success = false
        return res.status(400).json({ success, error: errors.array() })
    }
    try {
        //check email is in database or not
        const { email, password } = req.body
        let user = await User.findOne({ where: { email } })
        if (!user) {
            success = false
            return res.status(400).json({ success, error: "Please enter valid credentials" })
        }
        //check password is right or wrong
        const passwordCheck = bcrypt.compare(password, user.password)

        if (!passwordCheck) {
            success = false
            return res.status(400).json({ success, error: "Please enter valid credentials" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        success = true
        let token = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' });
        res.json({ success, token, user })
    } catch (error) {
        success = false
        res.status(500).json({ success, error: "Internal server error" })
    }
})

module.exports = router
