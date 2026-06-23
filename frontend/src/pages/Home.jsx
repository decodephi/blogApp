import { useEffect, useState }
from "react";

import api from "../api/axios";

import BlogCard
from "../components/BlogCard";

function Home() {

    const [blogs, setBlogs] =
        useState([]);

    useEffect(() => {

        const fetchBlogs =
        async () => {

            const res =
            await api.get("/blogs");

            setBlogs(res.data);
        };

        fetchBlogs();

    }, []);

    return (

<div className="max-w-7xl mx-auto p-6">

    <h1 className="text-4xl font-bold mb-8">
        Latest Blogs
    </h1>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {blogs.map((blog) => (
            <BlogCard
                key={blog.id}
                blog={blog}
            />
        ))}

    </div>

</div>

    );
}

export default Home;