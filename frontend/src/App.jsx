import { useEffect, useState } from "react";
import API from "./api/axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBackend = async () => {
      try {
        const response = await API.get("/");

        setMessage(response.data.message);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBackend();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        {message}
      </h1>
    </div>
  );
}

export default App;
