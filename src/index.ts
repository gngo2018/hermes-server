import express from 'express'
import { Server } from 'socket.io'
import cors from 'cors'
import Ping from "./api/ping"

const app = express();
const port = process.env.PORT || 3005;

const allowedOrigins = ['http://localhost:3000', 'https://hermes-app-blush.vercel.app'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options));
app.use(express.json());
app.use("/api/ping", Ping);

let http = require("http").Server(app);

const io = new Server(http, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", + socket.id);
  socket.emit('hello', 'Hello from hermes web socket connection')

  socket.on('howdy', (arg) => {
    console.log('Message from client:', arg)
    socket.broadcast.emit('chat-response', arg)
  });
});

http.listen(port, () => {
  console.log(`Hermes Server running on port ${port} from GitHub CD connection.`);
});