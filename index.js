//Bot Telegram: "@Parola_del_giorno_bot"
//Developed by: Federico Imbriani @TheSpaceFede and Gabriele Esposito @TwoCondor
//Ver: Alpha 1.0
//Date: 13/03/2020
const Telegraf = require('telegraf');
const bot = new Telegraf("940436854:AAElNinpdn4ltqFu0s1S4-_y5VgSry16kLI");
const axios = require('axios');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const WizardScene = require('telegraf/scenes/wizard');
const { leave } = Stage
const fs = require('fs')
const readline = require('readline');
var parola = ' ';
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
var today = dd + '/' + mm + '/' + yyyy;




//Avvio del bot
bot.start((message) => {
  console.log('started');
  return message.reply('Benvenuto nel bot per le parole del giorno\nCreato da:\nFederico Imbriani @TheSpaceFede\nGabriele Esposito @TwoCondor\nProprieta dei Quark\n\nInfo\nVer: Alpha 1.0\nDate: 13/03/2020');
})



//WizardScene di /paroladelgiorno
const giorno = new WizardScene(
  'giorno',
ctx => {
    ctx.reply("Scrivimi la parola del giorno:");
    ctx.wizard.state.data = {};
    return ctx.wizard.next();
  },
ctx => {
	ctx.wizard.state.data.parola = ctx.message.text;
	var riga = [];
	var rl = readline.createInterface({
		input: fs.createReadStream('Record.txt'),
		output: process.stdout,
		terminal: false
	});
	var ricerca = fs.readFileSync('Record.txt');
	var parolaricercata = new RegExp('\\b' + ctx.wizard.state.data.parola + '\\b', "i");
	var dataricercata = new RegExp('\\b' + today + '\\b');
	if (dataricercata.test(ricerca)){
		rl.on('line', function (line) {
		riga=line.split(" ");
		if (today==riga[0]){
			ctx.reply('Cazzo fai?\nLa parola di oggi è già: "' + riga[1] + '".');
			return ctx.scene.leave();}
		});	
	}	else{
		if (parolaricercata.test(ricerca)) {
			rl.on('line', function (line) {
			riga=line.split(" ");
			if (parolaricercata.test(riga[1])){
				ctx.reply('Ma che combini?\n"' + ctx.wizard.state.data.parola + '" è già stata parola del giorno il:\n' + riga[0]);
				}
			});	
		}	else{
				fs.appendFile('Record.txt', today + " " + ctx.wizard.state.data.parola + "\n", {flag: 'a+'}, err => {
					if (err) {
						console.error(err)
					return
					}
				})
				ctx.reply('La parola del giorno è: "' + ctx.wizard.state.data.parola + '".');
			}
		return ctx.scene.leave();
	}
},
);



//WizardScene di /cerca
const cer = new WizardScene(
	'cer',
	ctx => {
		ctx.reply('Quale parola vuoi cercare?:');
		ctx.wizard.state.data = {};
		return ctx.wizard.next();
	},
	ctx => {
		ctx.wizard.state.data.parola = ctx.message.text;
		var riga = [];
		var rl = readline.createInterface({
			input: fs.createReadStream('Record.txt'),
			output: process.stdout,
			terminal: false
		});
		var ricerca = fs.readFileSync('Record.txt');
		var parolaricercata = new RegExp('\\b' + ctx.wizard.state.data.parola + '\\b', "i");
		if (parolaricercata.test(ricerca)) {
			rl.on('line', function (line) {
			riga=line.split(" ");
			if (parolaricercata.test(riga[1])){
				ctx.reply('La parola "' + ctx.wizard.state.data.parola + '" è stata parola del giorno il: ' + riga[0]);
				}
			});	
		}	else{
			ctx.reply('La parola "' + ctx.wizard.state.data.parola + '" non è mai stata parola del giorno.');
		}
		return ctx.scene.leave();
	},
);



//WizardScene di /cerca
const tempo = new WizardScene(
	'tempo',
	ctx => {
		ctx.reply('Inserisci la data che vuoi cercare:\n(Formato gg/mm/aaaa)');
		ctx.wizard.state.data = {};
		return ctx.wizard.next();
	},
	ctx => {
		ctx.wizard.state.data.parola = ctx.message.text;
		var giornocercato = [];
		var giornonumero = [];
		giornocercato=ctx.wizard.state.data.parola.split('/');
		giornonumero[0] = parseInt(giornocercato[0]);
		giornonumero[1] = parseInt(giornocercato[1]);
		giornonumero[2] = parseInt(giornocercato[2]);
		if (giornonumero[0] < 1 || giornonumero[0] > 31 || giornonumero[1] < 1 || giornonumero[1] > 12 || giornonumero[2] < 1970 || giornonumero[2] >2100 || isNaN(giornonumero[0]) || isNaN(giornonumero[1]) || isNaN(giornonumero[2]) )  {
			ctx.reply('La data è nel formato sbagliato, riprova');
		} else {
				var ricerca = fs.readFileSync('Record.txt');
				var riga = [];
				var rl = readline.createInterface({
						input: fs.createReadStream('Record.txt'),
						output: process.stdout,
						terminal: false
					});
				var dataricercata = new RegExp('\\b' + ctx.wizard.state.data.parola + '\\b');
				if (dataricercata.test(ricerca)){
					rl.on('line', function (line) {
						riga=line.split(" ");
						if (ctx.wizard.state.data.parola==riga[0]){
							ctx.reply('La parola del giorno del ' + ctx.wizard.state.data.parola + ' è stata: "' + riga[1] + '".');
							return ctx.scene.leave();}
					});	
				}	else {
						ctx.reply('Il ' + ctx.wizard.state.data.parola + ' non ha avuto parole del giorno :(');
						return ctx.scene.leave();
				}
				return ctx.scene.leave();
			};
	},
);



//Session
bot.use(session());



//Comando /paroladelgiorno
const StageGiorno = new Stage([giorno]);
StageGiorno.command('annulla', leave())
bot.use(StageGiorno.middleware());
bot.command('paroladelgiorno', ctx => {
  ctx.scene.enter('giorno');
});
bot.launch();



//Comando /cerca
const StageCerca = new Stage([cer]);
StageCerca.command('annulla', leave())
bot.use(StageCerca.middleware());
bot.command('cerca', ctx => {
	ctx.scene.enter('cer');
});
bot.launch();



//Comando /data
const StageData = new Stage([tempo]);
StageData.command('annulla', leave())
bot.use(StageData.middleware());
bot.command('data', ctx => {
	ctx.scene.enter('tempo');
});
bot.launch();



//Comando /help
bot.command('help', ctx => {
	ctx.reply('Con questo bot puoi impostare la nuova parola del giorno, cercare le parole del giorno passate o vedere qual' + "'" + 'era la parola del giorno di una certa data.\nPuoi usare i seguenti comandi:\n/paroladelgiorno - Ti permette di impostare la nuova parola del giorno, ma ricorda che puoi usarlo solo una volta al giorno\n/cerca - Con questo comando puoi cercare se una parola è stata parola del giorno e scoprire quando\n/data - Questo invece ti permette di scoprire qual' +"'" + 'era la parola del giorno in una certa data\n/annulla - Semplicemente annulla l' + "'" + 'operazione in corso');
});
bot.launch();



//Loop
bot.startPolling();
