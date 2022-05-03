import express from 'express'
import  parseArgs  from "minimist";
import 'dotenv/config'

const router = express.Router()


router.get("/",(req,res)=>{
    const info =  { 
    arguments: parseArgs(process.argv.slice(2)),
    OS: process.platform,
    node_ver: process.version,
    memory: process.memoryUsage().rss,
    exe_path :process.execPath,
    process_id :process.pid,
    proyect_file:process.cwd()
    }
    res.send(info)
  
  })

  export default router