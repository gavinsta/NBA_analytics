import { User } from "../../../server/types/User";
import { UserQueryResponse } from "../../../server/types/QueryResponse"
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