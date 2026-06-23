import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function MyBlogs() {

    const [blogs, setBlogs] =
        useState([]);

    const token =
        localStorage.getItem("token");

    const fetchBlogs = async () => {

        try {

            const res =
                await api.get(
                    "/blogs/my-blogs",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setBlogs(res.data);

        } catch (error) {

            console.log(error);

        }
    };

    useEffect(() => {

        fetchBlogs();

    }, []);

    const deleteBlog = async (id) => {

        const confirmDelete =
            window.confirm(
                "Delete this blog?"
            );

        if (!confirmDelete)
            return;

        try {

            await api.delete(
                `/blogs/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            fetchBlogs();

        } catch (error) {

            console.log(error);

        }
    };

    const publishBlog =
        async (id) => {

            try {

                await api.patch(
                    `/blogs/${id}/publish`,
                    {},
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                fetchBlogs();

            } catch (error) {

                console.log(error);

            }
        };

    return (

        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                My Blogs
            </h1>

            {blogs.map(blog => (

                <div
                    key={blog.id}
                    className="border p-4 mb-4 rounded"
                >

                    <h2 className="text-xl font-bold">
                        {blog.title}
                    </h2>

                    <p>
                        Status:
                        {" "}
                        {blog.status}
                    </p>

                    <div className="flex gap-4 mt-3">

                        <Link
                            to={`/edit-blog/${blog.id}`}
                            className="text-blue-500"
                        >
                            Edit
                        </Link>

                        <button
                            onClick={() =>
                                deleteBlog(blog.id)
                            }
                            className="text-red-500"
                        >
                            Delete
                        </button>

                        {
                            blog.status === "DRAFT"
                            &&
                            (
                                <button
                                    onClick={() =>
                                        publishBlog(blog.id)
                                    }
                                    className="text-green-500"
                                >
                                    Publish
                                </button>
                            )
                        }

                    </div>

                </div>

            ))}

        </div>

    );
}

export default MyBlogs;