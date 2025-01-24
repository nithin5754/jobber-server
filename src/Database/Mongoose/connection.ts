import { Mongoose } from "mongoose";
import { ConfigType } from "../../config";

export default function connection(mongoose: Mongoose, config: ConfigType) {
  function connectToMongo() {
    mongoose
      .connect(config.MONGO_.URI || "")
      .then(
        () => {},
        (err) => {
          console.info("Mongodb error", err);
        }
      )
      .catch((err) => {
        console.log("ERROR:", err);
      });
  }

  mongoose.connection.on("connected", () => {
    console.info("Connected to MongoDB!");
  });

  mongoose.connection.on("reconnected", () => {
    console.info("MongoDB reconnected!");
  });

  mongoose.connection.on("error", (error) => {
    console.error(`Error in MongoDb connection: ${error}`);
    mongoose.disconnect();
  });

  return {
    connectToMongo,
  };
}
