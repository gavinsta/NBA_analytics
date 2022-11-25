import express, { Express, Request, Response } from "express"
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { User } from "../types/User"
import * as dbAccess from "./utils/DatabaseAccess"
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

  /* OLD CODE USING A JS LIST
  const user = users.find(user => {
    return user.email === email && user.password === password
  });
*/
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
  /*
  const existingUser = users.find(user => {
    return user.email === newUser.email
  });

  if (!existingUser) {
    newUser.id = users.length;
    users.push(newUser)
    res.send({ status: "success", title: "New User Created!", text: "Have fun!", user: newUser })
  }
  else {
    res.send({ status: "error", title: "User already exists!", text: "Try a different email.", user: null })
  }
  */
  const result = await dbAccess.createUser(newUser);
  if (!result.user) {
    return res.status(404).json({ status: "error", title: result.title, text: result.text, user: null })
  }

  console.log("Success!")
  return res.status(200).json({ status: "success", title: result.title, text: result.text, user: result.user })
});
app.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
});