
import mariadb from "mariadb"
import dotenv from "dotenv";
import { User } from "../../types/User"
import { Player } from "../../types/Player"
import { UserQueryResponse } from "../../types/UserQueryResponse"
import { PlayerQueryResponse } from "../../types/PlayerQueryResponse"
import { SQLsearchterm } from "../../types/QueryRequest"
import { Team } from "../../types/Team"
import { SaveTeamFormat } from "../../types/SaveTeamFormat"
dotenv.config();
let port = 3306
if (process.env.DB_PORT) {
  port = parseInt(process.env.DB_PORT)
}
const PLAYER_TABLE = "playerStats_contracts_22_23"
const pool = mariadb.createPool({
  //In production we will use the docker container address
  host: process.env.DB_HOST,
  port: port,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
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
function createQueryStringFromSearchTerm(searchTerm: SQLsearchterm, stat: "avg" | "std"): string {
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

  query = query.concat(searchTerm.term + " ")
  let search = ''

  switch (searchTerm.comparator) {
    case "startsWith":
      search = "LIKE \"%" + searchTerm.value + "\" "
      break;
    case "endsWith":
      search = "LIKE \"" + searchTerm.value + "%\" "
      break;
    case "includes":
      search = "LIKE \"%" + searchTerm.value + "%\" "
      break;
    default:
      search = searchTerm.comparator + " " + searchTerm.value
  }

  query = query.concat(search);

  let orderby = 'DESC'

  if (searchTerm.comparator == ">" || searchTerm.comparator == ">=") {
    orderby = 'ASC'
  }
  query = query.concat(` AND stat = \"${stat}\" ORDER BY ${searchTerm.term} ${orderby} LIMIT 20`)
  console.log(`Query Created: ${query}`)
  return query;
}

export async function findPlayers(searchTerm: SQLsearchterm): Promise<PlayerQueryResponse> {
  //create a connection
  let conn;
  //easy reference to the SQL table

  //create SQL query- COERCE it just in case...
  searchTerm.type = "Player"
  var findPlayersQuery = createQueryStringFromSearchTerm(searchTerm, "avg")

  //response object
  const res: PlayerQueryResponse = {
    status: "info",
    text: '',
    title: '',
    players: [],
    playerMetas: []
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

      var statsResults = await conn.query(createQueryStringFromSearchTerm(searchTerm, "std"))
      for (var i = 0; i < queryResults.length; i++) {
        res.players.push(queryResults[i])
      }
      for (var i = 0; i < statsResults.length; i++) {
        res.playerMetas.push(statsResults[i])
      }

      res.status = "success"
      res.title = "Players found"
      res.text = "Select the ones you want!"
    }
  }
  catch (err) {
    res.status = "error"
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

export async function saveTeam(team: Team, email: string): Promise<{ status: string, title: string, text: string }> {
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
    var queryResults = await conn.query(existsQuery, team.name + "-" + team.owner)
    //console.log(queryResults.userExists)
    var nullArraySize = 15 - team.roster.length
    var queryArguments = []
    queryArguments.push(team.name + "-" + team.owner, team.name, team.year, team.budget)
    for (var i = 0; i < 15; i++) {
      if (i < team.roster.length) {
        queryArguments.push(team.roster[i].PlayerName)
      }
      else {
        queryArguments.push("NULL")
      }
    }
    queryArguments.push(team.owner)
    console.log(`Team Exists:`)
    console.log(queryResults[0].teamExists)
    if (queryResults[0].teamExists == 1) {
      //if team exists, replace it
      var insertionQuery = "Replace into teams (team_id,team_name,year,budget,player1,player2,player3,player4,player5,player6,player7,player8,player9,player10,player11,player12,player13,player14,player15,owner) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
      var result = await conn.query(insertionQuery, queryArguments)
      console.log(result)
      res.status = "success"
      res.title = "Team Updates Saved"
      res.text = "Changes to your team were saved."
    }
    else {
      //if team doesn't exist... insert it
      var insertionQuery = "Insert into teams (team_id,team_name,year,budget,player1,player2,player3,player4,player5,player6,player7,player8,player9,player10,player11,player12,player13,player14,player15,owner) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
      var result = await conn.query(insertionQuery, queryArguments)
      console.log(result)
      res.status = "success"
      res.title = "Team Saved"
      res.text = "Changes to your team were saved."
    }

    //finally update the user's record
    var updateQuery = "Update NBA_APP.users SET team_id = ? WHERE email = ?"
    var result = await conn.query(updateQuery, [team.name + "-" + team.owner, email])

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


export async function getTeams(): Promise<{ status: string, title: string, text: string, teams: SaveTeamFormat[] }> {
  let conn;
  const res: { status: string, title: string, text: string, teams: SaveTeamFormat[] } = {
    status: "error",
    title: '',
    text: '',
    teams: []
  }

  try {
    conn = await fetchConn();
    //TODO add support for finding only teams within your group.
    var query = "SELECT * From NBA_APP.teams"
    var result = await conn.query(query)
    console.log(result)
    res.status = "success"
    res.teams = result
  }
  catch (err) {
    res.status = "error"
    res.title = "Sorry..."
    res.text = "Error while trying to get all teams";
    console.error(err)
    //console.error(`${res.title}: ${res.text}`)
  }
  finally {
    if (conn) conn.end();
  }
  return res;
}
export async function getTeam(team_id: string): Promise<{ status: string, title: string, text: string, team: Team | null }> {
  let conn;
  const res: {
    status: "error" | "warning" | "success" | "info",
    text: string,
    title: string,
    team: Team | null
  } = {
    status: "info",
    text: "",
    title: "",
    team: null
  }

  let teamFormat: SaveTeamFormat | null = null;
  try {
    conn = await fetchConn();
    //check if the user already exists
    var existsQuery = "SELECT * From teams where team_id = ?;"
    //console.log(team_id)
    //console.log(`${existsQuery}  : ${team_id.toString()}`)
    var queryResults = await conn.query(existsQuery, team_id)
    //console.log(queryResults)
    if (queryResults.length !== 0) {
      res.status = "success"
      res.title = "Team Loaded"
      res.text = "Found your team."
      teamFormat = queryResults[0]
      //NEED TO DECRYPT INTO TEAM object 
      if (teamFormat && teamFormat.player1 == null) {
        res.status = "warning"
        res.title = "Empty Team Roster"
        res.text = "Try adding some players and saving"
      }
      else if (teamFormat == null) {
        res.status = "error"
        res.title = "Found Null team"
        res.text = "Strange error..."
      }
      else {
        //not an empty roster
        try {
          res.team = {
            name: teamFormat.team_name,
            year: teamFormat.year,
            budget: teamFormat.budget,
            roster: [],
            owner: teamFormat.owner
          }
          //get all the player names from the query
          let sqlList = "("
          for (const prop in teamFormat) {
            if (prop.startsWith("player")) {
              const val = teamFormat[prop as keyof SaveTeamFormat];
              if (val && val != "NULL") {
                const coerced: string = val.toString().replace("'", "\'");
                sqlList += "'" + coerced + "'" + ","
              }
            }
          }

          sqlList = sqlList.slice(0, -1)
          sqlList += ")"
          //transfer that array into a list string that will be usable...
          //TODO susceptable to injection attacks...
          var getAllPlayersQuery = `SELECT * From ${PLAYER_TABLE} WHERE PlayerName in ${sqlList} and stat = "avg"`
          const foundPlayers: Player[] = await conn.query(getAllPlayersQuery)
          for (var i = 0; i < foundPlayers.length; i++) {
            res.team.roster.push(foundPlayers[i])
          }
        }
        catch (err) {
          res.status = "error"
          res.title = "Sorry, could not load players in team!"
          res.text = "MariaDB gave this error:\n" + err
          console.log(err)
          console.log(`${res.title}: ${res.text}`)
          if (conn) conn.end()
        }
      }
    }
    else {

      res.status = "error"
      res.title = "Could not find your team"
      res.text = "It's a strange error... Let us know what went wrong :)"
    }
  }
  catch (err) {
    res.status = "error"
    res.title = "Sorry, could not load your team!"
    res.text = "MariaDB gave this error:\n" + err
    console.log(err)
    console.log(`${res.title}: ${res.text}`)
    if (conn) conn.end()
  }
  finally {
    if (conn) conn.end()
  }
  return res;
}

export async function getTeamMetaData(team_id: string): Promise<{ status: string, title: string, text: string, metaDatas: Player[] }> {
  let conn;
  const res: {
    status: "error" | "warning" | "success" | "info",
    text: string,
    title: string,
    metaDatas: Player[]
  } = {
    status: "info",
    text: "",
    title: "",
    metaDatas: []
  }

  let teamFormat: SaveTeamFormat | null = null;
  try {
    conn = await fetchConn();
    //check if the user already exists
    var existsQuery = "SELECT * From teams where team_id = ? Limit 1;"
    //console.log(team_id)
    //console.log(`${existsQuery}  : ${team_id.toString()}`)
    var queryResults = await conn.query(existsQuery, team_id)
    //console.log(queryResults)
    if (queryResults.length !== 0) {
      res.status = "success"
      res.title = "Stats data loaded"
      res.text = "Found your team."
      teamFormat = queryResults[0]
      //NEED TO DECRYPT INTO TEAM object 
      if (teamFormat == null) {
        res.status = "error"
        res.title = "Found Null team"
        res.text = "Strange error..."
      }
      else {
        //not an empty roster
        try {
          //get all the player names from the query
          let sqlList = "("
          for (const prop in teamFormat) {
            if (prop.startsWith("player")) {
              const val = teamFormat[prop as keyof typeof teamFormat];
              if (val && val != "NULL") {
                sqlList += "'" + val + "'" + ","
              }
            }
          }

          sqlList = sqlList.slice(0, -1)
          sqlList += ")"
          //transfer that array into a list string that will be usable...
          //TODO susceptable to injection attacks...
          var getAllPlayersQuery = `SELECT * From ${PLAYER_TABLE} WHERE PlayerName in ${sqlList} and stat = "std"`
          const foundPlayers: Player[] = await conn.query(getAllPlayersQuery)
          for (var i = 0; i < foundPlayers.length; i++) {
            res.metaDatas.push(foundPlayers[i])
          }
        }
        catch (err) {
          res.status = "error"
          res.title = "Sorry, could not load player metadatas in team!"
          res.text = "MariaDB gave this error:\n" + err
          console.log(err)
          console.log(`${res.title}: ${res.text}`)
          if (conn) conn.end()
        }
      }
    }
    else {

      res.status = "error"
      res.title = "Could not find your team"
      res.text = "It's a strange error... Let us know what went wrong :)"
    }
  }
  catch (err) {
    res.status = "error"
    res.title = "Sorry, could not load your team!"
    res.text = "MariaDB gave this error:\n" + err
    console.log(err)
    console.log(`${res.title}: ${res.text}`)
    if (conn) conn.end()
  }
  finally {
    if (conn) conn.end()
  }
  return res;
}


//TODO update team name
export async function updateTeamName(team_id: string) {
  //update team and users table
}
//newUser.team_id = createTeamName();
