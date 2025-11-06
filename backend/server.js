require("dotenv").config();

console.log(process.env.JWT_SECRET);

const PORT = 5000;

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// in memory storage for blogs, change to database for production
let blogs = [];

// Middleware
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err || user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    req.user = user;
    next();
  });
};

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { username, role: "admin" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    console.log("Login Successfully!");
    return res.json({ token });
  }

  return res.status(401).json({ error: "Invalid username or password" });
});

app.post("/api/create-blog", (req, res) => {
  const { title, content } = req.body;

  const newBlog = {
    id: Date.now().toString(),
    title,
    content,
    createdAt: new Date().toISOString(),
  };

  blogs.push(newBlog);
  console.log(`Blog Created: ${newBlog}`);

  return res
    .status(201)
    .json({ message: "Blog created successfully ", blog: newBlog });
});

app.get("/api/blogs", (req, res) => {
  const sortedBlogs = [...blogs].reverse();
  return res.json({ sortedBlogs });
});

app.get("/api/blogs/:id", (req, res) => {
  const blog = blogs.find((b) => b.id === req.params.id);
  if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }
  return res.json({ blog });
});

app.delete("/api/blogs/:id", verifyAdmin, (req, res) => {
  const { password } = req.body;

  if (password !== process.env.DELETE_PASSWORD) {
    return res.status(403).json({ error: "Invalid password" });
  }

  const blogIndex = blogs.findIndex((b) => b.id === req.params.id);

  if (blogIndex === -1) {
    return res.status(404).json({ error: "Blog not found" });
  }

  blogs.splice(blogIndex, 1);
  console.log(`Blog deleted ${req.params.id}`);

  return res.json({ message: "Blog deleted successfully" });
});

app.put("/api/blogs/:id", verifyAdmin, (req, res) => {
  const { title, content } = req.body;
  const blogIndex = blogs.findIndex((b) => b.id === req.params.id);

  if (blogIndex === -1) {
    return res.status(404).json({ error: "Blog not found" });
  }

  blogs[blogIndex] = {
    ...blogs[blogIndex],
    title,
    content,
  };

  console.log(`Blog updated ${blogs[blogIndex]}`);

  return res.json({
    message: "Blog updated successfully",
    blog: blogs[blogIndex],
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
