import { User } from "../../../server/types/User";
import { UserQueryResponse } from "../../../server/types/UserQueryResponse"
import { PlayerQueryResponse } from "../../../server/types/PlayerQueryResponse";
import { SQLsearchterm } from "../../../server/types/QueryRequest"
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