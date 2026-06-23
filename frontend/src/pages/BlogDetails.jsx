import { useEffect, useState }
from "react";

import { useParams }
from "react-router-dom";

import api from "../api/axios";

function BlogDetails() {

    const { slug } =
        useParams();

    const [blog, setBlog] =
        useState(null);

    const [summary,
        setSummary] =
        useState("");

    useEffect(() => {

        const fetchBlog =
        async () => {

            const res =
            await api.get(
                `/blogs/slug/${slug}`
            );

            setBlog(res.data);
        };

        fetchBlog();

    }, [slug]);

    const getSummary =
    async () => {

        const res =
        await api.get(
            `/blogs/${blog.id}/summary`
        );

        setSummary(
            res.data.summary
        );
    };

    if (!blog)
        return <h1>Loading...</h1>;

    return (

        <div className="max-w-4xl mx-auto">

            <img
                src={blog.coverImage}
                alt={blog.title}
            />

            <h1 className="text-4xl font-bold">

                {blog.title}

            </h1>

            <button
                onClick={getSummary}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Show AI Summary
            </button>

            {summary && (

                <div className="border p-4 mt-4">

                    <h2>
                        AI Summary
                    </h2>

                    <p>
                        {summary}
                    </p>

                </div>

            )}

            <div
                dangerouslySetInnerHTML={{
                    __html: blog.content
                }}
            />

        </div>
    );
}

export default BlogDetails;