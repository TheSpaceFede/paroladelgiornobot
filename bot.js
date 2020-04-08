//Bot Telegram: "@Parola_del_giorno_bot"
//Developed by: Federico Imbriani @TheSpaceFede and Gabriele Esposito @TwoCondor
//Ver: Beta 1.2.0
//Date: 08/04/2020

// shellExec = require('shell-exec');
const Telegraf = require('telegraf');
const bot = require('./token.js');
const versione = require('./version.js');
const crediti = ('\nCreato da:\nFederico Imbriani @TheSpaceFede\nGabriele Esposito @TwoCondor\nProprieta dei Quark');
const axios = require('axios');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const WizardScene = require('telegraf/scenes/wizard');
const { leave } = Stage
const fs = require('fs')
const readline = require('readline');
var schedule = require ('node-schedule');
var parola = ' ';
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
var today = dd + '/' + mm + '/' + yyyy;
var Record = ('./Record.txt')



//Avvio del bot
bot.start((message) => {
  return message.reply('Benvenuto nel bot per le parole del giorno\n' + versione + '\n' + crediti);
})



//Messaggio giornaliero
schedule.scheduleJob('00 00 * * *', () => { 
	bot.telegram.sendMessage('-1001171692979','Allora... la parola di oggi?' )	
	//Thisisonlyatest*/bot.telegram.sendMessage('-1001129125003','Allora... la parola di oggi?' )
});
schedule.scheduleJob('30 23 * * *', () => { 
	shellExec('rclone copy /home/pi/paroladelgiornobot/Record.txt gdrive:telegram/paroladelgiornobot');
	console.log('backup Record.txt');
});
schedule.scheduleJob('47 00 * * *', () => { 
	shellExec('sudo reboot');
	console.log('rebooting');
});



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
		input: fs.createReadStream(Record),
		output: process.stdout,
		terminal: false
	});
	var ricerca = fs.readFileSync(Record);
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
				fs.appendFile(Record, today + " " + ctx.wizard.state.data.parola + "\n", {flag: 'a+'}, err => {
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
			input: fs.createReadStream(Record),
			output: process.stdout,
			terminal: false
		});
		var ricerca = fs.readFileSync(Record);
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



