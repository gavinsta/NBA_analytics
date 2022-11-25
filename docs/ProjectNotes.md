# Git Notes
Removing something from the repo, but not locally:
https://stackoverflow.com/questions/6313126/how-do-i-remove-a-directory-from-a-git-repository

# Webapp notes

## Typescript Reference

React Cheat Sheet:
https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/

## Front-end

Chakra:
https://chakra-ui.com/docs/components/button

## Server-side

ExpressJS reference:
https://expressjs.com/en/guide/routing.html

# Future explorations

- Honeybadger.io

# MariaDB/SQL

### Setting up MariaDB in Docker

[From the MariaDB docs](https://mariadb.com/kb/en/installing-and-using-mariadb-via-docker/)


### Credentials for `mariadbtest`
Name of container: `mariadbtest`
PORT: 3306e

**Root credentials:**
USER: `root`
PASSWORD: `mypass`

**Gavin's credentials**
USER: `gavinsta`
PASSWORD: `mypass`

### Manually accessing Server through Docker:
```console
docker exec -it {CONTAINER_NAME} mariadb --user root -p{PASSWORD}
```

The above returned: `172.17.0.2` for our server.

Excerpt [from the MariaDB docs:](https://mariadb.com/kb/en/installing-and-using-mariadb-via-docker/)
>After enabling network connections in MariaDB as described above, we will be able to connect to the server from outside the container.

>On the host, run the client and set the server address ("-h") to the container's IP address that you found in the previous step:
>```
>mysql -h 172.17.0.2 -u root -p
>```
>This simple form of the connection should work in most situations. Depending on your configuration, it may also be necessary to specify the port for the server or to force TCP mode:
>```
>mysql -h 172.17.0.2 -P 3306 --protocol=TCP -u root -p
>```
### Connecting from outside the container
Find the IP address:
```console
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mariadbtest
```



### Granting Privileges
```sql
--For Local access
grant all privileges on DATABASE_NAME.* TO 'USER_NAME'@'localhost' identified by 'PASSWORD';
--For Remote access
grant all privileges on DATABASE_NAME.* TO 'USER_NAME'@'%' identified by 'PASSWORD';


```
From: https://docs.bitnami.com/aws/infrastructure/jruby/configuration/create-database-mariadb/

## Data handling

### Loading data into databse from CSV

```sql
LOAD DATA LOCAL INFILE 'source.csv' INTO target_db.target_table FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n';
```

https://www.simplified.guide/mysql-mariadb/import-csv

## `NBA_APP` database managment

### Table: `users`
This table will be used for registering users of the app. 
The table was created like so:
```sql
CREATE TABLE NBA_APP.users( 
  name VARCHAR(50) not null, 
  email VARCHAR(50) not null unique, 
  password VARCHAR(50) not null, 
  team_id VARCHAR(50),
  primary key(email));
```
#### New User Registration
We check for user registrations like so:

```sql
Select EXISTS(SELECT * From users where email = "") as userExists;
```
Once users 'register,' an SQL command inserts the new user's info like so:
```sql
insert into NBA_APP.users VALUES (
  'Gavin Lau',
  'gavin@datanerds.lol',
  'notsecure',
  null
  );

```