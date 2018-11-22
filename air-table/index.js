const TelegramBot = require('node-telegram-bot-api');
const Agent = require('socks5-https-client/lib/Agent')
const config = require('./config/config.js');
const user = require('./controllers/userController.js');
const mongoose = require('mongoose');
const cron = require('node-cron');

mongoose.connect(config.databaseUrl).then((db) => {
	console.log('connected')
}).catch((err) => {
	console.log(err.message)
});

const checkDb = () => {
	if(mongoose.connection.readyState === 1) 
		return true;
	else 
		return false;
}

const bot = new TelegramBot(config.secretToken, {
	polling: true, 
	request: {
		agentClass: Agent,
		agentOptions: config.proxyAgent
	}
});

bot.onText(/start/, async (msg, match) => {
    const res = await user.regUser({
        userId: msg.from.id,
        created_at: new Date()
    });

	const message = `Привет, ${msg.from['first_name']}! Я буду напоминать тебе про air-table в 17:48 :D`;
	bot.sendMessage(msg.chat.id, message, {parse_mode: 'HTML'});
});

cron.schedule('42 23 * * 1-5', async () => {
    const users = await user.getUsers();
    console.log('asdlfasldfj');
    
    for(const user of users)
    {
        console.log(user);
        
        bot.sendMessage(user.userId, 'гыгы!!!!');
    }
    
});