//WizardScene di /data
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
				var ricerca = fs.readFileSync(Record);
				var riga = [];
				var rl = readline.createInterface({
						input: fs.createReadStream(Record),
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



//WizardScene di verifica messaggi	
const verifica = new WizardScene(
	'verifica',
	ctx => {
    if(ctx.message.text) {
		var testo = [];
		testo = ctx.message.text.split(' ');
		var trequarti = (((testo.length-1)/4)*3);
		if(ctx.from.id == "404978441" || ctx.from.id == "816264035") {
			for (i=testo.length-1; i>=trequarti; i--){
				if (testo[i] == 'chi'  || testo[i] == 'chi?'  || testo[i] == 'chi!'  || testo[i] == 'chi?!'  || testo[i] == 'chi!?'
				|| testo[i] == 'Chi'  || testo[i] == 'Chi?'  || testo[i] == 'Chi!'  || testo[i] == 'Chi?!'  || testo[i] == 'Chi!?'
				|| testo[i] == 'CHi'  || testo[i] == 'CHi?'  || testo[i] == 'CHi!'  || testo[i] == 'CHi?!'  || testo[i] == 'CHi!?'
				|| testo[i] == 'ChI'  || testo[i] == 'ChI?'  || testo[i] == 'ChI!'  || testo[i] == 'ChI?!'  || testo[i] == 'ChI!?'
				|| testo[i] == 'CHI'  || testo[i] == 'CHI?'  || testo[i] == 'CHI!'  || testo[i] == 'CHI?!'  || testo[i] == 'CHI!?'
				|| testo[i] == 'cHi'  || testo[i] == 'cHi?'  || testo[i] == 'cHi!'  || testo[i] == 'cHi?!'  || testo[i] == 'cHi!?'
				|| testo[i] == 'chI'  || testo[i] == 'chI?'  || testo[i] == 'chI!'  || testo[i] == 'chI?!'  || testo[i] == 'chI!?'
				|| testo[i] == 'cHI'  || testo[i] == 'cHI?'  || testo[i] == 'cHI!'  || testo[i] == 'cHI?!'  || testo[i] == 'cHI!?'
				|| testo[i] == 'C*i'  || testo[i] == 'C*i?'  || testo[i] == 'C*i!'  || testo[i] == 'C*i?!'  || testo[i] == 'C*i!?'
				|| testo[i] == 'C*I'  || testo[i] == 'C*I?'  || testo[i] == 'C*I!'  || testo[i] == 'C*I?!'  || testo[i] == 'C*I!?'
				|| testo[i] == 'c*i'  || testo[i] == 'c*i?'  || testo[i] == 'c*i!'  || testo[i] == 'c*i?!'  || testo[i] == 'c*i!?'
				|| testo[i] == 'c*I'  || testo[i] == 'c*I?'  || testo[i] == 'c*I!'  || testo[i] == 'c*I?!'  || testo[i] == 'c*I!?'){
					ctx.reply('STOCAZZO!');
					setTimeout(function() {
						return ctx.reply('Questo messaggio ha valore legale nella diatriba a favore dell' + "'" + 'avversario.');
					}, 500);
				}
			}
		}
		for (i=testo.length-1; i>=0; i--){
			if (testo[i] == 'batman' || testo[i] == 'Batman' ||testo[i] == 'joker' || testo[i] == 'Joker'){
				return ctx.replyWithAnimation({ source: fs.createReadStream('./File/batman.gif') });
			}
			if (testo[i] == 'pagliaccio' || testo[i] == 'buffone' || testo[i] == 'Pagliaccio' || testo[i] == 'Buffone'
				||testo[i] == 'pagliaccio!' || testo[i] == 'buffone!' || testo[i] == 'Pagliaccio!' || testo[i] == 'Buffone!'){
				return ctx.replyWithSticker('CAACAgQAAxkBAAI1P150n_AbIwja8GC_ZIZqUCXXiJXQAAKNAAMJeyMYHbcGPtt_pdkYBA');
			}
			if (testo[i] == 'comunista' || testo[i] == 'Comunista' || testo[i] == 'comunista!' || testo[i] == 'Comunista!'){
				ctx.reply("\u{1F1F7}\u{1F1FA}"+"\u{1F1F7}\u{1F1FA}"+"\u{1F1F7}\u{1F1FA}"+"\u{1F1F7}\u{1F1FA}"+"\u{1F1F7}\u{1F1FA}");
				setTimeout(function() {
				ctx.reply('https://youtu.be/U06jlgpMtQs');
				}, 500);
				setTimeout(function() {
				ctx.reply("\u{1F1F7}\u{1F1FA}"+"\u{1F1F7}\u{1F1FA}"+"\u{1F1F7}\u{1F1FA}"+"\u{1F1F7}\u{1F1FA}"+"\u{1F1F7}\u{1F1FA}");
				}, 500);
			}
			if (testo[i] == 'comunisti' || testo[i] == 'Comunisti' || testo[i] == 'comunisti!' || testo[i] == 'Comunisti!'){
				return ctx.replyWithAnimation({ source: fs.createReadStream('./File/comunisti.gif') });
			}
			if (testo[i] == 'fascista' || testo[i] == 'Fascista' || testo[i] == 'fascista!' || testo[i] == 'Fascista!'){
				return ctx.replyWithPhoto({ source: fs.createReadStream('./File/fascista.jpg') });
			}
		}
	}
});

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



//Comando /scarica
bot.command('scarica', ctx => {
	var giornodioggi=[];
	giornodioggi = today.split('/');
	ctx.replyWithDocument({source: fs.createReadStream(Record), filename: 'paroledelgiorno'+giornodioggi[0]+'-'+giornodioggi[1]+'-'+giornodioggi[2]+'.txt'});
});
bot.launch();



//Comando /help
bot.command('help', ctx => {
	ctx.reply('Con questo bot puoi impostare la nuova parola del giorno, cercare le parole del giorno passate o vedere qual' + "'" + 'era la parola del giorno di una certa data.\nPuoi usare i seguenti comandi:\n/paroladelgiorno - Ti permette di impostare la nuova parola del giorno, ma ricorda che puoi usarlo solo una volta al giorno\n/cerca - Con questo comando puoi cercare se una parola è stata parola del giorno e scoprire quando\n/data - Questo invece ti permette di scoprire qual' +"'" + 'era la parola del giorno in una certa data\n/scarica - Permette di scaricare il file con tutte le parole del giorno in ordine cronologico\n/annulla - Semplicemente annulla l' + "'" + 'operazione in corso\n' + crediti + versione);
});
bot.launch();



//Verifica messaggi
const StageTesto = new Stage([verifica]);
StageTesto.command('annulla', leave())
bot.use(StageTesto.middleware());
bot.on('message', ctx => {
	ctx.scene.enter('verifica');
});
bot.launch();






//Loop
bot.startPolling();
