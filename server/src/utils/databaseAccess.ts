
import mariadb from "mariadb"
import { User } from "../../types/User"
import { UserQueryResponse } from "../../types/QueryResponse"
const pool = mariadb.createPool({
  //In production we will use the docker container address
  host: process.env.NODE_ENV === 'production' ? "172.17.0.2" : "127.0.0.1",
  port: 3306,
  user: "root",
  password: "mypass",
  database: "NBA_APP"
})

export const getConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection().then((connection) => {
      resolve(connection);
    }).catch((error) => {
      reject(error);
    })
  })
}

// Fetch Connection
export async function fetchConn() {
  let conn = await pool.getConnection();
  console.log("Total connections: ", pool.totalConnections());
  console.log("Active connections: ", pool.activeConnections());
  console.log("Idle connections: ", pool.idleConnections());
  return conn;
}

export async function findUser(email: string, password: string): Promise<UserQueryResponse> {
  let conn;
  const res: UserQueryResponse = {
    "status": "info",
    "text": null,
    "title": '',
    "user": null
  }
  try {
    conn = await fetchConn();
    var query = "select * from users where email = ? AND password = ? LIMIT 1"
    var result = await conn.query(query, [email, password])
    console.log(result)
    res.user = result[0]
    res.status = "success";
    res.title = "User Found";
    res.text = "Logging in";
  }
  catch (err) {
    res.status = "error"
    res.title = "Sorry..."
    res.text = "Error while trying to connect to NBA_APP MariaDB";
    console.error(err)
    //console.error(`${res.title}: ${res.text}`)
  }
  finally {
    if (conn) conn.end()
  }
  return res;
}

export async function createUser(newUser: User): Promise<UserQueryResponse> {
  let conn;
  const res: UserQueryResponse = {
    status: "info",
    text: null,
    title: '',
    user: null
  }
  try {
    conn = await fetchConn();

    //check if the user already exists
    var existsQuery = "Select EXISTS(SELECT * From users where email = ?) as userExists;"
    var queryResults = await conn.query(existsQuery, newUser.email)
    console.log(queryResults.userExists)
    if (queryResults.userExists) {
      //if user exists, return an error message
      res.status = "error"
      res.title = "Could not create new user!"
      res.text = "Email is already registered"
    }
    else {

      var insertionQuery = `Insert into users (name,email,password,team_id) 
VALUES (?,?,?,NULL);`
      var result = await conn.query(insertionQuery, [newUser.name, newUser.email, newUser.password])
      console.log(result)
      res.user = newUser
      res.status = "success"
      res.title = "New user created!"
      res.text = "Go to the log in page"
    }
  }
  catch (err) {
    res.title = "Sorry, could not create new user!"
    res.text = "Error while trying to connect to NBA_APP MariaDB"
    console.log(err)
    console.log(`${res.title}: ${res.text}`)
  }
  finally {
    if (conn) conn.end()
  }
  return res;
}