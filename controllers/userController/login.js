'use strict';

const ValidationService = require('../../services/ValidationService')
const AuthService = require('../../services/AuthService');
const JWTService = require('../../services/JwtService');
const SessionService = require('../../services/SessionService');
const errors = require('../../core/errors');
const { filterEmptyFields } = require('../../core/helpers');
const JwtService = require('../../services/JwtService');
const { checkReq } = require('../../services/AnalyticsService');
const MailService = require('../../services/MailService');
const role_id = 2
const moment = require("moment");


module.exports = (app, db) => {
    app.post(
        '/api/v1/user/login',
        ValidationService.validateInput({
            "user_name.required":"User name is required", 
            "password.required":"Password is required.",
            "password.minLength":"Password should be at least 6 characters long."
        }),
        async function (req, res, next) {
            const { user_name, password } = req.body;
            const filtered = filterEmptyFields({ user_name, password })
            if(Object.keys(filtered).length < 2){
                return res.status(400).json({message: 'user_name and password are required'});
            }
            try{
                const user = await AuthService.login(user_name, password, role_id, 'user');
                if(user.verify === 0){
                    return res.status(400).json({message: 'Please verify your account'});
                }
                const check = await checkReq(req,user);
                if(!check.continue){
                  const template = await MailService.template('suspicious-login');
  
                  MailService.initialize({
                    hostname: process.env.EMAIL_SMTP_SMTP_HOST,
                    port: process.env.EMAIL_SMTP_SMTP_PORT,
                    username: process.env.EMAIL_SMTP_SMTP_USER,
                    password: process.env.EMAIL_SMTP_SMTP_PASS,
                    from: process.env.MAIL_FROM,
                    to: user.email,
                  });
                  const time = moment(new Date())
                  const timeString = time.format('LL') + ' at ' + time.format('h:mma'); // 'June 1, 2019 at 9:32'
                  console.log(timeString);
                  const finalTemplate = MailService.inject(
                    {
                      body: template.html,
                      subject: template.subject,
                    },
                    {
                      email: user.email,
                      name: user.user_name,
                      specs:'Suspicious Login on os ' + check.device?.os?.name + ' version ' + check.device?.os?.version + ' and browser ' + check.device?.client?.name + ' from ' + check.device?.device?.type + '  brand: ' + check.device?.device?.brand + ' device',
                      imageUrl: check.imageURL,
                      location: check.location,
                      time: timeString,
                      link: process.env.BASE_URL + '/login',
                    }
                  )
                  const mail = await MailService.sendInBlue({
                    ...finalTemplate,
                    name: user.user_name,
                    apiKey: process.env.SENDINBLUE_API_KEY,
                  });
                }

                // checkSuspiciousLogin(user.id, req);

                const session = req.session;
                if (req.body.remember_me === 'on') {
                const day = 60 * 60 * 1000 * 24;
                req.session.cookie.expires = new Date(Date.now() + day * 31);
                req.session.cookie.maxAge = day * 31;
                }
        
                session.role = role_id;
                session.user = user.id;
                const needRefreshToken = req.body.is_refresh ? true : false;
                let refreshToken = undefined;
                let result = user;
                if (needRefreshToken) {
                  const refreshToken = JwtService.createAccessToken(
                    {
                      user_id: result.id,
                      role: 'user'
                    },
                    process.env.refresh_jwt_expire,
                    process.env.jwt_key
                  );
                  let expireDate = new Date();
                  expireDate.setSeconds(expireDate.getSeconds() +  process.env.refresh_jwt_expire);
                  await AuthService.saveRefreshToken(db, result.id, refreshToken, expireDate);
                  return res.status(200).json({
                    error: false,
                    role: 'user',
                    message: 'Login successful',
                    token: JwtService.createAccessToken(
                      {
                        user_id: result.id,
                        role: 'user'
                      },
                      process.env.jwt_expire,
                      process.env.jwt_key
                    ),
                    refresh_token: refreshToken,
                    expire_at: process.env.refresh_jwt_expire,
                    user_id: result.id
                  });
                }else{
                    return res.status(200).json({
                      error: false,
                      role: 'user',
                      message: 'Login successful',
                      token: JwtService.createAccessToken(
                        {
                          user_id: result.id,
                          role: 'user'
                        },
                        process.env.jwt_expire,
                        process.env.jwt_key
                      ),
                      refresh_token: refreshToken,
                      expire_at: process.env.jwt_expire,
                      user_id: result.id
                    });

                }
          
            }catch(e){
             return res.status(400).json({message: e.message});   
            }
        }
      );
};

