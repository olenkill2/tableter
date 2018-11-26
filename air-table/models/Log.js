const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
	userId: {
		type: String,
		required: true,
    },
    fullName: {
        type: String,
		required: true,
    },
	comand: {
		type: String,
		required: true,
	},
	whoSend: {
        type: String,
		required: true,
    },
    response: {
        type: String,
        required: true,
    },
    create_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Log', logSchema);