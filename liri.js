var env = require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request')
var fs = require('fs');

var keys = require('./keys')
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var input = process.argv;
input.shift();
input.shift();
var searchParam = input[0];
var searchTerm = input.slice(1).join(' ');

runApp = function () {
    if (searchParam == 'my-tweets') {
        if (!searchTerm) {
            searchTerm = 'neha_testapp'
        };

        client.get('search/tweets', { q: 'from:@' + searchTerm, count: 20 }, function (error, tweets, response) {
            let queryText = '\nQUERY:\nYou searched for tweets by the following user: "' + searchTerm + '"';
            let allTweets = tweets.statuses
            // console.log(allTweets)
            let tweetData = []

            for (let i = 0; i < allTweets.length; i++) {
                let n = i + 1;
                tweetData.push('Tweet #' + n + ':\n     Text: ' + allTweets[i].text + '\n     Created on: ' + allTweets[i].created_at);
            }

            let printData = [
                '\nRESULTS:',
                tweetData.join('\n')
            ].join('\n')

            let divider = '\n------------------------------------------';

            fs.appendFile('log.txt', queryText + printData + divider, function (err) {
                if (err) {
                    throw err;
                }
                console.log(queryText);
                console.log(printData + divider);
            })
        });
    }

    if (searchParam == 'spotify-this-song') {
        if (!searchTerm) {
            searchTerm = 'The Sign Ace of Base';
        }

        spotify
            .search({ type: 'track', query: searchTerm, limit: 1 })
            .then(function (response) {
                let track = response.tracks.items[0];
                var title = track.name;
                var artist = track.album.artists[0].name;
                var album = track.album.name;
                var previewURL = track.preview_url;

                let queryText = '\nQUERY:\nYou searched the Spotify Database for the following terms: "' + searchTerm + '"';

                let songData = [
                    '\nRESULTS:',
                    'Song Title: ' + title,
                    'Artist: ' + artist,
                    'Album: ' + album,
                    'Preview on Spotify: ' + previewURL,
                ].join('\n');

                let divider = '\n------------------------------------------';

                fs.appendFile('log.txt', queryText + songData + divider, function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log(queryText);
                    console.log(songData + divider);
                })
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    if (searchParam == 'movie-this') {
        request('http://www.omdbapi.com/?t=' + searchTerm + '&apikey=trilogy', function (error, response, body) {

            let obj = JSON.parse(body);
            var title = obj.Title;
            var year = obj.Year;
            var rating1 = obj.Ratings[0];
            var rating2 = obj.Ratings[1];
            var country = obj.Country;
            var lang = obj.Language;
            var actors = obj.Actors;

            let queryText = '\nQUERY:\nYou searched the OMBD for the following terms: "' + searchTerm + '"';

            var movieData = [
                '\nRESULTS:',
                'Name: ' + title,
                'Year: ' + year,
                'Ratings: ',
                '     ' + rating1.Source + ': ' + rating1.Value,
                '     ' + rating2.Source + ': ' + rating2.Value,
                'Country: ' + country,
                'Language: ' + lang,
                'Actors: ' + actors
            ].join('\n')
            let divider = '\n------------------------------------------';

            fs.appendFile('log.txt', queryText + movieData + divider, function (err) {
                if (err) {
                    throw err;
                }
                console.log(queryText);
                console.log(movieData + divider);
            });

        });
    }
}

if (searchParam == 'do-what-it-says') {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        searchParam = dataArr[0],
        searchTerm = dataArr[1]
        runApp();
    });
};

runApp();