const mongoose = require("mongoose");

const app = require("./app");
const DB_HOST="mongodb+srv://Nazzik92:Nazzik92@cluster1.yoszk3g.mongodb.net/contact-list?retryWrites=true&w=majority";

mongoose.set("strictQuery", true);
mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(8000);
    
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
