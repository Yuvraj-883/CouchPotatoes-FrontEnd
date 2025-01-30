import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import HeroSection from '../component/HeroSection';
import MovieCard from '../component/MovieCard';
import GenreList from '../component/Genres';
import Pagination from '../component/Pagination';
import SearchBar from '../component/Search';

const GET_MOVIES = gql`
  query GetMovies($pageNumber: Int, $pageSize: Int, $genres: [String]) {
    movies(pageNumber: $pageNumber, pageSize: $pageSize, genres: $genres) {
      movies {
        id
        title
        plot
        genres
        poster
        likes
        imdb {
          rating
          
        }
          
      }
      totalPages
      currentPage
    }
  }
`;

export default function Home() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [searchResults, setSearchResults] = useState([]);

  const { loading, error, data } = useQuery(GET_MOVIES, {
    variables: {
      pageNumber: currentPage,
      pageSize: pageSize,
      genres: selectedGenres,
    },
  });

  const handleGenreSelect = (genre) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genre)
        ? prevGenres.filter((g) => g !== genre)
        : [...prevGenres, genre]
    );
    setCurrentPage(1);
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
    setCurrentPage(1);
  };

  const moviesToDisplay = searchResults.length > 0 ? searchResults : data?.movies?.movies || [];

  return (
    <>
      <HeroSection />
      <GenreList onGenreSelect={handleGenreSelect} selectedGenres={selectedGenres} />
      <SearchBar onSearch={handleSearchResults} />

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      <div className="flex flex-col md:flex-row justify-center items-center flex-wrap gap-2">
        {moviesToDisplay.length > 0 ? (
          moviesToDisplay.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          !loading && <p>No movies found</p>
        )}
      </div>

      {!searchResults.length && data?.movies?.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data.movies.totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}
