'use strict';

const ValidationService = require('../../services/ValidationService')
const SessionService = require('../../services/SessionService');
const AuthService = require('../../services/AuthService');
const JwtService = require('../../services/JwtService');
const MailService = require('../../services/MailService');

const role_id = 2


module.exports = (app, db) => {
app.post('/api/v1/user/forgot',

ValidationService.validateInput({
    email:"required|email",
},{
    "email.required":"Email is required", 
    "email.email":"Invalid email",
})
,async function (req, res, next) {
    const role_id = 2
    const {email} = req.body;
    const AuthViewModel = require("../../viewModels/member_auth_view_model")
    const viewModel =new AuthViewModel(db.user,"Forgot Password")

   
      ValidationService.handleValidationErrorForViews(
        req,
        res,
        viewModel,
        '',
        'forgot_fields',
        { email },
      );


try {
    if(!email){
        return res.status(400).json({...viewModel.validationError});
    }
    const accountExists  = await  viewModel.account_exists(email,{role_id})
    if(!accountExists){
        viewModel.error = "Account doesn't exists."
        return res.status(404).json({error:viewModel.error});
    }
    
    const template = await MailService.template('reset-password');
    const result = accountExists;
    const user = result;
    const now =  new Date();
    const expires = new Date(now.getTime() + 7 * 60 * 60 * 24 * 7);
    const token = JwtService.createAccessToken(
        {
          user_id: result.id,
          role: 'user'
        },
        process.env.jwt_expire,
        process.env.jwt_key
      )
    //   await db.token.insert({
    //     user_id: result.id,
    //     token,
    //     type: 3,
    //     issue_at: now.toISOString().slice(0, 19).replace("T", " "),
    //     expire_at: expires.toISOString().slice(0, 19).replace("T", " ")
    //   });
  
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
        name: result.user_name,
        reset_link: 'http://localhost:3000/reset/' + token,
      }
    )
    const mail = await MailService.sendInBlue({
      ...finalTemplate,
      name: result.user_name,
      apiKey: process.env.SENDINBLUE_API_KEY,
    });
     await viewModel.saveTokenToDB(token, user.id)
     viewModel.success = "A password reset link is sent to your inbox."
     return res.status(200).json({
        message: viewModel.success
     });

} catch (error) {
    viewModel.error = "Something went wrong"
    return res.status(400).json({...viewModel.validationError});
}
});


app.post('/api/v1/user/reset',
ValidationService.validateInput({
    password:"required|minLength:6"
},{
    "password.required":"Password is required.",
    "password.minLength":"Password should be at least 6 characters long.",
    }),
 async function (req, res, next) {
    const AuthViewModel = require("../../viewModels/member_auth_view_model")
    const viewModel = new AuthViewModel(db.user, "Reset Password")
    
    const token = req.body.token
    if(!token){
        viewModel.error = "Invalid token"
        return res.status(404).json({...viewModel});
    }
    const { password } = req.body;

    ValidationService.handleValidationErrorForViews(
        req,
        res,
        viewModel,
        '',
        'reset_fields',
        { password, confirm_password:password },
      );
    viewModel.resetToken=token
    try {
        const tokenValid = await viewModel.validateToken(token)
        if(!tokenValid){
            viewModel.error = "Invalid or Expired token"
            return res.status(404).json({...viewModel});
        }

        const hashPassword =await  viewModel.generate_hash(password)
        if(!hashPassword){
            return res.status(400).json({...viewModel});
        }
        const user = await db.user.findByPk(tokenValid.user_id)
        const result = user;
        // const decoded = JwtService.verifyAccessToken(tokenValid.token,2,{});
        await viewModel.updatePassword(hashPassword, tokenValid.user_id)

        if(user.verify === 0){
            return res.status(400).json({message: 'Password Reset complete, to continue please verify your account'});
        }
            return res.status(200).json({
              error: false,
              role: 'user',
              message: 'Password Reset completed and Login successful',
              token: JwtService.createAccessToken(
                {
                  user_id: result.id,
                  role: 'user'
                },
                process.env.jwt_expire,
                process.env.jwt_key
              ),
              refresh_token: null,
              expire_at: process.env.jwt_expire,
              user_id: result.id
            });

    } catch (error) {
        viewModel.error = "Something went wrong"
        console.log(error)
        return res.status(400).json({error:viewModel.validationError});
    }
  });

};

