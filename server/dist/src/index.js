"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const users = [
    {
        id: 1,
        name: "Gavin Lau",
        email: "testmail@gmail.com",
        password: "123"
    },
];
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 8080;
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '../client/build')));
    app.get('/*', function (req, res) {
        res.sendFile(path_1.default.join(__dirname, '../client/build', 'index.html'));
    });
}
else {
    app.get('/', (req, res) => {
        res.send('<h1>Hello World From the Typescript Server!</h1>');
    });
}
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`${email} + ${password}`);
    const user = users.find(user => {
        return user.email === email && user.password === password;
    });
    if (!user) {
        return res.status(404).json({ status: "error", title: "Invalid Login", user: null });
    }
    console.log("Success!");
    return res.status(200).json({ status: "success", title: "Found User!", user: user });
});
app.post('/signup', (req, res) => {
    const newUser = req.body;
    console.log(`Trying to add ${newUser.name} at ${newUser.email}`);
    const existingUser = users.find(user => {
        return user.email === newUser.email;
    });
    if (!existingUser) {
        newUser.id = users.length;
        users.push(newUser);
        res.send({ status: "success", title: "New User Created!", text: "Have fun!", user: newUser });
    }
    else {
        res.send({ status: "error", title: "User already exists!", text: "Try a different email.", user: null });
    }
    return;
});
app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
});
