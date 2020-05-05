let express = require('express'); 
let request = require('request');
let cors = require('cors');
let querystring = require('querystring');
let cookieParser = require('cookie-parser');

let client_id = ''; // Your client id
let client_secret = ''; // Your secret
let redirect_uri = ''; // Your redirect uri
let data = {};

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};


var stateKey = 'spotify_auth_state';
var app = express();

app.use(express.static(__dirname + '/public',{extensions:['html']}))
	.use(cors())
	.use(cookieParser());
	

app.engine('html', require('ejs').renderFile);

app.get('/login', function (req, res) {
	console.log('entering login');
	var state = generateRandomString(16);
	res.cookie(stateKey, state);

	var scope = 'user-read-private user-read-email user-top-read';
	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			response_type: 'code',
			client_id: client_id,
			scope: scope,
			redirect_uri: redirect_uri,
			state: state
		}));
});

app.get('/callback', function (req, res) {
	var code = req.query.code || null;
	var state = req.query.state || null;
	var storedState = req.cookies ? req.cookies[stateKey] : null;

	if (state === null || state !== storedState) {
		res.redirect('/#' +
			querystring.stringify({
				error: 'state_mismatch'
			}));
	} else {
		res.clearCookie(stateKey);
		var authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				code: code,
				redirect_uri: redirect_uri,
				grant_type: 'authorization_code'
			},
			headers: {
				'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
			},
			json: true
		};

		request.post(authOptions, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				let access_token = body.access_token;
				let refresh_token = body.refresh_token;
				console.log('at: ' + access_token);
				console.log('rt: ' + refresh_token);
								
				//---------------------
				//kullanicinin bilgilerini al
				var options_me = {
					url: 'https://api.spotify.com/v1/me',
					headers: { 'Authorization': 'Bearer ' + access_token },
					json: true
				};

				request.get(options_me, function (error, response, body) {
					data.me = body;
					console.log(body);
				});
				//---------------------

				//---------------------
				//kullanicinin en cok dinledigi trackleri al
				var options_tracks = {
					url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=20',
					headers: { 'Authorization': 'Bearer ' + access_token },
					json: true
				};

				request.get(options_tracks, function (error, response, body) {
					console.log('getting tracks');
					data.tracks = body;

					//---------------------
					//kullanicinin en cok dinledigi artistleri al
					var options_artists = {
						url: 'https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=20',
						headers: { 'Authorization': 'Bearer ' + access_token },
						json: true
					};

					request.get(options_artists, function (error, response, body) {
						console.log('getting artists');
						data.artists = body;
						res.render(__dirname + "/public/logic.html", {data:data});
						
					});
					//---------------------

				});
				//---------------------

				
			}
			else{
				console.log('hata var');
			}
		});
	}
});

const PORT = process.env.PORT || 8888;
console.log(PORT);

app.listen(PORT);