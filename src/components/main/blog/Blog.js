import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // import Link for navigation
import axios from 'axios';
import '../../../assets/css/blog.css';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // loading state
  const blogsPerPage = 4;

  useEffect(() => {
    // Fetch blog data 
    axios.get('http://localhost:8080/api/blogs')
      .then((response) => {
        console.log(response);
        
        const sortedBlogs = response.data.data.sort((a, b) => {
          // Compare createdAt arrays to sort in descending order
          const dateA = new Date(a.createdAt[0], a.createdAt[1] - 1, a.createdAt[2], a.createdAt[3], a.createdAt[4], a.createdAt[5]);
          const dateB = new Date(b.createdAt[0], b.createdAt[1] - 1, b.createdAt[2], b.createdAt[3], b.createdAt[4], b.createdAt[5]);
          return dateB - dateA; // Sort in descending order (latest first)
        });
        
        setBlogs(sortedBlogs);
        setLoading(false); 
      })
      .catch((error) => {
        console.error('Error fetching blog data:', error);
        setLoading(false); 
      });
  }, []);

  const formatDateTime = (createdAt) => {
    const date = new Date(createdAt[0], createdAt[1] - 1, createdAt[2], createdAt[3], createdAt[4], createdAt[5]);
    const formattedDate = date.toLocaleDateString(); // Format date as MM/DD/YYYY
    const formattedTime = date.toLocaleTimeString(); // Format time as HH:MM:SS
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
                <div className="logo-name"><span>Daily</span> Blogs</div>
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
            <div key={blog.id} className="blog-item">
              <img
                src={blog.thumbnailUrl[0].imageUrl}
                alt={blog.title}
                className="blog-thumbnail"
                style={{
                  width: '550px', // Chiều rộng cố định
                  height: '300px', // Chiều cao cố định
                  borderRadius: '8px',
                  objectFit: 'cover', // Đảm bảo ảnh được cắt hoặc co giãn đúng tỷ lệ
                }}
              />
              <h3>
                <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
              </h3>
              <p>{blog.content.substring(0, 150)}...</p>
              <p><strong>Category:</strong> {blog.category}</p>
              <p><strong>Tags:</strong> {blog.tags}</p>
              <p><strong>Created At:</strong> {formatDateTime(blog.createdAt)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
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
