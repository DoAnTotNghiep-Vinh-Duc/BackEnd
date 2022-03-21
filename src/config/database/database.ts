import mongoose, {ConnectOptions} from "mongoose";
export class ConnectDatabase {
  static async connectDatabase() {
    try {
      mongoose.connect(`${process.env.CONNECT_MONGODB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }as ConnectOptions);
      console.log("Connected database !");
    } catch (error) {
      console.log("Connect database fail!!!!");
    }
  }
}

