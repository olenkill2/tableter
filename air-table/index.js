process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const Agent = require('socks5-https-client/lib/Agent')
const config = require('./config/config.js');
const user = require('./controllers/userController.js');
const log = require('./controllers/logController.js');
const mongoose = require('mongoose');
const cron = require('node-cron');
const request = require('request-promise');

// параметры для гет запроса к airtable
const options = {
    url: 'https://airtable.com/v0.3/table/tblLcFW7k7ECFGgfx/readData?stringifiedObjectParams=%7B%22includeDataForViewIds%22%3Anull%7D&requestId=reqtjqT2x1R23IUd0&accessPolicy=%7B%22allowedActions%22%3A%5B%7B%22modelClassName%22%3A%22application%22%2C%22modelIdSelector%22%3A%22appraCyeBM03Mocds%22%2C%22action%22%3A%22read%22%7D%2C%7B%22modelClassName%22%3A%22application%22%2C%22modelIdSelector%22%3A%22appraCyeBM03Mocds%22%2C%22action%22%3A%22readBlockInstallationPages%22%7D%2C%7B%22modelClassName%22%3A%22application%22%2C%22modelIdSelector%22%3A%22appraCyeBM03Mocds%22%2C%22action%22%3A%22readBlockInstallations%22%7D%2C%7B%22modelClassName%22%3A%22application%22%2C%22modelIdSelector%22%3A%22appraCyeBM03Mocds%22%2C%22action%22%3A%22readInitialDataForBlockInstallations%22%7D%2C%7B%22modelClassName%22%3A%22blockInstallationPage%22%2C%22modelIdSelector%22%3A%22appraCyeBM03Mocds+*%22%2C%22action%22%3A%22readLayouts%22%7D%2C%7B%22modelClassName%22%3A%22table%22%2C%22modelIdSelector%22%3A%22appraCyeBM03Mocds+*%22%2C%22action%22%3A%22read%22%7D%2C%7B%22modelClassName%22%3A%22table%22%2C%22modelIdSelector%22%3A%22appraCyeBM03Mocds+*%22%2C%22action%22%3A%22readData%22%7D%2C%7B%22modelClassName%22%3A%22table%22%2C%22modelIdSelector%22%3A%22appraCyeBM03Mocds+*%22%2C%22action%22%3A%22readDataForRowCards%22%7D%2C%7B%22modelClassName%22%3A%22view%22%2C%22modelIdSelector%22%3A%22appraCyeBM03Mocds+*%22%2C%22action%22%3A%22readRowOrder%22%7D%2C%7B%22modelClassName%22%3A%22view%22%2C%22modelIdSelector%22%3A%22appraCyeBM03Mocds+*%22%2C%22action%22%3A%22readData%22%7D%2C%7B%22modelClassName%22%3A%22view%22%2C%22modelIdSelector%22%3A%22appraCyeBM03Mocds+*%22%2C%22action%22%3A%22getMetadataForPrinting%22%7D%2C%7B%22modelClassName%22%3A%22row%22%2C%22modelIdSelector%22%3A%22appraCyeBM03Mocds+*%22%2C%22action%22%3A%22readDataForDetailView%22%7D%2C%7B%22modelClassName%22%3A%22row%22%2C%22modelIdSelector%22%3A%22appraCyeBM03Mocds+*%22%2C%22action%22%3A%22createBoxDocumentSession%22%7D%2C%7B%22modelClassName%22%3A%22row%22%2C%22modelIdSelector%22%3A%22appraCyeBM03Mocds+*%22%2C%22action%22%3A%22createDocumentPreviewSession%22%7D%2C%7B%22modelClassName%22%3A%22view%22%2C%22modelIdSelector%22%3A%22appraCyeBM03Mocds+*%22%2C%22action%22%3A%22downloadCsv%22%7D%2C%7B%22modelClassName%22%3A%22view%22%2C%22modelIdSelector%22%3A%22appraCyeBM03Mocds+*%22%2C%22action%22%3A%22downloadICal%22%7D%2C%7B%22modelClassName%22%3A%22row%22%2C%22modelIdSelector%22%3A%22appraCyeBM03Mocds+*%22%2C%22action%22%3A%22downloadAttachment%22%7D%5D%2C%22shareId%22%3A%22shrtWt6CL5zklWiV7%22%2C%22applicationId%22%3A%22appraCyeBM03Mocds%22%2C%22sessionId%22%3A%22sesLCvFski1uCnNan%22%2C%22generationNumber%22%3A0%2C%22signature%22%3A%222e93e9011f4b5d55bf1ac0608da76eae84c768090fac76e32ba6e286bc46bc5f%22%7D',
    headers : {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding': 'null',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Cookie': 'sess=eyJzZXNzaW9uSWQiOiJzZXNMQ3ZGc2tpMXVDbk5hbiIsImNzcmZTZWNyZXQiOiI0bVAwUXRMbkdTd0w2NXdqWS1TRnE3X1oiLCJyZWRpcmVjdFRvQWZ0ZXJMb2dpbiI6Ii92MC4zL3RhYmxlL3RibExjRlc3azdFQ0ZHZ2Z4L3JlYWREYXRhIiwiYWNxdWlzaXRpb24iOiJbe1wicGxhdGZvcm1cIjpcImRlc2t0b3BcIixcIm9yaWdpblwiOlwibG9naW5cIixcInRvdWNoVGltZVwiOlwiMjAxOC0xMS0yMlQxODoyNjoxNS40NTVaXCJ9XSJ9; express:sess.sig=OAC6LC41HZTmBea-NImrK5Yai4c; lightstep_guid/sharedViewOrApp=12f2944659793764; lightstep_session_id=79a0af9d50b3451e',
        'Pragma': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
        'x-airtable-application-id': 'appraCyeBM03Mocds',
        'X-Compress': 'null',
        'X-Requested-With': 'XMLHttpRequest',
        'x-time-zone': 'Europe/Moscow',
        'x-user-locale': 'ru',
	},
	
};

