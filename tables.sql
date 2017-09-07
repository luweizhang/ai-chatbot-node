--CREATE TABLE STATEMENTS

--table of all the users, can collect more data via facebook API
CREATE TABLE users (
   id             INT PRIMARY KEY NOT NULL,
   name           TEXT,
   age            INT,
   address        CHAR(200),
   salary         REAL
);

--history of all the messages sent
CREATE TABLE messages (
   id SERIAL PRIMARY KEY NOT NULL,
   user_id INT NOT NULL,
   message TEXT,
   message_time timestamptz  NOT NULL,
   bot boolean NOT NULL -- 1 or 0 whether it is a bot or not
);

--for storing data on people's weight
CREATE TABLE weight (
   id SERIAL PRIMARY KEY NOT NULL, --serial auto increments
   user_id bigint NOT NULL,
   weight        real  NOT NULL ,
   metric            varchar(10)     NOT NULL, --pounds or kg
   message_time timestamptz  NOT NULL
);

--for storing data on people's mood
CREATE TABLE mood (
   id SERIAL PRIMARY KEY NOT NULL, --serial auto increments
   user_id bigint NOT NULL,
   mood        int  NOT NULL ,
   message_time timestamptz  NOT NULL
);
--INSERT INTO mood (user_id, mood, message_time) VALUES(123, 10, current_timestamp)

--for storing data on people's accomplishments
CREATE TABLE accomplishment (
   id SERIAL PRIMARY KEY NOT NULL, --serial auto increments
   user_id bigint NOT NULL,
   accomplishment        varchar(1000)  NOT NULL ,
   message_time timestamptz  NOT NULL
);
--INSERT INTO accomplishment (user_id, accomplishment, message_time) VALUES(123, 'I took out the trash', current_timestamp)


--responses: large table of requests and possible responses, will be supplement with a model later on
-- idea: record things that the bot doesn't understand here and manually add responses later!
CREATE TABLE responses (
   id SERIAL PRIMARY KEY NOT NULL,  --serial auto increments
   message varchar(1000) NOT NULL,
   response varchar(1000) NOT NULL
);

INSERT INTO weight (user_id, weight, metric, message_time) VALUES(123, 128, 'lbs', current_timestamp);