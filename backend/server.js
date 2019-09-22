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



// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://BigRedHacks:<bigredhacks123>@bigredhacks-vrs2y.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   console.log('Connected');
//   const collection = client.db("Bigredhacks");
//   // perform actions on the collection object
//   client.close();
// });

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


app.get('/', (req, res) => {
      
    
  })

  app.post('/',uploads.single('myFile'), function(req,res){
    var process = new ffmpeg(req.file.path);
    process.then(function (audio) {
      audio.fnExtractSoundToMP3('./uploads/abc.mp3', function(error, file) {
        syncRecognize(
          file,
          'MP3',
           16000,
          'en-US'
        ).then(text => {res.send(text)})
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