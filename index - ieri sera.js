const Telegraf = require('telegraf');
const bot = new Telegraf("1106305539:AAH3NMX0V-9OqDon0CTjIvK-kbo6E20p0sM");
const axios = require('axios');
var parola = '';
//var sergio = Date.now();
//var d = new Date(sergio);
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = dd + '/' + mm + '/' + yyyy;
//var dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' })
//dtf = sergio.toString();
bot.start((message) => {
  console.log('started:', message.from.id)
  return message.reply('Questo è il bot dei Quark per la parola del giorno');
})
bot.command('paroladelgiorno', (ctx) => ctx.reply('La parolda del giorno è: parola1'))
bot.command('paroladelgiornodata', (ctx) => ctx.reply('La parolda del giorno è: parola2'))
bot.command('paroladelgiornocerca', (ctx) => ctx.reply('La parolda del giorno è: parola3'))
bot.on('text', ctx =>{
parola = ctx.message.text;
fs.appendFile('Record.txt', parola + " " + today + "\n", {flag: 'a+'}, err => {

  if (err) {
    console.error(err)
    return
  }
})
return ctx.reply(parola);})

const fs = require('fs')
bot.startPolling();