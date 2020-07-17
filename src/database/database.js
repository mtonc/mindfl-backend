import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config({path: 'config/.env'})

export const initDB = async () => {

	// if production, connect to mongo docker container in service
	const host = (process.env.NODE_ENV == 'production') ? 'mongo' : 'localhost'

	try {
		const db = await mongoose.connect(`mongodb://${host}:27017/mindfl`, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
			user: process.env.MONGO_NON_ROOT_USERNAME,
			pass: process.env.MONGO_NON_ROOT_PASSWORD
		})

		return db
	} catch (e) {
		console.error(e)
		throw e
	}

	mongoose.connection.on('error', err => console.error(err))
	mongoose.connection.on('open', err => {
		if (err) {
			console.error(err)
		}
		console.log('Successfully connected to db')
	})
}