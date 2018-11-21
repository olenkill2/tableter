const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	userId: {
		type: String,
		required: true,
		unique: true
	},
	fullName: {
		type: String,
		default: ''
	},
	subscribed: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema);