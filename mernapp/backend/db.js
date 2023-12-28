import mongoose from "mongoose";

const mongoURI =
  "mongodb+srv://divyainfoneo:Mummy1029@cluster0.w34sp3r.mongodb.net/gofood?retryWrites=true&w=majority";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, {});

    console.log("connected");

    const foodDataCollection = mongoose.connection.db.collection("foodData2");
    const catDataCollection = mongoose.connection.db.collection("foodcategray");

    const data = await foodDataCollection.find({}).toArray();
    const catData = await catDataCollection.find({}).toArray();

    global.foodData2 = data;
    global.foodcategray = catData;
  } catch (err) {
    console.error(err);
  }
};

export default connectToMongoDB;
