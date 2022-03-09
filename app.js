const express = require("express");
const logger = require("./config/logger");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", require("./routes/user"));

app.get("/", (req, res) => {
    res.status(200).json("TODO App");
});


app.listen(port, () => logger.info(`TODO App listening on port ${port}.`));