// создание бота
const bot = new TelegramBot(config.secretToken, {
	polling: true, 
	request: {
		agentClass: Agent,
		agentOptions: config.proxyAgent
	}
});

// подключение к бд
mongoose.connect(config.databaseUrl, { 
    useNewUrlParser: true
}).catch(() => {
    console.log('fail');
})

// выводим приветственное сообщение 
bot.onText(/start/, async (msg, match) => {
    const res = await user.regUser({
        userId: msg.from.id,
        created_at: new Date()

    });

    var message = `Привет, ${msg.from['first_name']}! \n`+
        `Чтобы получать уводомления напиши мне свое фио из airtable \n`+
        `вот в таком виде "/subscribe Имя Фамилия" \n \n`+
        `Уведомления будут приходить в 9:45 и в 17:45`;
	bot.sendMessage(msg.chat.id, message, {parse_mode: 'HTML'}).then( payload => {        
        log.add({
            userId: msg.chat.id,
            fullName: msg.chat.first_name,
            comand: match[0],
            whoSend: match.input,
            response: message,
            create_at: new Date()
        })
    });
});

// отписываем пользователя
bot.onText(/unscribe/, async (msg, match) => {
    const res = await user.unscribe({
        userId: msg.from.id,
    });
    const message = `Ты больше не будешь получать уведомления`;
	bot.sendMessage(msg.chat.id, message, {parse_mode: 'HTML'}).then( payload => {
        log.add({
            userId: msg.chat.id,
            fullName: msg.chat.first_name,
            comand: match[0],
            whoSend: match.input,
            response: message,
            create_at: new Date()
        })
    });
});

