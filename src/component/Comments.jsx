import React, { useState, useEffect } from "react";
import CommentItem from "./CommentItem";

const ReplyItem = ({
  reply,
  setNewReplies,
  newReplies,
  setReplyingToReplyId,
  replyingToReplyId,
  handleAddNestedReply,
  loadingReplies,
  fetchRepliesToReply,
  movieId,
  setError
}) => {
  const handleShowNestedReplies = async (replyId) => {
    if (!reply.replies && !loadingReplies[replyId]) {
      await fetchRepliesToReply(replyId);
    }
  };

  return (
    <div className="p-3 border-l-2 border-gray-200">
      <p className="text-sm text-gray-800">{reply.text}</p>
      <span className="text-xs text-gray-500">- {reply.name || "Anonymous"}</span>

      {/* Reply Button */}
      {replyingToReplyId === reply._id ? (
        <div className="mt-2">
          <textarea
            className="w-full p-2 border rounded-md"
            placeholder="Add a reply..."
            value={newReplies[reply._id] || ""}
            onChange={(e) => setNewReplies((prev) => ({ ...prev, [reply._id]: e.target.value }))}
          />
          <button
            onClick={() => handleAddNestedReply(reply._id)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Reply
          </button>
        </div>
      ) : (
        <button
          onClick={() => setReplyingToReplyId(reply._id)}
          className="mt-2 mx-2 text-sm text-blue-500"
        >
          Reply
        </button>
      )}

      {/* Show Replies Button */}
      {!reply.replies && !loadingReplies[reply._id] && (
        <button
          onClick={() => handleShowNestedReplies(reply._id)}
          className="mt-2 mx-2 text-sm text-blue-500"
        >
          Show Replies
        </button>
      )}

      {/* Display Nested Replies */}
      {Array.isArray(reply.replies) && reply.replies.length > 0 && (
        <div className="mt-4 space-y-2 pl-6">
          {reply.replies.map((nestedReply) => (
            <ReplyItem
              key={nestedReply._id}
              reply={nestedReply}
              movieId={movieId}
              setError={setError}
              setReplyingToReplyId={setReplyingToReplyId}
              replyingToReplyId={replyingToReplyId}
              setNewReplies={setNewReplies}
              newReplies={newReplies}
              handleAddNestedReply={handleAddNestedReply}
              loadingReplies={loadingReplies}
              fetchRepliesToReply={fetchRepliesToReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Comments = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(""); // New comment text
  const [newReplies, setNewReplies] = useState({}); // New reply text for each reply
  const [loadingComments, setLoadingComments] = useState(false); // Loading state for comments
  const [loadingReplies, setLoadingReplies] = useState({}); // Track loading state for replies
  const [error, setError] = useState(""); // Error handling
  const [replyingToCommentId, setReplyingToCommentId] = useState(null); // Track which comment the user is replying to
  const [replyingToReplyId, setReplyingToReplyId] = useState(null); // Track which reply the user is replying to

  // Fetch comments for the movie
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const response = await fetch(`https://couch-potatoes-backend-smoky.vercel.app/comments/${movieId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data.data.comments || []);
        setLoadingComments(false);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch comments at this time.");
        setLoadingComments(false);
      }
    };

    if (movieId) fetchComments();
  }, [movieId]);

  // Fetch replies for a specific comment
  const fetchReplies = async (commentId) => {
    try {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));

      const response = await fetch(`https://couch-potatoes-backend-smoky.vercel.app/comments/replies/${commentId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch replies: ${response.statusText}`);
      }

      const data = await response.json();
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: data.data || [] }
            : comment
        )
      );
      setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
    } catch (err) {
      console.error("Error fetching replies:", err);
      setError("Unable to fetch replies at this time.");
      setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  // Fetch replies to a reply
  const fetchRepliesToReply = async (replyId) => {
    try {
      setLoadingReplies((prev) => ({ ...prev, [replyId]: true }));

      const response = await fetch(`https://couch-potatoes-backend-smoky.vercel.app/comments/replies/${replyId}`);
      console.log(response);
      if (!response.ok) {
        throw new Error(`Failed to fetch replies to reply: ${response.statusText}`);
      }

      const data = await response.json();
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.replies
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply._id === replyId
                    ? { ...reply, replies: data.data || [] }
                    : reply
                ),
              }
            : comment
        )
      );
      setLoadingReplies((prev) => ({ ...prev, [replyId]: false }));
    } catch (err) {
      console.error("Error fetching replies to reply:", err);
      setError("Unable to fetch replies to reply at this time.");
      setLoadingReplies((prev) => ({ ...prev, [replyId]: false }));
    }
  };

  // Handle new comment submission
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("You must be logged in to post a comment.");
      return;
    }

    try {
      const response = await fetch(`https://couch-potatoes-backend-smoky.vercel.app/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          text: newComment,
          movie_id: movieId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const addedComment = await response.json();
      setComments([addedComment.data, ...comments]);
      setNewComment(""); // Reset the new comment input
      setError(""); // Clear any error
    } catch (err) {
      console.error(err);
      setError("Unable to add comment at this time.");
    }
  };

  // Handle new reply submission
  const handleAddReply = async (commentId) => {
    if (!newReplies[commentId].trim()) {
      setError("Reply cannot be empty.");
      return;
    }

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("You must be logged in to post a reply.");
      return;
    }

    try {
      const response = await fetch(`https://couch-potatoes-backend-smoky.vercel.app/comments/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          text: newReplies[commentId],
          comment_id: commentId,
          movie_id: movieId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add reply");
      }

      const addedReply = await response.json();
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [...(comment.replies || []), addedReply.data] }
            : comment
        )
      );
      setNewReplies((prev) => ({ ...prev, [commentId]: "" })); // Reset the reply input
    } catch (err) {
      console.error(err);
      setError("Unable to add reply at this time.");
    }
  };

  // Handle new nested reply submission
  const handleAddNestedReply = async (replyId) => {
    if (!newReplies[replyId].trim()) {
      setError("Reply cannot be empty.");
      return;
    }

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setError("You must be logged in to post a reply.");
      return;
    }

    try {
      const response = await fetch(`https://couch-potatoes-backend-smoky.vercel.app/comments/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          text: newReplies[replyId],
          comment_id: replyId,
          movie_id: movieId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add nested reply");
      }

      const addedNestedReply = await response.json();
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.replies
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply._id === replyId
                    ? { ...reply, replies: [...(reply.replies || []), addedNestedReply.data] }
                    : reply
                ),
              }
            : comment
        )
      );
      setNewReplies((prev) => ({ ...prev, [replyId]: "" })); // Reset the nested reply input
    } catch (err) {
      console.error(err);
      setError("Unable to add nested reply at this time.");
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-4">Comments</h3>

      {loadingComments && <p className="text-gray-500">Loading comments...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Post Comment Section */}
      <div className="my-4">
        <textarea
          className="w-full p-2 border rounded-md"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </div>

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <CommentItem
              key={index}
              comment={comment}
              movieId={movieId}
              setComments={setComments}
              setError={setError}
              setReplyingToCommentId={setReplyingToCommentId}
              replyingToCommentId={replyingToCommentId}
              setReplyingToReplyId={setReplyingToReplyId}
              replyingToReplyId={replyingToReplyId}
              newReplies={newReplies}
              setNewReplies={setNewReplies}
              handleAddReply={handleAddReply}
              handleAddNestedReply={handleAddNestedReply}
              loadingReplies={loadingReplies}
              fetchReplies={fetchReplies}
              fetchRepliesToReply={fetchRepliesToReply}
            />
          ))
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to add one!</p>
        )}
      </div>
    </div>
  );
};

export default Comments;  