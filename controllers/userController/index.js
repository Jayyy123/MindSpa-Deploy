const Forgot = require("./forgot");
const Login = require("./login");
const Logout = require("./logout");
const Profile = require("./profile");
const Register = require("./register");

module.exports = (app, db) => {[Forgot(app, db),Login(app, db),Logout(app, db),Profile(app, db),Register(app, db)]}           
           