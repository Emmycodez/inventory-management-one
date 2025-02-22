import mongoose from "mongoose";


const connectDB = async (dbUrl: string) => {
  try {
    await mongoose.connect(dbUrl),
      {
        dbName: "GroupShepherd",
      };
    console.log("Database connected....");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
