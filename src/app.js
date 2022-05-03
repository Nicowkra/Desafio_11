import express  from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport"
import {Strategy} from "passport-local"
import path from "path"
import loginRouter from "./routes/login.js"
import infoRouter from "./routes/info.js"
import apiRouter from "./routes/api.js"
import fileStrategy from "session-file-store"
import MongoStore from "connect-mongo"
import mongoose from "mongoose"
import handlenbars from "express-handlebars"
import  parseArgs  from "minimist";
import 'dotenv/config'
const options = { 
   alias: {
		p: 'port',
	},
	default: {
		port: 8080,
	}
}

const objArguments = parseArgs(process.argv.slice(2), options)
const app = express()
const port = objArguments.port
const server = app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})

const Filestorage = fileStrategy(session)
const Url = process.env.MONGOURL
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser());
app.use(session({
   store: MongoStore.create({
      mongoUrl:Url,
      ttl:60
   }),
   secret:process.env.CLAVESESSION,
   resave: true,
   saveUninitialized:false,
   cookie:{
      maxAge:60000
   },

}))
mongoose.connect(Url, {
   useNewUrlParser: true, useUnifiedTopology: true
},err=>{
   if(err) throw new Error("No se pudo conectar");
   console.log("db conectada")
})

app.use(passport.initialize())
app.use(passport.session())


const __dirname = path.resolve();
app.use(express.static(__dirname+'/Public'))


app.use('/',loginRouter);
app.use('/api',apiRouter);
app.use("/info", infoRouter)
app.engine("handlebars", handlenbars.engine());
app.set("views", "./Public/views");
app.set("view engine", "handlebars");
