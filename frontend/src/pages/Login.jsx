import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const { login } = useAuth();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            login(
                res.data.user,
                res.data.token
            );

            navigate("/dashboard");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Login Failed"
            );

        }
    };

    return (

        <div className="max-w-md mx-auto mt-10">

            <h1 className="text-3xl font-bold mb-6">
                Login
            </h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    placeholder="Email"
                    className="border w-full p-2 mb-4"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="border w-full p-2 mb-4"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Login
                </button>

            </form>

        </div>

    );
}

export default Login;