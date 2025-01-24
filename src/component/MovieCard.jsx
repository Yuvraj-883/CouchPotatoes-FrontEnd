import React, { useState, useEffect, useContext } from "react";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function MovieCard({ movie }) {
  const [isLiked, setIsLiked] = useState(movie.likes > 0);
  const [likes, setLikes] = useState(movie.likes || 0);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLikes(movie.likes || 0);
  }, [movie.likes]);

  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      alert("Please sign in to like this movie.");
      navigate("/login");
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");

      const response = await fetch(`https://couch-potatoes-backend-smoky.vercel.app/movie/like/${movie._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(!isLiked);
        setLikes(data.likes);
      } else {
        console.error("Error while liking/unliking movie");
        alert("Error while liking/unliking movie.");
      }
    } catch (error) {
      console.error("Error while making API request:", error);
      alert("An error occurred while processing the request.");
    }
  };

  const description = movie.plot || movie.fullplot || "No description available";

  return (
    <div className="max-w-sm md:w-[32%] rounded overflow-hidden p-2 shadow-lg bg-gray-800 text-white">
      <img
        src={movie.poster || "default-image-url.jpg"}
        alt={movie.title}
        className="w-full h-64 object-cover"
      />
      <div className="px-6 py-4">
        <h2 className="text-xl font-bold mb-2 line-clamp-1">{movie.title || "No title available"}</h2>
        <p className="text-gray-400 text-base">{description.slice(0, 100)}...</p>
        <p className="text-yellow-400 text-sm font-semibold">
          Rating: {movie.imdb?.rating || "N/A"}
        </p>

        {/* Like Button */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-yellow-400 text-sm font-semibold">
            Likes: {likes}
          </p>
          <button
            onClick={handleLikeClick}
            className={`p-2 rounded-full ${isLiked ? "bg-red-500 text-white" : "border-2 border-red-500 text-red-500 bg-transparent"} transition-colors duration-200`}
          >
            <FaHeart size={24} />
          </button>
        </div>

        {/* Link to the full details page */}
        <Link
          to={`/movie/${movie._id}`}
          className="text-blue-500 hover:underline mt-2 block"
        >
          View Full Details
        </Link>
      </div>
    </div>
  );
}

export default MovieCard;
