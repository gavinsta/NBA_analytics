import express, { Express, Request, Response } from "express"
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { User } from "../types/User"
interface LoginFormInputs {
  email: string,
  password: string
}
const users: User[] = [
  {
    id: 1,
    name: "Gavin Lau",
    email: "testmail@gmail.com",
    password: "123"
  },
]

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json())
const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('/*', function (req: Request, res: Response) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}
else {
  app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Hello World From the Typescript Server!</h1>')
  });
}
app.post('/login', (req: Request, res: Response) => {
  const { email, password }: LoginFormInputs = req.body;
  console.log(`${email} + ${password}`)
  const user = users.find(user => {
    return user.email === email && user.password === password
  });

  if (!user) {
    return res.status(404).json({ status: "error", title: "Invalid Login", user: null })
  }

  console.log("Success!")
  return res.status(200).json({ status: "success", title: "Found User!", user: user })
});
app.post('/signup', (req: Request, res: Response) => {
  const newUser: User = req.body;
  console.log(`Trying to add ${newUser.name} at ${newUser.email}`);
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
  return
})
app.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
});