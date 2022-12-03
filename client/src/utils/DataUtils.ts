import { User } from "../../../server/types/User";
import { UserQueryResponse } from "../../../server/types/UserQueryResponse"
import { PlayerQueryResponse } from "../../../server/types/PlayerQueryResponse";
import { SaveTeamFormat } from "../../../server/types/SaveTeamFormat"
import { SQLsearchterm } from "../../../server/types/QueryRequest"
import { Team } from "../../../server/types/Team";
import { Player } from "../../../server/types/Player";
export const tryGetUser = async (
  url: string,
  email: string,
  password: string
)
  : Promise<UserQueryResponse> => {
  try {
    const res = await fetch(url, {
      method: 'Post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    return await res.json();
  }
  catch (err) {
    console.log(err)
    return ({ "status": "error", "title": `Server is likely down`, "text": `${err}`, "user": null })
  }
}

export const tryCreateNewUser = async (
  url: string,
  user: User
)
  : Promise<UserQueryResponse> => {
  try {
    const res = await fetch(url, {
      method: 'Post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    return await res.json();
  }
  catch (err) {
    console.log(err)
    return ({ "status": "error", "title": `Server is likely down`, "text": `${err}`, "user": null })
  }
}

interface FindRoomResponse {
  status: "success" | "error",
  title: string,
  text: string,
  roomCode: string | null,
}
export const tryFindRoom = async (
  url: string,
  roomCode: string,
  email: string
)
  : Promise<FindRoomResponse> => {
  try {
    const res = await fetch(url, {
      method: 'Post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ roomCode, email })
    });

    return await res.json();
  }
  catch (err) {
    console.log(err)
    return ({ "status": "error", "title": `Server is likely down`, "text": `${err}`, "roomCode": null })
  }
}

export const trySearchDatabase = async (
  url: string,
  search: SQLsearchterm
)
  : Promise<PlayerQueryResponse> => {
  try {
    const res = await fetch(url, {
      method: 'Post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(search)
    });

    return await res.json();
  }
  catch (err) {
    console.log(err)
    return ({ "status": "error", "title": `Search Failed`, "text": `${err}`, "players": [], "playerMetas": [] })
  }
}

export const trySaveTeam = async (
  url: string,
  team: Team
): Promise<{ status: "error" | "success", title: string, text: string }> => {
  try {
    const teamString = JSON.stringify(team)
    console.log(teamString)
    const res = await fetch(url + "/saveteam", {
      method: 'Post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ "team": team })
    });
    console.log("package away")
    return await res.json();
  }
  catch (err) {
    console.log(err)
    return ({ "status": "error", "title": `Failed to save team`, "text": `${err}` })
  }
}

export const tryLoadTeam = async (
  url: string,
  team_id: string
): Promise<{ status: "error" | "success", title: string, text: string, team: Team | null }> => {
  try {
    const res = await fetch(url + "/loadteam", {
      method: 'Post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ team_id })
    });

    return await res.json();
  }
  catch (err) {
    console.log(err)
    return ({ "status": "error", "title": `Failed to save team`, "text": `${err}`, team: null })
  }
}

export const tryLoadTeamMetadata = async (
  url: string,
  team_id: string
): Promise<{ status: "error" | "success", title: string, text: string, metaDatas: Player[] }> => {

  try {
    const res = await fetch(url + "/loadteammetadata", {
      method: 'Post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ team_id })
    });

    const result = await res.json();
    if (result) {
      return ({ "status": "success", "title": `Metadata retrieved`, "text": '', metaDatas: result.metaDatas })
    }
    else return ({ "status": "error", "title": `Failed to load team meta data`, "text": `Result was null`, metaDatas: [] })
  }
  catch (err) {
    console.log(err)
    return ({ "status": "error", "title": `Failed to load team meta data`, "text": `${err}`, metaDatas: [] })
  }
}

export const getAllTeams = async (url: string): Promise<{ status: "error" | "success", title: string, text: string, teams: SaveTeamFormat[] }> => {
  try {
    const res = await fetch(url + "/allteams", {
      method: 'Get',
      headers: {
        'Content-type': 'application/json'
      },
    });

    return await res.json();
  }
  catch (err) {
    console.log(err)
    return ({ "status": "error", "title": `Failed to load teams`, "text": `${err}`, teams: [] })
  }
}

export const collectPlayerNames = (team: SaveTeamFormat): string[] => {
  const playerNames: string[] = [];
  if (team.player1)
    playerNames.push(team.player1);
  if (team.player2)
    playerNames.push(team.player2);
  if (team.player3)
    playerNames.push(team.player3);
  if (team.player4)
    playerNames.push(team.player4);
  if (team.player5)
    playerNames.push(team.player5);
  if (team.player6)
    playerNames.push(team.player6);
  if (team.player7)
    playerNames.push(team.player7);
  if (team.player8)
    playerNames.push(team.player8);
  if (team.player9)
    playerNames.push(team.player9);
  if (team.player10)
    playerNames.push(team.player10);
  if (team.player11)
    playerNames.push(team.player11);
  if (team.player12)
    playerNames.push(team.player12);
  if (team.player13)
    playerNames.push(team.player13);
  if (team.player14)
    playerNames.push(team.player14);
  if (team.player15)
    playerNames.push(team.player15);
  return playerNames;
}