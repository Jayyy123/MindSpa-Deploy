'use strict';

const ValidationService = require('../../services/ValidationService')
const AuthService = require('../../services/AuthService');
const JWTService = require('../../services/JwtService');
const SessionService = require('../../services/SessionService');
const PasswordService = require('../../services/PasswordService');
const helpers = require("../../core/helpers");
const { validateEmail } = require('../../core/utils');

const role_id= 2

module.exports = (app,db) => {
  app.get("/member/profile", SessionService.verifySessionMiddleware(role_id, "member"),

async function (req, res, next) {
  try{
    const id = req.session.user;
    const profile = await db.user.getByPK(id);

    const AuthViewModel = require("../../viewModels/member_auth_view_model")

    const viewModel = new AuthViewModel(db.user,"Profile")

    viewModel._base_url = '/member/profile'
    
    if(!profile){
      viewModel.error = "Profile Not Found";
      return res.render("member/Profile", viewModel);
    }

    if (req.session.csrf === undefined) {
      req.session.csrf = SessionService.randomString(100);
    }
    
    Object.keys(viewModel.form_fields).forEach((field) => {
      
      viewModel.form_fields[field] = profile[field];
    });

    

    return res.render("member/Profile",viewModel)
  } catch(error){
    viewModel.error = "Something went wrong"
    return res.render("member/Profile", viewModel)
  }

});

app.post(
  '/member/profile',
  
  SessionService.verifySessionMiddleware(role_id, 'member'),
  async function (req, res, next) {
    const id = req.session.user;
    const profile = await db.user.getByPK(id);

    const AuthViewModel = require('../../viewModels/member_auth_view_model');

    const viewModel = new AuthViewModel(db.user,"Profile");    
    viewModel._base_url = '/member/profile';
    
    if(viewModel.form_fields.password) delete viewModel.form_fields.password;

    if(!profile){
      viewModel.error = "Profile Not Found";
      return res.render("member/Profile", viewModel);
    }

    if (req.session.csrf === undefined) {
      req.session.csrf = SessionService.randomString(100);
    }

    const { first_name,last_name,email,password,status } = req.body;

    viewModel.form_fields = {
      ...viewModel.form_fields,
      first_name,last_name,email,password,status
    };

    if(viewModel.form_fields.password) delete viewModel.form_fields.password;
    
    try {
      if (req.validationError) {
        viewModel.error = req.validationError;
        return res.render('member/Profile', viewModel);
      }

      
    if (email && profile.email !== email) {
      if (!validateEmail(email)) {
        viewModel.error = 'Invalid email';
        return res.render('member/Profile', viewModel);
      }
      const emailExists = await db.user.getByField('email', email);
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }
    
      
      let profileParams = {
        first_name,last_name,email,password,status
      };      

      
    if(profileParams.password) delete profileParams.password;
    if (password) {
      profileParams.password = await PasswordService.hash(password);
    }    
    

      await db.user.edit(profileParams, id);

      viewModel.success = 'Profile Updated Successfully';
      return res.render('member/Profile', viewModel);
    } catch (error) {      
      console.error(error);
      viewModel.error = error.message || 'Something went wrong';
      return res.render('member/Profile', viewModel);
    }
  },
);

  
  
  
};
