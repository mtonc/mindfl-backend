import express from 'express'
import Mood from '../models/Mood'
import bodyParser from 'body-parser'
import { check, validationResult } from 'express-validator'

import { auth } from '../middleware/auth'

const router = express.Router()

router.use(express.json())
router.use(bodyParser.urlencoded({
	type: 'application/x-www-form-urlencoded',
	extended: true
}))

router.post(
	'/',
	auth,
	[
		check('mood').not().isEmpty(),
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
				mood,
				trigger,
				physical,
				notes
			} = await req.body
			const userId = req.user.id

			let newMood = new Mood({
				mood,
				trigger,
				physical,
				notes,
				userId
			})

			await newMood.save();

			res.status(200).json({
				message: 'Successfully saved mood',
				moodId: newMood._id
			})
		} catch (err) {
			console.error(err)
			res.status(500).send({
				message: "Error saving mood"
			})
		}
	}
)

router.get(
	'/user',
	auth,
	async (req, res) => {
		try {
			console.log(req.user.id)
			const moods = await Mood.findByUser(req.user.id)
			res.status(200).json(moods)
		} catch (err) {
			console.error(err)
			res.status(500).send({
				message: "Error getting user's moods"
			})
		}
	}
)

router.get(
	'/:moodId',
	auth,
	async (req, res) => {
		const moodId = req.params.moodId

		try {
			Mood.findById( moodId, (err, doc) => {
				if (err) {
					console.log(err)
					res.status(500).send({
						message: 'No record found for given id.'
					})
				}
				return res.status(200).json({
					mood: doc
				})
			})
		} catch (err) {
			console.error(err)
			res.status(500).send({
				message: 'Error retrieving record'
			})
		}
	}
)

router.delete(
	'/:moodId',
	auth,
	async (req, res) => {
		try {
			const moodId = req.params.moodId		
			await Mood.findByIdAndRemove(moodId, (err) => {
				if (err) {
					console.log(err)
					res.status(500).send({
						message: 'Error deleting record'
					})
				}
				res.status(200).send({
					message: 'successfully deleted record'
				})
			})
		} catch (err) {
			console.error(err)
			res.status(500),send({
				message: "Error deleting recod"
			})
		}
	}
)

export default router