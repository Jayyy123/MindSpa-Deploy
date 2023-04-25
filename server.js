const app = require('./app');
app.set('port', process.env.NODE_PORT);
app.listen(app.get('port'), () => {
  const port = app.get('port');
  console.log('Node Server Running at http://localhost:' + port);
});
