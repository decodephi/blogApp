import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function CreateBlog() {

    const [title, setTitle] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [content, setContent] =
        useState("");

    const [image, setImage] =
        useState(null);

    const navigate =
        useNavigate();

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );

                const formData =
                    new FormData();

                formData.append(
                    "title",
                    title
                );

                formData.append(
                    "category",
                    category
                );

                formData.append(
                    "content",
                    content
                );

                if (image) {

                    formData.append(
                        "image",
                        image
                    );

                }

                await api.post(
                    "/blogs",
                    formData,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                alert(
                    "Blog Created"
                );

                navigate(
                    "/my-blogs"
                );

            } catch (error) {

                console.log(error);

                alert(
                    "Failed To Create Blog"
                );

            }

        };

    return (

        <div className="max-w-3xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6">
                Create Blog
            </h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Title"
                    className="border w-full p-2 mb-4"
                    value={title}
                    onChange={(e) =>
                        setTitle(
                            e.target.value
                        )
                    }
                />

                <input
                    type="text"
                    placeholder="Category"
                    className="border w-full p-2 mb-4"
                    value={category}
                    onChange={(e) =>
                        setCategory(
                            e.target.value
                        )
                    }
                />

                <textarea
                    rows="10"
                    placeholder="Content"
                    className="border w-full p-2 mb-4"
                    value={content}
                    onChange={(e) =>
                        setContent(
                            e.target.value
                        )
                    }
                />

                <input
                    type="file"
                    className="mb-4"
                    onChange={(e) =>
                        setImage(
                            e.target.files[0]
                        )
                    }
                />

                <button
                    type="submit"
                    className="bg-purple-500 text-white px-4 py-2 rounded"
                >
                    Create Blog
                </button>

            </form>

        </div>

    );
}

export default CreateBlog;