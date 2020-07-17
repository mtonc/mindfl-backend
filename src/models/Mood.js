import mongoose from 'mongoose'

const MoodSchema = mongoose.Schema({
	mood: {
		type: String,
		required: true
	},
	trigger: String,
	physical: String,
	notes: String,
	userId: {
		type:String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now()
	}
})

MoodSchema.statics.findByUser = function (id) {
	return this.find({userId: id})
}

export default mongoose.model('Mood', MoodSchema)