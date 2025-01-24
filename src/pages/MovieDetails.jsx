import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Comments from "../component/Comments"; // Import the Comments component

function MovieDetails() {
  const [movieDetails, setMovieDetails] = useState(null);
  const { id } = useParams();
  const url = `https://couch-potatoes-backend-smoky.vercel.app/movie/${id}`;

  // Async function to fetch movie details
  async function fetchMovieDetails(url) {
    const res = await fetch(url);
    const details = await res.json();
    setMovieDetails(details);
  }

  useEffect(() => {
    if (id) {
      fetchMovieDetails(url);
    }
  }, [id]);

  return (
    <div className="flex md:flex-row flex-col justify-center p-6 bg-gray-100 min-h-screen">
      {movieDetails ? (
        <div className="bg-white w-full max-w-7xl p-6 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row mb-8">
            <img
              src={movieDetails.poster}
              alt={movieDetails.title}
              className="md:w-[50vw] mx-auto h-auto rounded-lg mr-8"
            />
            <div className="flex flex-col w-full">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {movieDetails.title}
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Released: {new Date(movieDetails.released).toLocaleDateString()}
              </p>
              <p className="text-lg text-gray-600 mb-2">
                Genres: {movieDetails.genres?.join(", ")}
              </p>
              <p className="text-lg text-gray-600 mb-2">
                Runtime: {movieDetails.runtime} minutes
              </p>
              <p className="text-lg text-gray-600 mb-2">
                Languages: {movieDetails.languages?.join(", ")}
              </p>

              {/* Ratings Section */}
              <div className="mt-4 space-x-4">
                <span className="text-lg font-semibold">Ratings:</span>
                <div className="space-x-4">
                  <div className="text-blue-500">
                    <strong>IMDB:</strong> {movieDetails.imdb?.rating} / 10 (
                    {movieDetails.imdb?.votes} votes)
                  </div>
                  <div className="text-green-500">
                    <strong>Rotten Tomatoes:</strong>{" "}
                    {movieDetails.tomatoes?.viewer?.rating} / 5 (
                    {movieDetails.tomatoes?.viewer?.numReviews} reviews,{" "}
                    {movieDetails.tomatoes?.viewer?.meter}% rating)
                  </div>
                </div>
              </div>

              {/* Awards Section */}
              <div className="mt-4">
                <span className="text-lg font-semibold">Awards:</span>
                <p className="text-gray-600">
                  Wins: {movieDetails.awards?.wins}, Nominations:{" "}
                  {movieDetails.awards?.nominations}
                </p>
                <p className="text-gray-600">Text: {movieDetails.awards?.text}</p>
              </div>

              {/* Directors & Writers Section */}
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-700">Directors</h2>
                <p className="text-lg text-gray-600">
                  {movieDetails.directors?.join(", ")}
                </p>
                <h2 className="text-xl font-semibold text-gray-700 mt-4">
                  Writers
                </h2>
                <p className="text-lg text-gray-600">
                  {movieDetails.writers?.join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* Full Plot Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Full Plot</h2>
            <p className="text-lg text-gray-700">{movieDetails.fullplot}</p>
          </div>

          {/* Cast Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Cast</h2>
            <ul className="list-none pl-0">
              {movieDetails.cast?.map((actor, index) => (
                <li key={index} className="text-lg text-gray-700">
                  {actor}
                </li>
              ))}
            </ul>
          </div>

          {/* Comments Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Comments</h2>
            <Comments movieId={id} /> {/* Pass the movie ID to the Comments component */}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default MovieDetails;
