import { Link }
from "react-router-dom";

function BlogCard({ blog }) {

    return (

        <div className="border p-4 rounded">

            <img
                src={blog.coverImage}
                alt={blog.title}
                className="h-48 w-full object-cover"
            />

            <h2 className="text-xl font-bold mt-2">
                {blog.title}
            </h2>

            <p>
                {blog.summary}
            </p>

            <Link
                to={`/blog/${blog.slug}`}
                className="text-blue-500"
            >
                Read More
            </Link>

        </div>

    );
}

export default BlogCard;