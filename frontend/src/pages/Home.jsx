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

        <div className="grid grid-cols-3 gap-4 p-4">

            {blogs.map(blog => (

                <BlogCard
                    key={blog.id}
                    blog={blog}
                />

            ))}

        </div>

    );
}

export default Home;