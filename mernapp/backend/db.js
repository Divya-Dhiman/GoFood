import mongoose from "mongoose";

const mongoURI =
  "mongodb+srv://divyainfoneo:Mummy1029@cluster0.w34sp3r.mongodb.net/gofood?retryWrites=true&w=majority";

async function connectToMongo() {
  try {
    await mongoose.connect(mongoURI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      
    });

    console.log("Connected to MongoDB");

    const foodCollection = mongoose.connection.db.collection("foodData2");
    const data = await foodCollection.find({}).toArray();

    const categrayCollection =
      mongoose.connection.db.collection("foodcategray");
    const catData = await categrayCollection.find({}).toArray();

    return { data, catData };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; 
  }
}

export default connectToMongo;
