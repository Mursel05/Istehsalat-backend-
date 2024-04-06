const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://istehsalat:0125544523@cluster0.bpjaeyw.mongodb.net/istehsalat"
);

app.get("/", (req, res) => {
  res.send("Express server is running");
});

const User = mongoose.model("User", {
  fin: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  activity: [
    {
      day: String,
      enterTime: String,
      exitTime: String,
    },
  ],
  salary: { type: Number, required: true },
});

//?add
app.post("/addWorker", async (req, res) => {
  try {
    const user = new User({
      fin: req.body.fin,
      name: req.body.name,
      surname: req.body.surname,
      salary: req.body.salary,
      activity: req.body.activity,
    });
    console.log(user);
    await user.save();
    res.json({
      success: true,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

//!remove
app.post("/removeWorker", async (req, res) => {
  try {
    await User.findOneAndDelete({ fin: req.body.fin });
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
});

//^get
app.get("/getWorkers", async (req, res) => {
  try {
    const workers = await User.find({});
    res.send(workers);
  } catch (error) {
    console.log(error);
  }
});

//^get
app.get("/getWorker", async (req, res) => {
  try {
    const workers = await User.find({ fin: req.body.fin });
    const worker = workers.find((worker) => worker.fin === req.body.fin);
    if (worker) res.send(worker);
    else res.json({ success: false, error: "Worker not found" });
  } catch (error) {
    console.log(error);
  }
});

//?update
app.post("/updateWorker", async (req, res) => {
  try {
    const user = await User.findOne({
      fin: req.body.fin,
    });
    if (user) {
      user.name = req.body.name;
      user.surname = req.body.surname;
      user.salary = req.body.salary;
      user.activity = req.body.activity;
      await user.save();
      res.json({
        success: true,
      });
    } else {
      res.json({
        success: false,
        error: "Worker not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, (error) => {
  if (error) {
    console.log("Error: ", error);
  } else {
    console.log("Server is running on port", port);
  }
});
