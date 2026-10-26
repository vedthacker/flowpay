create database if not exists flowbank;
use flowbank;

create table accounts (
  id int auto_increment primary key,
  account_no varchar(30) not null unique,
  holder varchar(100) not null,
  pin varchar(255) not null,
  balance decimal(14,2) default 0
);

create table bank_transactions (
  id int auto_increment primary key,
  from_account varchar(30) not null,
  to_account varchar(30) not null,
  amount decimal(14,2) not null,
  created_at timestamp default current_timestamp
);

insert into accounts (account_no, holder, pin, balance) values
('1001', 'Amit Shah', '$2a$10$J2dvD6je32zFP/nDBa9yxOrocP8cVOQvKV7onOUhdnSYbjD4pR5va', 50000),
('1002', 'Riya Patel', '$2a$10$W/cCovC22FgwSngt/uu6pellQ5Ig9k.Ng2oELEYyQyLI.eWM8c/Ba', 50000),
('1003', 'Ved Thacker', '$2a$10$d0GGgbxSnWr4XMqZO.UwSOiE5rF6ynU7GOcMgH/.Lc/u9SGov.So2', 50000),
('FLOWPAY-MASTER', 'FlowPay Master Wallet', '$2a$10$mptPIYEU2K98M9KBY7lyd.UJPOua6zHRTdT7UNuNcqnaUuaQ1CAGy', 0),
('FLOWPAY-OWNER', 'FlowPay Company Account', '$2a$10$GCj/HwEshIdaKrRekpIWzuWHcuARn1f6YPMhnedZLZyxt8k1fPZw2', 10000000);
