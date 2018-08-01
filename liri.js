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

if (searchParam == 'my-tweets') {
    // do this
}

if (!searchTerm && searchParam == 'spotify-this-song') {
    searchTerm = 'The Sign Ace of Base';
}


if (searchParam == 'spotify-this-song') {
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
            '     '+rating1.Source + ': ' + rating1.Value,
            '     '+rating2.Source + ': ' + rating2.Value,
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

if (searchParam == 'do-what-it-says') {
    // do this
}
