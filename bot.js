//Bot Telegram: "@Parola_del_giorno_bot"
//Developed by: Federico Imbriani @TheSpaceFede and Gabriele Esposito @TwoCondor
//Ver: Beta 2.0.0
//Date: 03/07/2020

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
const gruppo = '-1001171692979';
var schedule = require ('node-schedule');
var parola = ' ';
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
var today = dd + '/' + mm + '/' + yyyy;
var Record = ('./Record.txt');
var Stats = ('./Stats.txt');
var StatStocazzo = ('./StatStocazzo.txt');
var CasaImbrianiChannel = ('./CasaImbrianiChannel.txt');
var Casuale = 0;



//Avvio del bot
bot.start((message) => {
  return message.reply('Benvenuto nel bot per le parole del giorno\n' + versione + '\n' + crediti);
  //return message.reply('Ciao!\nMi chiamo ___ e sono il bot dei Quark, scrivi /help per avere altre informazioni\n' + versione + '\n' + crediti);
})



//Messaggio giornaliero
schedule.scheduleJob('00 00 * * *', () => { 
	shellExec('pm2 restart bot');
});

schedule.scheduleJob('01 00 * * *', () => { 
	Casuale = getRandomInt(7);
	switch (Casuale) {
		case 0:
			bot.telegram.sendMessage(gruppo,'Allora... la parola di oggi?');
			break;
		case 1:
			bot.telegram.sendMessage(gruppo,'Suvvia! È l' + "'" + 'ora della parola del giorno');
			break;
		case 2:
			bot.telegram.sendMessage(gruppo,'Ma guarda un po' + "'" + ', è già l' + "'" + 'ora della parola del giorno!');
			break;
		case 3:
			bot.telegram.sendMessage(gruppo,'È giunto il momento della parola del giorno!');
			break;
		case 4:
			bot.telegram.sendMessage(gruppo,'Finalmente! Sono pronto per una nuova parola del giorno');
			break;
		case 5:
			bot.telegram.sendMessage(gruppo,'È mezzanotte, e questo significa solo una cosa...');
			break;
		case 6:
			bot.telegram.sendMessage(gruppo,'Chissà quale sarà la parola di oggi?');
			break;
	}
});

//Canzone del giorno
schedule.scheduleJob('00 14 * * *', () => { 
	const fs = require('fs');
	const readline = require('readline');
	const {google} = require('googleapis');
	const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
	const TOKEN_PATH = 'tokeng.json';
	fs.readFile('credentials.json', (err, content) => {
	  if (err) return console.log('Error loading client secret file:', err);
	  authorize(JSON.parse(content), listMajors);
	});
	function authorize(credentials, callback) {
	  const {client_secret, client_id, redirect_uris} = credentials.installed;
	  const oAuth2Client = new google.auth.OAuth2(
		  client_id, client_secret, redirect_uris[0]);
	  fs.readFile(TOKEN_PATH, (err, token) => {
		if (err) return getNewToken(oAuth2Client, callback);
		oAuth2Client.setCredentials(JSON.parse(token));
		callback(oAuth2Client);
	  });
	}
	function getNewToken(oAuth2Client, callback) {
	  const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	  });
	  console.log('Authorize this app by visiting this url:', authUrl);
	  const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	  });
	  rl.question('Enter the code from that page here: ', (code) => {
		rl.close();
		oAuth2Client.getToken(code, (err, token) => {
		  if (err) return console.error('Error while trying to retrieve access token', err);
		  oAuth2Client.setCredentials(token);
		  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
			if (err) return console.error(err);
			console.log('Token stored to', TOKEN_PATH);
		  });
		  callback(oAuth2Client);
		});
	  });
	}
	function listMajors(auth) {
	  const sheets = google.sheets({version: 'v4', auth});
	  sheets.spreadsheets.values.get({
		spreadsheetId: '1FzCDMn75IgGp8IIIrWWi-AoM20tl-E_AUxPMUPcig_Y',
		range: 'Foglio1!A:A',
	  }, (err, res) => {
		if (err) return console.log('The API returned an error: ' + err);
		const rows = res.data.values;
		if (rows.length>1) {
			Casuale = getRandomInt(rows.length);
			while (Casuale == 0){
				Casuale = getRandomInt(rows.length);
			}
			bot.telegram.sendMessage(gruppo,"Ecco la canzone del giorno:\n" + `${rows[Casuale]}`);
			sheets.spreadsheets.batchUpdate({
			  auth: auth,
			  spreadsheetId: '1FzCDMn75IgGp8IIIrWWi-AoM20tl-E_AUxPMUPcig_Y',
			  resource: {
				"requests": 
				[
				  {
					"deleteRange": 
					{
					  "range": 
					  {
						"sheetId": '0', // gid
						"startRowIndex": Casuale,
						"endRowIndex": Casuale+1
					  },
					  "shiftDimension": "ROWS"
					}
				  }
				]
			  }
			})
		} else {
		  bot.telegram.sendMessage(gruppo,"Ho finito le canzoni del giorno");
		}
	  });
	}
});



