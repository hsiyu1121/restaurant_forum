const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport = require("./config/passport");
const db = require("./models");
const app = express();
const port = process.env.PORT || 3000;

app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: true }));
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

app.listen(port, () => {
  // db.sequelize.sync()
  console.log(`Express server listening on http://localhost:${port}`);
});

require("./routes")(app, passport);
