const express = require("express");
const connectToMongo = require("./config/db");
const cors = require("cors");
require("dotenv").config();

connectToMongo();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("iNotebook Backend Running ✅");
});

// Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
