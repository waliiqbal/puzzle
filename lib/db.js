import url from "url";
import { connect } from "mongoose";
import path from "path";

const connectDB = async () => {
  try {
     await connect(process.env.mongodb, {
    // await mongoose.connect("mongodb+srv://waliiqbal2020:QwXfF6vnGHPDih1W@cluster0.gqktgu9.mongodb.net/practice?retryWrites=true&w=majority", {
    });
    console.log("Database connected...");
  } catch (error) {
    console.log(error.message);
  }
};

export {
  connectDB,
};

