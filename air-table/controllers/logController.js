const mongoose = require('mongoose');
const moment = require('moment');
const Log = require('../models/Log.js');
// const UserDate = require('../models/Date.js');

const logs = {
	async add (log) {        
		const newLog = Log(log);
		newLog.save();
        
        return false;
    },
    async getLogs () {
        return await Log.find({});
    }
}

module.exports = logs;