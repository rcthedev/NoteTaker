const express = require("express");
const path = require("path");
const fs = require("fs");
// const dbJson = require("../db/db.json");

const PORT = process.env.PORT || 8080;

let app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


// Will respond to GET note request ///////////////////////////////////////////////////////////////////
app.get("/api/notes", function (req, res) {

    fs.readFile(path.join(__dirname, "/db/db.json"), function (error, data) {
        if (error) {
           return console.log(error);
        };
        jsonFile = JSON.parse(data);
        return res.json(jsonFile);
    })
});


// Will respond to POST request and save the new note to the db.json File /////////////////////////////
app.post("/api/notes", function (req, res) {

    let newNote = req.body;

    fs.readFile(path.join(__dirname, "/db/db.json"), function (error, data) {
        if (error) {
            return console.log(error);
        };

        let allNotes = JSON.parse(data);
        let uniqueID = 100;

        ///Create for loop to iterate through notes and assign unique ID to each note /////////////////

        for(i = 0; i < allNotes.length; i++) {
            let currentNote = allNotes[i];
            if(currentNote.id > uniqueID) {
                uniqueID = currentNote.id
            }
        }
        uniqueID++;

        //This variable assigns new property of id to new note post request received from client ////////
        newNote.id = uniqueID;

        allNotes.push(newNote);


        // Send information back to client /////////
        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(allNotes), function (err) {
            if (error) {
                return console.log(err);
            };
            res.send(allNotes);
            console.log(allNotes);

        })
    })
});


// Will respond to DELETE request and delete specific note from db.json file /////////////////////////////////////
app.delete("/api/notes/:id", function (req, res) {
    let noteToDelete = req.params.id;

    fs.readFile(path.join(__dirname, "/db/db.json"), function (error, data) {
        if (error) {
            return console.log(error);
        }

        let allNotes = JSON.parse(data);
        
        for(i = 0; i < allNotes.length; i++) {
            let currentNote = allNotes[i];
            if(currentNote.id == noteToDelete) {
                allNotes.splice(i, 1);
            }
        }
        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(allNotes), function (err) {
            if (error) {
                return console.log(err);
            };
            res.send(allNotes);
            console.log(allNotes);
        })
    })
});

// To serve notes page //
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

//  Create routes ////////////////////////////////////////////////////////////////////////////////////
// To serve home page //
app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});


app.listen(PORT, () => {
    console.log("Listening on PORT 8080")
});