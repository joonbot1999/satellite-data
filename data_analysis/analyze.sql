
DROP DATABASE IF EXISTS analyze;

CREATE DATABASE analyze;
USE analyze;

DROP TABLE IF EXISTS Analysis;

CREATE TABLE Analysis(
  Times INT(30) NOT NULL,
  Satellite INT(30) NOT NULL,
  Type INT(30) NOT NULL,

  -- an "id" column is often used for a PRIMARY KEY, but name
  -- could also be a PRIMARY KEY if guaranteed unique
  PRIMARY KEY(Times)
);
