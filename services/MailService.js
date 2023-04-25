const nodemailer = require('nodemailer');
const SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;
//  Instantiate the client\
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY

const db = require('../models');

module.exports = {
  /** @private */
  transport: null,
  /** @private */
  from: null,
  /** @private */
  to: null,
  /**
   * Nodemailer initializer
   * @name mailService.initialize
   * @param {{hostname: String, port: Number, username: String, password: String, from: String, to: String}} config Nodemailer configuration
   * @returns {Void}
   */
  initialize: function (config) {
    // this.transport = nodemailer.createTransport({
    //   host: config.hostname,
    //   port: config.port,
    //   auth: {
    //     user: config.username,
    //     pass: config.password,
    //   },
    // });

    this.from = config.from;
    this.to = config.to;
  },

  sendInBlue: async function (config) {
    try{
      const data = await new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(
        {
          'subject':config.subject,
          'sender' : {'email':config.from, 'name':'Mind Spa NG'},
          // 'replyTo' : {'email':'api@sendinblue.com', 'name':'Sendinblue'},
          'to' : [{'name': config.name, 'email':config.to}],
          'htmlContent' : config.html,
          // 'params' : {'bodyMessage':'Made just for you!'}
        }
      )
      console.log(data,'<-data')
      return true;
    }catch(e) {
      console.log(e,'<-error');
      return false;
    }
  },

  sendinblue: async function (config) {
    try{
      const axios = require('axios');
      const response = await axios.post(
        'https://api.sendinblue.com/v3/smtp/email',
        // '{  \n   "sender":{  \n      "name":"Sender Alex",\n      "email":"senderalex@example.com"\n   },\n   "to":[  \n      {  \n         "email":"testmail@example.com",\n         "name":"John Doe"\n      }\n   ],\n   "subject":"Hello world",\n   "htmlContent":"<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Sendinblue.</p></body></html>"\n}',
        {
          'sender': {
            'name': 'Mind Spa NG',
            'email': config.from
          },
          'to': [
            {
              'email': config.to,
              'name': config.name
            }
          ],
          subject: config.subject,
          htmlContent: config.body
        },
        {
          headers: {
            'accept': 'application/json',
            'api-key': config.apiKey,
            'content-type': 'application/json'
          }
        }
      );
      console.log(response.data)
      return true;
    }catch(err){
      console.log(err)
      return false;
    }
  },
  /**
   * Get email template from database
   * @name mailService.template
   * @param {String} slug email template slug
   * @reject {Error}
   * @returns {Promise.<{body: String, subject: String}>} email template
   */
  template: function (slug) {
    return new Promise(function (resolve, reject) {
      db.email
        .findOne({ where: { slug } })
        .then((response) => {
          if (!response) {
            return reject(`TEMPLATE_NOT_FOUND`);
          } else resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  /**
   * Inject values into email template
   * @name mailService.inject
   * @param {{body: String, subject: String}} template email template
   * @param {Object.<string, string>} payload template values
   * @returns {{from: String, to: String, subject: String, text: String}}  Value injected email template
   */
  inject: function (template, payload) {
    let mailBody = template.body;
    let mailSubject = template.subject;

    for (const key in payload) {
      const value = payload[key];
      mailBody = mailBody.replace(new RegExp('{{{' + key + '}}}', 'g'), value);
    }

    for (const key in payload) {
      const value = payload[key];
      mailSubject = mailSubject.replace(
        new RegExp('{{{' + key + '}}}', 'g'),
        value,
      );
    }

    return {
      from: this.from,
      to: this.to,
      subject: mailSubject,
      html: mailBody,
    };
  },
  /**
   * Send email
   * @name mailService.send
   * @param {nodemailer.SendMailOptions} template email template
   * @reject {Error} send mail error
   * @returns {Promise.<nodemailer.SentMessageInfo>} send mail info
   */
  send: function (template) {
    let self = this;
    return new Promise(function (resolve, reject) {
      self.transport
        .sendMail(template)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  },
};
