import { connect } from "mongoose";
import CONFIG from "./config";

export const connectDB = async () => {
    try {
        await  connect(CONFIG.MONGODB_URI);
        console.log("MongoDB connected");
    } catch (err: any) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
      }
}