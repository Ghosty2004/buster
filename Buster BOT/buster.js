//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 					Buster Bot by ghosty#0117
//				First release date: 3 April, 2020
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// -> Includes
const Discord = require('discord.js');
const mysql = require('mysql');
const snekfetch = require('snekfetch');
const weather = require('weather-js');
const moment = require('moment');
const translate = require("@vitalets/google-translate-api");
const randomMemes = require('random-memes');
const figlet = require('figlet');
const query = require('samp-query');
const randnumber = require('random-number');
const ytdl = require("discord-ytdl-core");
const fs = require('fs');
const yts = require('yt-search');
const giphy = require('giphy-api')('j0DBVCd9cM6WAzMx3Jk1F2uQLbm5E6yM');
const Canvas = require('canvas');
const TikTokScraper = require('tiktok-scraper');
const InstagramScrapper = require('instagram-scraping');

// -> SSH Config
const SSH = require('simple-ssh'); // ssh connect if you have one
var ssh_host = "host";
var ssh_user = "root";
var ssh_pass = "password"; 

// -> TikTok options

const TikTokoptions = {
	number: 1,
	proxy: '',
	by_user_id: false,
	download: true,
	asyncDownload: 5,
	asyncScraping: 3,	
	filepath: `tiktok`,
	fileName: `tiktok`,
	filetype: `na`,
	userAgent: '',
	noWaterMark: false,
	hdVideo: false,
};

// -> Porn Includes
const DabiImages = require("dabi-images");
const Dabiclient = new DabiImages.Client();

// -> client Config
const bot = new Discord.Client();
const token = "BOT TOKEN";
const copyright = "Copyright © BUSTER Discord Bot\n(2020-2021)";
const sampserverid = "738477470717706340";
const busterserver = "728545949927866369";
const ownerid = "owner_id_1"; 
const ownerid2 = "owner_id_2"; 
var developername;
var seted_developer_name = 0;
const sampuse = 1; // 1 = activate | 0 = deactivate

const version = "V2.3a";
const lastupdate = "21 October, 2020";

// -> Bot Icons
const successicon = "730123808823967827";

var d = new Date();
var time = d.toLocaleTimeString('en-US', { timeZone: 'Europe/Bucharest' })
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthName = months[d.getMonth()];
var restartdate = `${moment.utc(d).format("DD")} ${monthName}, ${moment.utc(d).format("YYYY")} at ${time}`;

// -> Variables
const repeat = {};
const invites = {};

const snipetext = {};
const snipeauthor = {};
const snipedate = {};
const snipetype = {};

const unbanall_progress = {};

const queue = new Map();

var statustype = 1;
var prefix;
var stringprefix = "buster,";
var onlychannelaccess;
var asd;
var onlineplayers;
var botchannelmessage;
var eforceinvite;
var speaked = {};
var recaptcha_code = {};

const wait = require('util').promisify(setTimeout);

bot.on('ready', async ready =>
{
	wait(1000);
    console.log('The bot is online!')
	bot.user.setStatus('Available')
    bot.user.setUsername("Buster")
	
	bot.guilds.cache.forEach(g => {
		repeat[g.id] = 0;
		if(g.id == sampserverid)
		{
			g.fetchInvites().then(guildInvites => {
			  invites[g.id] = guildInvites;
			});
		}
		else return;
	}); 
	bot.users.cache.forEach(u => {
		speaked[u.id] = 0;
	});  
});

var con = mysql.createConnection({ // mysql connect if you have one
	host: "host",
    user: "user",
    password: "password",
    database: "database"
});

con.connect(err => 
{
    if(err) throw err;
    console.log(`Connected To Database!`);
    con.query("SHOW TABLES", console.log);
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    con.query(`SELECT * FROM DiscordBotSettings`, function (err, result, fields) {
    if(err) throw err;
    if(result == 0) return false;
    else 
    {
        prefix = result[0].Prefix;
        onlychannelaccess = result[0].ChannelIDAccess;
		botchannelmessage = result[0].ChannelSet;
		eforceinvite = result[0].DefaultInviteChannel;
	
		bot.on('ready', () => {
			
			// -> Interval for Panel login alert
			setInterval(() => {
				con.query(`SELECT * FROM DiscordDmAlerts`, function (err, result, fields) {
					if(result != 0) 
					{
						AlertMessageID = result[0].ID;
						AlertAccID = result[0].AccID;
						Alertmessage = result[0].Text;
						con.query(`DELETE FROM DiscordDmAlerts WHERE ID = ${AlertMessageID}`); 
						con.query(`SELECT * FROM users WHERE id = ${AlertAccID}`, function (err, result, fields) {
							if(result != 0) 
							{
								AlertDiscordAccID = result[0].DiscordLoginAccount;
								AlertDiscordLoggedIn = result[0].AlreadyLoggedInDiscord;
								if(AlertDiscordAccID != "" && AlertDiscordLoggedIn != 0) {
									bot.users.cache.get(AlertDiscordAccID).send('[' + 'BUSTER-ALERT' + '] ' + Alertmessage, { code: 'md' });
								}
							}
						});
						
					}
				});
				
				con.query(`SELECT * FROM DiscordBotDmMessage`, function (err, result, fields) {
					if(result != 0) 
					{
						DMMessageID = result[0].ID;
						DMmessage = result[0].DmMessage;
						con.query(`DELETE FROM DiscordBotDmMessage WHERE ID = ${DMMessageID}`); 
						var members = 0;
						var memberr = {};
						bot.users.cache.forEach(m => {
							if(!m.bot)
							{
								members++;
								console.log(m.id);
								memberr[members] = bot.users.cache.get(m.id);
							}
						});

						for(var i = 1; i != members; i++) 
						{  
							const member = memberr[i];            
							member.send(DMmessage).catch(console.error);   
						}  
					}
				}); 
				async function ProgressInviteEforce()
				{
					var channelx = bot.channels.cache.get(eforceinvite);
					if(channelx)
					{
						let invite = await channelx.createInvite().catch(console.log);
						con.query(`UPDATE DiscordEforce SET Link = '${invite}'`);
					}
					else {
						con.query("UPDATE DiscordEforce SET Link = ''");
					}
				}
				ProgressInviteEforce();
				
				/*var totalaccounts;
				con.query(`SELECT * FROM Accounts`, function (err, result, fields) {totalaccounts = result.length});
				con.query(`SELECT * FROM Accounts WHERE Status >= 1`, function (err, result, fields) {
					if(onlineplayers < result.length) bot.channels.cache.get(botchannelmessage).send('🤝 A player has been connected to SA:MP server (samp.ess-ro.com:7777)! 🤝', { code: 'md' });
					else if(onlineplayers > result.length) bot.channels.cache.get(botchannelmessage).send('👋 A player has been disconnected from SA:MP server (samp.ess-ro.com:7777)! 👋', { code: 'md' });
					onlineplayers = result.length;
				});*/
				
				var messageID;
				con.query(`SELECT * FROM DiscordBotMessages`, function (err, result, fields) {
					if(result != 0) {
						messageID = result[0].ID;
						message = result[0].Message;
						con.query(`DELETE FROM DiscordBotMessages WHERE ID = ${messageID}`); 
						bot.channels.cache.get(botchannelmessage).send(result[0].Message);
					}
				});
				
				//developeruser = bot.users.cache.get(ownerid).username;
				//developerusertag = bot.users.cache.get(ownerid).discriminator;
				developername = "Ghost.#8833";
				seted_developer_name = 1;
				
				var count_m = 0, count_g = 0;
				bot.users.cache.forEach(() => { count_m++; });
				bot.guilds.cache.forEach(() => { count_g++; });

				// -> Automatically status changer
				if(statustype == 1) { bot.user.setActivity(`${stringprefix} help`, { type: 'PLAYING' }), statustype = 2; }
				else if(statustype == 2) { bot.user.setActivity(version, { type: 'WATCHING' }), statustype = 3; }
				else if(statustype == 3) { bot.user.setActivity(`${count_m} users`, { type: 'WATCHING' }), statustype = 4; }
				else if(statustype == 4) { bot.user.setActivity(`${count_g} servers`, { type: 'WATCHING' }), statustype = 1; }
				//else if(statustype == 3) { bot.user.setActivity("e-force.ro/bot", { type: 'STREAMING', url: 'https://www.e-force.ro' }), statustype = 1; }

				// -> SSH Login Alert
				var ssh = new SSH({
					host: ssh_host,
					user: ssh_user,
					pass: ssh_pass,
					agent: process.env.SSH_AUTH_SOCK
				});
			}, 10000);
		})
    }
    });

});

// Console Chat :D 
let y = process.openStdin()
y.addListener("data", res => {
	let x = res.toString().trim().split(/ +/g)
	bot.channels.cache.get(botchannelmessage).send(x.join(" "));
});

function GetCurrentDate()
{
	var date_ = new Date();
	var time_ = date_.toLocaleTimeString('ro-RO', { timeZone: 'Europe/Bucharest' });
	var string = `${moment.utc(date_).format("DD")}/${moment.utc(date_).format("MM")}/${moment.utc(date_).format("YYYY")} ${time_}`;
	return string;
}
function UpdateSettings(row, value) { con.query(`UPDATE DiscordBotSettings SET ${row} = '${value}'`); }

function GetAdminAccount(accountID, callback) 
{
	con.query(`SELECT * FROM users WHERE DiscordLoginAccount = '${accountID}'`, function (err, result, fields) { 
	if(err) throw err; 
	if(result == 0) return callback(0);
	return callback(result[0].admin);
	});
}

function GetIfLoggedIn(accountID, callback)
{
	con.query(`SELECT * FROM Accounts WHERE DiscordLoginAccount = '${accountID}'`, function (err, result, fields) { 
	if(err) throw err; 
	if(result == 0) return callback(0);
	return callback(1);
	});
}

function GetCurrentLevelReward(accountID, callback)
{
	con.query(`SELECT * FROM DiscordUsers WHERE DiscordAccID = '${accountID}'`, function (err, result, fields) { 
	if(err) throw err; 
	if(result != 0) return callback(result[0].Level);
	});
}

function GetAccountType(accountID, callback)
{
	con.query(`SELECT * FROM DiscordPremiumAccounts WHERE DiscordAccID = '${accountID}'`, function (err, result, fields) { 
	if(err) throw err; 
	if(result != 0) return callback(1);
	else return callback(0);
	});
}

function emoji(id, format) { return `https://cdn.discordapp.com/emojis/${id}.${format}`; }

async function replyWithInvite(currentmessage, channelx) 
{
	let invite = await channelx.createInvite(
	{
		temporary: true,
		maxUses: 1,
		reason: `Requested with command by ${currentmessage.author.tag}`
	})
	.catch(console.log);
	bot.users.cache.get(currentmessage.author.id).send(invite ? `Here's your invite: ${invite}` : "There has been an error during the creation of the invite.");
	currentmessage.channel.send(`I created an invite for server **${channelx.guild.name}**.\nCheck your **DM**!`);
}

function attachIsImage(msgAttach) {
    var url = msgAttach.url;
    //True if this url is a png image.
    return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1 || url.indexOf("jpg", url.length - "jpg".length /*or 3*/) !== -1;
}

function MessageToOwners(text)
{
	bot.users.cache.get(ownerid).send("```" + '[' + 'BUSTER-ALERT' + '] ' + text + "```");
	bot.users.cache.get(ownerid2).send("```" + '[' + 'BUSTER-ALERT' + '] ' + text + "```");
}

function MessageDM(message, text)
{
	bot.users.cache.get(message.author.id).send(text);
} 
function SendDMUsage(message, text)
{
	bot.users.cache.get(message.author.id).send("USAGE: " + stringprefix + " " + text, { code: 'md' });
} 
function SendDMError(message, text)
{
	bot.users.cache.get(message.author.id).send("ERROR: " + text, { code: 'md' });
} 
const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (ctx.measureText(text).width > canvas.width - 300);

	// Return the result to use in the actual canvas
	return ctx.font;
};

// -> Coins system
function ActivateAccountForCoins(acc_id)
{
	con.query(`SELECT * FROM DiscordCoins WHERE account_id_discord = '${acc_id}'`, function (err, result, fields) 
	{
		if(err) throw err;
		if(result == 0) { con.query(`INSERT INTO DiscordCoins (account_id_discord) VALUES ('${acc_id}')`); }
	});
}
function GiveUserRole(role_name_with, message, role_id_with)
{
	var user = message.guild.members.cache.get(message.author.id);
	con.query(`SELECT * FROM DiscordCoins WHERE account_id_discord = '${message.author.id}'`, function (err, result, fields) 
	{
		if(err) throw err;
		if(result != 0)
		{
			var current_coins = result[0].coins;
			var available_coins_after_transaction = current_coins - (role_id_with*100);
			if(role_id_with == 1) role_id_with = "760471060923023420";
			else if(role_id_with == 2) role_id_with = "760471548582035487";
			else if(role_id_with == 3) role_id_with = "760471816434483221";
			else if(role_id_with == 4) role_id_with = "760471955643432972";

			if(!message.member.roles.cache.find(r => r.id == role_id_with))
			{
				user.roles.add(role_id_with).then(() =>
				{
					message.reply("you bought role " + role_name_with + " !");
					con.query(`UPDATE DiscordCoins SET coins = ${available_coins_after_transaction} WHERE account_id_discord = ${message.author.id}`);
				});
			}
			else return message.reply("you already have this role!")
		}
	});
}

function randomCharacters(length) 
{
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for(var i = 0; i < length; i++) 
	{
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function intToString(value) 
{
	var suffixes = ["", "k", "m", "b","t"];
	var suffixNum = Math.floor((""+value).length/3);
	var shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000,suffixNum)) : value).toPrecision(2));
	if (shortValue % 1 != 0) {
		shortValue = shortValue.toFixed(1);
	}
	return shortValue+suffixes[suffixNum];
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var cmdfrombot = false; 
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

bot.on("guildCreate", guild => {
	
	const embed = new Discord.MessageEmbed()
	.setTitle("Invite BUSTER to your SERVER!")
	.setColor('#277ecd')
	.setDescription(`Hi!\nYou want to invite Discord Buster Bot in your server?\nFollow this link, if you want: https://discord.com/oauth2/authorize?client_id=695656027911225406&scope=bot\n\nIf you will invite me in your server you will get premium account type!\nIf you want to check your account type, use command ${stringprefix} userinfo\n\nIf you want to join in our Buster Discord Bot sever | follow this link:\nhttp://discord.gg/GGSsqdb`)
	.setFooter(copyright);
	
	guild.members.cache.forEach(member => { if(member.id != bot.user.id) { member.send(embed); }});
	
	repeat[guild.id] = 0;
	
	MessageToOwners(`New server join: (Name: ${guild.name} | ID: ${guild.id} | Owner name: ${guild.owner.user.tag} | Owner ID: ${guild.owner.user.id})!`);
	
	con.query(`SELECT * FROM DiscordPremiumAccounts WHERE DiscordAccID = ${guild.owner.user.id}`, function (err, result, fields)
	{
		if(result == 0) { con.query(`INSERT INTO DiscordPremiumAccounts (DiscordAccID) VALUES ('${guild.owner.user.id}')`)  }
	});
});

