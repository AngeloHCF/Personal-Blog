import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Blog {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(res.data.sortedBlogs);
      } catch (error) {
        console.error(`Error fetched blogs: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <p className="text-gray-600 dark:text-gray-400">Loading blogs...</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          No blogs yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        All Blogs
      </h2>
      <div className="space-y-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            onClick={() => navigate(`/blog/${blog.id}`)}
            className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {blog.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 line-clamp-2">
              {blog.content}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              {new Date(blog.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
