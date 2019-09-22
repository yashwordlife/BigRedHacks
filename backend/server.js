const express = require('express');
const cors = require('cors')
const app = express();
var bodyparser= require('body-parser');
const multer = require('multer');
var ffmpeg = require('ffmpeg');

const fs = require("fs");
app.use(cors());
app.use(bodyparser.urlencoded({
    extended:true
}));
const uploads= multer({dest : 'uploads/'});
app.use(bodyparser.json());

// Google firebase database

//Credentials
const admin = require('firebase-admin');
let serviceAccount = require('./firebase.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://bigredhack-d7d8d.firebaseio.com'
});

var db = admin.firestore();


var docRef = db.collection('meeting');
var sumRef = db.collection('summ');



function writeUserData(name, notes, timestamp) {
  console.log("INSIDE writeUSERData");
  var addMeeting = docRef.add({
    'meeting_name': name,
    'notes': notes,
    'timestamp': timestamp
  });
}



function performSave(meetingName, date, content) {
  console.log("PERFORM" + meetingName + date+ content);
  writeUserData(meetingName, content, date);
  
}

//Summarizer

var tr = require('textrank'); //library for summarizing
 
function summ(str_1){
    var textRank = new tr.TextRank(str_1); //str_1 is the string you want summarized
    var summ_str = textRank.summarizedArticle;
    return summ_str
}



// Speech to Text Function
async function syncRecognize (filename, encoding, sampleRateHertz, languageCode) {

    const Speech = require('@google-cloud/speech');
    const speech = new Speech.SpeechClient();
    const file = await fs.readFileSync(filename);
    const audioBytes = file.toString('base64');
    const audio = {
        content: audioBytes,
      };
    const config = {
        encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode
    }
    const request = {
      audio: audio,
      config: config,
    };
    
    return speech.recognize(request)
  }
  

app.listen(3000, function() {
    console.log('listening on 3000')
})


app.get('/meetings', (req, res) => {
  var responseData = [];
  db.collection('meeting').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      responseData.push(doc.data());
    });
    res.send(responseData);
    })
  .catch((err) => {
    console.log('Error getting documents', err);
  });

});

app.post('/',uploads.single('myFile'), function(req,res){
    console.log(req.file);
    var process = new ffmpeg(req.file.path);
    process.then((audio) => {
      audio.fnExtractSoundToMP3('./uploads/abc.mp3', function(error, file) {
        syncRecognize(
          file,
          'MP3',
           16000,
          'en-US'
        ).then(text =>  {
          var mainText = "";
          for (item in text[0].results) {
             if (item == 0) mainText = text[0].results[item].alternatives[0].transcript;
             else mainText = mainText + "," + text[0].results[item].alternatives[0].transcript;
          }
          performSave(req.file.originalname, new Date(), mainText); res.json(mainText)})
        .catch((err) => {
          console.error('ERROR:', err);
        });
        console.log(error);
      });
      }, function (err) {
        console.log('Error :' + err);
    });
    
})






  












//MongoDb connection
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://BigRedHacks:<bigredhacks123>@bigredhacks-vrs2y.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// var db
// client.connect(err => {
//   //const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
  
//   client.close();
// });

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://yashChandra:yashrox@bigredhacks-vrs2y.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   console.log('Connected');
//   const collection = client.db("Bigredhacks").collection("data");
//   // perform actions on the collection object
//   client.close();
// });