//WizardScene di /paroladelgiorno
const giorno = new WizardScene(
  'giorno',
ctx => {
	Casuale = getRandomInt(7);
	switch (Casuale) {
		case 0:
			ctx.reply("Scrivimi la parola del giorno:");
			break;
		case 1:
			ctx.reply("Qual è la parola del giorno?");
			break;
		case 2:
			ctx.reply("Qual è la parola di oggi?");
			break;
		case 3:
			ctx.reply("Dimmi la parola di oggi");
			break;
		case 4:
			ctx.reply("Dimmi la parola del giorno");
			break;
		case 5:
			ctx.reply("Scrivimi la parola di oggi:");
			break;
		case 6:
			ctx.reply("Spara!");
			break;
	}
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
			Casuale = getRandomInt(3);
			switch (Casuale) {
				case 0:
					ctx.reply('Cazzo fai?\nLa parola di oggi è già: "' + riga[1] + '"');
					break;
				case 1:
					ctx.reply('A me risulta che la parola di oggi sia già: "' + riga[1] + '"');
					break;
				case 2:
					ctx.reply('Ci dev' + "'" + 'essere un errore, la parola di oggi è già: "' + riga[1] + '"');
					break;
			}
			return ctx.scene.leave();}
		});	
	}	else{
		if (parolaricercata.test(ricerca)) {
			rl.on('line', function (line) {
				riga=line.split(" ");
				if (parolaricercata.test(riga[1])){
					Casuale = getRandomInt(3);
					switch (Casuale) {
						case 0:
							ctx.reply('Non è possibile\n"' + ctx.wizard.state.data.parola + '" è già stata parola del giorno il\n' + riga[0]);
							break;
						case 1:
							ctx.reply('Ma che combini?\n"' + ctx.wizard.state.data.parola + '" è già stata parola del giorno il\n' + riga[0]);
							break;
						case 2:
							ctx.reply('Come fai a non ricordarti che\n"' + ctx.wizard.state.data.parola + '" è già stata parola del giorno il\n' + riga[0] + "?");
							break;
					}
					return ctx.scene.leave();
				}
			});	
		}	else{
				fs.appendFile(Record, today + " " + ctx.wizard.state.data.parola + "\n", {flag: 'a+'}, err => {
					if (err) {
						console.error(err)
					return
					}
				})
				ctx.reply('La parola del giorno è: "' + ctx.wizard.state.data.parola + '"');
				var riga = [];
				var rl = readline.createInterface({
				input: fs.createReadStream(Stats),
				output: process.stdout,
				terminal: false
				});
				var statistiche = fs.readFileSync(Stats);
				rl.on('line', function (line) {
					riga=line.split(" ");
					for (i=0; i<=4; i++){
						riga[i]=riga[i]*1;
					}
					if (ctx.from.id == "869500528"){
						riga[0]=riga[0]+1;
						fs.writeFile(Stats, riga[0] + " " + riga[1] + " " + riga[2] + " " + riga[3] + " " + riga[4], {flag: 'r+'}, err => {
						if (err) {
							console.error(err)
							return
							}
						})
						return ctx.scene.leave();
					}	else if (ctx.from.id == "1134238449"){
						riga[1]=riga[1]+1;
						fs.writeFile(Stats, riga[0] + " " + riga[1] + " " + riga[2] + " " + riga[3] + " " + riga[4], {flag: 'r+'}, err => {
						if (err) {
							console.error(err)
							return
							}
						})
						return ctx.scene.leave();
					}	else if (ctx.from.id == "404978441"){
						riga[2]=riga[2]+1;
						fs.writeFile(Stats, riga[0] + " " + riga[1] + " " + riga[2] + " " + riga[3] + " " + riga[4], {flag: 'r+'}, err => {
						if (err) {
							console.error(err)
							return
							}
						})
						return ctx.scene.leave();
					}	else if (ctx.from.id == "313498340"){
						riga[3]=riga[3]+1;
						fs.writeFile(Stats, riga[0] + " " + riga[1] + " " + riga[2] + " " + riga[3] + " " + riga[4], {flag: 'r+'}, err => {
						if (err) {
							console.error(err)
							return
							}
						})
						return ctx.scene.leave();
					}	else if (ctx.from.id == "816264035"){
						riga[4]=riga[4]+1;
						fs.writeFile(Stats, riga[0] + " " + riga[1] + " " + riga[2] + " " + riga[3] + " " + riga[4], {flag: 'r+'}, err => {
						if (err) {
							console.error(err)
							return
							}
						})
						return ctx.scene.leave();
					}
				});	
		return ctx.scene.leave();
	}
}
}
);



