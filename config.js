const config = {
  "ownerID": "326692518118948865",//Bu kısıma, kendi ID'niz. 
  "admins": [""],//Yetkili eklemek isterseniz, o kişinin ID'si.
  "support": [""],//Destek ekibi eklemek isterseniz, o kişinin ID'si.
  "token": "NTk1MjczMTY4NDU4MDg4NDYy.Xkeo0g.spRC_OikYmVGWoX9DorLXCLKrA4",//Botun, tokeni.
  "dashboard" : {
    "oauthSecret": "AEwbUAzphdpTAAkeRjxtGj4-7_whq2gL",//Client secret.
    "callbackURL": `https://kayit-sistemi-denemesi.glitch.me/callback`,//oAuth2 kısmında bulunan kutucuğa, bu bağlantıyı ekleyiniz.
    "sessionSecret": "Codare",//Bu kısımı, değiştirmeyiniz.
    "domain": "https://kayit-sistemi-denemesi.glitch.me"//Sitenin, adresi.
  }
};

module.exports = config;