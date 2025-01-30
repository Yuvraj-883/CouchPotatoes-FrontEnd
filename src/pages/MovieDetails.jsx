import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import Comments from "../component/Comments";

const GET_MOVIE_DETAILS = gql`
  query GetMovieDetails($id: ID!) {
    movie(id: $id) {
      title
      released
      genres
      runtime
      languages
      poster
      imdb {
        rating
        votes
      }
      tomatoes {
        viewer {
          rating
          numReviews
          meter
        }
      }
      awards {
        wins
        nominations
        text
      }
      directors
      writers
      fullplot
      cast
    }
  }
`;

function MovieDetails() {
  const { id } = useParams();
  
  const { loading, error, data } = useQuery(GET_MOVIE_DETAILS, {
    variables: { id },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const movieDetails = data?.movie;

  return (
    <div className="flex md:flex-row flex-col justify-center p-6 bg-gray-100 min-h-screen">
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

            <div className="mt-4 space-x-4">
              <span className="text-lg font-semibold">Ratings:</span>
              <div className="space-x-4">
                <div className="text-blue-500">
                  <strong>IMDB:</strong> {movieDetails.imdb?.rating} / 10 (
                  {movieDetails.imdb?.votes} votes)
                </div>
                <div className="text-green-500">
                  <strong>Rotten Tomatoes:</strong> {movieDetails.tomatoes?.viewer?.rating} / 5 (
                  {movieDetails.tomatoes?.viewer?.numReviews} reviews, {movieDetails.tomatoes?.viewer?.meter}% rating)
                </div>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-lg font-semibold">Awards:</span>
              <p className="text-gray-600">
                Wins: {movieDetails.awards?.wins}, Nominations: {movieDetails.awards?.nominations}
              </p>
              <p className="text-gray-600">Text: {movieDetails.awards?.text}</p>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-700">Directors</h2>
              <p className="text-lg text-gray-600">
                {movieDetails.directors?.join(", ")}
              </p>
              <h2 className="text-xl font-semibold text-gray-700 mt-4">Writers</h2>
              <p className="text-lg text-gray-600">
                {movieDetails.writers?.join(", ")}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Full Plot</h2>
          <p className="text-lg text-gray-700">{movieDetails.fullplot}</p>
        </div>

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

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Comments</h2>
          <Comments movieId={id} />
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
