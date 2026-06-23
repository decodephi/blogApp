import { useEffect, useState } from "react";
import api from "../api/axios";

function Dashboard() {

    const [stats, setStats] =
        useState({});

    useEffect(() => {

        const fetchStats =
            async () => {

                try {

                    const token =
                        localStorage.getItem(
                            "token"
                        );

                    const res =
                        await api.get(
                            "/dashboard/stats",
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`
                                }
                            }
                        );

                    setStats(
                        res.data
                    );

                } catch (error) {

                    console.log(error);

                }

            };

        fetchStats();

    }, []);

    return (

        <div className="p-6">

            <h1 className="text-3xl font-bold mb-6">
                Dashboard
            </h1>

            <div className="grid grid-cols-2 gap-4">

                <div className="border p-4">
                    Total Blogs:
                    {" "}
                    {stats.totalBlogs || 0}
                </div>

                <div className="border p-4">
                    Total Views:
                    {" "}
                    {stats.totalViews || 0}
                </div>

                <div className="border p-4">
                    Total Likes:
                    {" "}
                    {stats.totalLikes || 0}
                </div>

                <div className="border p-4">
                    Total Bookmarks:
                    {" "}
                    {stats.totalBookmarks || 0}
                </div>

            </div>

        </div>

    );
}

export default Dashboard;