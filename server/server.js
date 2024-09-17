const express = require("express");
const cors = require("cors");
const PORT = 4000;

const app = express();
const bodyParser = require("body-parser");

// CORS
app.use(cors());

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/api", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