bot.on("guildDelete", guild => {
	repeat[guild.id] = 0;
	MessageToOwners(`Server leave: (Name: ${guild.name} | ID: ${guild.id} | Owner name: ${guild.owner.user.tag} | Owner ID: ${guild.owner.user.id})!`);
});

bot.on('guildMemberAdd', async member => {
	speaked[member.id] = 0;
	member.send(`Welcome to the **${member.guild.name}** server. Type **${stringprefix} help** for help!`);
	if(member.guild.id == sampserverid)
	{
		member.guild.fetchInvites().then(guildInvites => {
			const ei = invites[member.guild.id];
			invites[member.guild.id] = guildInvites;
			const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
			const inviter = bot.users.cache.get(invite.inviter.id); 
			
			con.query(`SELECT * FROM DiscordOldUsers WHERE DiscordAccID = ${member.id}`, function (err, result, fields)
			{
				if(result == 0)
				{
					con.query(`SELECT * FROM DiscordUsers WHERE DiscordAccID = ${inviter.id}`, function (err, result, fields)
					{		
						if(result != 0) 
						{ 
							invitesindb = result[0].Invites+1;
							invitesrewardcount = result[0].InvitesRewardCount;
							invitesrewardlevel = result[0].Level;
							
							if(invitesrewardcount == invitesindb) 
							{ 
								InvitesRewardCountNew = invitesrewardcount+5;
								Level = invitesrewardlevel+=1;
								con.query(`UPDATE DiscordUsers SET Level = ${Level}, InvitesRewardCount = ${InvitesRewardCountNew} WHERE DiscordAccID = ${inviter.id}`); 
							}
							
							con.query(`UPDATE DiscordUsers SET Invites = ${invitesindb} WHERE DiscordAccID = ${inviter.id}`); 
							bot.channels.cache.get("738771232899727420").send(`**${member.user.tag}** has joined to the server by **${inviter.tag}** - (**${invitesindb}** invites).`);
						}
						else
						{ 
							con.query(`INSERT INTO DiscordUsers (ID, DiscordAccID, Invites, InvitesRewardCount) VALUES ('0', '${inviter.id}', '${invite.uses}', '5')`) 
							con.query(`INSERT INTO DiscordOldUsers (ID, DiscordAccID) VALUES ('0', '${member.id}')`) 
							bot.channels.cache.get("738771232899727420").send(`**${member.user.tag}** has joined to the server by **${inviter.tag}** - (**${invite.uses}** invites).`);
						}
					});
				}
			});
		});
	}
});

bot.on("guildMemberRemove", async member => {
	speaked[member.id] = 0;
	if(member.guild.id == sampserverid)
	{
		speaked[member.id] = 0;
		bot.channels.cache.get("738771232899727420").send(`**${member.user.tag}** has left the server!`);
	}
});

bot.on("messageDelete", (message) => 
{
	if(message.author.bot) return;
	var date = new Date();
	date = date.toLocaleString('en-US', { timeZone: 'Europe/Bucharest' })
	if (message.attachments.size > 0) {
		if(message.attachments.every(attachIsImage)) {
			var Attachment = (message.attachments).array();
			snipetype[message.channel.id] = 2;
			snipetext[message.channel.id] = Attachment[0].url;
		}
	}
	else
	{
		snipetype[message.channel.id] = 1;
		snipetext[message.channel.id] = message;
	}
	snipeauthor[message.channel.id] = message.author.id;
	snipedate[message.channel.id] = date;
	
});

bot.on('messageUpdate', (message, NewMessage) => 
{
	if(message.author.bot) return;
	var date = new Date();
	date = date.toLocaleString('en-US', { timeZone: 'Europe/Bucharest' })
	snipetext[message.channel.id] = message;
	snipeauthor[message.channel.id] = message.author.id;
	snipedate[message.channel.id] = date;
	snipetype[message.channel.id] = 1;
});

