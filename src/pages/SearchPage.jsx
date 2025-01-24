import React, { useState, useEffect } from 'react';
import MovieCard from '../component/MovieCard'; // Assuming this is your movie card component

function SearchPage() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get('q');
    if (query) {
      setSearchQuery(query);
      fetchMovies(query); // Fetch the movies based on the search query
    }
  }, []); // Empty dependency array to run only once when component mounts

  const fetchMovies = async (query) => {
    try {
      const res = await fetch(`https://couch-potatoes-backend-smoky.vercel.app/movie/search?q=${query}`);
      const data = await res.json();

      // Ensure that the response has 'movies' and it's not empty
      if (data && Array.isArray(data) && data.length > 0) {
        setMovies(data);
      } else {
        console.error('No movies found:', data); // Log if no movies found
        setMovies([]); // Ensure to clear previous data if no movies found
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div>
      <h1>Search Results for "{searchQuery}"</h1>

      {/* Only try to render movies if movies is an array and has items */}
      {Array.isArray(movies) && movies.length > 0 ? (
        <div className="movie-list">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} /> // Assuming MovieCard is your movie component
          ))}
        </div>
      ) : (
        <p>No movies found.</p> // Display message when no results found
      )}
    </div>
  );
}

export default SearchPage;
