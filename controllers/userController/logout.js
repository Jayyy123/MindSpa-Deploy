'use strict';

module.exports = (app, db) => {
  app.get('/member/logout', async function (req, res, next) {
  req.session.destroy(function(err) {
    req.session = {}
  })

  return res.redirect("/member/login")
});

};
