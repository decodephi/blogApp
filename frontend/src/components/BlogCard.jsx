import { Link } from "react-router-dom";

function BlogCard({ blog }) {

    return (
        <div className="border rounded-lg shadow p-4 bg-white">

            <img
                src={
                    blog.coverImage ||
                    "https://via.placeholder.com/400x200?text=Blog+Image"
                }
                alt={blog.title}
                className="h-48 w-full object-cover rounded"
            />

            <h2 className="text-xl font-bold mt-3">
                {blog.title}
            </h2>

            <p className="text-gray-600 mt-2">
                {
                    blog.summary ||
                    blog.content.slice(0, 120) + "..."
                }
            </p>

            <Link
                to={`/blog/${blog.slug}`}
                className="inline-block mt-3 text-blue-500"
            >
                Read More →
            </Link>

        </div>
    );
}

export default BlogCard;