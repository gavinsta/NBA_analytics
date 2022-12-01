import { User } from "../../../server/types/User";
import { UserQueryResponse } from "../../../server/types/UserQueryResponse"
import { PlayerQueryResponse } from "../../../server/types/PlayerQueryResponse";
import { SQLsearchterm } from "../../../server/types/QueryRequest"
import { Team } from "../../../server/types/Team";
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
    return ({ "status": "error", "title": `Search Failed`, "text": `${err}`, "players": [] })
  }
}

export const trySaveTeam = async (
  team: Team
): Promise<{ status: "error" | "success", title: string, text: string }> => {
  try {
    const res = await fetch("/saveteam", {
      method: 'Post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(team)
    });

    return await res.json();
  }
  catch (err) {
    console.log(err)
    return ({ "status": "error", "title": `Failed to save team`, "text": `${err}` })
  }
}

export const tryLoadTeam = async (
  team_id: string
): Promise<{ status: "error" | "success", title: string, text: string, team: Team | null }> => {
  try {
    const res = await fetch("/loadteam", {
      method: 'Post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(team_id)
    });

    return await res.json();
  }
  catch (err) {
    console.log(err)
    return ({ "status": "error", "title": `Failed to save team`, "text": `${err}`, team: null })
  }
}