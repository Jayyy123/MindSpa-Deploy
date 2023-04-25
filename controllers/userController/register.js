'use strict';

const ValidationService = require('../../services/ValidationService');
const AuthService = require('../../services/AuthService');
const {verifyReq,checkReq} = require('../../services/AnalyticsService');
const JWTService = require('../../services/JwtService');
const SessionService = require('../../services/SessionService');
const MailService = require('../../services/MailService');
const { filterEmptyFields, generateCode } = require('../../core/helpers');
const { Op } = require('sequelize');
const SMSService = require('../../services/SMSService');
const JwtService = require('../../services/JwtService');

const role_id = 2;

module.exports = (app, db) => {
  app.post(
    '/api/v1/user/check',
    ValidationService.validateInput({
      email: 'required|email',
      user_name: 'required',
    }),
    async function (req, res, next) {
      const { email, user_name } = req.body;
      console.log(req.session);
      const filtered = filterEmptyFields({ email, user_name })
      if(Object.keys(filtered).length < 2){
        return res.status(400).json({message: 'Email and Username are required'});
      }
      const found = await db.user.findOne({
        where: {
          [Op.or]: [{ email }, { user_name }],
        }
      });
      let message = '';

      if(found){
        if(found.email === email){
          message = 'Email already exists';
        }else if(found.user_name === user_name){
          message = 'Username already exists';
        }
        return res.status(409).json({message});
      }else{
        return res.status(200).json({message: 'ok'});
      }
    }
  );
  app.get(
    '/api/v1/user/check',
    ValidationService.validateInput({
      email: 'required|email',
      user_name: 'required',
    }),
    async function (req, res, next) {
      const location = await checkReq(req)
      console.log('req.session', location);
      return res.status(200).json(location);
    }
  );
  app.post(
    '/api/v1/user/test',
    ValidationService.validateInput({
    }),
    async function (req, res, next) {
      try{
        const sms = await SMSService.sendInBlue({});
        console.log(sms);
        return res.status(200).json({message: 'ok'});
      }catch(err){
        console.log(err);
        return res.status(500).json({message: 'Internal Server Error'});
      }
    }
  );
  app.post(
    '/api/v1/user/verify',
    ValidationService.validateInput({
      email: 'required|email',
      code: 'required|6digitcode',
    }),
    async function (req, res, next) {
      const { email, code } = req.body;
      console.log(req.session);
      const filtered = filterEmptyFields({ email, code })
      if(Object.keys(filtered).length < 2){
        return res.status(400).json({message: 'Email and code are required'});
      }
      const found = await db.user.findOne({
        where: {
           email,
        }
      });
      if(found){
        const user_id = found.id;
        const currentTime = (new Date()).toISOString().slice(0, 19).replace("T", " ");
        const code = await db.token.findOne({
          where: {
            user_id,
            type: 1,
            token: filtered.code,
            expire_at:{
              [Op.gte]:currentTime
            }
          }
        })
        if(!code) return res.status(400).json({message: 'Invalid code or Expired Code'});
        console.log(code,currentTime);

        const needRefreshToken = req.body.is_refresh ? true : false;
        let message = ''
        let refreshToken = undefined;
        let result = found
        if(code.token === filtered.code){
          console.log('code matched',result.verify === 1);
          if(result.verify !== 1){
            await verifyReq(req,result,db);
            const template = await MailService.template('welcome');
  
            MailService.initialize({
              hostname: process.env.EMAIL_SMTP_SMTP_HOST,
              port: process.env.EMAIL_SMTP_SMTP_PORT,
              username: process.env.EMAIL_SMTP_SMTP_USER,
              password: process.env.EMAIL_SMTP_SMTP_PASS,
              from: process.env.MAIL_FROM,
              to: email,
            });
            const finalTemplate = MailService.inject(
              {
                body: template.html,
                subject: template.subject,
              },
              {
                email: result.email,
                user_name: result.user_name,
                link: process.env.BASE_URL + '/login',
              }
            )
            const mail = await MailService.sendInBlue({
              ...finalTemplate,
              name: result.user_name,
              apiKey: process.env.SENDINBLUE_API_KEY,
            });
            message = "User verified"
          }else{
            message = "User already verified"
          }

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
              token: JwtService.createAccessToken(
                {
                  user_id: result.id,
                  role: 'user'
                },
                process.env.jwt_expire,
                process.env.jwt_key
              ),
              message,
              refresh_token: refreshToken,
              expire_at: process.env.jwt_expire,
              user_id: result.id
            });
          }else{
            return res.status(200).json({
              error: false,
              role: 'user',
              token: JwtService.createAccessToken(
                {
                  user_id: result.id,
                  role: 'user'
                },
                process.env.jwt_expire,
                process.env.jwt_key
              ),
              message,
              refresh_token: refreshToken,
              expire_at: process.env.jwt_expire,
              user_id: result.id
            });
          }
    
        }
      }else{
        return res.status(404).json({message: 'User not found'});
      }

    }
  );

  app.post(
    '/api/v1/user/register',
    ValidationService.validateInput({
      email: 'required|email',
      user_name: 'required',
      password: 'required|minLength:6',
      confirm_password: 'required|minLength:6',
    }),
    async function (req, res, next) {
      const role_id = 2;
      const { email, user_name, password, confirm_password } =
        req.body;
        const filtered = filterEmptyFields({ email, user_name, password, confirm_password })
      // const { {{{register_fields}}} } = req.body;
      let viewModel = {};
      console.log(filtered);

      const newViewModel = ValidationService.handleValidationErrorForViews(
        req,
        res,
        viewModel,
        filtered
      );
      viewModel = newViewModel ?? {};
      console.log(viewModel,'<');
      try {
        if(Object.keys(filtered).length <= 3) return res.status(400).json({...viewModel});
        if (password.length < 4) {
          viewModel.error = 'Password should be at least 6 characters';
          return res.status(400).json({...viewModel});
        }

        if (password !== confirm_password) {
          viewModel.error = 'Passwords do not match';
          return res.status(400).json({...viewModel});
        }
        delete filtered.password
        delete filtered.confirm_password

        var user = await AuthService.register(
          email,
          password,
          role_id,
          'user',
          filtered
        );

        if (user) {
          const session = req.session;
          session.role = role_id;
          session.user = user.id;

          return session.save(async (error) => {
            if (error) {
              throw new Error(error);
            }

            const template = await MailService.template('register');
            console.log(template);
            const now =  new Date();
            const expires = new Date(now.getTime() + 7 * 60 * 60 * 24 * 7);
            const code = generateCode();
            MailService.initialize({
              hostname: process.env.EMAIL_SMTP_SMTP_HOST,
              port: process.env.EMAIL_SMTP_SMTP_PORT,
              username: process.env.EMAIL_SMTP_SMTP_USER,
              password: process.env.EMAIL_SMTP_SMTP_PASS,
              from: process.env.MAIL_FROM,
              to: email,
            });
            const finalTemplate = MailService.inject(
              {
                body: template.html,
                subject: template.subject,
              },
              {
                email: user.email,
                name:user_name,
                token:code,
                time:expires.toISOString().slice(0, 19).replace("T", " ")
              }
            )
            console.log(finalTemplate);
            await db.token.insert({
              user_id: user.id,
              token:code,
              type: 1,
              issue_at: now.toISOString().slice(0, 19).replace("T", " "),
              expire_at: expires.toISOString().slice(0, 19).replace("T", " ")
            });
            const mail = await MailService.sendInBlue({
              ...finalTemplate,
              name: user_name,
              apiKey: process.env.SENDINBLUE_API_KEY,
            });
            console.log(mail);
            
            return res.status(201).json({message: 'user created successfully'});
          });
        }
        return res.status(400).json({...viewModel});
      } catch (error) {
        if (user) {
          await db.user.destroy(user.id);
        }
        console.log(error,'<--');
        return res.status(400).json({error:error.message});
      }
    }
  );
};