//WizardScene di /cerca
const cer = new WizardScene(
	'cer',
	ctx => {
		ctx.reply('Quale parola vuoi cercare?');
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
				ctx.reply('"' + ctx.wizard.state.data.parola + '" è stata parola del giorno il: ' + riga[0]);
				}
			});	
		}	else{
			ctx.reply('"' + ctx.wizard.state.data.parola + '" non è mai stata parola del giorno');
		}
		return ctx.scene.leave();
	},
);



//WizardScene di /data
const tempo = new WizardScene(
	'tempo',
	ctx => {
		ctx.reply('Inserisci la data che vuoi cercare\n(Formato gg/mm/aaaa)');
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
		for (i=testo.length-1; i>=0; i--){
			testo[i] = testo[i].toLowerCase()
			testo[i] = testo[i].replace(/[!?,.:;="']/gi, "");
			testo[i] = testo[i].replace(/[*]/gi, "h");
		}
		var trequarti = (((testo.length-1)/4)*3);
		if(ctx.from.id == "404978441" || ctx.from.id == "816264035") {
			for (i=testo.length-1; i>=trequarti; i--){
				if (testo[i] == 'chi'){
					var riga = [];
					var rl = readline.createInterface({
					input: fs.createReadStream(StatStocazzo),
					output: process.stdout,
					terminal: false
					});
					var statistiche = fs.readFileSync(StatStocazzo);
					rl.on('line', function (line) {
						riga=line.split(" ");
						for (i=0; i<=1; i++){
							riga[i]=riga[i]*1;
						}
						if (ctx.from.id == "404978441"){
							riga[0]=riga[0]+1;
							fs.writeFile(StatStocazzo, riga[0] + " " + riga[1], {flag: 'r+'}, err => {
							if (err) {
								console.error(err)
								return
								}
							})
							return ctx.scene.leave();
						}	else if (ctx.from.id == "816264035"){
							riga[1]=riga[1]+1;
							fs.writeFile(StatStocazzo, riga[0] + " " + riga[1], {flag: 'r+'}, err => {
							if (err) {
								console.error(err)
								return
								}
							})
							return ctx.scene.leave();
						}
					});
					ctx.reply('STOCAZZO!');
					setTimeout(function() {
						return ctx.reply('Questo messaggio ha valore legale nella diatriba a favore dell' + "'" + 'avversario.');
					}, 500);
					setTimeout(function() {
						var riga = [];
						var rl = readline.createInterface({
							input: fs.createReadStream(StatStocazzo),
							output: process.stdout,
							terminal: false
						});
						var statistiche = fs.readFileSync(StatStocazzo);
						rl.on('line', function (line) {
						riga=line.split(" ");
						ctx.reply('Il nuovo punteggio dello Stocazzo è:\nTheSpaceFede ' + riga[1] + '\nZigulì ' + riga[0]);
						});
					}, 1500);
				}
			}
		}
		for (i=testo.length-1; i>=0; i--){
			if (testo[i] == 'batman' || testo[i] == 'joker'){
				return ctx.replyWithAnimation({ source: fs.createReadStream('./File/batman.gif') });
			}
			if (testo[i] == 'pagliaccio' || testo[i] == 'buffone'){
				return ctx.replyWithSticker('CAACAgQAAxkBAAI1P150n_AbIwja8GC_ZIZqUCXXiJXQAAKNAAMJeyMYHbcGPtt_pdkYBA');
			}
			if (testo[i] == 'tempo' && testo[i+1] == 'modo' && testo[i+2] == 'e' && testo[i+3] == 'occasione'){
				return ctx.replyWithSticker('CAACAgQAAxkBAAL_XV79zYX37i2AjSSPFun4p0ZtEv7GAAK3AAMJeyMYYUBiF5TZm8MaBA');
			}
			if (testo[i] == 'comunista' || testo[i] == 'comunismo'){
				ctx.reply("\u{1F1F7}\u{1F1FA}"+"\u{1F1F7}\u{1F1FA}"+"\u{1F1F7}\u{1F1FA}"+"\u{1F1F7}\u{1F1FA}"+"\u{1F1F7}\u{1F1FA}");
				setTimeout(function() {
				ctx.reply('https://youtu.be/U06jlgpMtQs');
				}, 500);
				setTimeout(function() {
				ctx.reply("\u{1F1F7}\u{1F1FA}"+"\u{1F1F7}\u{1F1FA}"+"\u{1F1F7}\u{1F1FA}"+"\u{1F1F7}\u{1F1FA}"+"\u{1F1F7}\u{1F1FA}");
				}, 500);
			}
			if (testo[i] == 'comunisti'){
				return ctx.replyWithAnimation({ source: fs.createReadStream('./File/comunisti.gif') });
			}
			if (testo[i] == 'fascista' || testo[i] == 'fascisti' || testo[i] == 'fascismo' || testo[i] == 'duce'){
				return ctx.replyWithPhoto({ source: fs.createReadStream('./File/fascista.jpg') });
			}
		}
	}
});



//WizardScene di /sticker
const adesivo = new WizardScene(
	'adesivo',
	ctx => {
		ctx.reply('Inviami una foto con lo sticker che desideri realizzare, un giorno potrebbe diventare realtà!\n(Inviala in formato file)');
		return ctx.wizard.next();
	},
	ctx => {
		if (!ctx.update.message.photo && !ctx.update.message.document){
			ctx.reply('Ti ho detto di inviare una foto!');
		}
		if (ctx.update.message.photo){
			ctx.reply('Non lesinare sulla qualità, inviala in formato file');
		}
		if(ctx.update.message.document){
			var file = ctx.update.message.document;
			ctx.telegram.getFileLink(file).then(url => {    
				axios({url, responseType: 'stream'}).then(response => {
					return new Promise((resolve, reject) => {
						let uniqueId = Math.random().toString(36).substring(2) + Date.now().toString(36);
						response.data.pipe(fs.createWriteStream('./Stickers/' + uniqueId + '.jpg'))
						ctx.reply('La tua richiesta è stata presa in carico, e sarà analizzata dal nostro staff il prima possibile (o forse mai)');
						setTimeout(function() {
							bot.telegram.sendPhoto('-1001129125003', { source: fs.createReadStream('./Stickers/' + uniqueId + '.jpg') });
						}, 2000);
					});
				})
			})
			return ctx.scene.leave();
		}
	}
);



//Random
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}



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



