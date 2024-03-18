create database realwebsite;
use realwebsite;

create table zakaznici(
	id int auto_increment primary key,
    username varchar(50) not null,
    email varchar(50) not null check(email like '%@%'),
    password varchar(200) not null
);
