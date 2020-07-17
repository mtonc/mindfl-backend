import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from '../models/User'
import bodyParser from 'body-parser'
import {check, validationResult} from 'express-validator'

import { auth } from '../middleware/auth'

const router = express.Router()

router.use(express.json())
router.use(bodyParser.urlencoded({
	type: 'application/x-www-form-urlencoded',
	extended: true
}))

router.post(
	'/signup',
	[
		check('username')
			.not().isEmpty().withMessage("Username cannot be empty."),
		check('email')
			.isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
		check('password')
			.isLength({
				min: 6
			}).withMessage("Password must be at least 6 characters long")
			.isAscii().withMessage("Password contains invalid characters")
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			res.status(400).json({
				errors: errors.array()
			})
		}

		try {
			const {
				username,
				email,
				password
			} = await req.body

			let user = await User.findOne({
				email
			})
			if (user) {
				return res.status(400).json({
					msg: 'Email already in use'
				})
			}

			user = new User({
				username,
				email,
				password
			})

			const salt = await bcrypt.genSalt(10)
			console.log(`password: ${password}`);
			console.log(`salt: ${salt}`);
			user.password = await bcrypt.hash(password, salt)

			await user.save()

			const payload = {
				user: {
					id: user.id
				}
			}

			jwt.sign(
				payload,
				'randomString', {
					expiresIn: 10000
				},
				(err, token) => {
					if (err) throw err
					res.status(200).json({
						token
					})
				}
			)
		} catch (err) {
			console.error(err)
			res.status(500).send("Error saving user")
		}
	}
)

router.post(
	'/login',
	[
		check('email')
			.isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
		check('password')
			.isLength({
				min: 6
			}).withMessage('Password must be at least 6 chars long.')
			.isAscii().withMessage('Password contains invalid characters.')
	],
	async (req, res) => {
		try {
			const { email, password } = await req.body
			let user = await User.findOne({
				email
			})

			if (!user) {
				return res.status(400).json({
					message: "User does not exist"
				})
			}

			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) {
				return res.status(400).json({
					message: "Incorrect Password"
				})
			}

			const payload = {
				user: {
					id: user.id
				}
			}

			jwt.sign(
				payload,
				"randomString",
				{
					expiresIn: 3600
				},
				(err, token) => {
					if (err) throw err
					res.status(200).json({
						token
					})
				}
			)
		} catch (e) {
			console.error(e)
			res.status(500).json({
				message: "Server Error"
			})
		}
	} 
)

router.get(
	'/self',
	auth,
	async (req, res) => {
		try {
			const user = await User.findById(req.user.id)
			return res.json(user)
		} catch (e) {
			console.error(e)
			res.send({ message: 'Error fetching user' })
		} 
	}
)

export default router