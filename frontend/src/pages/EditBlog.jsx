import { useEffect, useState } from "react";
import { useParams, useNavigate }
from "react-router-dom";

import api from "../api/axios";

function EditBlog() {

    const { id } =
        useParams();

    const navigate =
        useNavigate();

    const [title, setTitle] =
        useState("");

    const [content, setContent] =
        useState("");

    const token =
        localStorage.getItem("token");

    useEffect(() => {

        const fetchBlog =
            async () => {

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

                    const blog =
                        res.data.find(
                            b => b.id === id
                        );

                    if (blog) {

                        setTitle(blog.title);

                        setContent(
                            blog.content
                        );

                    }

                } catch (error) {

                    console.log(error);

                }

            };

        fetchBlog();

    }, [id]);

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            try {

                await api.put(
                    `/blogs/${id}`,
                    {
                        title,
                        content
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                navigate(
                    "/my-blogs"
                );

            } catch (error) {

                console.log(error);

            }
        };

    return (

        <div className="max-w-2xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6">
                Edit Blog
            </h1>

            <form
                onSubmit={
                    handleSubmit
                }
            >

                <input
                    type="text"
                    value={title}
                    onChange={(e) =>
                        setTitle(
                            e.target.value
                        )
                    }
                    placeholder="Title"
                    className="border w-full p-2 mb-4"
                />

                <textarea
                    value={content}
                    onChange={(e) =>
                        setContent(
                            e.target.value
                        )
                    }
                    rows="10"
                    className="border w-full p-2 mb-4"
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Update Blog
                </button>

            </form>

        </div>

    );
}

export default EditBlog;