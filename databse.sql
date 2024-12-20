CREATE TABLE employer(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    dagree VARCHAR(80) NOT NULL,
    salary NUMERIC(15) NOT NULL
    job_id BIGINT REFERENCES job(id)
);

CREATE TABLE job(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(80) NOT NULL
)