const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000
if(process.env.NODE_ENV !== "production"){
  require('dotenv').config()
}
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport = require("./config/passport");
const db = require("./models");



app.engine("handlebars", handlebars({ 
  defaultLayout: "main", 
  helpers: require('./config/handlebars-helpers')  
}));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session()); //放在session之後
app.use(flash());
app.use('/upload', express.static(__dirname + '/upload'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  res.locals.user = req.user;
  next();
});

app.listen(PORT, () => {
  // db.sequelize.sync()
  console.log(`Express server listening on http://localhost:${PORT}`);
});

require("./routes")(app);
