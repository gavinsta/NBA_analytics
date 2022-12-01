import express, { Express, Request, Response } from "express"
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { User } from "../types/User"
import { Team } from "../types/Team"
import * as dbAccess from "./utils/DatabaseAccess"
import { SQLsearchterm } from "../types/QueryRequest";
import { SaveTeamFormat } from "../types/SaveTeamFormat"
interface LoginFormInputs {
  email: string,
  password: string
}

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json())
const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));

  app.get('/*', function (req: Request, res: Response) {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
  });
}
else {
  app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Hello World From the Typescript Server!</h1>')
  });
}
app.post('/login', async (req: Request, res: Response) => {
  const { email, password }: LoginFormInputs = req.body;
  console.log(`${email} + ${password}`)

  const result = await dbAccess.findUser(email, password);
  if (!result.user) {
    return res.status(404).json({ status: "error", title: result.title, text: result.text, user: null })
  }

  console.log("Success!")
  return res.status(200).json({ status: "success", title: result.title, text: result.text, user: result.user })
});

app.post('/signup', async (req: Request, res: Response) => {
  const newUser: User = req.body;
  console.log(`Trying to add ${newUser.name} at ${newUser.email}`);

  const result = await dbAccess.createUser(newUser);
  if (!result.user) {
    return res.status(404).json({ status: "error", title: result.title, text: result.text, user: null })
  }

  console.log("Success!")
  return res.status(200).json({ status: "success", title: result.title, text: result.text, user: result.user })
});

app.post('/joinroom', async (req: Request, res: Response) => {
  const { roomCode, email } = req.body;
  const mode = "join"
  console.log(`${mode.toUpperCase()} + ${roomCode}`)

  const result = await dbAccess.findRoom(roomCode, mode, email);
  if (result.status === "error") {
    return res.status(404).json({ status: "error", title: result.title, text: result.text })
  }

  console.log("Success!")
  return res.status(200).json({ status: "success", title: result.title, text: result.text })
});
app.post('/createroom', async (req: Request, res: Response) => {
  const { roomCode, email } = req.body;
  const mode = "create"
  console.log(`${mode.toUpperCase()} + ${roomCode}`)

  const result = await dbAccess.findRoom(roomCode, mode, email);
  if (result.status === "error") {
    return res.status(404).json({ status: "error", title: result.title, text: result.text })
  }

  console.log("Success!")
  return res.status(200).json({ status: "success", title: result.title, text: result.text })
});
app.post('/search', async (req: Request, res: Response) => {
  const search: SQLsearchterm = req.body
  console.log(search)

  if (search.type === "Player") {
    const result = await dbAccess.findPlayers(search)

    if (!result.players) {
      return res.status(404).json({ status: "error", title: result.title, text: result.text, players: [], playerMetas: [] })
    }
    else {
      return res.status(200).json({ status: "success", title: result.title, text: result.text, players: result.players, playerMetas: result.playerMetas })
    }
  }
  //TODO add in team search
})

app.post('/saveteam', async (req: Request, res: Response) => {
  //prep the saveteam object
  if (!req.body) {
    return res.status(404).json({ status: "error", title: "No Team received", text: "" })
  }
  const team: Team = req.body.team;

  const result = await dbAccess.saveTeam(team)
  const saveTeam: SaveTeamFormat = {
    team_id: team.name,
    team_name: team.name,
    year: team.year,
    budget: team.budget,
    player1: team.roster[0]?.PlayerName,
    player2: team.roster[1]?.PlayerName,
    player3: team.roster[2]?.PlayerName,
    player4: team.roster[3]?.PlayerName,
    player5: team.roster[4]?.PlayerName,
    player6: team.roster[5]?.PlayerName,
    player7: team.roster[6]?.PlayerName,
    player8: team.roster[7]?.PlayerName,
    player9: team.roster[8]?.PlayerName,
    player10: team.roster[9]?.PlayerName,
    player11: team.roster[10]?.PlayerName,
    player12: team.roster[11]?.PlayerName,
    player13: team.roster[12]?.PlayerName,
    player14: team.roster[13]?.PlayerName,
    player15: team.roster[14]?.PlayerName,
  }

  return res.status(200).json({ status: result.status, title: result.title, text: result.text })
})


app.post('/loadteam', async (req: Request, res: Response) => {
  //prep the saveteam object
  if (!req.body) {
    return res.status(404).json({ status: "error", title: "No Team received", text: "" })
  }
  const team_id: string = req.body;
  const result = await dbAccess.getTeamFormat(team_id)

  return res.status(200).json({ status: result.status, title: result.title, text: result.text, team: result.team })
})
app.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
});