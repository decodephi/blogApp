import Navbar
  from "./components/Navbar";

import Home
  from "./pages/Home";

import BlogDetails
  from "./pages/BlogDetails";

import {
  Routes,
  Route
}
  from "react-router-dom";



function App() {

  return (

    <>
      <Navbar />

      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/blog/:slug"
          element={<BlogDetails />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-blog"
          element={
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
          }
        />


        <Route
          path="/my-blogs"
          element={
            <ProtectedRoute>
              <MyBlogs />
            </ProtectedRoute>
          }
        />


        <Route
          path="/become-author"
          element={<BecomeAuthor />}
        />

        <Route
          path="/my-blogs"
          element={<MyBlogs />}
        />

        <Route
          path="/edit-blog/:id"
          element={<EditBlog />}
        />

      </Routes>

    </>

  );
}

export default App;
