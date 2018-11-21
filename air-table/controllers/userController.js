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
		newUser.save((err) => {
			if(err)
				return console.log(err)
			else
				console.log('user created')
        })
        
        return false;
    },
    async getUsers () {
        return await User.find({});
    }
}

module.exports = user;