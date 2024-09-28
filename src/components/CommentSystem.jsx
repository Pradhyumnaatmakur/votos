import React, { useState, useEffect } from "react";

function CommentSystem({ category, title }) {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [category, title]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments/${category}/${title}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setComments(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (newComment) => {
    try {
      const response = await fetch(`/api/comments/${category}/${title}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const addedComment = await response.json();
      setComments([...comments, addedComment]);
      setError(null);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again.");
    }
  };

  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Comments</h2>
      {/* Render comments and add comment form */}
    </div>
  );
}

export default CommentSystem;
