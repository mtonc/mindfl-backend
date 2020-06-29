import mongoose from 'mongoose'

export const initDB = () => {
	try {
		mongoose.connect('mongodb://mongo:27017/mindfl', {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
			user: process.env.MONGO_USER,
			pass: process.env.MONGO_PW
		})
	} catch (e) {
		console.error(e)
		throw e
	}
	
	mongoose.connection.on('open', err => {
		if (err) console.error(err)
		console.log('Successfully connected to db')
	}).catch( err => console.error(err))
}