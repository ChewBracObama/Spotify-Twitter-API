//NB node_modules must be reinstalled beforehand
//Start script has been created with npm start
//Update the .env file with all spotify and twitter API details. Twitter elevated access is required
const SpotifyWebApi = require('spotify-web-api-node')//used npm install Spotify-Web-Api-Node
const readline = require("readline") //allows us to get user input from console
const Twitter = require("twitter") //Used npm i twitter for the api
const fs = require('fs').promises 
require("dotenv").config()

console.log("");
console.log("\n1.\tReturn a users Tweets\n2.\tGet details of a song from Spotify\n3.\tRead a query from a text file");

const rl = readline.createInterface({
    input: process.stdin,//allows for input from user
    output: process.stdout//creates a function output variable
})

rl.question("\nPlease select an option\n", function(answer){
    switch (answer) {
        case '1':
            try {
                rl.question("\nPlease enter a twitter handel\n", function(handle){
                    returnTweets(handle) //calls the tweet function
                })
                break;
            } catch (error) {
              console.log(error);  
            }         
            
        case '2':
            try {
                rl.question("\nPlease enter a song name (For increased accuracy include the artist name too)\n", function(name){ 
                    spotify(name) //calls spotify function
                })
                break;
            } catch (error) {
              console.log(error);  
            }
            

        case '3':
            //calls the textfile function
            randomTextQuery()
            break;
    
        default:
            //in case of an incorrect value entered
            console.log("No correct option chosen")
            rl.close()
            break;
    } 
})
//returns 20 most recent tweets/replies from the handel entered
function returnTweets(username) { //username refers to the @ or handle of the user to search
    Tweets = new Twitter({
        //Replace with own keys
        consumer_key: process.env.Cons_Key_Twitter, 
        consumer_secret: process.env.Cons_Secret_Twitter,
        access_token_key: process.env.Acc_Token_Twitter,
        access_token_secret: process.env.Acc_Secret_Twitter
    })

    Tweets.get('statuses/user_timeline', {screen_name: username}, function(err, data,response){ //statuses/user_timeline will return activity from a users timeline based on their screen name or handle
        if(!err){
            console.log("\nBeginning of Tweets:\n");
            for (let x = 0; x < 20; x++) { //set to 20 to only print the 20 most recent tweets
                console.log(`${x+1}: Posted on ${data[x].created_at}\n ${data[x].text}\n`) //data object which in a similar way to spotify's.
            }
            console.log("\nEnd of Tweets...\n");
            rl.close()
        }else{
            console.log(err);
        }  
    })
} 
//returns small details of a spotify song using their API. 
function spotify(name) { 
    SpotifyApi = new SpotifyWebApi({
        clientId: process.env.Client_ID_Spotify, //Please replace with your own spotify API ID key
        clientSecret: process.env.Client_Secret_Spotify, //Please replace with own spotify API secret key
    })
    //access tokens are only active for a single hour from activation
    SpotifyApi.setAccessToken(process.env.Acc_Token_Spotify)

    SpotifyApi.searchTracks(`track:${name} `, {limit:1}) //limit 1 means that only a single song will be returned
    .then(function(data){ //data is a json object that we can get different information in an array like fashion such as the artist title of the index 1
        console.log(`\nSearched for: ${name}`) 
        console.log(`\nSong Name:\t`, data.body.tracks.items[0].name);
        console.log(`Artist name:\t`, data.body.tracks.items[0].artists[0].name)
        console.log(`Link to open with Spotify:\t`, data.body.tracks.items[0].uri,`\nPaste in browser to open Spotify App\n`)
        rl.close() //ends this readline() question
    },function(error){
        console.error('OOPSIES ',error)
    })
}
//random text file and returns either spotify or twitter output based on what 'type' value it has. You can add more to the txt (keeping the format of it. To test others)
function randomTextQuery(){
    try {
        data = fs.readFile('random.txt').then((randomtext)=>{
            let textarray = randomtext.toString().split('\n')
            textarray.forEach(element => {
                //converting each array element into either a name (song or twitter handle) and the type of 
                let name = element.substring(0, element.indexOf(','))
                let type = element.substring(element.indexOf(',')+1, element.length)
                if (type == 1) {
                    returnTweets(name) //calls the tweet function
                }
                if (type == 2) {
                    spotify(name) //calls the spotify function
                }
            });

        }).catch((error) =>{
            console.log(error);
        })
    } catch (error) {
        console.log(error);
    }
}

