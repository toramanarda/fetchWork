import { useEffect, useState } from 'react';
import '../App.css';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 30;

  const fetchPosts = async () => {
    try {
      const response = await fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${(page - 1) * limit}`);
      const data = await response.json();
      setPosts(data.posts);
      setTotalPages(Math.ceil(data.total / limit));
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await fetch(`https://dummyjson.com/posts/${postId}/comments`);
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  const filterPosts = (posts, searchTerm) => {
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterPosts(posts, term);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    fetchComments(post.id);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    setComments([]);
  };

  const changePage = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  useEffect(() => {
    filterPosts(posts, searchTerm);
  }, [posts, searchTerm]);

  return (
    <div className="container">
      <header className="header">
        <h1>Posts Dashboard</h1>
        <div className="search">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </header>

      <div className="postsList">
        {filteredPosts.map(post => (
          <div
            className="postItem"
            key={post.id}
            onDoubleClick={() => handlePostClick(post)}>
            <h4>{post.title}</h4>
            <p>{post.body}</p>
            <div className="tags">
              <strong>Tags:</strong> {post.tags.join(', ')}
            </div>
            <div className="reactions">
              <strong>Likes:</strong> {post.reactions.likes}
              <strong>Dislikes:</strong> {post.reactions.dislikes}
            </div>
            <div className="views">
              <strong>Views:</strong> {post.views}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <ul className="pagination">
          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); if (page > 1) changePage(page - 1); }}>&lt;</a>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
            <li key={num}>
              <a
                href="#"
                className={page === num ? 'activePage' : ''}
                onClick={(e) => { e.preventDefault(); changePage(num); }}
              >
                {num}
              </a>
            </li>
          ))}
          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); if (page < totalPages) changePage(page + 1); }}>&gt;</a>
          </li>
        </ul>
      )}

      {selectedPost && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>{selectedPost.title}</h2>
            <p>{selectedPost.body}</p>
            <div className="tags">
              <strong>Tags:</strong> {selectedPost.tags.join(', ')}
            </div>
            <div className="reactions">
              <strong>Likes:</strong> {selectedPost.reactions.likes} <strong>Dislikes:</strong> {selectedPost.reactions.dislikes}
            </div>
            <div className="comments">
              <h3>Comments ({comments.length})</h3>
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div className="comment" key={comment.id}>
                    <p><strong>{comment.userId}</strong>: {comment.body}</p>
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
