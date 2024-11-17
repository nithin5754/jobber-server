

import { Application } from "express";
import { ConfigType } from "../../config";


const serverConfig=(app:Application,config:ConfigType)=>{


const startServer=()=>{
  app.listen(config.PORT,()=>console.log("server started ....")
  )
}
return {
  startServer
}

}

export default serverConfig