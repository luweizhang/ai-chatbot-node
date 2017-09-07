//sample database request
app.get('/db', function (request, response) {
  pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send({results: result.rows} ); }
    });
  });
});

//store the weight
app.post('/db/weight', (req, res, next) => {
  const results = [];
  const data = {user_id: req.body.user_id || '123' , weight: req.body.weight || 123, metric: req.body.metric || 'lbs'};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO weight (user_id, weight, metric, message_time) values($1, $2, $3, current_timestamp);',
    [data.user_id, data.weight, data.metric]);
  done();
  return res.status(200).json({success: true,message: 'inserted weight record'})
  });
});