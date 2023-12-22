import mongoose from "mongoose";

const mongoURI =
  "mongodb+srv://divyainfoneo:Mummy1029@cluster0.w34sp3r.mongodb.net/gofood?retryWrites=true&w=majority";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, {});

    console.log("connected");

    const fetched_data = await mongoose.connection.db.collection(
      "foodData2"
    );
    const data = await fetched_data.find({}).toArray();
    console.log();
  } catch (err) {
    console.error(err);
  }
};

export default connectToMongoDB;
