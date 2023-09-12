-- This are the queries for the database creation.

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  is_faculty BOOLEAN NOT NULL
  );

CREATE TABLE resources (
  resource_id SERIAL PRIMARY KEY,
  name VARCHAR(250) NOT NULL,
  url VARCHAR(250) NOT NULL,
  description VARCHAR(500) NOT NULL,
  content_type VARCHAR(250) NOT NULL,
  stage VARCHAR(50) NOT NULL,
  creation_date TIMESTAMP DEFAULT NOW(),
  user_id INT NOT NULL,
  recommendation_type VARCHAR(50) NOT NULL,
  reason VARCHAR(250) NOT NULL,
  likes INT DEFAULT 0,
  dislikes INT DEFAULT 0,
  FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE tags (
  tag_id SERIAL PRIMARY KEY,
  resource_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  FOREIGN KEY(resource_id) REFERENCES resources(resource_id)
  );
  
CREATE TABLE favourites (
  favourite_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  resource_id INT NOT NULL,
  creation_date TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY(user_id) REFERENCES users(user_id),
  FOREIGN KEY(resource_id) REFERENCES resources(resource_id)
  );
  
CREATE TABLE comments (
  comment_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  resource_id INT NOT NULL,
  text VARCHAR(500) NOT NULL,
  FOREIGN KEY(resource_id) REFERENCES resources(resource_id),
  FOREIGN KEY(user_id) REFERENCES users(user_id)
  );