// выводим статус пользователя 
bot.onText(/status/, async (msg, match) => {
    const userInfo = await user.getUser(msg.chat.id);
    let message = '';
    if(userInfo.subscribed)
        message = `Подписан, как пользователь ${userInfo.fullName}`;
    else
        message = `Не подписан`;

	bot.sendMessage(msg.chat.id, message, {parse_mode: 'HTML'}).then( payload => {
        log.add({
            userId: msg.chat.id,
            fullName: msg.chat.first_name,
            comand: match[0],
            whoSend: match.input,
            response: message,
            create_at: new Date()
        })
    });
});

// регестрируем пользователей 
bot.onText(/subscribe(.*)/, async (msg, match) => {
    const userFullName = match[1].trim().toLocaleLowerCase();
    const userInfo = await user.getUser(msg.chat.id);
    let msgRes = '';
    if(userFullName && !userInfo.subscribed)
    {
        const res = await user.setFullName({
            userId: msg.from.id,
            fullName: userFullName
        });
        msgRes = res ? 'Теперь ты подписан на уведомления' : 'Ты уже подписан';
    } else {
        msgRes = 'Отправь сообщение в формате "/subscribe имя фамилия"'
    }
	bot.sendMessage(msg.chat.id, msgRes, {parse_mode: 'HTML'}).then( payload => {
        log.add({
            userId: msg.chat.id,
            fullName: msg.chat.first_name,
            comand: match[0],
            whoSend: match.input,
            response: msgRes,
            create_at: new Date()
        })
    });
});

// парсим узеров заполнивших air table
var getFilledUsers = async function(yerstadayDate)
{
    let res = '';
    var date = new Date();
    let curDate = '';
    let whotInsert = [];
    const data = await request.get(options).then((res) => {
		// console.log(res);
		res = JSON.parse(res).data.rows;    
		    
        return res;
    }).catch((err) => {
        res = err;
        return res;
	});
	
    
    // меняем дату на "вчера"
    if(yerstadayDate == true)
        date = new Date(date.setDate(date.getDate() - 1));
    curDate = date.toISOString().slice(0, 10);

    for(var key in data)
    {
        var raw = data[key];

        if(typeof raw.cellValuesByColumnId == 'undefined')
            continue;
		
        var date = raw.cellValuesByColumnId.fldPWNuiRKgdnt0Fw.slice(0,10);

        if(date != curDate)
            continue;
		if(raw.cellValuesByColumnId.fldfGl1C4Wq7CcmKh != undefined)
        	whotInsert.push(raw.cellValuesByColumnId.fldfGl1C4Wq7CcmKh[0].foreignRowDisplayName.toLocaleLowerCase())
    }

    return whotInsert;
}



// получаем юзеров бота, которые не заполнили airtable
var getNotFilledUsers = async function(yerstadayDate) {    
    const filledUsers = await getFilledUsers(yerstadayDate);
    const getBotUsers = await user.getUsers();
    
    let notFilledUsers = [];

    if(!filledUsers.length)
        return false;
    for(botUser of getBotUsers)
    {
        if(botUser.subscribed && !filledUsers.includes(botUser.fullName))
            notFilledUsers.push(botUser)
	}
	
    return notFilledUsers;
}

// уведомляем юзеров не заполнивших бота
var notificateUsers = async function (yerstadayDate) {
    const notFilledUsers = await getNotFilledUsers(yerstadayDate);    
       
    if(notFilledUsers.length)
        for(const user of notFilledUsers)
        {
            bot.sendMessage(user.userId, 'Заполни airtable блеат').then( payload => {
                log.add({
                    userId: user.userId,
                    fullName: user.fullName,
                    comand: 'notification',
                    whoSend: 'null',
                    response: 'Заполни airtable блеат',
                    create_at: new Date()
                })
            });
        }
}

// уведомляем утром тех, кто вчера не заполнил
cron.schedule('45 9 * * 2-6', async () => {
    notificateUsers(true);
});

// уведомляем, что надо заполнить airtable
cron.schedule('45 17 * * 1-5', async () => {
    notificateUsers(false);
});