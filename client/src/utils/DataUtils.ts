import { User } from "../../../server/types/User";

export const getUser = async <T>(
  url: string,
  email: string,
  password: string
)
  : Promise<T> => {
  const res = await fetch(url, {
    method: 'Post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  return await res.json();
}

export const tryCreateNewUser = async <T>(
  url: string,
  user: User
)
  : Promise<T> => {
  const res = await fetch(url, {
    method: 'Post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(user)
  });

  return await res.json();
}