import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Button } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "flowbite-react";

export default function Details() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(false);
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/users/${id}`
        );
        setData(response.data);
        setUpdatedData(response.data);
      } catch (error) {
        setError(true);
      }
    };

    fetchData();
  }, [id]);

  const handleEditClick = () => {
    setIsModalOpen(true);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!updatedData.name || updatedData.name.length < 3) {
      errors.name = "Name is required and must be at least 3 characters.";
    }
    if (!updatedData.email || !/\S+@\S+\.\S+/.test(updatedData.email)) {
      errors.email = "Email is required and must be a valid email format.";
    }
    if (!updatedData.phone || !/^\d{10}$/.test(updatedData.phone)) {
      errors.phone = "Phone is required and must be a valid phone number.";
    }
    if (updatedData.username && updatedData.username.length < 3) {
      errors.username = "Username must be at least 3 characters.";
    }
    if (
      !updatedData.address ||
      !updatedData.address.street ||
      !updatedData.address.city
    ) {
      errors.address = "Address (Street and City) is required.";
    }
    if (updatedData.company?.name && updatedData.company.name.length < 3) {
      errors.companyName =
        "Company Name must be at least 3 characters if provided.";
    }
    if (updatedData.website && !/^https?:\/\/.+/.test(updatedData.website)) {
      errors.website = "Website must be a valid URL if provided.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return; // Validate form before updating
    try {
      await axios.put(
        `https://jsonplaceholder.typicode.com/users/${id}`,
        updatedData
      );
      setData(updatedData);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      alert("User deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full max-w-md">
        {error ? (
          <Alert color="failure">Error occurred while fetching the data.</Alert>
        ) : (
          <div>
            <table className="w-full text-sm text-left rtl:text-right text-blue-600 dark:text-blue-100">
              <tbody>
                <tr>
                  <td className="font-bold">ID</td>
                  <td>{data.id || "NULL"}</td>
                </tr>
                <tr>
                  <td className="font-bold">Name</td>
                  <td>{data.name || "NULL"}</td>
                </tr>
                <tr>
                  <td className="font-bold">Username</td>
                  <td>{data.username || "NULL"}</td>
                </tr>
                <tr>
                  <td className="font-bold">Email</td>
                  <td>{data.email || "NULL"}</td>
                </tr>
                <tr>
                  <td className="font-bold">Address</td>
                  <td>
                    {data.address
                      ? `${data.address.street}, ${data.address.city}, ${data.address.zipcode}`
                      : "NULL"}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold">Phone</td>
                  <td>{data.phone || "NULL"}</td>
                </tr>
                <tr>
                  <td className="font-bold">Website</td>
                  <td>{data.website || "NULL"}</td>
                </tr>
                <tr>
                  <td className="font-bold">Company</td>
                  <td>{data.company ? data.company.name : "NULL"}</td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <Button onClick={handleEditClick} gradientDuoTone="purpleToPink">
                Edit
              </Button>
              <Button
                onClick={() => setIsDeleting(true)}
                gradientDuoTone="purpleToPink"
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Edit User</Modal.Header>
        <Modal.Body>
          <div>
            <label className="block mb-2">Name</label>
            <input
              type="text"
              value={updatedData.name}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, name: e.target.value })
              }
              className={`border rounded px-2 py-1 w-full ${
                formErrors.name ? "border-red-500" : ""
              }`}
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs">{formErrors.name}</p>
            )}

            <label className="block mb-2">Username (auto-filled)</label>
            <input
              type="text"
              value={`USER-${data.username}`}
              readOnly
              className="border rounded px-2 py-1 w-full"
            />
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={updatedData.email}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, email: e.target.value })
              }
              className={`border rounded px-2 py-1 w-full ${
                formErrors.email ? "border-red-500" : ""
              }`}
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs">{formErrors.email}</p>
            )}

            <label className="block mb-2">Phone</label>
            <input
              type="text"
              value={updatedData.phone}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, phone: e.target.value })
              }
              className={`border rounded px-2 py-1 w-full ${
                formErrors.phone ? "border-red-500" : ""
              }`}
            />
            {formErrors.phone && (
              <p className="text-red-500 text-xs">{formErrors.phone}</p>
            )}

            <label className="block mb-2">Website</label>
            <input
              type="text"
              value={updatedData.website}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, website: e.target.value })
              }
              className={`border rounded px-2 py-1 w-full ${
                formErrors.website ? "border-red-500" : ""
              }`}
            />
            {formErrors.website && (
              <p className="text-red-500 text-xs">{formErrors.website}</p>
            )}

            <label className="block mb-2">Company</label>
            <input
              type="text"
              value={updatedData.company?.name || ""}
              onChange={(e) =>
                setUpdatedData({
                  ...updatedData,
                  company: { ...updatedData.company, name: e.target.value },
                })
              }
              className={`border rounded px-2 py-1 w-full ${
                formErrors.companyName ? "border-red-500" : ""
              }`}
            />
            {formErrors.companyName && (
              <p className="text-red-500 text-xs">{formErrors.companyName}</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleUpdate}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Update
          </Button>
          <Button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={isDeleting} onClose={() => setIsDeleting(false)}>
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this user?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Yes, Delete
          </Button>
          <Button
            onClick={() => setIsDeleting(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
