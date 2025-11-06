import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Header from "./components/Header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "./components/ui/dialog";
import { toast } from "sonner";

interface BlogDetailsProps {
  token: string | null;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

interface Blog {
  token: string;
  title: string;
  content: string;
  createdAt: string;
}

interface JwtPaylod {
  username: string;
  role: string;
}

const BlogDetails: React.FC<BlogDetailsProps> = ({
  token,
  onLogout,
  darkMode,
  setDarkMode,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Check user is admin
  let isAdmin = false;
  if (token && token !== "guest-token") {
    try {
      const decoded = jwtDecode<JwtPaylod>(token);
      isAdmin = decoded.role === "admin";
    } catch (error) {
      console.error(`Invalid token: ${error}`);
    }
  }

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(res.data.blog);
        setEditTitle(res.data.blog.title);
        setEditContent(res.data.blog.content);
      } catch (error) {
        console.error(`Error fetching blog: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (!deletePassword) {
      setDeleteError("Please enter password");
      return;
    }
    setIsDeleting(true);
    setDeleteError("");
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { password: deletePassword },
      });

      toast.error("Blog deleted successfully!");
      setIsDialogOpen(false);
      setTimeout(() => navigate("/"), 500);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Failed ot delete blog";
      setDeleteError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/blogs/${id}`,
        {
          title: editTitle,
          content: editContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlog(res.data.blog);
      setIsEditing(false);
      toast.success("Blog updated successfully!");
    } catch (error) {
      console.error(`Failed to update blog ${error}`);
      toast.error("Failed to update blog!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <Header
          token={token}
          onLogout={onLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <Header
          token={token}
          onLogout={onLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <p className="text-gray-600 dark:text-gray-400">Blog not found.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 active:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <Header
        token={token}
        onLogout={onLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate("/")}
          className="mb-4 text-white bg-blue-500 rounded-md px-4 py-2 hover:bg-blue-600 cursor-pointer active:bg-blue-700"
        >
          ← Back to all blogs
        </button>
        {isEditing ? (
          <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold dark:text-white mb-4">
              Edit Blog
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-00 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 active:bg-green-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <article className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold dark:text-white mb-6">
              {blog.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-white mb-6">
              {new Date(blog.createdAt).toLocaleDateString()}
            </p>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {blog.content}
              </p>
            </div>
          </article>
        )}
        {/* Admin Buttons */}
        {isAdmin && !isEditing && (
          <div className="flex gap-4 mt-6">
            <Dialog>
              <DialogTrigger asChild>
                <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 active:bg-red-700">
                  Delete
                </button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-gray-700">
                <DialogHeader>
                  <DialogTitle className="dark:text-white">
                    Are you absolutely sure?
                  </DialogTitle>
                  <DialogDescription className="dark:text-gray-300">
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <input
                    placeholder="Enter password to delete..."
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {deleteError && <p>{deleteError}</p>}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                      Cancel
                    </button>
                  </DialogClose>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 active:bg-blue-700"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
