require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const artistQuery = req.query.artist; // Obtiene el término de búsqueda del artista del query string
  spotifyApi
    .searchArtists(artistQuery)
    .then((data) => {
      const artists = data.body.artists.items; // Obtiene los artistas encontrados de la respuesta
      res.render("artist-search-results", { artists }); // Renderiza la vista 'artist-search-results' y pasa los artistas como datos
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  const artistId = req.params.artistId; // Obtiene el ID del artista de los parámetros de la ruta
  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const albums = data.body.items; // Obtiene los álbumes del artista de la respuesta
      res.render("albums", { albums }); // Renderiza la vista 'albums' y pasa los álbumes como datos
    })
    .catch((err) =>
      console.log("The error while getting artist albums occurred: ", err)
    );
});

app.get('/tracks/:albumId', (req, res) => {
    const albumId = req.params.albumId; // Obtiene el ID del álbum de los parámetros de la ruta
    spotifyApi
      .getAlbumTracks(albumId)
      .then(data => {
        const tracks = data.body.items; // Obtiene las canciones del álbum de la respuesta
        res.render('tracks', { tracks }); // Renderiza la vista 'tracks' y pasa las canciones como datos
      })
      .catch(err => console.log('The error while getting album tracks occurred: ', err));
  });

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
