import React, { useEffect, useState } from 'react';
import HeroSection from '../component/HeroSection';
import MovieCard from '../component/MovieCard';
import GenreList from '../component/Genres';
import Pagination from '../component/Pagination';
import SearchBar from '../component/Search';

export default function Home() {
  const url = 'https://couch-potatoes-backend-smoky.vercel.app/movie';
  const [movies, setMovies] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  // Fetch movies function
  async function fetchMovies(genres = [], page = 1, pageSize = 9) {
    let queryParams = `?page=${page}&pageSize=${pageSize}`;
    if (genres.length) queryParams += `&genres=${genres.join(',')}`;

    const res = await fetch(url + queryParams);
    const data = await res.json();

    setMovies(data.movies);
    setTotalPages(data.totalPages);
  }

  // Fetch movies when genres, page, or pageSize changes
  useEffect(() => {
    fetchMovies(selectedGenres, currentPage, pageSize);
  }, [selectedGenres, currentPage, pageSize]);

  // Handle genre selection
  const handleGenreSelect = (genre) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
  };

  // Handle search results
  const handleSearchResults = (searchResults) => {
    setMovies(searchResults);
    setCurrentPage(1); // Reset to the first page
    setTotalPages(1); // Reset total pages since it's a new dataset
  };

  return (
    <>
      <HeroSection />
      <GenreList
        onGenreSelect={handleGenreSelect}
        selectedGenres={selectedGenres}
      />
      <SearchBar onSearch={handleSearchResults} />
      <div className="flex flex-col md:flex-row justify-center items-center flex-wrap gap-2">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))
        ) : (
          <p>No movies found</p>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}