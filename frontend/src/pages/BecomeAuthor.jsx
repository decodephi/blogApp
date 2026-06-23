import { useState } from "react";
import api from "../api/axios";

function BecomeAuthor() {

    const [message, setMessage] = useState("");

    const requestAuthor = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const res = await api.post(
                "/author-requests",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(res.data.message);

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Something went wrong"
            );

        }
    };

    return (

        <div className="max-w-md mx-auto mt-10">

            <h1 className="text-3xl font-bold mb-4">
                Become Author
            </h1>

            <button
                onClick={requestAuthor}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Request Author Access
            </button>

            {message && (
                <p className="mt-4">
                    {message}
                </p>
            )}

        </div>

    );
}

export default BecomeAuthor;