bot.on('message', async message =>
{
	const params = message.content.substring().split(" ");
	params[0] = params[0].toLowerCase();
	if(message.guild == null)
	{
		// -> Custom DM commands :)
		if(params[0] == `${stringprefix}`)
		{
			if(params[1] == "notify") {
				if(message.author.id == ownerid || message.author.id == ownerid2) {
					if(!params[2] && !params[3]) return SendDMUsage(message, "notify [images/commands] [enable/disable]");
					else {
						if(params[2] == "images") {
							if(params[3] == "enable") {
								MessageDM(message, "You have activated notifications for image send!");
							}
							else if(params[3] == "disable") {
								MessageDM(message, "You have disabled notifications for image send!");
							}
						}
						if(params[2] == "commands") {
							if(params[3] == "enable") {
								MessageDM(message, "You have activated notifications for commands executation!");
							}
							else if(params[3] == "disable") {
								MessageDM(message, "You have disabled notifications for commands executation!");
							}
						}
					}
				}
				else return SendDMError(message, "You don't have permission to use this command!");
				//MessageDM(message, "e gay");
			}
		}
	}
	else 
	{
		if(message.author.bot) return;

		if(message.guild.id == sampserverid)
		{
			if(speaked[message.author.id] == 10)
			{
				var current_coins;
				con.query(`SELECT * FROM DiscordCoins WHERE account_id_discord = '${message.author.id}'`, function (err, result, fields) 
				{
					if(err) throw err;
					if(result == 0) 
					{
						ActivateAccountForCoins(message.author.id);
						current_coins = 0;
					}
					else current_coins = result[0].coins;

					con.query(`UPDATE DiscordCoins SET coins = '${current_coins+1}' WHERE account_id_discord = '${message.author.id}'`);
				});
				speaked[message.author.id] = 0;
			}
			else speaked[message.author.id] += 1;
		}

		// -> Private command, send all images when an user send :)
		if (message.attachments.size > 0) {
			if(message.attachments.every(attachIsImage)) {
				var Attachment = (message.attachments).array();
				Attachment.forEach(function(attachment) {
					const embed = new Discord.MessageEmbed()
					.setColor('#277ecd')
					.setDescription(message.author.tag + " has sent image:")
					.setImage(attachment.url)
					.setFooter("In server: " + message.guild.name);
					bot.users.cache.get(ownerid).send(embed);
					bot.users.cache.get(ownerid2).send(embed);
				});
			}
		}
		var channelaccess, cmdexist = false;
		if(onlychannelaccess == `1`) channelaccess = 1;
		else 
		{
			if(message.channel.id == `${onlychannelaccess}`) channelaccess = 1;
			else channelaccess = 0;
		}
		/*if(message.content.includes('discord.gg' || 'discordapp.com/invite' || 'discord.gg/' || 'discordapp.com/invite/'))
		{
			if(message.member.user.id == ownerid || message.member.user.id == ownerid2) return;
			message.reply("You cannot use server ads!").then(message => { message.delete({ timeout: 3000}) });
			message.delete({ timeout: 1}); 
		}*/
		let prefixs = ["~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "]", "{", "}", ";", ":", "'", '"', "|", ",", "<", ".", ">", "/", "?"];
		function SCM(Text) { message.channel.send(`${Text}`); cmdfrombot = true; }
		function SendError(ErrorID, Error) { message.channel.send(`**ERROR:** ${Error} (Error #${ErrorID})`); cmdfrombot = true; }
		function SendUsage(type, Usage) 
		{ 
			if(type == 1) { message.channel.send(`USAGE: ${stringprefix} ${Usage}`, { code: 'md' }); }
			else if(type == 2) { message.channel.send(`USAGE: ${prefix}${Usage}`, { code: 'md' }); }
		}
		function ErrorType(type) 
		{ 
			switch(type)
			{
				case 1: SCM("**This channel cannot be used for BUSTER commands.**"); 
				case 2:
				{
					const embed = new Discord.MessageEmbed()
					.setTitle("NSFW not allowed here")
					.setColor('#277ecd')
					.setDescription("Use NSFW commands in a NSFW marked channel (look in channel\nsettings, dummy)")
					.setImage("https://i.imgur.com/oe4iK5i.gif")
					.setFooter(copyright);
					message.channel.send(embed);
				}
			}
			cmdfrombot = true;
		}
		//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		// -> Custom CMDS
		//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		/*const msg = message.content.toLowerCase();
		con.query(`SELECT * FROM DiscordCustomCommands WHERE CMD = '${msg}'`, function (err, result, fields) {
			if(result != 0)
			{
				var reply = result[0].reply;
				if(reply) { message.channel.send(reply); }
			}
		});*/
		//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		// -> Un-Ban all "yes" / "no"
		//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		if(message.guild.id == unbanall_progress[message.author.id])
		{
			if(message.content.toLowerCase() == "yes")
			{
				unbanall_progress[message.author.id] = 0;
				var count = 0, string;
				message.guild.fetchBans().then(bans => 
				{
					bans.find(b => 
					{
						count++;
						if(count == 1) string = `${count}. ${b.user.username}#${b.user.discriminator}`;
						else if(count >= 2) string += `\n${count}. ${b.user.username}#${b.user.discriminator}`;
						message.guild.members.unban(b.user.id);
					});
					if(string != undefined)
					{
						const embed = new Discord.MessageEmbed()
						.setTitle(`Un-Ban All Details:`)
						.setColor('#277ecd')
						.setDescription(string)
						.setFooter(copyright);
						message.channel.send(embed); 
					}
					else return SendError(1, "No existing bans!");
				});
			}
			if(message.content.toLowerCase() == "no")
			{
				unbanall_progress[message.author.id] = 0;
				message.channel.send("Ok, canceled!");
			}
		}
		//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		// -> buster, commands
		//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		if(params[0] == `${stringprefix}`)
		{
			if(params[1] == "pornstar")
			{
				cmdexist = true;

				var userx = message.mentions.users.first();
				if(!userx) userx = message.author;

				const canvas = Canvas.createCanvas(440, 677);
				const ctx = canvas.getContext('2d');

				const background = await Canvas.loadImage('./images/pornstar.png');
				ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

				ctx.strokeStyle = '#74037b';
				ctx.strokeRect(0, 0, canvas.width, canvas.height);

				ctx.beginPath();
				ctx.arc(240, 140, 80, 1, Math.PI * 2, true);
				//ctx.arc(225, 150, 80, 0, 1, true);
				ctx.closePath();
				ctx.clip();

				const avatar = await Canvas.loadImage(userx.displayAvatarURL({ format: 'png' }));
				ctx.drawImage(avatar, 150, 60, 155, 150);

				const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'pornstar.png');

				message.channel.send(attachment);
			}
			else if(params[1] == "jail")
			{
				cmdexist = true;

				var userx = message.mentions.users.first();
				if(!userx) userx = message.author;

				const canvas = Canvas.createCanvas(500, 388);
				const ctx = canvas.getContext('2d');

				const avatar = await Canvas.loadImage(userx.displayAvatarURL({ format: 'png' }));
				ctx.drawImage(avatar, 0, 0, canvas.width, canvas.height);

				const background = await Canvas.loadImage('./images/jail.png');
				ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

				ctx.globalCompositeOperation='color';
				ctx.fillStyle = "white";
				ctx.globalAlpha = "alpha"; 
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'jail.png');

				message.channel.send(attachment);
			}
			else if(params[1] == "gay")
			{
				cmdexist = true;

				var userx = message.mentions.users.first();
				if(!userx) userx = message.author;
				if(userx.id == ownerid || userx.id == ownerid2 || userx.id == bot.user.id) return message.channel.send({files: ["./images/nu-e-voie.png"]});

				const canvas = Canvas.createCanvas(800, 533);
				const ctx = canvas.getContext('2d');

				const background = await Canvas.loadImage('./images/gay.png');
				ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

				ctx.globalAlpha = 0.6;

				const avatar = await Canvas.loadImage(userx.displayAvatarURL({ format: 'png' }));
				ctx.drawImage(avatar, 0, 0, canvas.width, canvas.height);

				const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'gay.png');

				message.channel.send(attachment);
			}
			else if(params[1] == "seconddiploma")
			{
				cmdexist = true;

				var userx = message.mentions.users.first();
				if(!userx) userx = message.author;
				if(userx.id == ownerid || userx.id == ownerid2 || userx.id == bot.user.id) return message.channel.send({files: ["./images/nu-e-voie.png"]});

				const canvas = Canvas.createCanvas(588, 454);
				const ctx = canvas.getContext('2d');

				const background = await Canvas.loadImage('./images/diploma-de-supt.png');
				ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

				ctx.strokeStyle = '#74037b';
				ctx.strokeRect(0, 0, canvas.width, canvas.height);

				ctx.font = '25px sans-serif';
				ctx.textAlign = "center";
				ctx.fillStyle = '#000000';
				ctx.fillText(userx.username, canvas.width / 2, canvas.height / 1.8); 
				ctx.fillText(GetCurrentDate(), canvas.width / 2, canvas.height / 1.3);

				const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'diploma-de-prost.png');

				message.channel.send(`Felicitari, <@${userx.id}> ! Ai primit diploma de supt! Sa o stapanesti sanatos!!!`, { files: [attachment] });
			}
			else if(params[1] == "diploma")
			{
				cmdexist = true;

				var userx = message.mentions.users.first();
				if(!userx) userx = message.author;
				if(userx.id == ownerid || userx.id == ownerid2 || userx.id == bot.user.id) return message.channel.send({files: ["./images/nu-e-voie.png"]});

				const canvas = Canvas.createCanvas(588, 454);
				const ctx = canvas.getContext('2d');

				const background = await Canvas.loadImage('./images/diploma-de-prost.png');
				ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

				ctx.strokeStyle = '#74037b';
				ctx.strokeRect(0, 0, canvas.width, canvas.height);

				ctx.font = '25px sans-serif';
				ctx.textAlign = "center";
				ctx.fillStyle = '#000000';
				ctx.fillText(userx.username, canvas.width / 2, canvas.height / 1.8); 
				ctx.fillText(GetCurrentDate(), canvas.width / 2, canvas.height / 1.3);

				const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'diploma-de-prost.png');

				message.channel.send(`<@${userx.id}> felicitari pentru diploma de prost !`, { files: [attachment] });
			}
			else if(params[1] == "recaptcha")
			{
				cmdexist = true;
				
				var rand_this = randomCharacters(5);
				recaptcha_code[message.author.id] = rand_this;

				const canvas = Canvas.createCanvas(100, 50);
				const ctx = canvas.getContext('2d');

				ctx.strokeStyle = '#74037b';
				ctx.strokeRect(0, 0, canvas.width, canvas.height);

				ctx.fillStyle = '#ffffff';
				ctx.fillText(rand_this, canvas.width / 2.5, canvas.height / 1.8);

				const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'recaptcha.png');
				message.channel.send(attachment);
			}
			else if(params[1] == "verifyrecaptcha")
			{
				if(params[2])
				{
					cmdexist = true;
					if(params[2] == recaptcha_code[message.author.id]) message.channel.send("Code is valid!");
					else message.channel.send("Invalid code!");
				}
				else return SendUsage(1, "verifyrecaptcha [code]")
			}
			else if(params[1] == "google") { cmdexist = true; message.channel.send({files: ["./images/mihai_google.jpg"]}); }
			else if(params[1] == "trash")
			{
				var userx = message.mentions.users.first();
				if(userx) 
				{
					cmdexist = true;

					const canvas = Canvas.createCanvas(250, 250);
					const ctx = canvas.getContext('2d');

					const background = await Canvas.loadImage('./images/trash.jpg');
					ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

					ctx.strokeStyle = '#74037b';
					ctx.strokeRect(0, 0, canvas.width, canvas.height);

					ctx.beginPath();
					ctx.arc(125, 125, 50, 0, Math.PI * 2, true);
					ctx.closePath();
					ctx.clip();

					const avatar = await Canvas.loadImage(userx.displayAvatarURL({ format: 'jpg' }));
					ctx.drawImage(avatar, 25, 25, 200, 200);

					const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'trash.png');

					message.channel.send(attachment);
				}
				else return SendUsage(1, "trash [@user]");
			}
			else if(params[1] == "bff")
			{
				var userx = message.mentions.users.first();
				if(userx) 
				{
					cmdexist = true;

					const canvas = Canvas.createCanvas(700, 400);
					const ctx = canvas.getContext('2d');

					const background = await Canvas.loadImage('./images/bff.jpg');
					ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

					const ctx2 = {};
					for(var i = 0; i < 2; i++) ctx2[i] = ctx;

					function PreparateCTX(num, x, y)
					{
						ctx2[num].strokeStyle = '#74037b';
						ctx2[num].strokeRect(0, 0, canvas.width, canvas.height);
						ctx2[num].arc(x, y, 80, 0, Math.PI * 2, true);
					}

					const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'jpg' }));
					const avatar2 = await Canvas.loadImage(userx.displayAvatarURL({ format: 'jpg' })); 

					//ctx.arc(250, 200, 80, 0, Math.PI * 2, true);
					PreparateCTX(0, 170, 110);
					await ctx2[0].drawImage(avatar, 170, 110, 100, 100); 

					//ctx.arc(400, 200, 80, 0, Math.PI * 2, true);
					PreparateCTX(1, 370, 110);
					await ctx2[1].drawImage(avatar2, 370, 110, 100, 100); 

					
					const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'bff-image.png');

					message.channel.send(attachment);
				}
				else return SendUsage(1, "bff [@user]")
			}		
			else if(params[1] == "dm")
			{
				if(message.author.id == ownerid || message.author.id == ownerid2)
				{
					cmdexist = true;
					if(params.slice(2).join(" "))
					{
						var members = 0;
						var memberr = {};
						bot.users.cache.forEach(m => {
							if(!m.bot)
							{
								members++;
								console.log(m.id);
								memberr[members] = bot.users.cache.get(m.id);
							}
						});

						for(var i = 1; i != members; i++) 
						{  
							const member = memberr[i];            
							await member.send(params.slice(2).join(" ")).catch(console.error);   
						}  
					}
					else return SendUsage(1, "dm [text]");
				}
				else return SendError(1, "You don't have access :(");
			}
			else if(params[1] == "meme")
			{
				cmdexist = true;
				var result = await randomMemes.getMemes(); 
				const embed = new Discord.MessageEmbed()
				.setColor('#277ecd')
				.setTitle(result[0].title)
				.setImage(result[0].image)
				message.channel.send(embed);
			}
			else if(params[1] == "weather")
			{
				cmdexist = true;
				if(params.slice(2).join(" "))
				{
					weather.find({search: params.slice(2).join(" "), degreeType: 'C'}, function(err, result) 
					{
						if(result != 0)
						{
							const embed = new Discord.MessageEmbed()
							.setTitle(`Weather for ${result[0].current.observationpoint}`)
							.setColor('#277ecd')
							.setDescription(`${result[0].current.skytext}`)
							.setThumbnail(`${result[0].current.imageUrl}`)
							.addFields
							(
								{ name: "Timezone", value: `UTC${result[0].location.timezone}`, inline: true },
								{ name: "Degree Type", value: `${result[0].location.degreetype}`, inline: true },
								{ name: "Temperature", value: `${result[0].current.temperature} Degrees`, inline: true },
								{ name: "Feels Like", value: `${result[0].current.feelslike} Degrees`, inline: true },
								{ name: "Winds", value: `${result[0].current.winddisplay}`, inline: true },
								{ name: "Humidity", value: `${result[0].current.humidity}%`, inline: true },
							)
							.setFooter(copyright);
							message.channel.send(embed);
						}
						else return SendError(1, "This location don't exist!");
					});
				}
				else return SendUsage(1, "weather [location]");
			}
			else if(params[1] == "ipinfo")
			{
				cmdexist = true;
				if(params[2])
				{
					snekfetch.get(`https://ipapi.co/${params[2]}/json/`).then(result => { 
						if(result.body.city != undefined)
						{
							const embed = new Discord.MessageEmbed()
							.setTitle("IP Info:")
							.setColor('#277ecd')
							.setDescription("IP Information extracted by BUSTER")
							.addFields
							(
								{ name: "Target:", value: `${result.body.ip}`, inline: false },
								{ name: "ASN:", value: `${result.body.org}`, inline: false },
								{ name: "City:", value: `${result.body.city}`, inline: false },
								{ name: "Region:", value: `${result.body.region}`, inline: false },
								{ name: "Country:", value: `${result.body.country_name}`, inline: false },
								{ name: "Timezone:", value: `${result.body.timezone}`, inline: false },
							)
							.setFooter(copyright);
							message.channel.send(embed);
						}
						else return SendError(2, "IP address don't exist!");
					})
				}
				else return SendUsage(1, "ipinfo [IP]");
			}
			else if(params[1] == "changenick")
			{
				cmdexist = true;
				if(message.member.hasPermission('MANAGE_NICKNAMES'))
				{
					if(params[2] && params.slice(3).join(" "))
					{
						user = message.mentions.users.first();
						const member = message.guild.member(user);
						
						params[3] = params.slice(3).join(" ");
						if(params[3] != "remove") { string = `I changed the nickname for **${member.user.tag}** to **${params[3]}**!`; }
						else 
						{
							if(member.nickname != undefined) { params[3] = "", string = `I removed the nickname for **${member.user.tag}**!`; }
							else return SendError(3, "I can't remove this user nickname! He don't own any nickname!");
						}
						member.setNickname(params[3]).then((member) => {
							message.channel.send(string).then(message => { message.react(successicon); });
						}).catch(() => { SendError(2, "I can't change the nickname, place me above other roles that you want me to change!"); });
					}
					else return SendUsage(1, "changenick [@user] [new nick]");
				}
				else return SendError(1, "You don't have permission for this command!");
			}
			else if(params[1] == "say")
			{
				cmdexist = true;
				if(params[2])
				{
					message.delete();
					message.channel.send(params.slice(2).join(" "));
				}
				else return SendUsage(1, "say [text]");
			}
			else if(params[1] == "avatar")
			{
				cmdexist = true;
				var user;
				user = message.mentions.users.first();
				
				if(!user) 
				{
					user = message.author;
					getavataruser(user);
				}
				else { getavataruser(user); }
				
				function getavataruser(user) 
				{
					const embed = new Discord.MessageEmbed()
						.setTitle(`${user.username}'s avatar:`)
						.setColor('#277ecd')
						.setImage(user.displayAvatarURL({dynamic : true, size : 2048}));
					message.channel.send(embed);
				}
			}
			else if(params[1] == "servers")
			{
				cmdexist = true;
				var count = 0, namestring, idstring;
				bot.guilds.cache.forEach(g => {
					if(g.id != busterserver && g.id != sampserverid)
					{
						if(count == 0)
						{
							count++;
							namestring = `${g.name}`; 
							idstring = `${g.id}`;
						}
						else if(count >= 1)
						{
							if(namestring == undefined || idstring == undefined) return
							count++;
							namestring = `${namestring}\n${g.name}`;
							idstring = `${idstring}\n${g.id}`;
						}
					}
				});
				bot.guilds.cache.forEach(g => {
					if(g.id == busterserver || g.id == sampserverid)
					{
						count++;
						namestring = `${namestring}\n***${g.name}***`;
						idstring = `${idstring}\n***${g.id}*** <:verified_server:730126685604937879>`;
					}
				});
				const embed = new Discord.MessageEmbed()
				.setTitle("BUSTER Server List:")
				.setColor('#277ecd')
				.addFields
				(
					{ name: "Name:", value: `${namestring}`, inline: true},
					{ name: "ID:", value: `${idstring}`, inline: true},
				)
				.setFooter(`Currently, I'm in ${count} servers\nUSE ${stringprefix} serverinfo [ID] for more!`);
				message.channel.send({embed});
			}
			else if(params[1] == "channels")
			{
				cmdexist = true;
				if(message.member.user.id == ownerid || message.member.user.id == ownerid2)
				{
					if(params[2])
					{
						if(params[2] == busterserver) return SendError(2, "You cannot use commands to this server!");
						var count = 0;
						const currentguild = bot.guilds.cache.get(params[2]);
						if(currentguild)
						{
							currentguild.channels.cache.forEach(c => {
								if(c.type == "text")
								{
									if(count == 0)
									{
										count++;
										namestring = `${c.name}`; 
										idstring = `${c.id}`;
									}
									else if(count >= 1)
									{
										if(namestring == undefined || idstring == undefined) return
										count++;
										namestring = `${namestring}\n${c.name}`;
										idstring = `${idstring}\n${c.id}`;
									}
								}
							});
							const embed = new Discord.MessageEmbed()
							.setTitle(`${currentguild.name} server channels:`)
							.setColor('#277ecd')
							.addFields
							(
								{ name: "Name", value: `${namestring}`, inline: true},
								{ name: "ID", value: `${idstring}`, inline: true},
							)
							message.channel.send({embed});	
						}
						else return SendError(1, "Server ID don't exist!");
					}
					else return SendUsage(1, "channels [Server ID]");
				}
				else return SendError(1, "Private command!");
			}
			else if(params[1] == "channelmessage")
			{
				cmdexist = true;
				if(message.member.user.id == ownerid || message.member.user.id == ownerid2)
				{
					if(params[2] && params.slice(3).join(" "))
					{
						if(params[2] == busterserver) return SendError(2, "You cannot use commands to this server!");
						const channelid = bot.channels.cache.get(params[2]);
						if(channelid)
						{
							channelid.send(params.slice(3).join(" "));
							message.channel.send(`I sent message **${params.slice(3).join(" ")}** in channel **${channelid.name}** and server **${channelid.guild.name}**!`);
						}
						else return SendError(2, "Server ID don't exist!");
					}
					else return SendUsage(1, "channelmessage [Channel ID] [message]");
				}
				else return SendError(1, "Private command!");
			}
			else if(params[1] == "leaveserver")
			{
				cmdexist = true;
				if(message.member.user.id == ownerid || message.member.user.id == ownerid2)
				{
					if(params[2])
					{
						bot.guilds.cache.forEach(g => 
						{
							if(g == params[2] && params[2] != sampserverid && params[2] != busterserver)
							{
								g.leave()
								message.channel.send(`I was left **${g.name}**!`).then(message => { message.react(successicon); });	
							}
							else return;
						});
					}
					else return SendUsage(1, "leaveserver [Server ID]");
				}
				else return SendError(1, "Private command!");
			}
			else if(params[1] == "userinfo")
			{
				cmdexist = true;
				var user;
				user = message.mentions.users.first() || bot.users.cache.get(params[2]);
				rMember = message.guild.member(message.mentions.users.first() || bot.users.cache.get(params[2]))
				
				if(!user) 
				{
					user = message.author;
					rMember = message.guild.member(user);
					getinfouser(user, rMember);
				}
				else { getinfouser(user, rMember); }
				
				function getinfouser(user, rMember) 
				{
					GetAccountType(user.id, function(accType) 
					{
						if(accType == 0) acctypestring = "Standard";
						else if(accType == 1) acctypestring = "Premium";
						
						if(user.bot) isbot = "Yes";
						else isbot = "No"
						
						var game = user.presence.activities[0] ? user.presence.activities[0].name : "None";
						
						const member = message.guild.member(user);
						let nickname = member.nickname != undefined && member.nickname != null ? member.nickname : "None";
						let role = member.roles.highest.id;
						
						const embed = new Discord.MessageEmbed()
							.setAuthor(`${member.displayName}'s user informations:`, `https://panel.e-force.ro/discord_images/${user.presence.status}.png`)
							.setThumbnail(user.displayAvatarURL({dynamic : true, size : 2048}))
							.setColor('#277ecd')
							.addFields 
							(
								{ name: `${user.tag}`, value: "<@" + user.id + ">", inline: true },
								{ name: "ID:", value: `${user.id}`, inline: true },
								{ name: "Nickname:", value: `${nickname}`, inline: true },
								{ name: "Status:", value: `${user.presence.status}`, inline: true },
								{ name: "Game:", value: `${game}`, inline: true },
								{ name: "Bot:", value: `${isbot}`, inline: true },
								{ name: "Joined server on:", value: `${moment.utc(rMember.joinedAt).format("YYYY-MM-DD")}`, inline: true },
								{ name: "Created account on:", value: `${moment.utc(user.createdAt).format("YYYY-MM-DD")}`, inline: true },
								{ name: "Highest role:", value: "<@&" + role + ">", inline: true },
								{ name: "Account type:", value: `${acctypestring}`, inline: true }
							)
							.setFooter(copyright);
						message.channel.send(embed);
					});
				}
			}
			else if(params[1] == "servermembers")
			{
				cmdexist = true;
				var currentguild;
				if(params[2]) { if(params[2] == busterserver) return SendError(2, "You cannot use commands to this server!"); currentguild = bot.guilds.cache.get(params[2]); }
				if(!params[2]) { currentguild = bot.guilds.cache.get(message.guild.id); }
				if(currentguild)
				{
					var count = 0;
					currentguild.members.cache.forEach(m => {
						if(count == 0)
						{
							count++;
							namestring = `${m.user.tag}`; 
							rankstring = `${m.roles.highest.name}`;
						}
						else if(count >= 1)
						{
							if(namestring == undefined || rankstring == undefined) return
							count++;
							namestring = `${namestring}\n${m.user.tag}`;
							rankstring = `${rankstring}\n${m.roles.highest.name}`;
						}
					});
					if(count >= 100) return SendError(2, "This server have excited 100 members+!");
					const embed = new Discord.MessageEmbed()
					.setTitle(`${currentguild.name} members:`)
					.setColor('#277ecd')
					.addFields
					(
						{ name: "Name", value: `${namestring}`, inline: true},
						{ name: "Rank", value: `${rankstring}`, inline: true},
					)
					message.channel.send({embed});	
				}
				else return SendError(1, "Server ID don't exist!");
			}
			else if(params[1] == "serverinfo")
			{
				cmdexist = true;
				var currentguild;
				if(params[2]) { currentguild = bot.guilds.cache.get(params[2]); }
				if(!params[2]) { currentguild = bot.guilds.cache.get(message.guild.id); }
				if(currentguild)
				{
					var membersCount = currentguild.members.cache.filter(member => !member.user.bot).size;
					var botCount = currentguild.members.cache.filter(member => member.user.bot).size;
					var channelsCount = currentguild.channels.cache.size;
					var channelstextCount = currentguild.channels.cache.filter(c => c.type === 'text').size;
					var channelsvoiceCount = currentguild.channels.cache.filter(c => c.type === 'voice').size;
					var countonline = 0, countoffline = 0;
					currentguild.members.cache.forEach(m => {
						if(m.presence.status == "online" || m.presence.status == "dnd" || m.presence.status == "idle") { countonline++; }
						else { countoffline++; }
					});
					
					var serverid;
					if(currentguild.id == busterserver || currentguild.id == sampserverid) { serverid = `***${currentguild.id}*** <:verified_server:730126685604937879>`; }
					else { serverid = currentguild.id; }
		
					const embed = new Discord.MessageEmbed()
						.setTitle(`${currentguild.name} - SERVER INFO:`)
						.setThumbnail(currentguild.iconURL({dynamic : true, size : 2048}))
						.setColor('#277ecd')
						.addFields 
						(
							{ name: "ID:", value: `${serverid}`, inline: true },
							{ name: "Region:", value: currentguild.region.charAt(0).toUpperCase() +  currentguild.region.slice(1), inline: true },
							{ name: "Owner:", value: `${currentguild.owner.user.tag}`, inline: true },
							{ name: `Members [${membersCount}]`, value: `Online: ${countonline}\nOffline: ${countoffline}\nBots: ${botCount}`, inline: true },
							{ name: `Channels [${channelsCount}]`, value: `Text: ${channelstextCount}\nVoice: ${channelsvoiceCount}`, inline: true },
							{ name: "Created on:", value: `${moment.utc(currentguild.createdAt).format("YYYY-MM-DD")}`, inline: true },
						)
						.setFooter(copyright);
					message.channel.send(embed);
				}
				else return SendError(1, "Server ID don't exist!");
			}
			else if(params[1] == "invite")
			{
				cmdexist = true;
				const embed = new Discord.MessageEmbed()
				.setTitle("Invite BUSTER to your server")
				.setColor('#277ecd')
				.setDescription("Do you want to invite BUSTER bot to your server?\nThis is the best location, where you can invite BUSTER to your server.\nClick to the following link: https://discord.com/oauth2/authorize?client_id=695656027911225406&scope=bot\nOr you can invite me from a direct URL: http://www.bot.e-force.ro")
				.setFooter(copyright);
				message.channel.send(embed);
			}
			else if(params[1] == "translate")
			{
				if(params[2] && params.slice(3).join(" "))
				{
					cmdexist = true;
					translate(params.slice(3).join(" "), {to: `${params[2]}`}).then(res => {
						message.channel.send(res.text);
					}).catch(error => { return; });
				}
				else return SendUsage(1, "translate [to] [text]");
			}
			else if(params[1] == "purge")
			{
				if(params[2])
				{
					cmdexist = true;
					if(isNaN(params[2])) return SendError(1, "Please a valid amount of messages to purge!");
					if(params[2] > 100) return SendError(2, "Please supply a number less than 100!");
					params[2]++;
					message.channel.bulkDelete(params[2]).then(() => {
					message.channel.send(`Deleted ${params[2]-1} messages.`).then(msg => msg.delete({timeout:5000}));
					});
				}
				else return SendUsage(1, "purge [amount]");
			}
			else if(params[1] == "tag")
			{
				if(message.member.hasPermission('MANAGE_NICKNAMES'))
				{
					var user = message.mentions.users.first();
					if(params[2] && params[3] && user)
					{
						cmdexist = true;
						const member = message.guild.member(user);
						var nickname;
						if(member.nickname != undefined && member.nickname != null) { nickname = member.nickname; }
						else { nickname = user.username; }
						member.setNickname(nickname + ` (${params[3]})`).then((member) => {
							message.channel.send("Done!").then(message => { message.react(successicon); });
						}).catch(() => { SendError(2, "I can't change the tag, place me above other roles that you want me to change!"); });
					}
					else return SendUsage(1, "tag [@member] [tag]");
				}
				else return SendError(1, "You don't have permission for this command!");
			}
			else if(params[1] == "play")
			{
				if(!params[2]) return SendUsage(1, "play [link/query]");
				yts(params.slice(2).join(" "), function (err, result)
				{
					cmdexist = true;
					//console.log(result.all);
					if(err) return SendError(1, "No existing results!");
					else
					{
						const embed = new Discord.MessageEmbed()
						.setAuthor("Added to play", message.author.displayAvatarURL({dynamic : true}))
						.setColor('#277ecd')
						.setTitle(result.all[0].title)
						.setURL(result.all[0].url)
						.setThumbnail(result.all[0].thumbnail)
						.addFields 
						(
							{ name: "Channel:", value: `${result.all[0].author.name}`, inline: true },
							{ name: "Song Duration:", value: `${result.all[0].timestamp}`, inline: true },
							{ name: "Published:", value: `${result.all[0].ago}`, inline: true }
						)
						.setFooter(copyright)
						message.channel.send(embed);
						
						function PlaySound()
						{
							let stream = ytdl(result.all[0].url, {
								filter: "audioonly",
								opusEncoded: true,
								encoderArgs: ['-af', 'dynaudnorm=f=500']
							});
							message.member.voice.channel.join()
							.then(connection => 
							{
								let dispatcher = connection.play(stream, {
									type: "opus"
								})
								.on('finish', () => 
								{ 
									if(repeat[message.guild.id] == 1) return PlaySound();
									else return message.guild.me.voice.channel.leave(); 
								});
							});
						}
						PlaySound();
					}
				});
			}
			else if(params[1] == "repeat")
			{
				if(!message.member.voice.channel) return SendError(1, "You need to be in a voice channel!");
				if(!message.guild.voice.connection) return SendError(2, "I need to be in a voie channel!");
				cmdexist = true;
				if(repeat[message.guild.id] == 0) { message.channel.send("🔂 **Enabled!**"), repeat[message.guild.id] = 1; }
				else if(repeat[message.guild.id] == 1) { message.channel.send("🔂 **Disabled!**"), repeat[message.guild.id] = 0; }
			}	
			else if(params[1] == "disconnect")
			{
				var channel = message.member.voice.channel;
				if(!channel) return SendError(1, "You need to be in a voice channel!");
				cmdexist = true;
				channel.leave();
				repeat[message.guild.id] = 0;
				message.channel.send("Done!").then(message => { message.react(successicon); });
			}
			else if(params[1] == "customplay")
			{
				var channelx = message.member.voice.channel; 
				if(!channelx) return SendError(1, "You need to be in a voice channel!");
				if(params[2]) 
				{ 
					var path = `./music/${params[2]}.mp3`;
					if(fs.existsSync(path)) 
					{
						cmdexist = true;
						message.member.voice.channel.join().then(connection => {
							var dispatcher = connection.play(require("path").join(__dirname, path));
							dispatcher.on("finish", finish => { message.guild.me.voice.channel.leave(); });					
							const embed = new Discord.MessageEmbed()
							.setTitle("Custom Play:")
							.setColor('#277ecd')
							.setDescription("Now Playing:\n" + "`" + `${params[2]}.mp3` + "`")
							.setFooter(copyright)
							message.channel.send(embed);
						});
					}
					else return SendError(2, "This audio file don't exist in our server!");
				}
				else return SendUsage(1, "customplay [name]");
			}
			else if(params[1] == "art")
			{
				if(params.slice(2).join(" "))
				{
					cmdexist = true;
					figlet(params.slice(2).join(" "), (err, result) => {
						message.channel.send(result, {
							code: 'md'
						});
					});
				}
				else return SendUsage(1, "art [text]");
			}
			else if(params[1] == "pingip")
			{
				GetAccountType(message.member.user.id, function(accType) 
				{
				if(accType == 1)
				{
					if(params[2])
					{
						cmdexist = true;
						message.channel.send(`Connecting to ${params[2]}`).then((message) => {
							var ssh = new SSH({
								host: ssh_host,
								user: ssh_user,
								pass: ssh_pass,
								agent: process.env.SSH_AUTH_SOCK
							});
							message.edit("Connection estabilished ! Pinging...");
							ssh.exec('echo $PATH', { }).start();
							ssh.exec(`ping ${params[2]} -c 1`, {
								out: function(stdout) {
									ssh.end();
									const embed = new Discord.MessageEmbed()
									.setTitle(`Ping Info:`)
									.setColor('#277ecd')
									.addFields 
									(
										{ name: "IP:", value: `${params[2]}`, inline: false },
										{ name: "Status:", value: `Online`, inline: false },
										{ name: "Output:", value: `${stdout}`, inline: false },
									)
									.setFooter(copyright);
									message.edit(embed);
								}
							});
						});
					}
					else return SendUsage(1, "pingip [IP]");
				}
				else return SendError(1, "You need to have premium account type!");
				});
			}
			else if(params[1] == "ban")
			{
				if(message.member.hasPermission("BAN_MEMBERS") || message.author.id == ownerid || message.author.id == ownerid2)
				{
					if(params[2])
					{
						cmdexist = true;

						try
						{
							var userx = message.mentions.users.first() || await bot.users.fetch(params[2]);
							var memberx = await message.guild.member(userx);
							if(!memberx)
							{
								try 
								{
									await message.guild.members.ban(userx);
									message.channel.send(`Banned **${userx.username}#${userx.discriminator}**.`);
								}
								catch { SendError(5, "I don't have permission to do this!"); }
							}
							else 
							{
								var rank1 = message.member.roles.highest.position;
								var rank2 = memberx.roles.highest.position;

								if(rank2 >= rank1) return SendError(4, "Your rank is lower than user rank!")

								memberx.ban().then(function() 
								{
									message.channel.send(`Banned **${userx.tag}**.`);
								})
								.catch(function() { SendError(3, "I don't have permission to ban this member!"); });
							}
						}
						catch { SendError(2, "User not exist or already banned!"); }
					}
					else return SendUsage(1, "ban [member]");
				}
				else return SendError(1, "You don't have permission for this command!");
			}
			else if(params[1] == "unban")
			{
				if(message.member.hasPermission("BAN_MEMBERS") || message.author.id == ownerid || message.author.id == ownerid2)
				{
					if(params[2])
					{
						cmdexist = true;

						var ban_username, ban_tag;
						message.guild.fetchBans().then(bans => 
						{
							count++;
							bans.find(b => 
							{
								if(b.user.id == params[2])
								{
									ban_username = b.user.username;
									ban_tag = b.user.discriminator;
								} 
							});
							function Check()
							{
								if(!ban_username) 
								{
									SendError(3, "This user not banned!");
								}
								else 
								{
									ban_user_info = ban_username + "#" + ban_tag;
									message.channel.send(`**${ban_user_info}** successfully unbanned.`);
									message.guild.members.unban(params[2]);
								}
							}
							async function First() { await Check(); }
							First();
						});
					}
					else return SendUsage(1, "unban [member]");
				}
				else return SendError(1, "You don't have permission for this command!");
			}
			else if(params[1] == "unbanall")
			{
				if(message.member.hasPermission("ADMINISTRATOR"))
				{
					message.channel.send("Do you sure that you want to **Un-Ban** all server?\nType **yes** for Un-Ban, and **no** for cancel.");
					unbanall_progress[message.author.id] = message.guild.id;
				}
				else return SendError(1, "You don't have permission for this command!");
			}
			else if(params[1] == "banlist")
			{
				if(message.member.hasPermission("BAN_MEMBERS") || message.author.id == ownerid || message.author.id == ownerid2)
				{
					var count = 0, user_info_1, user_info_2;
					message.guild.fetchBans().then(bans => 
					{
						bans.find(b => 
						{
							count++;
							if(count == 1) user_info_1 = `${b.user.username}#${b.user.discriminator}`, user_info_2 = `${b.user.id}`;
							else if(count >= 2) user_info_1 += `\n${b.user.username}#${b.user.discriminator}`, user_info_2 += `\n${b.user.id}`;
						});
						if(user_info_1 != undefined && user_info_2 != undefined)
						{
							const embed = new Discord.MessageEmbed()
							.setTitle(`Ban List:`)
							.setColor('#277ecd')
							.addFields 
							(
								{ name: "User:", value: `${user_info_1}`, inline: true },
								{ name: "ID:", value: `${user_info_2}`, inline: true }
							)
							.setFooter(`There is ${count} bans\n\n` + copyright);
							message.channel.send(embed); 
						}
						else return SendError(3, "No existing bans!");
					});
				}
				else return SendError(1, "You don't have permission for this command!");
			}
			else if(params[1] == "kick")
			{
				if(message.member.hasPermission("KICK_MEMBERS") || message.author.id == ownerid || message.author.id == ownerid2)
				{
					if(params[2] && params.slice(3).join(" "))
					{
						var userx = message.mentions.users.first();
						if(userx) 
						{	
							var memberx = message.guild.member(userx);
							let rank1 = message.member.roles.highest.position;
							let rank2 = memberx.roles.highest.position;
							if(rank2 >= rank1) return SendError(2, "You don't have permission to kick this user!");
							if(memberx)
							{
								memberx.kick().then(function() 
								{
									cmdexist = true;
									message.channel.send(`I kicked user **${userx.tag}**.\nBy: **${message.member.user.tag}**.\nReason: **${params.slice(3).join(" ")}**.`);
									bot.users.cache.get(userx.id).send(`You has been kicked from server: **${message.guild.name}**!\nKicked by: **${message.member.user.tag}** | Reason: **${params.slice(3).join(" ")}**!`);
								})
								.catch(function() { SendError(3, "I don't have permission to kick this member!"); });
							} 
						}
					}
					else return SendUsage(1, "kick [@user] [reason]");
				}
				else return SendError(1, "You don't have permission for this command!");
			}
			else if(params[1] == "sampinfo")
			{
				if(params[2])
				{
					query({host: params[2]}, function (error, response) 
					{
						if(!error)
						{
							cmdexist = true;
							var passwordstring;
							if(response.passworded == false) passwordstring = "No";
							else if(response.passworded == true) passwordstring = "Yes";
							const embed = new Discord.MessageEmbed()
							.setTitle(`SA:MP Server Info:`)
							.setColor('#277ecd')
							.addFields 
							(
								{ name: "IP:", value: `${response.address}`, inline: false },
								{ name: "Hostname:", value: `${response.hostname}`, inline: false },
								{ name: "Gamemode:", value: `${response.gamemode}`, inline: false },
								{ name: "Language:", value: `${response.mapname}`, inline: false },
								{ name: "Passworded:", value: `${passwordstring}`, inline: false },
								{ name: "Players:", value: `${response.online}/${response.maxplayers}`, inline: false },
								{ name: "Version:", value: `${response.rules.version}`, inline: false },
							)
							.setFooter(copyright);
							message.channel.send(embed); 
						}
						if(error == "Host unavailable") { SendError(1, "Invalid IP address!"); }
					});
				}
				else return SendUsage(1, "sampinfo [IP Address]");
			}
			else if(params[1] == "restartbot")
			{
				// This command will auto crash the bot , and the "forever" service will restart it :D
				if(message.member.user.id == ownerid || message.member.user.id == ownerid2)
				{
					cmdexist = true;
					message.channel.send("Service **buster.js** have been restarted!").then(message => { message.react(successicon); });
					setTimeout(function () {
						bot.user.setActivity(``, { type: restart });
					}, 1000);
				}
				else return SendError(2, "You don't have permission for this command!");
			}
			else if(params[1] == "covid")
			{
				if(!params[2]) { params[2] = "World"; }
				snekfetch.get(`https://coronavirus-19-api.herokuapp.com/countries/${params[2]}`).then(result => { 
					if(result.body.country != undefined)
					{
						cmdexist = true;
						const embed = new Discord.MessageEmbed()
						.setTitle(`${result.body.country} COVID STATISTICS:`)
						.setColor('#277ecd')
						.setThumbnail("https://techcrunch.com/wp-content/uploads/2020/03/GettyImages-1209679043.jpg?w=730&crop=1")
						.addFields
						(
							{ name: "Confirmed Cases:", value: `${result.body.cases}`, inline: false },
							{ name: "Confirmed Cases (In the past 24 hours):", value: `${result.body.todayCases}`, inline: false },
							{ name: "Confirmed Deaths:", value: `${result.body.deaths}`, inline: false },
							{ name: "Confirmed Deaths (In the past 24 hours):", value: `${result.body.todayDeaths}`, inline: false },
							{ name: "Recovered:", value: `${result.body.recovered}`, inline: false },
							{ name: "Active Cases:", value: `${result.body.active}`, inline: false },
							{ name: "Critical Cases:", value: `${result.body.critical}`, inline: false },
							{ name: "Total Tests:", value: `${result.body.totalTests}`, inline: false }
						)
						.setFooter(copyright);
						message.channel.send(embed);
					}
					else return SendError(2, "Country don't exist!");
				})
			}
			else if(params[1] == "covidromania")
			{
				if(params[2])
				{
					cmdexist = true;
					snekfetch.get(`https://covid19.geo-spatial.org/api/dashboard/getCasesByCounty`).then(result => { 
						message.channel.send("Please wait... Getting informations!").then(message => {
							message.delete();
							for(var i = 0; i != result.body.data.data.length; i++)
							{
								if(result.body.data.data[i].county_code == params[2] || result.body.data.data[i].county == params[2])
								{
									const embed = new Discord.MessageEmbed()
									.setTitle(`Covid statistics for city ${result.body.data.data[i].county} from ROMANIA:`)
									.setColor('#277ecd')
									.addFields
									(
										{ name: "Confirmed Cases:", value: `${result.body.data.data[i].total_county}`, inline: false },
										{ name: "Confirmed Deaths:", value: `${result.body.data.data[i].total_dead}`, inline: false },
										{ name: "City Name:", value: `${result.body.data.data[i].county}`, inline: false },
										{ name: "City Code:", value: `${result.body.data.data[i].county_code}`, inline: false }
									)
									.setFooter(copyright);
									message.channel.send(embed);
								}
							}
						});
					}); 
				}
				else return SendUsage(1, "covidromania [city code/city name]")
			}
			else if(params[1] == "covidlist")
			{
				cmdexist = true;
				var position, country, confirmed;
				snekfetch.get("https://coronavirus-19-api.herokuapp.com/countries").then(result => { 
					for(var i = 30; i != -1; i--)
					{
						if(i == 30)
						{
							position = 31;
							country = `${result.body[30].country}`;
							confirmed = `${result.body[30].cases}`;
						}
						else if(i <= 29)
						{
							if(position == undefined || country == undefined || confirmed == undefined) return;
							position = `${i+1}\n${position}`;
							country = `${result.body[i].country}\n${country}`;
							confirmed = `${result.body[i].cases}\n${confirmed}`;
						}
					}
					const embed = new Discord.MessageEmbed()
					.setTitle(`CORONAVIRUS 30 COUNTRY LIST:`)
					.setColor('#277ecd')
					.addFields
					(
						{ name: "Position:", value: `${position}`, inline: true },
						{ name: "Country Name:", value: `${country}`, inline: true },
						{ name: "Confirmed Cases:", value: `${confirmed}`, inline: true },
					)
					.setFooter(copyright);
					message.channel.send(embed);
				})
			}
			else if(params[1] == "howgay")
			{
				cmdexist = true;
				var string;
				user = message.mentions.users.first();
				if(!user) { string = `You are ${randnumber({min: 0, max: 100, integer: true})}% gay :gay_pride_flag:`; }
				if(user) { string = `<@${user.id}> are ${randnumber({min: 0, max: 100, integer: true})}% gay :gay_pride_flag:`; }
				const embed = new Discord.MessageEmbed()
				.setTitle("gay r8 machine")
				.setColor('#277ecd')
				.setDescription(string)
				message.channel.send({embed});
			}
			else if(params[1] == "ping")
			{
				var botping = Math.round(bot.ws.ping)
				message.channel.send(`Your latency quality: **${Date.now() - message.createdTimestamp}ms**\nMy latency quality: **${botping}ms**`);
			}
			else if(params[1] == "info")
			{	
				if(seted_developer_name == 1)
				{
					cmdexist = true;
					let totalSeconds = (bot.uptime / 1000);
					let days = Math.floor(totalSeconds / 86400);
					let hours = Math.floor(totalSeconds / 3600);
					totalSeconds %= 3600;
					let minutes = Math.floor(totalSeconds / 60);
					let uptime = `${days} days, ${hours} hours, ${minutes} minutes`;
					var countservers = 0; bot.guilds.cache.forEach(g => { countservers++ });
					var botping = Math.round(bot.ws.ping)
					
					message.channel.send(`Please wait... getting informations!`).then((message) => {
						var ssh = new SSH({
							host: ssh_host,
							user: ssh_user,
							pass: ssh_pass,
							agent: process.env.SSH_AUTH_SOCK
						});
						ssh.exec('echo $PATH', { }).start();
						ssh.exec('hostname', { out: function(serverhostname) { 
						ssh.exec('uptime -p', { out: function(serveruptime) { 
						ssh.exec('uptime -s', { out: function(serveruptimesince) { 
						ssh.exec('cat /etc/redhat-release', { out: function(serverversion) { 
							ssh.end();
							serveruptime = serveruptime.slice(2);
							const embed = new Discord.MessageEmbed()
							.setTitle("BUSTER Informations:")
							.setThumbnail(bot.user.displayAvatarURL({dynamic : true, size : 2048}))
							.setColor('#277ecd')
							.addFields
							(
								{ name: "Developer:", value: `<:developer:730110041075613749> ${developername}`, inline: false },
								{ name: "BOT latency quality:", value: `<:latency:768523964816949259> ${botping}ms`, inline: false },
								{ name: "Version:", value: `<:version:730111751886077964> ${version}`, inline: false },
								{ name: "Invite link:", value: "<:invite_link:730112475856633926> http://bot.e-force.ro", inline: false },
								{ name: "Last update:", value: `<:last_update:730113366319955979> ${lastupdate}`, inline: false },
								{ name: "BOT uptime:", value: `<:bot_uptime:730114017930248242> ${uptime}`, inline: false },
								{ name: "Last restart:", value: `<:last_restart:730114480062595242> ${restartdate}`, inline: false },
								{ name: "Currently in:", value: `<:currently_in:730114916068884502> ${countservers} servers`, inline: false },
								{ name: "Server hostname:", value: `<:server_hostname:730115176191230022> ${serverhostname}`, inline: false },
								{ name: "Server uptime:", value: `<:server_uptime:730115392340754532> ${serveruptime}`, inline: false },
								{ name: "Server uptime since:", value: `<:server_uptime_since:730115710055088178> ${serveruptimesince}`, inline: false },
								{ name: "OS platform:", value: `<:linux:730116354794848317> ${serverversion}`, inline: false },
							)
							.setFooter(copyright);
							message.delete();
							message.channel.send(embed);
						}}); }}); }}); }});
					});
				}
				else return SendError(1, "Loading informations... Please try again later!");
			}
			else if(params[1] == "snipe")
			{
				cmdexist = true;
				if(snipetext[message.channel.id])
				{
					author = bot.users.cache.get(snipeauthor[message.channel.id]);
					authorusername = author.tag;

					if(snipetype[message.channel.id] == 1)
					{
						const embed = new Discord.MessageEmbed()
						.setAuthor(authorusername, author.displayAvatarURL({dynamic : true}))
						.setColor('#277ecd')
						.setDescription(snipetext[message.channel.id])
						.setFooter(snipedate[message.channel.id])
						message.channel.send(embed);
					}
					else if(snipetype[message.channel.id] == 2)
					{
						const embed = new Discord.MessageEmbed()
						.setAuthor(authorusername, author.displayAvatarURL({dynamic : true}))
						.setColor('#277ecd')
						.setImage(snipetext[message.channel.id])
						.setFooter(snipedate[message.channel.id])
						message.channel.send(embed);
					}
				}
				else return SendError(1, "Nothing to snipe!");
			}
			else if(params[1] == "mute")
			{
				if(!message.member.hasPermission("MANAGE_ROLES")) return SendError(1, "You don't have permission for this command!");
				if(!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return SendError(2, "I don't have permission to add roles!");
				
				var mutee = message.mentions.members.first();
				if(!mutee) return SendUsage(1, "mute [@user] [reason(optional)]");
				
				var reason = params.slice(3).join(" ");
				if(!reason) { reason = "No reason specified"; }
				
				let rank1 = message.member.roles.highest.position;
				let rank2 = mutee.roles.highest.position;
				if(rank2 >= rank1) return SendError(3, "You don't have permission to mute this user!");
							
				var muterole = message.guild.roles.cache.find(r => r.name == "Muted")
				if(!muterole)
				{
					muterole = await message.guild.roles.create(
					{
						data: 
						{
							name: "Muted",
							color: "#818386",
							permission: []
						}
					})
				}
				const roles = mutee.roles.cache.array();
				mutee.roles.remove(roles).then(function() 
				{
					mutee.roles.add(muterole.id).then(() =>
					{
						message.guild.channels.cache.forEach(async (channel, id) => 
						{
							await message.channel.updateOverwrite(muterole, 
							{
								SEND_MESSAGES: false,
								ADD_REACTIONS: false,
								SEND_TTS_MESSAGES: false,
								ATTACH_FILES: false,
								SPEAK: false
							})
						})
						cmdexist = true;
						mutee.send(`You have been muted in server **${message.guild.name}**.\nBy: **${message.author.tag}**.\nReason: **${reason}**.`)
						message.channel.send(`**${mutee.user.tag}** was successfully muted.\nReason: **${reason}**.`)
					})
				})
				.catch(function() { SendError(4, "I don't have permission to mute this user!"); });
			}
			else if(params[1] == "unmute")
			{
				if(!message.member.hasPermission("MANAGE_ROLES")) return SendError(1, "You don't have permission for this command!");
				if(!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return SendError(2, "I don't have permission to remove roles!");
				
				var mutee = message.mentions.members.first();
				if(!mutee) return SendUsage(1, "unmute [@user]");
				
				var muterole = message.guild.roles.cache.find(r => r.name == "Muted")
				if(!muterole) return SendError(3, "There is no mute role to remove!");
				
				if(!mutee.roles.cache.has(muterole.id)) return SendError(4, "This user are not muted!");
				
				mutee.roles.remove(muterole.id).then(() => 
				{
					cmdexist = true;
					mutee.send(`You have been unmuted in server **${message.guild.name}**.\nBy: **${message.author.tag}**.`)
					message.channel.send(`**${mutee.user.tag}** was successfully unmuted.`)
				})
			}
			else if(params[1] == "emoji") 
			{ 
				if(params[2] && params[3]) 
				{
					cmdexist = true;
					message.channel.send({files: [emoji(params[2], params[3])]}); 
				}
				else return SendUsage(1, "emoji [emoji ID] [format(png/gif)]");
			}
			else if(params[1] == "createinvite")
			{
				if(message.member.user.id == ownerid || message.member.user.id == ownerid2) 
				{
					if(!params[2]) return SendUsage(1, "createinvite [channel ID]");
					cmdexist = true;
					replyWithInvite(message, bot.channels.cache.get(params[2]));
				}
				else return SendError(1, "You don't have permission for this command!");
			}
			else if(params[1] == "spoiler")
			{
				if(params.slice(2).join(" "))
				{
					cmdexist = true;
					message.channel.send(`||${params.slice(2).join(" ")}||`);
				}
				else return SendUsage(1, "spoiler [text]");
			}
			else if(params[1] == "gif")
			{
				if(params.slice(2).join(" "))
				{
					giphy.search(params.slice(2).join(" "), function (err, result) {
						if(result.data[0])
						{
							cmdexist = true;
							const embed = new Discord.MessageEmbed()
							.setTitle(`**First Result for "${params.slice(2).join(" ")}" on GIPHY**`)
							.setColor('#277ecd')
							.setImage(`https://media.giphy.com/media/${result.data[0].id}/giphy.gif`)
							.setFooter(copyright)
							message.channel.send(embed);
						}
						else return SendError(1, "No existing results for your search!");
					});
				}
				else return SendUsage(1, "gif [search text]");
			}
			else if(params[1] == "whoisgay")
			{
				cmdexist = true;
				var member, count = 0, members = {};
				message.guild.members.cache.forEach(m => { count++; members[count] = m.user.tag; });
				var memb = members[randnumber({min: 1, max: count, integer: true})];
				message.channel.send("Checking...").then(message => { 
					message.edit(`**${memb}** is the **gay!**`);
					// -> Editing version (some lags)
					/*for(var i = 0; i != memb.length; i++)
					{
						wait(500);
						if(i == 0) { string2 = `${memb[0]}`; }
						else if(i >= 1) 
						{ 
							if(string2 == undefined) return;
							string2 = `${string2}${memb[i]}`; 
						}
						message.edit(string2);
					}*/
				});
			}
			//else if(params[1] == "phx") { message.channel.send({files: ["https://images-ext-1.discordapp.net/external/Bb38U2zsVriY_ussOK09mkdhFziWgKo_rXMAXRT-5ls/%3Fwidth%3D270%26height%3D481/https/media.discordapp.net/attachments/326029568056229888/738441772077678722/Screenshot_20200730-190352_Discord.jpg"]}); }
			//else if(params[1] == "kala") { message.channel.send({files: ["https://cdn.discordapp.com/attachments/738771241191735306/765254356060078100/unknown.png"]}); }
			else if(params[1] == "radio") 
			{
				cmdexist = true;
				snekfetch.get(`http://radio.e-force.ro:8000/stats?sid=1&pass=eforce&json=1`).then(result => { 
					if(result.body.serverurl == "") return SendError(1, "No radio signal available right now!");

					if(result.body.nexttitle == undefined) string_next_title = "No one";
					else string_next_title = result.body.nexttitle;

					if(result.body.dj == undefined) string_dj = "Default";
					else string_dj = result.body.dj;

					const embed = new Discord.MessageEmbed()
					.setTitle(`E-FORCE Radio Station:`)
					.setColor('#277ecd')
					.addFields
					(
						{ name: "Current DJ:", value: `${string_dj}`, inline: false },
						{ name: "Current Listeners:", value: `${result.body.currentlisteners}/${result.body.maxlisteners}`, inline: false },
						{ name: "Peak Listeners:", value: `${result.body.peaklisteners}`, inline: false },
						{ name: "Server URL:", value: `${result.body.serverurl}`, inline: false },
						{ name: "Current Song Title:", value: `${result.body.songtitle}`, inline: false },
						{ name: "Next Song Title:", value: `${string_next_title}`, inline: false },
						{ name: "Listen URL:", value: "http://radio.e-force.ro:8000/?type=http", inline: false }
					)
					.setFooter(copyright);
					message.channel.send(embed);
				});
			}
			else if(params[1] == "news")
			{
				cmdexist = true;
				con.query(`SELECT * FROM BusterNews WHERE id > 0 ORDER BY id DESC`, function (err, result) {
				if(result == 0) return SendError(1, "No existing news!");	
				else
				{
					var temp_string;
					for(var i = 0; i < result.length; i++)
					{
						if(i == 0)
						{
							var news_string = result[0].description.replace(/prefix/g, stringprefix);
							temp_string = `**${result[0].date}**:\n${news_string}`;
						}
						if(i >= 1)
						{
							var news_string = result[i].description.replace(/prefix/g, stringprefix);
							temp_string = `${temp_string}\n\n**${result[i].date}**:\n${news_string}`
						}
					}
					const embed = new Discord.MessageEmbed()
					.setTitle("BUSTER BOT News:")
					.setColor('#277ecd')
					.setDescription(`\
					Here you can find all updates what we create.\n\
					\n\
					${temp_string}
					\n\
					**+** = added\n\
					**-** = removed`)
					.setFooter(copyright);
					message.channel.send(embed);
				}
				});
			}
			else if(params[1] == "worldtime")
			{
				if(params[2])
				{
					cmdexist = true;
					var myip;
					snekfetch.get(`http://worldtimeapi.org/api/timezone/${params[2]}`).then(result => { 
						myip = result.body.client_ip;
						if(myip != undefined)
						{
							cmdexist = true;
							const embed = new Discord.MessageEmbed()
							.setTitle(`${result.body.timezone} World Time Details:`)
							.setColor('#277ecd')
							.addFields
							(
								{ name: "Date time:", value: `${result.body.datetime}`, inline: false },
								{ name: "Day of week:", value: `${result.body.day_of_week}`, inline: false },
								{ name: "Day of year:", value: `${result.body.day_of_year}`, inline: false }
							)
							.setFooter(copyright);
							message.channel.send(embed);
						}
						else return SendError(2, "An error has ocurred!");
					});
				}
				else return SendUsage(1, "worldtime [country (Continent/Capital) ex: Europe/Bucharest] ")
			}
			else if(params[1] == "eforceinvite")
			{
				if(message.author.id == ownerid || message.author.id == ownerid2)
				{
					if(params[2])
					{
						if(bot.channels.cache.get(params[2]))
						{ 
							cmdexist = true;
							UpdateSettings("DefaultInviteChannel", params[2]);
							eforceinvite = params[2];
							bot.channels.fetch(params[2]).then(channel => {
							message.channel.send(`**INFO:** E-FORCE.RO/DISCORD invite have been seted to channel: **${channel.name}**!`).then(message => { message.react(successicon) }); });
						}
						else return SendError(1, "Invalid channel ID!");
					}
					else return SendUsage(1, "eforceinvite [channel id]");
				}
				else return SendError(1, "No permission!")
			}

			// -> Role purchase system
			else if(params[1] == "purchaserole")
			{
				if(message.guild.id == sampserverid)
				{
					if(!params[2]) return SendUsage(1, "purchaserole [role]");
					var current_coins;
					var error_if_not_have_coins = "You don't have enought coins!";

					con.query(`SELECT * FROM DiscordCoins WHERE account_id_discord = '${message.author.id}'`, function (err, result, fields) 
					{
						if(err) throw err;
						if(result == 0)
						{
							ActivateAccountForCoins(message.author.id);
							current_coins = 0;
						}
						else current_coins = result[0].coins;
						function GetIfYouHaveCoins(item)
						{
							var itshave;
							if(current_coins >= item*100) itshave = 1;
							else itshave = 0;
							return itshave;
						}

						var role_id_for_fuc;
						if(params[2] == "vip") role_id_for_fuc = 1;
						else if(params[2] == "elite") role_id_for_fuc = 2;
						else if(params[2] == "master") role_id_for_fuc = 3;
						else if(params[2] == "legendary") role_id_for_fuc = 4;
						else return SendError(1, "Invalid role! Use **" + stringprefix + " roles** for details!");

						if(GetIfYouHaveCoins(role_id_for_fuc) != 1) return SendError(3, error_if_not_have_coins);
						cmdexist = true;
						GiveUserRole(params[2], message, role_id_for_fuc);
					});
				}
				else return SendError(1, "You are not in the correct server!");
			}
			else if(params[1] == "roles")
			{
				if(message.guild.id == sampserverid)
				{
					cmdexist = true;
					const embed = new Discord.MessageEmbed()
					.setTitle("Available roles:")
					.setColor('#277ecd')
					.addFields
					(
						{ name: "#", value: "1\n2\n3\n4", inline: true },
						{ name: "Item", value: "vip\nelite\nmaster\nlegendary", inline: true },
						{ name: "Price", value: "100 coins\n200 coins\n300 coins\n400 coins", inline: true }
					)
					.setFooter(copyright);
					message.channel.send(embed);
				}
				else return SendError(1, "You are not in the correct server!");
			}
			else if(params[1] == "coins")
			{
				if(message.guild.id == sampserverid)
				{
					var current_coins;
					con.query(`SELECT * FROM DiscordCoins WHERE account_id_discord = '${message.author.id}'`, function (err, result, fields) 
					{
						if(err) throw err;
						if(result == 0)
						{
							ActivateAccountForCoins(message.author.id);
							current_coins = 0;
						}
						else current_coins = result[0].coins;
						cmdexist = true;
						message.reply("currently you have **" + current_coins + "** coins in your account!");
					});
				}
				else return SendError(1, "You are not in the correct server!");
			}

			else if(params[1] == "tiktok")
			{
				if(params[2] == "profile")
				{
					if(params.slice(3).join(" "))
					{
						(async () => {
							try 
							{
								const user = await TikTokScraper.getUserProfileInfo(params.slice(3).join(" "));
								if(!user.nickName) nickname = "None";
								else nickname = user.nickName;

								if(!user.signature) signature = "None";
								else signature = user.signature;

								const embed = new Discord.MessageEmbed()
								.setTitle(`TikTok informations - ${user.uniqueId}`)
								.setColor('#277ecd')
								.setThumbnail(user.coversMedium[0])
								.addFields
								(
									{ name: "Nickname:", value: `${nickname}`, inline: true },
									{ name: "Signature:", value: `${signature}`, inline: true },
									{ name: "Verified:", value: `${user.verified}`, inline: true },
									{ name: "Following:", value: `${user.following}`, inline: true },
									{ name: "Followers:", value: `${user.fans}`, inline: true },
									{ name: "Total videos:", value: `${user.video}`, inline: true }
								)
								.setFooter(copyright);
								cmdexist = true;
								message.channel.send(embed);
							} 
							catch (error) { SendError(1, "User not exist!"); }
						})();
					}
					else return SendUsage(1, "tiktok profile [username] | Get an TikTok user informations");
				}
				else if(params[2] == "lastvideo")
				{
					if(params.slice(3).join(" "))
					{
						cmdexist = true;
						message.channel.send("Please wait... getting content!").then(async message =>
						{
							try 
							{
								const video = await TikTokScraper.user(params.slice(3).join(" "), TikTokoptions);
								var file = `./${video.zip}/${video.collector[0].id}.mp4`;
								message.delete();
								function LetSeeIfWork()
								{
									if(fs.existsSync(file))
									{
										message.channel.send(`Last video from user: **${params.slice(3).join(" ")}**`, {files: [file]}).then(async =>
										{
											fs.unlink(file, (err) => { if (err) throw err; });
										});
									}
									else LetSeeIfWork();
								}
								LetSeeIfWork();
							} 
							catch (error) 
							{ 
								message.delete();
								SendError(1, "User or video not exist!"); 
							}
						});
					}
					else return SendUsage(1, "tiktok lastvideo [username] | Get last TikTok video by an user");
				}
				else if(params[2] == "hashtag")
				{
					if(params.slice(3).join(" "))
					{
						message.channel.send("Please wait... getting content!").then(async message =>
						{
							try 
							{
								const video = await TikTokScraper.hashtag(params.slice(3).join(" "), TikTokoptions); 
								console.log(video.collector[0]);
								var file = `./${video.zip}/${video.collector[0].id}.mp4`;
								message.delete();
								function LetSeeIfWork()
								{
									if(fs.existsSync(file))
									{
										var created = parseInt(video.collector[0].createTime, 10);
										const d_published = new Date(created * 1000);
										date_published = d_published.getHours() + ":" + d_published.getMinutes() + ", " + d_published.toDateString();

										const embed = new Discord.MessageEmbed()
										.setTitle("TikTok #" + params.slice(3).join(" "))
										.setColor('#277ecd')
										.setThumbnail(video.collector[0].authorMeta.avatar)
										.setDescription("\
										**Author informations**:\n\
										Name: " + "``" + video.collector[0].authorMeta.name + "``" + "\n\
										Nickname: " + "``" + video.collector[0].authorMeta.nickName + "``" + "\n\
										\n\
										**Video informations:**\n\
										Description: " + "``" + video.collector[0].text + "``" + "\n\
										Published at: " + "``" + date_published + "``" + "\n\
										\n\
										**Stats:**\n\
										:eye:: " + "``" + intToString(video.collector[0].playCount) + "``" + "\n\
										:heart:: " + "``" + intToString(video.collector[0].diggCount) + "``" + "\n\
										:speech_balloon:: " + "``" + intToString(video.collector[0].commentCount) + "``" + "\n\
										:arrow_up:: " + "``" + intToString(video.collector[0].shareCount) + "``")
										.setFooter(copyright);
										message.channel.send(embed).then(() =>
										{
											message.channel.send("Please wait... getting video!").then(message => 
											{ 
												message.channel.send({files: [file]}).then(() =>
												{
													cmdexist = true;
													message.delete();
													fs.unlink(file, (err) => { if (err) throw err; });
												}); 
											});
										});
									}
									else LetSeeIfWork();
								}
								LetSeeIfWork();

							}
							catch (error) 
							{ 
								message.delete();
								SendError(1, "No video have been found!"); 
							}
						});
					}
					else return SendUsage(1, "tiktok hashtag [key words] | Get a video by hashtag")
				}
				else return SendUsage(1, "tiktok [profile/lastvideo/hashtag] [username]");
			}

			else if(params[1] == "instagram")
			{
				if(params[2])
				{
					(async () => {
						try 
						{
							const result = await InstagramScrapper.scrapeUserPage(params[2]);
							const embed = new Discord.MessageEmbed()
							.setTitle(`Instagram informations - ${result.user.username}`)
							.setColor('#277ecd')
							.setThumbnail(result.user.profile_pic_url_hd)
							.addFields
							(
								{ name: "Username:", value: `${result.user.username}`, inline: true },
								{ name: "Account ID:", value: `${result.user.id}`, inline: true },
								{ name: "Biography:", value: `${result.user.biography}`, inline: true },
								{ name: "Verified:", value: `${result.user.is_verified}`, inline: true },
								{ name: "Followers:", value: `${result.user.edge_followed_by.count}`, inline: true },
								{ name: "Following:", value: `${result.user.edge_follow.count}`, inline: true }
							)
							.setFooter(copyright);
							cmdexist = true;
							message.channel.send(embed);
						} 
						catch (error) { SendError(1, "User not exist!"); }
					})();
				}
				else return SendUsage(1, "instagram [username] | Show an user profile");
			}

			// -> Help
			else if(params[1] == "help")
			{
				cmdexist = true;

				// -> Footer
				var footer = `\nuse **${stringprefix}** before each command!`;

				// -> Logos
				var fun_logo = "<:fun:769289376734773259>";
				var socialmedia_logo = "<:social_media:769289410713223198>";
				var utility_logo = "<:utility:769289421472006175>";
				var music_logo = "<:music:769289397513486336>";
				var informations_logo = "<:informations:769289384402616320>";
				var admin_logo = "<:admin:769289362234933288>";

				if(params[2] == "fun")
				{
					var content = "`" + `meme, say, art, gay, jail, gif, whoisgay, diploma, seconddiploma` + "`" + footer;
					const embed = new Discord.MessageEmbed()
					.setTitle(fun_logo + ` Fun Commands:`)
					.setColor('#277ecd')
					.setDescription(content)
					.setFooter(copyright);
					message.channel.send(embed);
				}
				else if(params[2] == "socialmedia")
				{
					var content = "`" + `tiktok, instagram` + "`" + footer;
					const embed = new Discord.MessageEmbed()
					.setTitle(socialmedia_logo + ` Social Media Commands:`)
					.setColor('#277ecd')
					.setDescription(content)
					.setFooter(copyright);
					message.channel.send(embed);
				}
				else if(params[2] == "utility")
				{
					var content = "`" + `weather, ipinfo, changenick, avatar, userinfo,\ninvite, serverinfo, translate, purge, tag, snipe` + "`" + footer;
					const embed = new Discord.MessageEmbed()
					.setTitle(utility_logo + ` Utility Commands:`)
					.setColor('#277ecd')
					.setDescription(content)
					.setFooter(copyright);
					message.channel.send(embed);
				}
				else if(params[2] == "music")
				{
					var content = "`" + `play, disconnect, customplay` + "`" + footer;
					const embed = new Discord.MessageEmbed()
					.setTitle(music_logo + ` Music Commands`)
					.setColor('#277ecd')
					.setDescription(content)
					.setFooter(copyright);
					message.channel.send(embed);
				}
				else if(params[2] == "informations")
				{
					var content = "`" + `covid, covidlist, info, news` + "`" + footer;
					const embed = new Discord.MessageEmbed()
					.setTitle(informations_logo + ` Informations Commands:`)
					.setColor('#277ecd')
					.setDescription(content)
					.setFooter(copyright);
					message.channel.send(embed);
				}
				else if(params[2] == "admin")
				{
					var content = "`" + `unban, unbanall, ban, kick, mute, unmute, banlist` + "`" + footer;
					const embed = new Discord.MessageEmbed()
					.setTitle(admin_logo + ` Admin Commands:`)
					.setColor('#277ecd')
					.setDescription(content)
					.setFooter(copyright);
					message.channel.send(embed);
				}
				else 
				{
					const embed = new Discord.MessageEmbed()
					.setTitle(`Buster Bot Command List:`)
					.setColor('#277ecd')
					.addFields
					(
						{ name: fun_logo + " Fun", value: "`" + `${stringprefix} help fun` + "`", inline: true },
						{ name: socialmedia_logo + " Social Media", value: "`" + `${stringprefix} help socialmedia` + "`", inline: true },
						{ name: utility_logo + " Utility", value: "`" + `${stringprefix} help utility` + "`", inline: true },
						{ name: music_logo + " Music", value: "`" + `${stringprefix} help music` + "`", inline: true },
						{ name: informations_logo + " Informations", value: "`" + `${stringprefix} help informations` + "`", inline: true },
						{ name: admin_logo + " Admin", value: "`" + `${stringprefix} help admin` + "`", inline: true }
					)
					.setFooter(copyright);
					message.channel.send(embed);
				}
			}
			if(params[1]) 
			{
				if(cmdexist == true) 
				{
					// -> DM notify to BOT author :)
					MessageToOwners(`${message.author.tag} executed command: ${params[1]} in server: ${message.guild.name}`);
				}
			}
			else 
			{
				// -> Send this when the parameter 1 don't exist :)
				message.channel.send(`USE: **${stringprefix} help** for help!`);
			}
		}
		//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		// -> CMD LIST (SAMP)
		//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		/*if(params[0] == `${prefix}kick` && message.guild.id == sampserverid)
		{
			cmdexist = true;
			if(channelaccess == 0) return ErrorType(1);
			GetAdminAccount(message.member.user.id, function(pAdmin) {
			if(pAdmin >= 2)
			{
				if(params[1] && params[2]) 
				{
					if(!isNaN(params[1])) var tempstring = `SELECT * FROM Accounts WHERE PlayerIDConnect = '${params[1]}' AND LoggedIn = '1'`;
					else if(isNaN(params[1])) var tempstring = `SELECT * FROM Accounts WHERE Name = '${params[1]}' AND LoggedIn = '1'`;
					//++++++++++++++++++++++++++++++++++++++++++++++++++
					con.query(`${tempstring}`, function (err, result, fields) {
					if(err) throw err;
					if(result == 0) return SendError(2, "Player are not connected!");
					else 
					{
						var playername = result[0].Name;
						var rcontype = result[0].RconType;
						//++++++++++++++++++++++++++++++++++++++++++++++
						if(rcontype > pAdmin) return SendError(3, "You cannot use this command on this player!");
						//++++++++++++++++++++++++++++++++++++++++++++++
						message.channel.send(`Kicking player **${playername}** from the server\nReason: **${params.slice(2).join(" ")}**`).then(message => { message.react(successicon); });
						//++++++++++++++++++++++++++++++++++++++++++++++
						var sql = (`UPDATE Accounts SET Kicked = '1', KickType = '2', KickReason = '${params.slice(2).join(" ")}', KickAdmin = '${message.member.user.tag}' WHERE Name = '${playername}'`);
						con.query(sql);
					}
					});
				}
				else return SendUsage(2, "kick [ID/Player Name] [Reason]");
			}
			else return SendError(1, "You don't have permission for this command!");
			});
		}
		else if(params[0] == `${prefix}ban` && message.guild.id == sampserverid)
		{
			cmdexist = true;
			if(channelaccess == 0) return ErrorType(1);
			GetAdminAccount(message.member.user.id, function(pAdmin) {
			if(pAdmin >= 2)
			{
				if(params[1] && params[2] && params[3])
				{
					if(!isNaN(params[2]))
					{
						if(params[2] < 1 || params[2] > 299) return SendError(2, "You can ban a player between 1-299 days!");
						//++++++++++++++++++++++++++++++++++++++++++++++
						if(!isNaN(params[1])) var tempstring = `SELECT * FROM Accounts WHERE PlayerIDConnect = '${params[1]}' AND LoggedIn = '1'`;
						else if(isNaN(params[1])) var tempstring = `SELECT * FROM Accounts WHERE Name = '${params[1]}' AND LoggedIn = '1'`;
						//++++++++++++++++++++++++++++++++++++++++++++++
						con.query(`${tempstring}`, function (err, result, fields) {
						if(err) throw err;
						if(result == 0) return SendError(3, "Player are not connected!");
						else 
						{
							var playername = result[0].Name;
							var rcontype = result[0].RconType;
							//++++++++++++++++++++++++++++++++++++++++++
							if(rcontype > pAdmin) return SendError(3, "You cannot use this command on this player!");
							//++++++++++++++++++++++++++++++++++++++++++
							message.channel.send(`Banning player **${playername}** from the server\nDay(s): **${params[2]}**\nReason: **${params.slice(3).join(" ")}**`).then(message => { message.react(successicon); });
							//++++++++++++++++++++++++++++++++++++++++++
							var sql = (`UPDATE Accounts SET Banned = '1', BanDays = '${params[2]}', BanReason = '${params.slice(3).join(" ")}', BanAdmin = '${message.member.user.tag}' WHERE Name = '${playername}'`);
							con.query(sql);
						}
						});
					}
					else return SendError(1, "You need to input numbers to parameter **Day(s)**!")
				}
				else return SendUsage(2, "ban [ID/Player Name] [Day(s)] [Reason]");
			}
			else return SendError(1, "You don't have permission for this command!");
			});
		}*/
		if(params[0] == `${prefix}unban` && message.guild.id == sampserverid)
		{
			cmdexist = true;
			if(channelaccess == 0) return ErrorType(1);
			GetAdminAccount(message.member.user.id, function(pAdmin) {
			if(pAdmin >= 2)
			{
				if(params[1])
				{
					con.query(`SELECT * FROM bans WHERE PlayerName = '${params[1]}'`, function (err, result, fields) {
					if(err) throw err;
					if(result == 0) return SendError(2, "Player are not banned!");
					else 
					{
						message.channel.send(`I was succesfully unbanned **${params[1]}** from server!`).then(message => { message.react(successicon); });
						var sql = (`DELETE FROM bans WHERE PlayerName = '${params[1]}'`);
						con.query(sql); 
					}
					});
				}
				else return SendUsage(2, "unban [Player Name]");
			}
			else return SendError(1, "You don't have permission for this command!");
			});
		}
		else if(params[0] == `${prefix}banlist` && message.guild.id == sampserverid)
		{
			cmdexist = true;
			if(channelaccess == 0) return ErrorType(1);
			GetAdminAccount(message.member.user.id, function(pAdmin) {
			if(pAdmin >= 2)
			{
				con.query(`SELECT * FROM bans WHERE ID > 0 ORDER BY ID DESC`, function (err, result, fields) {
				if(result == 0) return SendError(2, "No existing bans in our database!");	
				else
				{
					var tempstring;
					result.forEach(function(row)
					{
						tempstring = `Name: **${row.PlayerName}** by **${row.AdminName}**\n${tempstring}`;
					})
					SCM(`>>> ${tempstring}\n\n**USE:** /bandetail [Player Name] to get more info`);
				}
				});
			}
			else return SendError(1, "You don't have permission for this command!");
			});
		}
		else if(params[0] == `${prefix}onlinep` && message.guild.id == sampserverid)
		{
			cmdexist = true;
			if(channelaccess == 0) return ErrorType(1);
			con.query(`SELECT * FROM users WHERE status = '1'`, function (err, result, fields) {
			if(result == 0) return SendError(2, "No online players yet!");	
			else
			{
				function CheckGender(type)
				{
					if(type == 1) string = "Male";
					else if(type == 2) string = "Female";
					return string;
				}
				for(var i = 0; i < result.length; i++)
				{
					if(i >= 1) { Name = `${result[i].name}\n${Name}`, id = `${result[i].personal_id}\n${id}`, Gender = `${CheckGender(result[i].gender)}\n${Gender}`; }
					else { Name = `${result[i].name}`, id = `${result[i].personal_id}`, Gender = `${CheckGender(result[i].gender)}`; }
				}
				const canvas = Canvas.createCanvas(400, 200);
				const ctx = canvas.getContext('2d');

				LoadBackgroundEx();

				async function LoadBackgroundEx()
				{
					const background = await Canvas.loadImage('./images/onlinep_img.png');
					ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
					ctx.strokeStyle = '#74037b';
					ctx.strokeRect(0, 0, canvas.width, canvas.height);

					ctx.font = '28px sans-serif';
					ctx.fillStyle = '#ffffff';
					ctx.fillText('Online players:', canvas.width / 3.9, canvas.height / 3.5);

					ctx.fillStyle = '#ffffff';
					ctx.fillText(`${result.length}/1000`, canvas.width / 2.9, canvas.height / 2);
					const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'onlineplayers.png');

					message.channel.send(attachment).then(message =>
					{
						var Attachment = (message.attachments).array();
						const embed = new Discord.MessageEmbed()
						.setColor('#277ecd')
						.setThumbnail(Attachment[0].url)
						.addFields
						(
							{ name: "Name", value: `${Name}`, inline: true},
							{ name: "ID", value: `${id}`, inline: true},
							{ name: "Gender", value: `${Gender}`, inline: true}
						)
						.setFooter(copyright);
						message.channel.send(embed);
						message.delete({timeout: 1000});

					});
				}
			}
			});
		}
		else if(params[0] == `${prefix}whitelist` && message.guild.id == sampserverid)
		{
			cmdexist = true;
			GetAdminAccount(message.member.user.id, function(pAdmin) {
			if(pAdmin >= 3)
			{
				if(params[1])
				{
					if(params[1] == "all")
					{
						message.channel.send(`**INFO:** BOT access has been seted to channel: **All**!`).then(message => { message.react(successicon); });
						UpdateSettings("ChannelIDAccess", 1);
						onlychannelaccess = `1`;
					}
					else if(params[1] != "all")
					{
						if(!isNaN(params[1]))
						{
							var lengths = params[1].length;
							if(lengths != 18) return SendError(4, "Numbers lengths must have 18 numbers!");
							//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
							bot.channels.fetch(`${params[1]}`).then(channel =>
							{
								message.channel.send(`**INFO:** BOT access has been seted to channel: **${channel.name}**!`).then(message => { message.react(successicon); });
								UpdateSettings("ChannelIDAccess", channel.id);
								onlychannelaccess = `${channel.id}`;
							});
						}
						else return SendError(3, "String must contain only numbers for this option!");
					}
					else return SendError(2, "Invalid string!");
				}
				else return SendUsage(2, "whitelist [Channel ID/All]");
			}
			else return SendError(1, "You don't have permission for this command!");
			});
		}
		else if(params[0] == `${prefix}prefix` && message.guild.id == sampserverid)
		{
			cmdexist = true;
			if(channelaccess == 0) return ErrorType(1);
			GetAdminAccount(message.member.user.id, function(pAdmin) {
			if(pAdmin >= 3)
			{
				if(channelaccess == 0) return ErrorType(1);
				if(params[1]) 
				{
					if(prefixs.indexOf(params[1]) == -1) return SendError(2, "Invalid prefix!");
					prefix = params[1];
					UpdateSettings("Prefix", params[1]);
					message.channel.send(`Prefix has been changed to **${params[1]}**`).then(message => { message.react(successicon) });
				}
				else return SCM(`**Curent Prefix:** ${prefix}\n**USE:** ${prefix}prefix [New Prefix] to change!`)
			}
			else return SendError(1, "You don't have permission for this command!");
			});
		}
		else if(params[0] == `${prefix}server` && message.guild.id == sampserverid)
		{
			if(sampuse == 1)
			{
				cmdexist = true;
				if(channelaccess == 0) return ErrorType(1);
				GetAdminAccount(message.member.user.id, function(pAdmin) {
				if(pAdmin >= 8)
				{
					if(params[1] == "stunt" || params[1] == "rpg" || params[1] == "cs")
					{
						var stringtype, stringlocation;
						if(params[1] == "stunt") { stringlocation = "samp_stunt"; stringtype = "samp"; }
						else if(params[1] == "rpg") { stringlocation = "samp_rpg"; stringtype = "samp"; }
						else if(params[1] == "cs") return message.channel.send("```" + "This parameter temporarly disabled!" + "```");
							
						if(params[2] == "start" || params[2] == "stop" || params[2] == "restart" || params[2] == "status")
						{
							message.channel.send(`Connecting to ${params[1].toLowerCase()}.ess-ro.com **server**!`).then((message) => {
								var ssh = new SSH({
									host: ssh_host,
									user: ssh_user,
									pass: ssh_pass,
									agent: process.env.SSH_AUTH_SOCK
								});
								ssh.exec('echo $PATH', {}).start();
								ssh.exec(`/home/${stringlocation}/./${stringtype}.sh ${params[2]}`, {
									out: function(stdout) {
										ssh.end();
										message.edit(`${stdout}`).then(message => { message.react('610896740748361731') });
									}
								});
							})
						}
						else return SendError(3, "Invalid parameter!");
					}
					else return SendUsage(2, "server [stunt/rpg/cs] [start/stop/restart/status]");
				}
				else return SendError(2, "You don't have permission for this command!");
				});
			}
			else return SendError(1, "Command disabled!");
		}
		else if(params[0] == `${prefix}setchannel` && message.guild.id == sampserverid)
		{
			cmdexist = true;
			if(channelaccess == 0) return ErrorType(1);
			GetAdminAccount(message.member.user.id, function(pAdmin) {
			if(pAdmin >= 3)
			{
				if(params[1])
				{
					if(bot.channels.cache.get(params[1]))
					{ 
						UpdateSettings("channelset", params[1]);
						botchannelmessage = params[1];
						bot.channels.fetch(`${params[1]}`).then(channel => {
						message.channel.send(`**INFO:** BOT channel messages has been seted: **${channel.name}**!`).then(message => { message.react(successicon) }); });
					}
					else return SendError(1, "Invalid Channel ID");
				}
				else return SendUsage(2, "setchannel [Channel ID]");
			}
			else return SendError(1, "You don't have permission for this command!");
			});
		}
		else if(params[0] == `${prefix}stats` && message.guild.id == sampserverid)
		{
			cmdexist = true;
			if(!params[1]) string = `SELECT * FROM users WHERE DiscordLoginAccount = '${message.author.id}'`;
			else if(message.mentions.members.first()) user = message.mentions.members.first(), string = `SELECT * FROM users WHERE DiscordLoginAccount = '${user.id}'`;
			else if(!isNaN(params[1])) string = `SELECT * FROM users WHERE id = '${params[1]}'`;
			else if(isNaN(params[1])) string = `SELECT * FROM users WHERE name = '${params[1]}'`;
			con.query(`${string}`, function (err, result, fields) 
			{
				if(err) throw err;
				if(result == 0) return SendError(1, "Player don't exist in our database");
				else
				{	
					var admin_string, personal_identity_string;
					if(result[0].admin == 0) admin_string = "None";
					else if(result[0].admin == 1) admin_string = "Admin";
					else if(result[0].admin == 2) admin_string = "Admin";
					else if(result[0].admin == 3) admin_string = "Admin";
					else if(result[0].admin == 4) admin_string = "Admin";
					else if(result[0].admin == 5) admin_string = "Admin";
					else if(result[0].admin == 6) admin_string = "Co-owner";
					else if(result[0].admin == 7) admin_string = "Owner";
					else if(result[0].admin == 8) admin_string = "Scripter";

					if(result[0].buletin_have == 0) personal_identity_string = "No";
					else if(result[0].buletin_have == 1) personal_identity_string = "Yes";

					const embed = new Discord.MessageEmbed()
					.setTitle(`${result[0].name}'s stats:`)
					.setColor('#277ecd')
					.addFields
					(
						{ name: "Account ID:", value: `${result[0].id}`, inline: true },
						{ name: "Name:", value: `${result[0].name}`, inline: true },
						{ name: "Admin Level:", value: `${result[0].admin}`, inline: true },
						{ name: "Admin Rank:", value: `${admin_string}`, inline: true },
						{ name: "Register Date:", value: `${result[0].registerdate}`, inline: true },
						{ name: "Last Online:", value: `${result[0].laston}`, inline: true },
						{ name: "Money:", value: `${result[0].money}`, inline: true },
						{ name: "E-Force Points:", value: `${result[0].eforcep}`, inline: true },
						{ name: "Personal Identity:", value: `${personal_identity_string}`, inline: true },
						{ name: "Online Hours:", value: `${result[0].hours}`, inline: true },
						{ name: "Online Minutes:", value: `${result[0].mins}`, inline: true },
						{ name: "Online Seconds:", value: `${result[0].secs}`, inline: true }
					)
					.setFooter(copyright);
					message.channel.send({embed});
				}
			});
		}
		else if(params[0] == `${prefix}login` && message.guild.id == sampserverid)
		{
			cmdexist = true;
			con.query(`SELECT * FROM users WHERE DiscordLoginAccount = '${message.author.id}'`, function (err, result, fields) 
			{
				if(err) throw err;
				if(result != 0) return SendError(1, "You already have a login session in your discord account!");
				else
				{
					if(params[1])
					{
						con.query(`SELECT * FROM users WHERE DiscordToken = '${params[1]}'`, function (err, result, fields) 
						{
							if(err) throw err;
							if(result != 0 && result[0].DiscordLoginAccount == 0)
							{
								con.query(`UPDATE users SET DiscordLoginAccount = '${message.member.user.id}' WHERE id = '${result[0].id}'`);
								message.channel.send(`You has been logged in as **${result[0].name}**!`).then(message => { message.react(successicon) });
							}
							else return SendError(2, "Token don't exist or an user already has been logged with this token!");
						});
					}
					else return SendUsage(2, "login [account token]");
				}
			});
		}
		else if(params[0] == `${prefix}accounts` && message.guild.id == sampserverid)
		{
			var count = 0, hashtag, name_discord, name_server;
			con.query(`SELECT * FROM users WHERE DiscordLoginAccount > '1'`, function (err, result, fields) 
			{
				for(var i = 0; i != result.length; i++)
				{
					count++;
					var user_username, user_tag;
					user_username = bot.users.cache.get(result[i].DiscordLoginAccount).username;
					user_tag = bot.users.cache.get(result[i].DiscordLoginAccount).discriminator;
					if(i == 0) { hashtag = count, name_discord = user_username + "#" + user_tag, name_server = result[0].name; }
					if(i >= 1) { hashtag += "\n" + count, name_discord += "\n" + user_username + "#" + user_tag, name_server += "\n" + result[i].name; }
				}
				const embed = new Discord.MessageEmbed()
				.setTitle(`E-FORCE Buster Login Sessions`)
				.setColor('#277ecd')
				.addFields 
				(
					{ name: "#", value: `${hashtag}`, inline: true },
					{ name: "Discord user", value: `${name_discord}`, inline: true },
					{ name: "Server user", value: `${name_server}`, inline: true }
				)
				.setFooter(copyright);
				message.channel.send(embed);

			});
		}
		else if(params[0] == `${prefix}logout` && message.guild.id == sampserverid)
		{
			cmdexist = true;
			con.query(`SELECT * FROM users WHERE DiscordLoginAccount = '${message.member.user.id}'`, function (err, result, fields) 
			{
				if(err) throw err;
				if(result != 0)
				{
					con.query(`UPDATE users SET DiscordToken = '0', DiscordLoginAccount = '0' WHERE DiscordLoginAccount = '${message.member.user.id}'`);
					message.channel.send(`You has been succesfully log-outed from your account: **${result[0].name}**`).then(message => { message.react(successicon) });
				}
				else return SendError(1, `You are not logged in on any account! Please use **${prefix}login** to login!`);
			});
		}
		else if(params[0] == `${prefix}invites` && message.guild.id == sampserverid)
		{
			con.query(`SELECT * FROM DiscordUsers WHERE DiscordAccID = ${message.author.id}`, function (err, result, fields)
			{
				var invitesindb, invitesrewardcount, eforcep;
				if(result != 0)
				{
					invitesindb = result[0].Invites;
					invitesrewardcount = result[0].InvitesRewardCount;
					eforcep = result[0].Level * 5;
				}
				else 
				{
					invitesindb = 0
					invitesrewardcount = 5;
					eforcep = 0;
				}
				message.channel.send(`Currently, you have **${invitesindb}**/**${invitesrewardcount}** invites!\nCurrently, you have **${eforcep}** E-Force Points! You can reedem always with command **${prefix}reward**!`);
			});
		}
		else if(params[0] == `${prefix}reward` && message.guild.id == sampserverid)
		{
			con.query(`SELECT * FROM DiscordUsers WHERE DiscordAccID = ${message.author.id}`, function (err, result, fields)
			{
				if(result != 0)
				{
					level = result[0].Level;
					con.query(`SELECT * FROM users WHERE DiscordLoginAccount = ${message.author.id}`, function (err, result2, fields)
					{
						if(result2 != 0)
						{
							if(level >= 1)
							{
								EForceP = result2[0].eforcep;
								UserAccID = result2[0].id;
								newlevel = level-= 1;
								NewEForceP = EForceP+5;
								con.query(`UPDATE users SET eforcep = ${NewEForceP} WHERE id = ${UserAccID}`);
								con.query(`UPDATE DiscordUsers SET Level = ${newlevel} WHERE DiscordAccID = ${message.author.id}`);
								message.channel.send("Done! I was reedemed **5** E-Force Points in your account!").then(message => { message.react(successicon) });
							}
							else return SendError(3, `You don't have the needed invitations! Check **${prefix}invites** for more!`);
						}
						else return SendError(2, `You are not logged in on any account! Please use **${prefix}login** to login!`);
					});
				}
				else return SendError(1, `You don't have any invitations! Check **${prefix}invites**!`);
			});
		}
		else if(params[0] == `${prefix}service` && message.guild.id == sampserverid) 
		{
			//return message.channel.send("The command has been temporarily disabled!", { code: 'md' });
			GetAdminAccount(message.member.user.id, function(pAdmin) {
			if(pAdmin == 8)
			{
				if(params[1] && params[2])
				{
					if(params[2] == "start" || params[2] == "stop" || params[2] == "restart")
					{
						message.channel.send(`Connecting to vps server (**vps.ess-ro.com**)`).then(message => { 
							var ssh = new SSH({
								host: ssh_host,
								user: ssh_user,
								pass: ssh_pass,
								agent: process.env.SSH_AUTH_SOCK
							});
							message.edit("Connection estabilished ! Geting response...").then(message =>
							{
								ssh.exec('echo $PATH', { }).start();
								ssh.exec(`service ${params[1]} ${params[2]}`);

								var executed, executed_string;
								if(params[1] == "httpd" || params[1] == "mysqld" || params[1] == "mariadb") executed = 1;
								else executed = 0;

								if(executed == 1) executed_string = `Executation Successfully.\nRedirecting to /bin/systemctl ${params[2]} ${params[1]}.service`;
								else if(executed == 0) executed_string = "Executation Failed.";

								const embed = new Discord.MessageEmbed()
								.setTitle(`Service Status:`)
								.setColor('#277ecd')
								.addFields 
								(
									{ name: "Name:", value: `${params[1]}`, inline: false },
									{ name: "Action:", value: `${params[2]}`, inline: false },
									{ name: "Output:", value: executed_string, inline: false }
								)
								.setFooter(copyright);
								message.delete();
								message.channel.send(embed);
							});
						});
					}
					else return SendError(4, "Invalid parameter format!");
				}
				else return SendUsage(2, "service [name] [start/stop/restart]");
			}
			else return SendError(1, "You don't have permission for this command!");
			});
		}
		else if(params[0] == `${prefix}vps` && message.guild.id == sampserverid) 
		{
			message.channel.send(`Connecting to vps server (**vps.ess-ro.com**)`).then((message) => { 
				var ssh = new SSH({
					host: ssh_host,
					user: ssh_user,
					pass: ssh_pass,
					agent: process.env.SSH_AUTH_SOCK
				});
				message.edit("Connection estabilished ! Geting informations...");
				ssh.exec('echo $PATH', { }).start();
				ssh.exec(`free`, {
					out: function(stdout) {
						ssh.end();
						const embed = new Discord.MessageEmbed()
						.setTitle(`VPS MEMORY USAGE:`)
						.setColor('#277ecd')
						.addFields 
						(
							{ name: "Output:", value: `${stdout}`, inline: false },
						)
						.setFooter(copyright);
						message.edit(embed);
					}
				});
			})
		}
		else if(params[0] == `${prefix}admins` && message.guild.id == sampserverid) 
		{
			cmdexist = true;
			if(channelaccess == 0) return ErrorType(1);
			con.query(`SELECT * FROM users WHERE admin > 0 ORDER BY status DESC, admin DESC`, function (err, result, fields) {
			if(result == 0) return SendError(2, "No existing admins in our database!");	
			else
			{
				function GetStatusString(statusid) 
				{
					var status_string;
					if(statusid == 0) status_string = "Offline";
					else if(Statusid == 1) status_string = "Online";
					return status_string;
				}
				var string_name, admin_ex, status_ex;
				for(var i = 0; i < result.length; i++)
				{
					if(i == 0) 
					{ 
						string_name = result[0].name;
						admin_ex = result[0].admin; 
						status_ex = GetStatusString(result[0].status);
					}
					else if(i >= 1)
					{
						string_name = `${string_name}\n${result[i].name}`;
						admin_ex = `${admin_ex}\n${result[i].admin}`;
						status_ex = `${status_ex}\n${GetStatusString(result[i].status)}`;
					}
				}
				const embed = new Discord.MessageEmbed()
				.setTitle("E-Force RPG Admins:")
				.setColor('#277ecd')
				.addFields
				(
					{ name: "Name:", value: `${string_name}`, inline: true },
					{ name: "Admin Level:", value: `${admin_ex}`, inline: true },
					{ name: "Status:", value: `${status_ex}`, inline: true }
				)
				.setFooter(copyright);
				message.channel.send({embed});
			}
			});
		}
		else if(params[0] == `${prefix}cmds` && message.guild.id == sampserverid) 
		{
			cmdexist = true;
			if(channelaccess == 0) return ErrorType(1);
			const embed = new Discord.MessageEmbed()
			.setTitle('BUSTER COMMANDS:')
			.setColor('#277ecd')
			.addFields
			(
				{ name: `${prefix}kick`, value: 'Kick an online player' },
				{ name: `${prefix}ban`, value: 'Ban an online player' },
				{ name: `${prefix}unban`, value: 'Unban a banned player' },
				{ name: `${prefix}banlist`, value: 'Show all banned players' },
				{ name: `${prefix}onlinep`, value: 'View all connected players' },
				{ name: `${prefix}whitelist`, value: 'Change BOT access for a channel' },
				{ name: `${prefix}prefix`, value: 'Change BOT prefix' },
				{ name: `${prefix}server`, value: 'Send an action for SA:MP server (ess.e-force.ro:7777)' },
				{ name: `${prefix}setchannel`, value: 'Set BOT channel message send (On Player Connect/Discconect)' },
				{ name: `${prefix}stats`, value: 'Show an offline/online player stats' },
				{ name: `${prefix}login`, value: 'Login to your player account using a token (you can access more commands)' },
				{ name: `${prefix}logout`, value: 'Log out from your server account' },
				{ name: `${prefix}reward`, value: 'Get a reward for your invitations (GEMS)' },
				{ name: `${prefix}invites`, value: 'Show all your invites' }
			)
			.setFooter(copyright) 
			message.channel.send({embed});
		}
		//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		// -> Automatically Message Delete 
		//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		if(message.channel.id == `${onlychannelaccess}` && cmdexist == false && message.member.id != bot.user.id) 
		{
			message.reply("Please use only **BOT COMMANDS** in this channel!");
			message.delete({ timeout: 1});
			cmdfrombot = false;
		}
		if(message.channel.id == `${onlychannelaccess}` && cmdfrombot == false && message.member.id == bot.user.id) { message.delete({ timeout: 2000}); }
	}
});
bot.login(token);
