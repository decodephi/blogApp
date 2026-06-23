import { Link } from "react-router-dom";

import { useAuth }
from "../context/AuthContext";

function Navbar() {

    const { user, logout } =
        useAuth();

    return (

        <nav className="bg-black text-white p-4">

            <div className="flex justify-between">

                <Link to="/">
                    Home
                </Link>

                <div className="space-x-4">

                    {!user && (

                        <>
                            <Link to="/login">
                                Login
                            </Link>

                            <Link to="/register">
                                Register
                            </Link>
                        </>

                    )}

                    {user && (

                        <>
                            <Link to="/dashboard">
                                Dashboard
                            </Link>

                            <button
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </>

                    )}

                </div>

            </div>

        </nav>

    );
}

export default Navbar;