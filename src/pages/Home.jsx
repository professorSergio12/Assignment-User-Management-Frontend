import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Alert, Button } from "flowbite-react";
import CreateUser from "./CreateUser";
import { ClipLoader as Spinner } from "react-spinners"; // Import Spinner correctly

export default function Home() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [isCreateUserOpen, setCreateUserOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(false);
        setLoading(true); // Set loading to true before fetching data
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        setData(response.data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();
  }, []);

  const handleUserCreated = (newUser) => {
    setData([...data, newUser]);
  };

  // Function to handle the search input change
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter data based on the search query
  const filteredData = data.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col justify-center min-h-screen bg-black">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          {error ? (
            <Alert color="failure">
              Error occurred while fetching the data.
            </Alert>
          ) : loading ? ( // Show loading spinner while fetching
            <div className="flex justify-center items-center h-64">
              <Spinner size={50} color="blue" />
            </div>
          ) : (
            <>
              <Button onClick={() => setCreateUserOpen(true)} className="mb-4">
                Create User
              </Button>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={handleSearch}
                className="mb-4 p-2 border border-gray-300 rounded"
              />

              <table className="w-full text-sm text-left rtl:text-right text-blue-100 dark:text-blue-100">
                <thead className="text-xs text-white uppercase bg-blue-500 dark:text-white">
                  <tr>
                    <th scope="col" className="px-4 py-2 sm:px-6 sm:py-3">
                      Id
                    </th>
                    <th scope="col" className="px-4 py-2 sm:px-6 sm:py-3">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-2 sm:px-6 sm:py-3">
                      Username
                    </th>
                    <th scope="col" className="px-4 py-2 sm:px-6 sm:py-3">
                      Email
                    </th>
                    <th scope="col" className="px-4 py-2 sm:px-6 sm:py-3">
                      More Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={
                        index % 2 === 0
                          ? "bg-green-500 border-b border-green-400"
                          : "bg-blue-500 border-b border-blue-400"
                      }
                    >
                      <th
                        scope="row"
                        className="px-4 py-2 sm:px-6 sm:py-4 font-medium text-blue-50 whitespace-nowrap dark:text-blue-100"
                      >
                        {item.id}
                      </th>
                      <td className="px-4 py-2 sm:px-6 sm:py-4">{item.name}</td>
                      <td className="px-4 py-2 sm:px-6 sm:py-4">
                        {item.username}
                      </td>
                      <td className="px-4 py-2 sm:px-6 sm:py-4">
                        {item.email}
                      </td>
                      <td className="px-4 py-2 sm:px-6 sm:py-4">
                        <Link
                          to={`/user/${item.id}`}
                          className="font-medium text-white hover:underline"
                        >
                          Click Here
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      <CreateUser
        isOpen={isCreateUserOpen}
        onClose={() => setCreateUserOpen(false)}
        onUserCreated={handleUserCreated}
      />
    </>
  );
}
