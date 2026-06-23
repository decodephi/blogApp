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

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/blog/:slug"
          element={<BlogDetails />}
        />

      </Routes>

    </>

  );
}

export default App;
