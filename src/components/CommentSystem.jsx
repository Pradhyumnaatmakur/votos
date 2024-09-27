import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserTie,
  faUserNinja,
  faUserAstronaut,
  faUserSecret,
} from "@fortawesome/free-solid-svg-icons";

const avatars = [faUser, faUserTie, faUserNinja, faUserAstronaut, faUserSecret];

const CommentSystem = ({ contentId, category }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    content: "",
  });
  const [visibleComments, setVisibleComments] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [contentId, category]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/${category}/${contentId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewComment({ ...newComment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!newComment.name || !newComment.email || !newComment.content) {
      alert("All fields are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/comments/${category}/${contentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newComment,
          avatar: Math.floor(Math.random() * avatars.length),
          timestamp: new Date().toISOString(),
        }),
      });
      if (response.ok) {
        setNewComment({ name: "", email: "", content: "" });
        fetchComments();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadMoreComments = () => {
    setVisibleComments((prevVisible) => prevVisible + 5);
  };

  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Comments</h2>
      {comments.length > 0 ? (
        <div className="mb-8 space-y-4">
          {comments.slice(0, visibleComments).map((comment, index) => (
            <div
              key={comment.timestamp}
              className="border border-gray-300 rounded-lg p-4 bg-white"
            >
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <FontAwesomeIcon
                    icon={avatars[comment.avatar]}
                    className="text-gray-600 text-xl"
                  />
                </div>
                <span className="font-bold text-lg">{comment.name}</span>
              </div>
              <p className="mt-2 text-gray-700">{comment.content}</p>
            </div>
          ))}
          {visibleComments < comments.length && (
            <button
              onClick={loadMoreComments}
              className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Load More Comments
            </button>
          )}
        </div>
      ) : (
        <p className="mb-4 text-center text-gray-600">
          No comments yet. Be the first to comment!
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newComment.name}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={newComment.email}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label htmlFor="content" className="block mb-1 font-medium">
            Comment:
          </label>
          <textarea
            id="content"
            name="content"
            value={newComment.content}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            rows="4"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Publish Comment"}
        </button>
      </form>
    </div>
  );
};

export default CommentSystem;
