//postgresql connection
var connectionString = process.env.DATABASE_URL

//postgres://ytlimopprhbhyc:3dbba39aae816e59dcb13022ace6bd2400236df5cde5cab7f3cca88b06cf8f64@ec2-107-22-211-182.compute-1.amazonaws.com:5432/d737pgn8g441di

pg.connect(connectionString, function(err, client, done) {
   client.query('SELECT * FROM your_table', function(err, result) {
      done();
      if(err) return console.error(err);
      console.log(result.rows);
   });
});


//queries to interact with the db
