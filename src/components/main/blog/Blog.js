import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DataContext } from '../../helpers/DataContext'; // Adjust path as needed
import '../../../assets/css/blog.css';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(DataContext); // Get user context
  const blogsPerPage = 6;

  useEffect(() => {
    axios.get('http://localhost:8082/api/blogs')
      .then((response) => {
        console.log(response);
        
        const sortedBlogs = response.data.data.sort((a, b) => {
          const dateA = new Date(a.createdAt[0], a.createdAt[1] - 1, a.createdAt[2], a.createdAt[3], a.createdAt[4], a.createdAt[5]);
          const dateB = new Date(b.createdAt[0], b.createdAt[1] - 1, b.createdAt[2], b.createdAt[3], b.createdAt[4], b.createdAt[5]);
          return dateB - dateA;
        });
        
        setBlogs(sortedBlogs);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching blog data:', error);
        setLoading(false);
      });
  }, []);

  const handleBlogClick = (blogId) => {
    if (!user) {
      // If user is not logged in, redirect to login page
      navigate('/login');
    } else {
      // If user is logged in, navigate to blog detail page
      navigate(`/blog/${blogId}`);
    }
  };

  const formatDateTime = (createdAt) => {
    const date = new Date(createdAt[0], createdAt[1] - 1, createdAt[2], createdAt[3], createdAt[4], createdAt[5]);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return `${formattedDate} ${formattedTime}`;
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const nextPage = () => {
    if (currentPage < Math.ceil(blogs.length / blogsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <section id="services">
      <div style={{ textAlign: "center", marginTop: "50px", marginBottom: "40px" }}>
        <div href="#" className="logo">
        <span className="daily-text">Daily</span> <span className="blogs-text">Blogs</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner" style={{ textAlign: 'center', marginTop: '50px' }}>
          <div className="spinner"></div> 
          <p>Loading...</p>
        </div>
      ) : (
        <div className="blog-list">
          {currentBlogs.map((blog) => (
            <div 
              key={blog.id} 
              className="blog-item" 
              onClick={() => handleBlogClick(blog.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="blog-thumbnail-container">
                <img
                  src={blog.thumbnailUrl[0].imageUrl}
                  alt={blog.title}
                  className="blog-thumbnail"
                />
              </div>
              <div className="blog-content">
                <h3>{blog.title}</h3>
                <p>{blog.content.substring(0, 150)}...</p>
                <p><strong>Category:</strong> {blog.category}</p>
                <p><strong>Tags:</strong> {blog.tags}</p>
                <p><strong>Created At:</strong> {formatDateTime(blog.createdAt)}</p>
                <div className="blog-stats">
                  <span className="blog-likes">{blog.likesCount} Likes</span>
                  <span className="blog-views">{blog.viewCount} Views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination" style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>

        <span style={{ margin: '0 15px', fontSize: '18px', fontWeight: 'bold' }}>
          Page {currentPage} of {Math.ceil(blogs.length / blogsPerPage)}
        </span>

        <button onClick={nextPage} disabled={currentPage >= Math.ceil(blogs.length / blogsPerPage)}>
          Next
        </button>
      </div>
    </section>
  );
};

export default Blog;