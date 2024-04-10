const PORT = process.env.PORT || 4000;
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
      times: [
        {
          enterTime: String,
          exitTime: String,
        },
      ],
    },
  ],
  graduation: [
    {
      startTime: String,
      endTime: String,
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
      graduation: req.body.graduation,
    });
    await user.save();
    res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      success: false,
      error,
    });
  }
});

// !remove
app.post("/removeWorker", async (req, res) => {
  try {
    await User.findOneAndDelete({ fin: req.body.fin });
    res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      success: false,
      error,
    });
  }
});

//^get
app.get("/getWorkers", async (req, res) => {
  try {
    const workers = await User.find({});
    res.send(workers);
  } catch (error) {
    res.json({
      success: false,
      error,
    });
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
    res.json({
      success: false,
      error,
    });
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
      user.graduation = req.body.graduation;
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
    res.json({
      success: false,
      error,
    });
  }
});

//?addActivity
app.post("/addActivity", async (req, res) => {
  try {
    const user = await User.findOne({
      fin: req.body.fin,
    });
    if (user) {
      const d = new Date();
      const day = d.getFullYear() + "-" + d.getMonth() + 1 + "-" + d.getDate();
      const time =
        d.getHours() + 4 + ":" + d.getMinutes() + ":" + d.getSeconds();
      if (
        user.activity.some((activity) => activity.day == day) &&
        user.activity.some(
          (activity) => activity.times[activity.times.length - 1].exitTime != ""
        )
      )
        user.activity = user.activity.map((activity) =>
          activity.day == day
            ? {
                ...activity,
                times: [
                  ...activity.times,
                  {
                    enterTime: time,
                    exitTime: "",
                  },
                ],
              }
            : activity
        );
      else if (user.activity.some((activity) => activity.day == day))
        user.activity = user.activity.map((activity) =>
          activity.day == day
            ? {
                ...activity,
                times: activity.times.map((item, index) =>
                  activity.times.length - 1 == index
                    ? { ...item, exitTime: time }
                    : item
                ),
              }
            : activity
        );
      else
        user.activity = [
          ...user.activity,
          {
            day: day,
            times: [
              {
                enterTime: time,
                exitTime: "",
              },
            ],
          },
        ];
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
    res.json({
      success: false,
      error,
    });
  }
});

//?addGraduation
app.post("/addGraduation", async (req, res) => {
  try {
    const user = await User.findOne({
      fin: req.body.fin,
    });
    if (user) {
      const d = new Date();
      user.graduation = [
        ...user.graduation,
        {
          startTime: req.body.startTime,
          endTime: req.body.endTime,
        },
      ];
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
    res.json({
      success: false,
      error,
    });
  }
});

app.listen(PORT, (error) => {
  if (error) {
    console.log("Error: ", error);
  } else {
    console.log("Server is running on port", PORT);
  }
});
