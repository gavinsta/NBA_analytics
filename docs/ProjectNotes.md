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

**App credentials**
USER: `app`
PASSWORD: `not@$ecret`

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



### GRANT notes
`GRANT ALL` examples:
```sql
--For Local access
grant all privileges on DATABASE_NAME.* TO 'USER_NAME'@'localhost' identified by 'PASSWORD';
--For all access
grant all privileges on DATABASE_NAME.* TO 'USER_NAME'@'%' identified by 'PASSWORD';
```
`GRANT` specific permissions:

For `'app'`:
```sql
grant select,insert,update on NBA_APP.users to 'app'@'%'
```
### CREATE user notes
```sql
CREATE user 'USER_NAME'@'%' identified by 'PASSWORD'
```


From: https://docs.bitnami.com/aws/infrastructure/jruby/configuration/create-database-mariadb/


## Data handling

### Loading data into databse from CSV

```sql
LOAD DATA LOCAL INFILE 'source.csv' INTO target_db.target_table FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n';
```
https://www.simplified.guide/mysql-mariadb/import-csv

For our `playerStats_perGame_22_23` table, the data was loaded like so:

```sql
--@block Insert data from csv
LOAD DATA LOCAL INFILE '/Users/gavinlau/Documents/MDSA/DATA604/NBA_app/basketball_data/playerstats-22.csv' INTO TABLE NBA_APP.playerStats_perGame_22_23 FIELDS TERMINATED BY ',' LINES TERMINATED BY '\n' IGNORE 1 LINES (
  --Dummy variable for the 'rank' column of the CSV
  @discardRK,
  Player,
  Pos,
  Age,
  Tm,
  G,
  GS,
  MP,
  FG,
  FGA,
  FGcent,
  3P,
  3PA,
  3Pcent,
  2P,
  2PA,
  2Pcent,
  eFGcent,
  FT,
  FTA,
  FTcent,
  ORB,
  DRB,
  TRB,
  AST,
  STL,
  BLK,
  TOV,
  PF,
  PTS,
  Player_additional
);
```

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

## Troubleshooting Links
- Problem: Issues with app having the appropritate permissions when constructing a team-view
    - Solution from [GRANT INSERT on tables participating in an updateable view](https://stackoverflow.com/questions/45675205/grant-insert-on-tables-participating-in-an-updateable-view)
- 

# Additional stuff

Comments on each column of the data
```sql
COMMENT ON Rk IS "Rank",
COMMENT = "Position",
COMMENT = "Team",
COMMENT = "Games",
COMMENT = "Games Started",
COMMENT = "Minutes Played",
COMMENT = "Field Goals Per Game",
COMMENT = "Field Goal Attempts Per Game",
COMMENT = "Field Goal Percentage",
COMMENT = "3-Point Field Goals Per Game",
 COMMENT = "3-Point Field Goals Attempted Per Game",
  COMMENT = "3-Point Field Goal Percentage",
  COMMENT = "2-Point Field Goals Per Game",
  COMMENT = "2-Point Field Goals Attempted Per Game",
  COMMENT = "2-Point Field Goal Percentage",
  COMMENT = "Effective Field Goal Percentage",
  COMMENT = "Free Throws Per Game",
  COMMENT = "Free Throw Attempts Per Game",
  COMMENT = "Free Throw Percentage",
  COMMENT = "Offensive Rebounds Per Game",
  COMMENT = "Defensive Rebounds Per Game",
  COMMENT = "Total Rebounds Per Game",
  COMMENT = "Assists Per Game",
  COMMENT = "Steals Per Game",
  COMMENT = "Blocks Per Game",
  COMMENT = "Turnovers Per Game",
  COMMENT = "Personal Fouls Per Game",
  COMMENT = "Points Per Game",
```