//Comando /statistcihe
bot.command('statistiche', ctx => {
	var riga = [];
	var rl = readline.createInterface({
		input: fs.createReadStream(Stats),
		output: process.stdout,
		terminal: false
	});
	var statistiche = fs.readFileSync(Stats);
	rl.on('line', function (line) {
	riga=line.split(" ");
	ctx.reply('Ecco il punteggio delle parole del giorno:\nLuca23456 ' + riga[0] + '\nPagliaccio ' + riga[1] + '\nTheSpaceFede ' + riga[2] + '\nTwoCondor ' + riga[3] + '\nZigulì ' + riga[4]);
	});
	setTimeout(function() {
		var riga = [];
		var rl = readline.createInterface({
			input: fs.createReadStream(StatStocazzo),
			output: process.stdout,
			terminal: false
		});
		var statistiche = fs.readFileSync(StatStocazzo);
		rl.on('line', function (line) {
		riga=line.split(" ");
		ctx.reply('Questo invece è il punteggio dello Stocazzo:\nTheSpaceFede ' + riga[1] + '\nZigulì ' + riga[0]);
		});
	}, 500);
});
bot.launch();



//Comando /sticker
const StageSticker = new Stage([adesivo]);
StageSticker.command('annulla', leave())
bot.use(StageSticker.middleware());
bot.command('sticker', ctx => {
	ctx.scene.enter('adesivo');
});
bot.launch();



