﻿# Spotify Top Records
 
This is a basic web application which retrieves and displays all-time most-played tracks and artists of a Spotify user. There are other, and more UX friendly applications which achieve the same goal of this application, but **Spotify Top Records** differs from them in terms authorization.

The main purpose of the project is implementing [OAuth 2.0 Authorization Code Grant](https://tools.ietf.org/html/rfc6749#section-4.1). So that all the sensitive information like `client_id`,` client_secret`, `redirect_uri`, `access_token`, `refresh_token` will be preserved in back-end. In the other authorization types, these sensitive infromation is accessible from front-end.

A simple demo of this application can be seen [here](https://spotify-top-track-artist.herokuapp.com/).

**Reference:**
Detailed information about OAuth 2.0 can be found on [IETF](https://tools.ietf.org/html/rfc6749) and [Spotify Official Authorization Guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/).
