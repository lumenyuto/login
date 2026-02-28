CREATE TABLE users
(
    id    SERIAL PRIMARY KEY,
    name  TEXT NOT NULL,
    sub   TEXT UNIQUE,
    email TEXT
);
