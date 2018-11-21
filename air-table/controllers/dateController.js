const moment = require('moment');
const config = require('../config/config.js');

const dmbDate = {
	userDate: '',
	nowDate: '',
	endDate: '',

	userDateValidation (userDate) {
		if(moment(userDate, config.dateFormat).isValid() && moment(userDate, config.dateFormat).isSameOrBefore(moment()))
			return true;
		else
			return false;
	},

	setDates (userDate) {
		this.userDate = moment(userDate, config.dateFormat);
		this.endDate = moment(userDate, config.dateFormat).add(1, 'year');
		this.nowDate = moment();
	},

	getAgoPercent () {
		return (((this.nowDate - this.userDate) / (this.endDate - this.userDate)) * 100).toFixed(2)
	},

	getCalculatedTime () {
		const agoTime = moment.duration(this.nowDate.diff(this.userDate));
		const lastTime = moment.duration(this.endDate.diff(this.nowDate));
		const percentAgo = this.getAgoPercent();

		const calculatedTime = {
			userDate: moment(this.userDate).format(config.dateFormat),
			agoTime: {
				months: Math.floor(agoTime.months()),
				weeks: Math.floor(agoTime.weeks()),
				days: Math.floor(agoTime.days()),
				hours: Math.floor(agoTime.hours()),
				minutes: Math.floor(agoTime.minutes()),
			},
			lastTime: {
				months: Math.floor(lastTime.months()),
				days: Math.floor(lastTime.days()),
				weeks: Math.floor(lastTime.weeks()),
				hours: Math.floor(lastTime.hours()),
				minutes: Math.floor(lastTime.minutes()),
			},
			percents: {
				ago: percentAgo,
				last: 100 - percentAgo,
			}
		}

		return calculatedTime;
	},

	calculateTime (userDate) {
		if(this.userDateValidation(userDate)) {
			this.setDates(userDate);
			return this.getResponseString(this.getCalculatedTime());
		}
		else {
			return false;
		}
	},

	getResponseString (calculatedTime) {
		let message = '';
		if(calculatedTime)
		{
			if(calculatedTime.percents.ago < 100)
			{
				message = `<b>${calculatedTime.userDate}</b>\n`+
					`--- <b>Отслужил</b> --- \n` +
					`Месяцев ${calculatedTime.agoTime.months} \n`+
					`Недель ${calculatedTime.agoTime.weeks} \n`+
					`Дней ${calculatedTime.agoTime.days}\n`+
					`Часов ${calculatedTime.agoTime.hours}\n`+
					`Минут ${calculatedTime.agoTime.minutes}\n`+
					`Пройдено ${calculatedTime.percents.ago}%\n`+
					`--- <b>Осталось</b> --- \n`+ 
					`Месяцев ${calculatedTime.lastTime.months}\n`+
					`Недель ${calculatedTime.lastTime.weeks}\n`+
					`Дней ${calculatedTime.lastTime.days}\n`+
					`Часов ${calculatedTime.lastTime.hours}\n`+
					`Минут ${calculatedTime.lastTime.minutes}\n`+
					`Пройдено ${calculatedTime.percents.last}%\n`;
			} else {
				message += `--- <b> Финиш </b> ---\n`+ 
					`Поздравляем с дембелем! Удачи в гражданской жизни!`;
			}
		} else {
			message = 'Произошла ошибка. Проверьте правильность введенных данных, ну или вы все сломали)'
		}

		return message;
	}
}

module.exports = dmbDate;