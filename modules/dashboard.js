const url = require("url");
const path = require("path");

const Discord = require("discord.js");

const express = require("express");
const app = express();
const moment = require("moment");
require("moment-duration-format");

const passport = require("passport");
const db = require('quick.db')
const session = require("express-session");
const LevelStore = require("level-session-store")(session);
const Strategy = require("passport-discord").Strategy;

const helmet = require("helmet");

const md = require("marked");

module.exports = (client) => {

  const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);

  const templateDir = path.resolve(`${dataDir}${path.sep}templates`);
  
  app.use("/public", express.static(path.resolve(`${dataDir}${path.sep}public`)));

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  passport.use(new Strategy({
    clientID: client.user.id,
    clientSecret: client.config.dashboard.oauthSecret,
    callbackURL: client.config.dashboard.callbackURL,
    scope: ["identify", "guilds"]
  },
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => done(null, profile));
  }));

  app.use(session({
    secret: client.config.dashboard.sessionSecret,
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(helmet());

  app.locals.domain = client.config.dashboard.domain;
  
  app.engine("html", require("ejs").renderFile);
  app.set("view engine", "html");

  var bodyParser = require("body-parser");
  app.use(bodyParser.json());       
  app.use(bodyParser.urlencoded({   
    extended: true
  })); 

  function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    req.session.backURL = req.url;
    res.redirect("/authorize/");
  }
  
  app.get("/authorize/", checkAuth, (req, res) => {
    res.redirect(`/authorize/${req.user.id}`);
  });
  
  app.get("/authorize/:memberID", checkAuth, (req, res) => {
    const guild = client.users.get(req.user.id);
    const websiteonay = client.ayar.fetch(`websiteonay-${req.user.id}`);
    if (!websiteonay) return res.status(404)
    const checkUrl = req.params.memberID
    if (req.user.id !== checkUrl) return res.status(404)
    if (!guild) return res.status(404);
    res.redirect(`/authorize/${req.user.id}/auth`);
  });
  
  app.get("/authorize/:memberID/auth", checkAuth, (req, res) => {
    const guild = client.users.get(req.user.id);
    const websiteonay = client.ayar.fetch(`websiteonay-${req.user.id}`);
    if (!websiteonay) return res.status(404)
    if (!guild) return res.status(404);
    const checkUrl = req.params.memberID
    if (req.user.id !== checkUrl) return res.status(404)
    //const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
    //if (!isManaged && !req.session.isAdmin) res.redirect("/");
    renderTemplate(res, req, "guild/auth.ejs", {guild});
  });
  
  app.post("/authorize/:memberID/auth", checkAuth, (req, res) => {
    const guild = client.users.get(req.user.id);
    const websiteonay = client.ayar.fetch(`websiteonay-${req.user.id}`);
    if (!websiteonay) return res.status(404)
    if (!guild) return res.status(404);
    const checkUrl = req.params.memberID
    if (req.user.id !== checkUrl) return res.status(404)
    //const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
    //if (!isManaged && !req.session.isAdmin) res.redirect("/");
    //console.log(req.user.id)
    let ayar = req.body
    //console.log("sfd")
    if (ayar === {}) return;
    let bir = req.body.rakamliset
    const ki = client.ayar.fetch(`rakamliset-${req.user.id}`)
    //console.log(ana)
    //console.log(anas2)
    //if (!ana == anas2) console.log("Eşit değil!");
    if (bir == ki) {
      const kullanicis = client.users.get(req.user.id)
      kullanicis.send(`Başarılı bir şekilde kayıt oldunuz yönlendiriliyorsunuz! Web sitemizi kapatabilirsiniz.`)
      const guildimms = client.ayar.fetch(`guildset-${req.user.id}`)
      let kullanici = client.guilds.get(guildimms).members.get(req.user.id)
      kullanici.addRole("678249999020326913")
      client.ayar.delete(`guildset-${req.user.id}`);
      client.ayar.delete(`rakamliset-${req.user.id}`);
      client.ayar.delete(`websiteonay-${req.user.id}`);
    }
    else {
      const kullanici = client.users.get(req.user.id)
      kullanici.send(`Girdiğiniz kod doğrulanamadı. Lütfen size verilen kodu giriniz.`)
    }
    res.redirect("/authorize/"+req.user.id+"/auth");
  });
  
  app.get("/authorize/:memberID/auth/yeni-kod", checkAuth, async (req, res) => {
    //const guild = client.guilds.get(req.params.guildID);
    //if (!guild) return res.status(404);
    //const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has("MANAGE_GUILD") : false;
    //if (!isManaged && !req.session.isAdmin) res.redirect("/");
    const websiteonay = client.ayar.fetch(`websiteonay-${req.user.id}`);
    if (!websiteonay) return res.status(404)
    const checkUrl = req.params.memberID
    if (req.user.id !== checkUrl) return res.status(404)
    client.ayar.delete(`rakamliset-${req.user.id}`)
    //client.ayar.delete(`guildset-${req.user.id}`)
    
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
    
    client.ayar.set(`rakamliset-${req.user.id}`, setlencek)
    const guildimms = client.ayar.fetch(`guildset-${req.user.id}`)
    const mains = client.guilds.get(guildimms).members.get(req.user.id)
    mains.send(`Yeni Kodunuz Burada: ${setlencek} .\nEğer kod istediğini siz gerçekleştirmediyseniz bu mesajı görmezden gelebilirsiniz.`)
    res.redirect("/authorize/"+req.user.id+"/auth");
  });
  
  
  const renderTemplate = (res, req, template, data = {}) => {
    const baseData = {
      bot: client,
      path: req.path,
      user: req.isAuthenticated() ? req.user : null
    };
    res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
    
  };
  
  

  app.get("/login", (req, res, next) => {
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL;
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer);
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path;
      }
    } else {
      req.session.backURL = "/authorize/";
    }
    next();
  },
  passport.authenticate("discord"));

  app.get("/callback", passport.authenticate("discord", { failureRedirect: "/autherror" }), (req, res) => {
    if (req.user.id === client.config.ownerID) {
      req.session.isAdmin = true;
    } else {
      req.session.isAdmin = false;
    }
    if (req.session.backURL) {
      const url = req.session.backURL;
      req.session.backURL = null;
      res.redirect(url);
    } else {
      res.redirect("/authorize/");
    }
    
  });

  app.get("/autherror", (req, res) => {
    renderTemplate(res, req, "autherror.ejs");
    
    //client.channels.get("498131796870037514").send("Web Panelinde bağlantı hatası oluştu! Kişi giriş yapamıyor tekrar denemeli! Büyük bir sorun değil.")
  });

  app.get("/logout", function(req, res) {
    req.session.destroy(() => {
      req.logout();
      res.redirect("/authorize/");
    });
    
  });
  client.site = app.listen(process.env.PORT);
};