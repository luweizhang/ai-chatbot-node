--CREATE TABLE STATEMENTS

--table of all the users, can collect more data via facebook API
CREATE TABLE users (
   id             INT PRIMARY KEY NOT NULL,
   name           TEXT,
   age            INT,
   address        CHAR(200),
   salary         REAL
);

CREATE TABLE messages (
   id SERIAL PRIMARY KEY NOT NULL,
   user_id INT NOT NULL,
   message TEXT,
   message_time timestamptz  NOT NULL,
   bot boolean NOT NULL -- 1 or 0 whether it is a bot or not
);

CREATE TABLE weight (
   id SERIAL PRIMARY KEY NOT NULL, --serial auto increments
   user_id INT NOT NULL,
   weight        real  NOT NULL ,
   metric            varchar(10)     NOT NULL, --pounds or kg
   message_time timestamptz  NOT NULL
);

INSERT INTO weight VALUES(sender, weight, metric, message_time);
INSERT INTO weight (user_id, weight, metric, message_time) VALUES(123, 128, 'lbs', current_timestamp);

