const Discord = require('discord.js'); 
const client = new Discord.Client(); 
const Jimp = require('jimp'); 
const ayarlar = require('./ayarlar.json'); 
const fs = require('fs'); 
const db = require('quick.db'); 
const snekfetch = require('snekfetch'); 
const moment = require('moment'); 
var chalk = require('chalk'); 
const config = require('./config.js')

var prefix = ayarlar.prefix;
  

client.on('message', async message => {
  if(message.channel.id === "KANALİD") {
  if(message.content === "kayıt-ol") {
    let rakam1 = Math.floor(Math.random() * 10).toString()
    let rakam2 = Math.floor(Math.random() * 10).toString()
    let rakam3 = Math.floor(Math.random() * 10).toString()
    let rakam4 = Math.floor(Math.random() * 10).toString()
    let rakam5 = Math.floor(Math.random() * 10).toString()
    let rakam6 = Math.floor(Math.random() * 10).toString()
    let rakam7 = Math.floor(Math.random() * 10).toString()
    let rakam8 = Math.floor(Math.random() * 10).toString()
    let rakam9 = Math.floor(Math.random() * 10).toString()
    let rakam00 = Math.floor(Math.random() * 10).toString()
    let setlencek = rakam1+rakam2+rakam3+rakam4+rakam5+rakam6+rakam7+rakam8+rakam9+rakam00
    console.log(setlencek)
    db.set(`rakamliset-${message.author.id}`, setlencek)
    db.set(`guildset-${message.author.id}`, message.guild.id)
    db.set(`websiteonay-${message.author.id}`, "aktif")
    message.channel.send(`Dm den mesaji gonderdim!`).catch(err => message.reply(`DM mesaji gonderilemedi! ${err}`))
    message.author.send(`Lütfen bu siteye giriş yapın: <https://kayit-sistemi-denemesi.glitch.me/login>\nGiriş yaptıktan sonra \`${setlencek}\` kodunu kullanarak onaylayın.`)
  }
  }
})

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

client.ayar = db;
client.config = require("./config.js");
require("./modules/functions.js")(client);

client.on("ready", async () => {
  client.appInfo = await client.fetchApplication();
  setInterval( async () => {
    client.appInfo = await client.fetchApplication();
  }, 60000);
  
  require("./modules/dashboard.js")(client);
});


client.login(config.token);