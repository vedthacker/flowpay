create database if not exists flowpay;
use flowpay;

create table users (
  id int auto_increment primary key,
  name varchar(100) not null,
  email varchar(100) not null unique,
  password varchar(255) not null,
  role enum('user','admin') default 'user',
  balance decimal(12,2) default 0,
  pay_limit decimal(12,2) default 0
);

create table transactions (
  id int auto_increment primary key,
  user_id int not null,
  type varchar(20) not null,
  amount decimal(12,2) not null,
  other_party varchar(100),
  created_at timestamp default current_timestamp,
  foreign key (user_id) references users(id)
);

create table splits (
  id int auto_increment primary key,
  from_id int not null,
  to_id int not null,
  amount decimal(12,2) not null,
  status varchar(10) default 'pending',
  foreign key (from_id) references users(id),
  foreign key (to_id) references users(id)
);

create table company (
  id int primary key,
  pool decimal(14,2) default 0
);

insert into company (id, pool) values (1, 0);

insert into users (name, email, password, role) values ('Admin', 'admin@flowpay.com', '$2a$10$VR.Zk9AOajRkRLsuboqe4e1hlZOsUQQtJBcEU5/LTWavLghjSR1j.', 'admin');
