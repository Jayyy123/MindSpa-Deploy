const app = require('./app');
const db = require('./models');
const bcrypt = require('bcryptjs');
async function executeSeeds() {
  await db.sequelize.sync({ force: true });

  //load seed files and run the function to insert
await db.user.insert({"email":"admin@mindpsa.com","password":"$2a$04$8krter.5FOxrk2dlJ6RLgeoxhC8qWB/rF3CykpO37mDthCI6mf/NW","first_name":"Mind","last_name":"Spa","phone":"","photo":"","role_id":1,"verify":1,"status":1});
await db.user.insert({"email":"member@mindspa.com","password":"$2a$04$znvfyeSd3MIsKy3ZpP3RQ.a6pQPyC.qYcpsWanwftJWnvY4R/vrSG","first_name":"Member","last_name":"Member","phone":"","photo":"","role_id":2,"verify":1,"status":1});
await db.role.insert({"name":"admin"});
await db.role.insert({"name":"member"});
// insert template for forgot password
await db.email.insert({"slug":"reset-password","subject":"Reset your password",
"tag":"name,reset_link,email","html":`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      .header img {
        width: 15%;
      }

      .img1 {
        width: 3%;
      }

      .img2 {
        margin-left: 4%;
        width: 6%;
      }

      .img3 {
        margin-left: 4%;
        width: 5%;
      }

      body {
        padding-left: 30%;
        padding-right: 30%;
      }

      button {
        margin-top: 4%;
        background-color: #155f43;
        width: 50%;
        height: 50px;
        border-radius: 15px;
        color: white;
        border-color: transparent;
      }

      h4 {
        font-weight: bold;
        margin-top: 4%;
      }

      .text {
        text-align: justify;
        margin-top: 5%;
      }

      span {
        text-decoration: underline;
      } /*# sourceMappingURL=style.css.map */
    </style>
    <title>Document</title>
  </head>
  <body>
    <div class="header">
      <img
        src="https://fv9-1.failiem.lv/thumb.php?i=42fmrqucx&n=icon-2+1.png"
        alt="logo"
      />
      <hr />
    </div>

    <div>
      <h4>Reset Your Password</h4>
      <p>Hi {{{name}}},</p>
      <p style="text-align: justify; margin-top: 5%">
        You recently requested to reset the password to your Mindspa account.
        click the button below to continue
      </p>
    </div>

    <div>
      <button style="width: 35%">
        <a style="text-decoration:none; color:white;" href="{{{reset_link}}}">Reset Password</a>
      </button>
      <p>
        If you did not request a password reset. kindly ignore this email or
        contact our <span style="color: #f17916">help center</span> immediately
      </p>
      <hr style="margin-top: 10%" />
    </div>

    <p>
      This email was sent to <span>{{{email}}}</span>. if you will rather
      not recieve any more emails from Mindspa,
      <span style="color: #f17916">Unsubscribe</span>
    </p>

    <div style="margin-top: 7%">
      <img
        class="img1"
        src="https://elva-technologies.slack.com/files/U03LUHNCLK0/F052VCJ2ZQB/vector.png"
        alt="facebook"
      />
      <img
        class="img2"
        src="https://elva-technologies.slack.com/files/U03LUHNCLK0/F052Y0SPR52/vector__1_.png"
        alt="twitter"
      />
      <img
        class="img3"
        src="https://elva-technologies.slack.com/files/U03LUHNCLK0/F052Y0SGAMA/vector__2_.png"
        alt="instagram"
      />
    </div>

    <p style="margin-top: 6%">
      100 Smith Street, Melbourne VIC 3000 <br />
      @2023 Mindspa
    </p>
  </body>
</html>

`});
// insert template for Registration and sending of otp
await db.email.insert({"slug":"register","subject":"Register","tag":"email,reset_token,link","html":`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      .header img {
        width: 15%;
      }

      .img1 {
        width: 3%;
      }

      .img2 {
        margin-left: 4%;
        width: 6%;
      }

      .img3 {
        margin-left: 4%;
        width: 5%;
      }

      body {
        padding-left: 30%;
        padding-right: 30%;
      }

      button {
        margin-top: 4%;
        background-color: #155f43;
        width: 50%;
        height: 50px;
        border-radius: 15px;
        color: white;
        border-color: transparent;
      }

      h4 {
        font-weight: bold;
        margin-top: 4%;
      }

      .text {
        text-align: justify;
        margin-top: 5%;
      }

      span {
        text-decoration: underline;
      } /*# sourceMappingURL=style.css.map */
    </style>
    <title>Document</title>
  </head>
  <body>
    <div class="header">
      <img
        src="https://fv9-1.failiem.lv/thumb.php?i=42fmrqucx&n=icon-2+1.png"
        alt="logo"
      />
      <hr />
    </div>

    <div>
      <h4>One Time Password</h4>
      <p>Hi {{{name}}},</p>
      <p style="text-align: justify; margin-top: 5%">
        Thank you for signing up to Mindspa. Here is your OTP
      </p>
    </div>

    <div>
      <h2>{{{token}}}</h2>
      <p>Please note that this code expires in 5 minutes</p>
      <hr style="margin-top: 10%" />
    </div>

    <p>
      This email was sent to <span>{{{email}}}</span>. if you will rather not
      recieve any more emails from Mindspa,
      <span style="color: #f17916">Unsubscribe</span>
    </p>

    <div style="margin-top: 7%">
      <img
        class="img1"
        src="https://fv9-5.failiem.lv/thumb.php?i=cuamjj9qy&n=Vector.png"
        alt="facebook"
      />
      <img
        class="img2"
        src="https://fv9-3.failiem.lv/thumb.php?i=uxm4fnc8f&n=Vector+%281%29.png"
        alt="twitter"
      />
      <img
        class="img3"
        src="https://fv9-7.failiem.lv/thumb.php?i=ne47xkbjt&n=Vector+%282%29.png"
        alt="instagram"
      />
    </div>

    <p style="margin-top: 6%">
      100 Smith Street, Melbourne VIC 3000 <br />
      @2023 Mindspa
    </p>
  </body>
</html>
`});
//insert template for welcome email
await db.email.insert({"slug":"welcome","subject":"Welcome to Mind Spa","tag":"user_name,link","html":`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      .header img {
        width: 15%;
      }

      .img1 {
        width: 3%;
      }

      .img2 {
        margin-left: 4%;
        width: 6%;
      }

      .img3 {
        margin-left: 4%;
        width: 5%;
      }

      body {
        padding-left: 30%;
        padding-right: 30%;
      }

      button {
        margin-top: 4%;
        background-color: #155f43;
        width: 50%;
        height: 50px;
        border-radius: 15px;
        color: white;
        border-color: transparent;
      }

      h4 {
        font-weight: bold;
        margin-top: 4%;
      }

      .text {
        text-align: justify;
        margin-top: 5%;
      }

      span {
        text-decoration: underline;
      } /*# sourceMappingURL=style.css.map */
    </style>
    <title>Document</title>
  </head>
  <body>
    <div class="header">
      <img
        src="https://fv9-1.failiem.lv/thumb.php?i=42fmrqucx&n=icon-2+1.png"
        alt="logo"
      />
      <hr />
    </div>

    <div>
      <img
        style="width: 100%; margin-top: 3%"
        src="img/Rectangle 4330.png"
        alt=""
      />
      <h4>Welcome to Mindspa!</h4>
      <p>Hi {{{user_name}}},</p>
      <p class="text">
        Lorem ipsum dolor sit amet consectetur. Id vitae viverra a eu vitae nam
        sit tempor. Habitasse risus pulvinar morbi ipsum etiam donec pharetra
        rutrum volutpat. Consequat eget quam varius velit a enim enim fermentum.
        Mauris enim at morbi sed. Aliquam sit vel consequat elementum senectus
        sit.
      </p>

      <p class="text">
        Lorem ipsum dolor sit amet consectetur. Id vitae viverra a eu vitae nam
        sit tempor. Habitasse risus pulvinar morbi ipsum etiam donec pharetra
        rutrum volutpat. Consequat eget quam varius velit a enim enim fermentum.
        Mauris enim at morbi sed. Aliquam sit vel consequat elementum senectus
        sit.
      </p>

      <p class="text">Stay Healthy</p>

      <p>Mindspa Team</p>
    </div>

    <div>
      <button>Get Started</button>
      <hr style="margin-top: 10%" />
    </div>

    <p>
      This email was sent to <span>{{{email}}}</span>. if you will rather not
      recieve any more emails from Mindspa,
      <span style="color: #f17916">Unsubscribe</span>
    </p>

    <div style="margin-top: 7%">
      <img
        class="img1"
        src="https://fv9-5.failiem.lv/thumb.php?i=cuamjj9qy&n=Vector.png"
        alt="facebook"
      />
      <img
        class="img2"
        src="https://fv9-3.failiem.lv/thumb.php?i=uxm4fnc8f&n=Vector+%281%29.png"
        alt="twitter"
      />
      <img
        class="img3"
        src="https://fv9-7.failiem.lv/thumb.php?i=ne47xkbjt&n=Vector+%282%29.png"
        alt="instagram"
      />
    </div>

    <p style="margin-top: 6%">
      100 Smith Street, Melbourne VIC 3000 <br />
      @2023 Mindspa
    </p>
  </body>
</html>
`});
//insert template for confirm password email
await db.email.insert({"slug":"confirm-password","subject":"Confirm your account","tag":"email,confirm_token,link","html":"Hi {{{email}}},<br/>Please click the link below to confirm your account.<br/><a href=\"{{{link}}}/{{{confirm_token}}}\">Link</a>Thanks,<br/> Admin"});
//insert template for account verification email
await db.email.insert({"slug":"verify","subject":"Account verification","tag":"code","html":"Your verification # is {{{code}}}"});
//insert template for suspicious login email
await db.email.insert({"slug":"suspicious-login","subject":"Suspicious Login","tag":"name,location,time,imageUrl,email","html":`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      .header img {
        width: 15%;
      }

      .img1 {
        width: 3%;
      }

      .img2 {
        margin-left: 4%;
        width: 6%;
      }

      .img3 {
        margin-left: 4%;
        width: 5%;
      }

      body {
        padding-left: 30%;
        padding-right: 30%;
      }

      button {
        margin-top: 4%;
        background-color: #155f43;
        width: 50%;
        height: 50px;
        border-radius: 15px;
        color: white;
        border-color: transparent;
      }

      h4 {
        font-weight: bold;
        margin-top: 4%;
      }

      .text {
        text-align: justify;
        margin-top: 5%;
      }

      span {
        text-decoration: underline;
      } /*# sourceMappingURL=style.css.map */
    </style>
    <script
      src="https://kit.fontawesome.com/a278e9af44.js"
      crossorigin="anonymous"
    ></script>
    <title>Document</title>
  </head>
  <body>
    <div class="header">
      <img
        src="https://fv9-1.failiem.lv/thumb.php?i=42fmrqucx&n=icon-2+1.png"
        alt="logo"
      />
      <hr />
    </div>

    <h4>Suspicious Login Dectected</h4>
    <p>Hi {{{name}}},</p>
    <p class="text">
      We noticed a new login to your account from a new device. If this was you,
      there is nothing to worry about.
    </p>

    <div class="icon">
      <img src="img/Group 2457.png" alt="" />
      <span>Location: <span>{{{location}}}</span> </span> <br />

      <img src="img/Group 2241.png" alt="" />
      <span>Time: <span>{{{time}}}</span> </span>
    </div>

    <img style="width: 100%; margin-top: 3%" src="{{{imageUrl}}}" alt="" />

    <p style="font-weight: 900; font-size: 20px">Not you ?</p>
    <p>Take a few minutes to secure your account</p>

    <div>
      <button style="width: 35%">Secure Account</button>
      <hr style="margin-top: 10%" />
    </div>

    <p>
      This email was sent to <span>{{{email}}}</span>. if you will rather not
      recieve any more emails from Mindspa,
      <span style="color: #f17916">Unsubscribe</span>
    </p>

    <div style="margin-top: 7%">
      <img
        class="img1"
        src="https://fv9-5.failiem.lv/thumb.php?i=cuamjj9qy&n=Vector.png"
        alt="facebook"
      />
      <img
        class="img2"
        src="https://fv9-3.failiem.lv/thumb.php?i=uxm4fnc8f&n=Vector+%281%29.png"
        alt="twitter"
      />
      <img
        class="img3"
        src="https://fv9-7.failiem.lv/thumb.php?i=ne47xkbjt&n=Vector+%282%29.png"
        alt="instagram"
      />
    </div>

    <p style="margin-top: 6%">
      100 Smith Street, Melbourne VIC 3000 <br />
      @2023 Mindspa
    </p>
  </body>
</html>
`});
}

executeSeeds();