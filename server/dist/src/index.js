"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dbAccess = __importStar(require("./utils/DatabaseAccess"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 8080;
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '../../client/build')));
    app.get('/*', function (req, res) {
        res.sendFile(path_1.default.join(__dirname, '../../client/build', 'index.html'));
    });
}
else {
    app.get('/', (req, res) => {
        res.send('<h1>Hello World From the Typescript Server!</h1>');
    });
}
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(`${email} + ${password}`);
    /* OLD CODE USING A JS LIST
    const user = users.find(user => {
      return user.email === email && user.password === password
    });
  */
    const result = yield dbAccess.findUser(email, password);
    if (!result.user) {
        return res.status(404).json({ status: "error", title: result.title, text: result.text, user: null });
    }
    console.log("Success!");
    return res.status(200).json({ status: "success", title: result.title, text: result.text, user: result.user });
}));
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = req.body;
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
    const result = yield dbAccess.createUser(newUser);
    if (!result.user) {
        return res.status(404).json({ status: "error", title: result.title, text: result.text, user: null });
    }
    console.log("Success!");
    return res.status(200).json({ status: "success", title: result.title, text: result.text, user: result.user });
}));
app.post('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.body;
    console.log(search);
    if (search.type === "Player") {
        const result = yield dbAccess.findPlayers(search);
        if (!result.players) {
            return res.status(404).json({ status: "error", title: result.title, text: result.text, players: [] });
        }
        else {
            return res.status(200).json({ status: "success", title: result.title, text: result.text, players: result.players });
        }
    }
}));
app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
});
