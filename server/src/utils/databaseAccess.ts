
import mariadb from "mariadb"
import { User } from "../../types/User"
import { Player } from "../../types/Player"
import { UserQueryResponse } from "../../types/UserQueryResponse"
import { PlayerQueryResponse } from "../../types/PlayerQueryResponse"
import { SQLsearchterm } from "../../types/QueryRequest"
import { query } from "express"
const pool = mariadb.createPool({
  //In production we will use the docker container address
  host: process.env.NODE_ENV === 'production' ? "172.17.0.2" : "127.0.0.1",
  port: 3306,
  user: "app",
  password: "not@$ecret",
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

    var foundUser = result[0]
    if (foundUser !== undefined) {
      res.user = result[0]
      res.status = "success";
      res.title = "User Found";
      res.text = "Logging in";
    }
    else {
      res.user = null
      res.status = "error";
      res.title = "Invalid Email or Password";
      res.text = "If you don't have an account yet, sign up now!";
    }
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
    //console.log(queryResults.userExists)
    if (queryResults.userExists) {
      //if user exists, return an error message
      res.status = "error"
      res.title = "Could not create new user!"
      res.text = "Email is already registered"
    }
    else {

      var insertionQuery = `Insert into users (name,email,password,room_id,team_id) VALUES (?,?,?,NULL,NULL);`
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
    res.text = "Error while trying to connect to NBA_APP MariaDB: " + err
    console.log(err)
    console.log(`${res.title}: ${res.text}`)
  }
  finally {
    if (conn) conn.end()
  }
  return res;
}
function createQueryStringFromSearchTerm(searchTerm: SQLsearchterm): string {
  const PLAYER_TABLE = "playerstats_contracts_22_23"
  //TODO add the TEAM table to MariaDB
  const TEAM_TABLE = ""
  let query = "SELECT * FROM "
  if (searchTerm.type == "Team") {
    query = query.concat(TEAM_TABLE)
  }
  else {
    query = query.concat(PLAYER_TABLE)
  }

  query = query.concat(" WHERE ")

  query = query.concat(searchTerm.criteria + " ")
  let search = ''

  switch (searchTerm.comparator) {
    case "startsWith":
      search = "LIKE \"%" + searchTerm.term + "\" "
      break;
    case "endsWith":
      search = "LIKE \"" + searchTerm.term + "%\" "
      break;
    case "includes":
      search = "LIKE \"%" + searchTerm.term + "%\" "
      break;
    default:
      search = searchTerm.comparator + " " + searchTerm.term
  }

  query = query.concat(search);
  query = query.concat(" AND stat = \"avg\"")
  console.log(`Query Created: ${query}`)
  return query;
}
export async function findPlayers(searchTerm: SQLsearchterm): Promise<PlayerQueryResponse> {
  //create a connection
  let conn;
  //easy reference to the SQL table

  //create SQL query- COERCE it just in case...
  searchTerm.type = "Player"
  var findPlayersQuery = createQueryStringFromSearchTerm(searchTerm)

  //response object
  const res: PlayerQueryResponse = {
    status: "info",
    text: '',
    title: '',
    players: []
  }
  try {
    conn = await fetchConn();

    //check if the user already exists

    var queryResults = await conn.query(findPlayersQuery)
    console.log(queryResults)
    if (queryResults.length === 0) {
      //if players exists that match this query, return an error message
      res.status = "error"
      res.title = "No Results"
      res.text = "Could not find any players that matched"
    }
    else {
      for (var i = 0; i < queryResults.length; i++) {
        res.players.push(queryResults[i])
      }
      res.status = "success"
      res.title = "Players found"
      res.text = "Select the ones you want!"
    }
  }
  catch (err) {
    res.title = "Sorry, could not search for player!"
    res.text = "Error while trying to connect to NBA_APP MariaDB"
    console.log(err)
    console.log(`${res.title}: ${res.text}`)
  }
  finally {
    if (conn) conn.end()
  }
  return res;
}