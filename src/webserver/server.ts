

import  { Server as httpServerType } from 'http';
import { ConfigType } from "../config";



const serverConfig=(httpServer:httpServerType,config:ConfigType )=>{


const startServer=()=>{
  httpServer.listen(config.PORT,()=>console.log("server started ....")

  
)

}



return {
  startServer 
 
}




}

export default serverConfig