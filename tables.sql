--CREATE TABLE STATEMENTS

/*
Database schema design.

users table:
description: table of all the users
schema: user_id, name, location, age
additional notes: we can collect this data either through facebook API or through some other means

messages table:
descr: history of all the conversations from all the users
schema: user_id, message, timestamp, bot (0 or 1, what is the user)
*/

CREATE TABLE users (
   id            	INT PRIMARY KEY NOT NULL,
   name           TEXT,
   age            INT,
   address        CHAR(200),
   salary         REAL
);

CREATE TABLE messages (
   user_id INT PRIMARY KEY NOT NULL,
   message TEXT,
   message_time timestamp NOT NULL,
   bot boolean NOT NULL
);

CREATE TABLE weight (
   user_id INT PRIMARY KEY NOT NULL,
   weight        real  NOT NULL ,
   metric            varchar(10)     NOT NULL, --pounds or kg
   message_time timestamp NOT NULL,
);