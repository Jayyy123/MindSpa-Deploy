const passwordService = require('./PasswordService');
const mailService = require('./MailService');
const generateCode = require('../utils/generateCode');
const db = require('../models');
const errors = require('../core/errors');
const { Op } = require('sequelize');

module.exports = {
  /**
   * Register new user with email and password
   * @name authService.register
   * @param {String} email user new email address
   * @param {String} password user new password
   * @returns {Promise.<{credential:String, user:String}>} payload to generate jwt access and refresh token
   * @example
   * const payload = await authService.register(req.body.email, req.body.password)
   */
  register: async function (email, password, roleId, model, userDetails = {}) {
    try {
      var user = await db[model].getByFields({
        email,
      });

      if (user) throw new Error(errors.EMAIL_ADDRESS_ALREADY_EXIST);

      const hashedPassword = await passwordService.hash(password);
      console.log(hashedPassword,'the hashed');
      var user = await db[model].insert({ email, password: hashedPassword, role_id: roleId, verify: 0, status: 1, ...userDetails }, { returnAllFields: true });

      return user;
    } catch (error) {
      // if (user) {
      //   await db.user.realDelete(user.id);
      // }
      console.error(error);
      throw error;
    }
  },
  /**
   * Login user with email and password
   * @name authService.login
   * @param {String} email user email address
   * @param {String} password user password
   * @returns {Promise.<{credential:String, user:String}>} payload to generate jwt access and refresh token
   * @example
   * const payload = await authService.login(req.body.email, req.body.password)
   */
  login: async function (user_name, password, roleId, model,extra=0) {
    try {
      const user = await db[model].findOne({
        where: { user_name, role_id: {
          [Op.in]: [roleId,extra]
        } },
      });

      if (!user) throw new Error(errors.EMAIL_ADDRESS_NOT_FOUND);

      const { password: hashedPassword } = user;

      const passwordValid = await passwordService.compareHash(password, hashedPassword);

      if (!passwordValid) throw new Error(errors.INVALID_EMAIL_OR_PASSWORD);

      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  /**
   * Send email and save to database
   * @name authService.forgotPassword
   * @param {String} email user email address
   * @return {Promise.<Void>}
   * @example
   * await authService.forgotPassword(req.body.email)
   */
  forgotPassword: async function (email) {
    try {
      const isEmailAddressExist = await db.credential.getByFields({
        email: email,
      });

      if (!isEmailAddressExist) throw new Error(errors.EMAIL_ADDRESS_NOT_FOUND);

      const { user_id } = isEmailAddressExist;

      const getUser = await db.user.getByPK(user_id);

      const verificationCode = generateCode(6);

      mailService.initialize({
        hostname: process.env.EMAIL_SMTP_SMTP_HOST,
        port: process.env.EMAIL_SMTP_SMTP_PORT,
        username: process.env.EMAIL_SMTP_SMTP_USER,
        password: EMAIL_SMTP_SMTP_PASS,
        from: process.env.MAIL_FROM,
        to: email,
      });

      const mailTemplate = await mailService.template('reset-password');

      const injectedMailTemplate = mailService.inject(
        {
          body: mailTemplate.body,
          subject: mailTemplate.subject,
        },
        {
          username: `${getUser.first_name} ${getUser.last_name}`,
          verification_code: verificationCode,
        },
      );

      await mailService.send(injectedMailTemplate);

      await db.token.insert({ token: verificationCode, user_id });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  /**
   * Verify forgot password confirmation code
   * @name authService.verifyForgotPassword
   * @param {code} code confirmation code
   * @returns {Promise.<{credential:String, user:String}>} payload to generate jwt access and refresh token
   * @example
   * const payload = await authService.verifyForgotPassword(req.body.code)
   */
  verifyForgotPassword: async function (code) {
    try {
      const Token = await db.token.getByFields({
        token: code,
      });

      const Credential = await db.credential.getByFields({
        user_id: Token.user_id,
      });

      return { credential: Credential.id, user: Credential.user_id };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  saveRefreshToken: async function (db, user_id, token, expireDate) {

    try {
      const result = await db.token.insert({
        user_id: user_id,
        token: token,
        type: 2,
        data: JSON.stringify({ user_id, token }),
        status: 1,
        create_at: sqlDateFormat(new Date()),
        update_at: sqlDateTimeFormat(new Date()),
        expire_at: sqlDateTimeFormat(expireDate)
      });
      return result;
    } catch (error) {
      return error.message;
    }
  },

  /**
   * Reset password
   * @name authService.resetPassword
   * @param {String} password user new password
   * @param {String} credential_id user credential id
   * @example
   * await authService.resetPassword(req.body.password, credential_id)
   */
  resetPassword: async function (password, credential_id) {
    try {
      const hashedPassword = await passwordService.hash(password);

      await db.credential.edit(
        {
          password: hashedPassword,
        },
        credential_id,
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  /**
   * Email confirmation
   * @name authService.emailConfirmation
   * @param {String} email user email address
   * @example
   * await authService.emailConfirmation(email)
   */
  emailConfirmation: async function (email) {
    try {
      const isEmailAddressExist = await db.credential.getByFields({
        email: email,
      });

      if (!isEmailAddressExist) throw new Error(errors.EMAIL_ADDRESS_NOT_FOUND);

      const { user_id } = isEmailAddressExist;

      const user = await db.user.getByPK(user_id);

      const confirmationCode = generateCode(6);

      mailService.initialize({
        hostname: process.env.EMAIL_SMTP_SMTP_HOST,
        port: process.env.EMAIL_SMTP_SMTP_PORT,
        username: process.env.EMAIL_SMTP_SMTP_USER,
        password: EMAIL_SMTP_SMTP_PASS,
        from: process.env.MAIL_FROM,
        to: email,
      });

      const mailTemplate = await mailService.template('email-confirmation');

      const injectedMailTemplate = mailService.inject(
        {
          body: mailTemplate.body,
          subject: mailTemplate.subject,
        },
        {
          username: `${user.first_name} ${user.last_name}`,
          confirmation_code: confirmationCode,
        },
      );

      await mailService.send(injectedMailTemplate);

      await db.token.insert({ token: confirmationCode, user_id, type: 6 });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  /**
   * Verify Email address
   * @name authService.emailVerify
   * @param {String} token email confirmation code
   * @param {string} user_id user id
   * @example
   * await authService.emailVerify(email, user_id)
   */
  emailVerify: async function (token, user_id) {
    try {
      const isTokenExist = await db.token.getByFields({
        user_id,
        token,
        type: 6,
      });

      if (!isTokenExist) throw new Error(errors.INVALID_EMAIL_CONFIRMATION_CODE);

      await db.token.realDelete(isTokenExist.id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  /**
   * check if user need to change password before logging in
   * @name authService.forcePasswordChange
   * @param {string} user_id user id
   */
  forcePasswordChange: async function (user_id) {
    try {
      const { profile_id } = await db.user.getByPK(user_id);
      const { force_password_change } = await db.profile.getByPK(profile_id);

      if (force_password_change) return true;
      else return false;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
