import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] =
        useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post(
                "/auth/register",
                {
                    name,
                    email,
                    password
                }
            );

            alert(
                "Registration Successful"
            );

            navigate("/login");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Registration Failed"
            );

        }

    };

    return (

        <div className="max-w-md mx-auto mt-10">

            <h1 className="text-3xl font-bold mb-6">
                Register
            </h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Name"
                    className="border w-full p-2 mb-4"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                />

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
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Register
                </button>

            </form>

        </div>

    );
}

export default Register;