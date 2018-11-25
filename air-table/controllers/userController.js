const mongoose = require('mongoose');
const moment = require('moment');
const User = require('../models/User.js');
// const UserDate = require('../models/Date.js');

const user = {
	async regUser (user) {
        const result = await User.find({userId: user.userId})
        if(result.length != 0)
            return false;
        
		const newUser = User(user);
		newUser.save();
        
        return false;
    },
    async setFullName (user) {
        const result = await User.find({userId: user.userId})
        await User.updateOne({ userId: user.userId}, {$set: {fullName: user.fullName, subscribed: true}},{new: true});
        return true;
    },
    async unscribe (user) {
        const res = await User.updateOne({ userId: user.userId}, {$set: {subscribed: false}},{new: true});
        return true;
    },
    async getUser (id) {
        return await User.findOne({userId: id});
    },
    async getUsers () {
        return await User.find({});
    }
}

module.exports = user;