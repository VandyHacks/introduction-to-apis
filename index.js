// Express framework to write end points and middleware
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

// File Sync library to write to the local json
const fs = require("fs");

// Local json storage file which will mock a db
const storage = "storage.json";

// Recoginizes the incoming Request Object as a JSON; Middleware
app.use(express.json());

// Middleware to that will log the date whenever a request happens
app.use((req, res, next) => {
    let date = new Date();
    console.log(date.toLocaleTimeString());
    next();
});

// Add a callback for route parameters
app.param("school", (req, res, next, school) => {
    if (school.toLowerCase() == "vanderbilt") {
        req.school = "vanderbilt";
        next();
    } else {
        next(Error("Invalid School"));
    }
});

// Root route
app.get("/", (req, res) => {
    res.status(200).send("Root route");
});

// Route that will use the school parameter we set up
app.get("/:school", (req, res, next) => {
    // Reads the file
    fs.readFile(storage, (err, data) => {
        if (err) {
            next(err);
        } else {
            let school = JSON.parse(data);
            let info = school.vanderbilt;
            console.log(school);
            res.status(200).json(info);
        }
    });
});

// Route that will post information to a specific school's section in the JSON file
app.post("/vanderbilt", (req, res, next) => {
    let schoolName = req.school;
    fs.readFile(storage, (err, data) => {
        if (err) {
            next(err);
        }
        let newLocation = req.body.location;
        let newUndergrad = req.body.undergrad;
        let school = JSON.parse(data);
        school.vanderbilt.location = newLocation;
        school.vanderbilt.undergrad = newUndergrad;
        json = JSON.stringify(school);
        fs.writeFileSync(storage, json);
        res.status(200).send("Post successful");
    });
});

// Middleware that will handle errors that get thrown
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send(err.message);
});

// Starts the express server to listen on the port provided
app.listen(port, () => console.log(`App is listening on port ${port}`));
