import React, { useState } from "react";
import { Modal, Button, TextInput } from "flowbite-react"; // Ensure this import is correct
import axios from "axios";

const CreateUser = ({ isOpen, onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    website: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.name || formData.name.length < 3) {
      errors.name = "Name is required and must be at least 3 characters.";
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is required and must be a valid email.";
    }
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number is required and must be 10 digits.";
    }
    if (formData.username && formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters.";
    }
    if (!formData.address) {
      errors.address = "Address is required.";
    }
    if (formData.company && formData.company.length < 3) {
      errors.company = "Company name must be at least 3 characters.";
    }
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      errors.website = "Website must be a valid URL.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post("https://jsonplaceholder.typicode.com/users", formData);
      onUserCreated(response.data);
      onClose();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} className="flex items-center justify-center h-screen">
      <Modal.Header className="text-lg font-bold">Create User</Modal.Header>
      <Modal.Body className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextInput
              type="text"
              name="name"
              value={formData.name}
              placeholder="Name"
              onChange={handleInputChange}
              required
            />
            {formErrors.name && <p className="text-red-500">{formErrors.name}</p>}
          </div>
          <div className="mb-4">
            <TextInput
              type="text"
              name="username"
              value={formData.username}
              placeholder="Username"
              onChange={handleInputChange}
            />
            {formErrors.username && <p className="text-red-500">{formErrors.username}</p>}
          </div>
          <div className="mb-4">
            <TextInput
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleInputChange}
              required
            />
            {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}
          </div>
          <div className="mb-4">
            <TextInput
              type="text"
              name="phone"
              value={formData.phone}
              placeholder="Phone"
              onChange={handleInputChange}
              required
            />
            {formErrors.phone && <p className="text-red-500">{formErrors.phone}</p>}
          </div>
          <div className="mb-4">
            <TextInput
              type="text"
              name="address"
              value={formData.address}
              placeholder="Address"
              onChange={handleInputChange}
              required
            />
            {formErrors.address && <p className="text-red-500">{formErrors.address}</p>}
          </div>
          <div className="mb-4">
            <TextInput
              type="text"
              name="company"
              value={formData.company}
              placeholder="Company"
              onChange={handleInputChange}
            />
            {formErrors.company && <p className="text-red-500">{formErrors.company}</p>}
          </div>
          <div className="mb-4">
            <TextInput
              type="text"
              name="website"
              value={formData.website}
              placeholder="Website"
              onChange={handleInputChange}
            />
            {formErrors.website && <p className="text-red-500">{formErrors.website}</p>}
          </div>
          <div className="flex justify-between">
            <Button type="submit">Create User</Button>
            <Button onClick={onClose} color="gray">
              Cancel
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateUser;
