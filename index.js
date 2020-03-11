const Telegraf = require('telegraf');
const bot = new Telegraf("1106305539:AAH3NMX0V-9OqDon0CTjIvK-kbo6E20p0sM");
const axios = require('axios');
var parola = '';
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = dd + '/' + mm + '/' + yyyy;

//Avvio del bot
bot.start((message) => {
  console.log('started:', message.from.id)
  return message.reply('Questo è il bot dei Quark per la parola del giorno');
})

//Comando /paroladelgiorno
bot.command('paroladelgiorno', (ctx) => {
	ctx.reply('Scrivimi la parola del giorno:')
	bot.on('text', ctx =>{
		parola = ctx.message.text;
		fs.appendFile('Record.txt', today + " " + parola + "\n", {flag: 'a+'}, err => {
			if (err) {
				console.error(err)
			return
			}
		})
	return ctx.reply('La parola del giorno è: "' + parola + '".');
	})
	const fs = require('fs')
})

//Comando /Paroladelgiornocerca
bot.command('paroladelgiornocerca', (ctx) => {
	ctx.reply('Quale parola vuoi cercare?:")
	bot.on('text', ctx =>{
		parola = ctx.message.text;
	}
)}

//Comando /paroladelgiornodata
bot.command('paroladelgiornodata', (ctx) => {
	ctx.reply('La parola del giorno è:')
	
)}

//Loop
bot.startPolling();