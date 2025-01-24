import React, { useEffect, useState } from 'react';
import MovieCard from '../component/MovieCard'; // Your MovieCard component
import Pagination from '../component/Pagination'; // Pagination component

const TopRatedMovies = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalPages, setTotalPages] = useState(0); // Track total pages
  const pageSize = 12;

  useEffect(() => {
    // Fetch top-rated movies from your backend API with pagination
    const fetchTopRatedMovies = async () => {
      try {
        const res = await fetch(`https://couch-potatoes-backend-smoky.vercel.app/movie/top-rated?page=${page}&size=${pageSize}`);
        const data = await res.json();

        setMovies(data.movies); // Set movies from API response
        setTotalMovies(data.totalMovies); // Set total number of movies
        setTotalPages(data.totalPages); // Set total pages from API response
      } catch (err) {
        console.log('Error fetching top-rated movies:', err);
      }
    };

    fetchTopRatedMovies();
  }, [page]);

  return (
    <div className="top-rated-movies-page bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto mt-12 p-4">
        <h1 className="text-4xl font-bold text-center text-yellow-400 mb-8">
          Top Rated Movies
        </h1>

        {/* Movie list container */}
        <div className="flex flex-col md:flex-row gap-2 justify-center items-center flex-wrap">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))
          ) : (
            <p>No top-rated movies found.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination mt-8 flex justify-center">
            <Pagination
              currentPage={page}
              totalItems={totalMovies}
              pageSize={pageSize}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TopRatedMovies;