//Comando /casaimbrianichannel
bot.command('casaimbrianichannel', ctx => {
	var riga = [];
	var rl = readline.createInterface({
		input: fs.createReadStream(CasaImbrianiChannel),
		output: process.stdout,
		terminal: false
	});
	var statistiche = fs.readFileSync(CasaImbrianiChannel);
	var i=0;
	rl.on('line', (line) => {
		riga[i]=line;
		i=i+1;
	});
	setTimeout(function() {
		if (riga[0]==0){
			ctx.reply("Attualmente non c'è nulla in programmazione a Casa Imbriani Channel");
		}	else{
				ctx.reply('Ecco la programmazione di questo mese a Casa Imbriani Channel');
				setTimeout(function() {
					ctx.reply("Tutti i giovedì alle 21:30");
				}, 1000);
				setTimeout(function() {
					for (i=10; i>=0; i--){
						if (typeof riga[i] !== 'undefined' && riga[i] !== null){
						}	else{
							riga[i] = "\n"
						}
					}
					ctx.reply(riga[1] + "\n" + riga[2] + "\n" + riga[3] + "\n" + riga[4] + "\n" + riga[5] + "\n" + riga[6] + "\n" + riga[7] + "\n" + riga[8] + "\n" + riga[9] + "\n" + riga[10]);
				}, 500);
			}
	}, 100);
});
bot.launch();



//Comando /CIC
bot.command('CIC', ctx => {
	var riga = [];
	var rl = readline.createInterface({
		input: fs.createReadStream(CasaImbrianiChannel),
		output: process.stdout,
		terminal: false
	});
	var statistiche = fs.readFileSync(CasaImbrianiChannel);
	var i=0;
	rl.on('line', (line) => {
		riga[i]=line;
		i=i+1;
	});
	setTimeout(function() {
		if (riga[0]==0){
			riga[0]=1;
			ctx.reply("Ho riattivato il comando /casaimbrianichannel");
		}	else{
			riga[0]=0;
			ctx.reply("Ho disattivato il comando /casaimbrianichannel");
		}
		for (i=10; i>=0; i--){
			if (typeof riga[i] !== 'undefined' && riga[i] !== null){
			}	else{
				riga[i] = "\n"
			}
		}
		fs.writeFile(CasaImbrianiChannel, riga[0] + "\n" + riga[1] + "\n" + riga[2] + "\n" + riga[3] + "\n" + riga[4] + "\n" + riga[5] + "\n" + riga[6] + "\n" + riga[7] + "\n" + riga[8] + "\n" + riga[9] + "\n" + riga[10], {flag: 'r+'}, err => {
		if (err) {
			console.error(err)
			return
			}
		})
	}, 100);
});



//Comando /help
bot.command('help', ctx => {
	ctx.reply('Con questo bot puoi impostare la nuova parola del giorno, cercare le parole del giorno passate o vedere qual' + "'" + 'era la parola del giorno di una certa data.\nPuoi usare i seguenti comandi:\n/paroladelgiorno - Ti permette di impostare la nuova parola del giorno, ma ricorda che puoi usarlo solo una volta al giorno\n/cerca - Con questo comando puoi cercare se una parola è stata parola del giorno e scoprire quando\n/data - Questo invece ti permette di scoprire qual' +"'" + 'era la parola del giorno in una certa data\n/scarica - Permette di scaricare il file con tutte le parole del giorno in ordine cronologico\n/statistiche - Vedi il punteggio delle parole del giorno e dello stocazzo\n/sticker - Richiedi la creazione di uno sticker\n/casaimbrianichannel - Vedi cosa c' + "'" + 'è in programmazione a Casa Imbriani Channel\n/annulla - Semplicemente annulla l' + "'" + 'operazione in corso\n' + crediti + versione);
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