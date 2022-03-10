const express = require("express");
const logger = require("./config/logger");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 3001;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/", require("./routes/user"));
app.use("/", require("./routes/note"));

app.get("/", (req, res) => {
    res.status(200).json("TODO App");
});

app.listen(port, () => logger.info(`TODO App listening on port ${port}.`));
