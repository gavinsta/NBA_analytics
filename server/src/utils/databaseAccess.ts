
import mariadb from "mariadb"
import { User } from "../../types/User"
import { Player } from "../../types/Player"
import { UserQueryResponse } from "../../types/UserQueryResponse"
import { PlayerQueryResponse } from "../../types/PlayerQueryResponse"
import { SQLsearchterm } from "../../types/QueryRequest"
import createTeamName from "../utils/TeamNameGenerator"
import { Team } from "../../types/Team"
import { SaveTeamFormat } from "../../types/SaveTeamFormat"
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
      newUser.team_id = createTeamName();
      var insertionQuery = `Insert into users (name,email,password,room_id,team_id) VALUES (?,?,?,NULL,?);`
      var result = await conn.query(insertionQuery, [newUser.name, newUser.email, newUser.password, newUser.team_id])
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

interface FindRoomResponse {
  status: "success" | "error",
  title: string,
  text: string,
  roomCode: string | null,
}
export async function findRoom(roomCode: string, mode: "join" | "create", email: string): Promise<{ status: "error" | "success", title: string, text: string }> {
  let conn;
  const res: FindRoomResponse = {
    roomCode: null,
    status: "error",
    title: '',
    text: ''
  }

  let roomExists = 0;
  try {
    conn = await fetchConn();

    var existsQuery = "Select EXISTS(SELECT * From NBA_APP.rooms_index where room_id = ?) as roomExists;"
    var result = await conn.query(existsQuery, roomCode)
    console.log(result)
    roomExists = result[0].roomExists;
    console.log(`Does room ${roomCode} exist: ${roomExists}`)
  }
  catch (err) {
    res.status = "error"
    res.title = "Sorry..."
    res.text = "Error while trying to connect to NBA_APP MariaDB";
    console.error(err)
    //console.error(`${res.title}: ${res.text}`)
    if (conn) conn.end();
    return res;
  }

  if (mode == "join" && roomExists) {
    try {
      var query = "UPDATE NBA_APP.users SET room_id = ? WHERE email = ?"
      var result = await conn.query(query, [roomCode, email])
      console.log(result)
      res.status = "success";
      res.title = "Joining Room";
      res.text = "Found your room!";
    }
    catch (err) {
      res.status = "error"
      res.title = "Sorry..."
      res.text = `Error while trying to join Room ${roomCode}`;
      console.error(err)
      //console.error(`${res.title}: ${res.text}`)
    }
    finally {
      if (conn) conn.end()
    }
  }
  else if (mode == "create" && !roomExists) {
    //create a new room if there is none!
    try {
      var createRoomQuery = "Insert into NBA_APP.rooms_index (host_email,room_id,max_budget,mode,private,description) VALUES (?,?,140000000,\"test\",1,\"Another Room\");"
      //TODO tweak other settings later
      var createRoomResponse = await conn.query(createRoomQuery, [email, roomCode])
      console.log(createRoomResponse)
      var query = "UPDATE NBA_APP.users SET room_id = ? WHERE email = ?"
      var result = await conn.query(query, [roomCode, email])
      console.log(result)
      res.status = "success";
      res.title = "Created Room";
      res.text = "Joining new room. You are the host!";
    }
    catch (err) {
      res.status = "error"
      res.title = "Sorry..."
      res.text = `Error while trying to create Room ${roomCode}`;
      console.error(err)
      //console.error(`${res.title}: ${res.text}`)
    }
    finally {
      if (conn) conn.end()
    }
  }
  else if (mode === "create" && roomExists) {
    res.status = "error"
    res.title = `Room ${roomCode} already exists`
    res.text = `Try joining instead!`;
  }
  else {
    res.status = "error"
    res.title = `Room ${roomCode} does not exist`
    res.text = `Did you mean to create a new one?`;
  }
  return res;
}
//TODO finish Leave Room funciton and create !
export async function leaveRoom(email: string, roomCode: string) {
  let conn;
  try {
    conn = await fetchConn()

    var existsQuery = "Select EXISTS(SELECT * From NBA_APP.rooms_index where room_id = ? and host_email = ?) as isHost;"
    var result = await conn.query(existsQuery, [roomCode, email])
    if (result.isHost) {
      var deleteRoom = await conn.query
    }
    var query = "UPDATE NBA_APP.users SET room_id = NULL WHERE email = ?"
    var result = await conn.query(query, email)
  }
  catch {

  }
}
//TODO write close room function
function closeRoom() {

}

export async function saveTeam(team: Team): Promise<{ status: string, title: string, text: string }> {
  let conn;
  const res = {
    status: "info",
    text: "",
    title: ""
  }
  try {
    conn = await fetchConn();

    //check if the user already exists
    var existsQuery = "Select EXISTS(SELECT * From teams where team_id = ?) as teamExists;"
    var queryResults = await conn.query(existsQuery, team.name)
    //console.log(queryResults.userExists)
    var nullArraySize = 15 - team.roster.length
    var queryArguments = []
    queryArguments.push(team.name, team.year, team.budget)
    for (var i = 0; i < 15; i++) {
      if (i < team.roster.length) {
        queryArguments.push(team.roster[i])
      }
      else {
        queryArguments.push("NULL")
      }
    }
    if (queryResults.teamExists) {
      //if team exists, replace it
      var insertionQuery = `Replace into teams (name,year,budget,player1,player2,player3,player4,player5,player6,player7,player8,player9,player10,player11,player12,player13,player14,player15)`
      var result = await conn.query(insertionQuery, queryArguments)
      console.log(result)
      res.status = "success"
      res.title = "Team Updates Saved"
      res.text = "Changes to your team were saved."
    }
    else {
      //if team exists, replace it
      var insertionQuery = `Insert into teams (name,year,budget,player1,player2,player3,player4,player5,player6,player7,player8,player9,player10,player11,player12,player13,player14,player15)`
      var result = await conn.query(insertionQuery, queryArguments)
      console.log(result)
      res.status = "success"
      res.title = "Team Saved"
      res.text = "Changes to your team were saved."
    }
  }
  catch (err) {
    res.status = "error"
    res.title = "Sorry, could not save your team!"
    res.text = "MariaDB gave this error:\n" + err
    console.log(err)
    console.log(`${res.title}: ${res.text}`)
  }
  finally {
    if (conn) conn.end()
  }
  return res;
}


export async function getTeamFormat(team_id: string): Promise<{ status: string, title: string, text: string, team: SaveTeamFormat | null }> {
  let conn;
  const res = {
    status: "info",
    text: "",
    title: "",
    team: null
  }
  try {
    conn = await fetchConn();

    //check if the user already exists
    var existsQuery = "SELECT * From teams where team_id = ?;"
    var queryResults = await conn.query(existsQuery, team_id)
    if (queryResults.length !== 0) {
      res.status = "success"
      res.title = "Team Loaded"
      res.text = "Found your team."
      res.team = queryResults[0]
    }
    else {

      res.status = "error"
      res.title = "Could not find your team"
      res.text = "Strange error..."
    }
  }
  catch (err) {
    res.status = "error"
    res.title = "Sorry, could not save your team!"
    res.text = "MariaDB gave this error:\n" + err
    console.log(err)
    console.log(`${res.title}: ${res.text}`)
  }
  finally {
    if (conn) conn.end()
  }
  return res;
}
