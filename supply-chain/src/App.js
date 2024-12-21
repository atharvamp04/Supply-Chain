import React, { useState, useEffect } from "react";
import { ethers } from "ethers"; // Updated import to ethers directly
import "./App.css";

const App = () => {
  const [contract, setContract] = useState(null);
  const [productId, setProductId] = useState("");
  const [productDetails, setProductDetails] = useState(null);

  const [productName, setProductName] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [certificationDetails, setCertificationDetails] = useState("");

  const [location, setLocation] = useState("");
  const [checkpoint, setCheckpoint] = useState("");

  const [certifyingAuthority, setCertifyingAuthority] = useState("");
  const [certificationType, setCertificationType] = useState("");

  const [userType, setUserType] = useState(""); // New state for user type
  const [userName, setUserName] = useState(""); // New state for user name

  // Define contract address here
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Example address

  // ABI (replace this with your actual ABI)
  const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "productId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "productName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "supplierName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "certificationDetails",
          "type": "string"
        }
      ],
      "name": "registerProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "productId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "location",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "checkpoint",
          "type": "string"
        }
      ],
      "name": "updateLocation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "productId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "certifyingAuthority",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "certificationType",
          "type": "string"
        }
      ],
      "name": "addCertification",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "productId",
          "type": "string"
        }
      ],
      "name": "getProduct",
      "outputs": [
        {
          "internalType": "string",
          "name": "productName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "supplierName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "certificationDetails",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "currentCheckpoint",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "delivered",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "userType",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "userName",
          "type": "string"
        }
      ],
      "name": "registerUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  // Connect to the contract
  const connectContract = async () => {
    if (!window.ethereum) {
      console.error("MetaMask is not installed or detected.");
      alert("MetaMask is not installed or detected.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length === 0) {
        throw new Error("No account found in MetaMask.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      setContract(contractInstance);
      console.log("Contract connected successfully.");
    } catch (error) {
      console.error("Error connecting to MetaMask or the contract:", error);
      alert(`Failed to connect to MetaMask or the contract: ${error.message}`);
    }
  };

  // Register a product
  const registerProduct = async () => {
    if (!contract) {
      console.error("Contract is not initialized.");
      return;
    }

    try {
      const tx = await contract.registerProduct(
        productId,
        productName,
        supplierName,
        certificationDetails
      );
      await tx.wait();
      alert("Product registered successfully!");
    } catch (error) {
      console.error("Error registering product:", error);
    }
  };

  // Update product location
  const updateLocation = async () => {
    if (!contract) {
      console.error("Contract is not initialized.");
      return;
    }

    try {
      const tx = await contract.updateLocation(productId, location, checkpoint);
      await tx.wait();
      alert("Location updated successfully!");
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  // Add certification
  const addCertification = async () => {
    if (!contract) {
      console.error("Contract is not initialized.");
      return;
    }

    try {
      const tx = await contract.addCertification(
        productId,
        certifyingAuthority,
        certificationType
      );
      await tx.wait();
      alert("Certification added successfully!");
    } catch (error) {
      console.error("Error adding certification:", error);
    }
  };

  // Fetch product details
  const getProductDetails = async () => {
    try {
      if (!productId) {
        alert("Please enter a valid product ID.");
        return;
      }

      const product = await contract.getProduct(productId);
      console.log("Product details:", product);

      if (product && product[0] && product[0] !== "0x" && product[0] !== "") {
        setProductDetails({
          productName: product[0],
          supplierName: product[1],
          certificationDetails: product[2],
          currentCheckpoint: product[3],
          isDelivered: product[4] ? "Delivered" : "Not Delivered",
        });
      } else {
        alert("No product found with the provided ID.");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      alert(`Error fetching product details: ${error.message}`);
    }
  };

  // Register user as a supplier, manufacturer, regulator, logistics, or retailer
  const registerUser = async () => {
    if (!contract || !userType || !userName) {
      console.error("Contract is not initialized, user type or user name is missing.");
      return;
    }

    try {
      const tx = await contract.registerUser(userType, userName);
      await tx.wait();
      alert("User registered successfully!");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  useEffect(() => {
    connectContract();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Supply Chain Management</h1>

      {/* Register User */}
      <div className="mt-4">
        <h3>Register User</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter Your Name"
            className="form-control my-2"
            onChange={(e) => setUserName(e.target.value)}
          />
          <select
            className="form-control my-2"
            onChange={(e) => setUserType(e.target.value)}
            value={userType}
          >
            <option value="">Select User Type</option>
            <option value="1">Supplier</option>
            <option value="2">Manufacturer</option>
            <option value="3">Regulator</option>
            <option value="4">Logistics</option>
            <option value="5">Retailer</option>
          </select>
          <button className="btn btn-primary" onClick={registerUser}>
            Register User
          </button>
        </div>
      </div>

      {/* Register Product */}
      <div className="mt-4">
        <h3>Register Product</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Product ID"
            className="form-control my-2"
            onChange={(e) => setProductId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Product Name"
            className="form-control my-2"
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Supplier Name"
            className="form-control my-2"
            onChange={(e) => setSupplierName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Certification Details"
            className="form-control my-2"
            onChange={(e) => setCertificationDetails(e.target.value)}
          />
          <button className="btn btn-primary" onClick={registerProduct}>
            Register Product
          </button>
        </div>
      </div>

      {/* Update Location */}
      <div className="mt-4">
        <h3>Update Location</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            className="form-control my-2"
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="Checkpoint"
            className="form-control my-2"
            onChange={(e) => setCheckpoint(e.target.value)}
          />
          <button className="btn btn-primary" onClick={updateLocation}>
            Update Location
          </button>
        </div>
      </div>

      {/* Add Certification */}
      <div className="mt-4">
        <h3>Add Certification</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Certifying Authority"
            className="form-control my-2"
            onChange={(e) => setCertifyingAuthority(e.target.value)}
          />
          <input
            type="text"
            placeholder="Certification Type"
            className="form-control my-2"
            onChange={(e) => setCertificationType(e.target.value)}
          />
          <button className="btn btn-primary" onClick={addCertification}>
            Add Certification
          </button>
        </div>
      </div>

      

      {/* Display Product Details */}
      <div className="mt-4">
        <h3>Get Product Details</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter Product ID"
            className="form-control my-2"
            onChange={(e) => setProductId(e.target.value)}
          />
          <button className="btn btn-primary" onClick={getProductDetails}>
            Get Product Details
          </button>
        </div>
        {productDetails && (
          <div className="mt-4">
            <h4>Product Details</h4>
            <p><strong>Product Name:</strong> {productDetails.productName}</p>
            <p><strong>Supplier Name:</strong> {productDetails.supplierName}</p>
            <p><strong>Certification Details:</strong> {productDetails.certificationDetails}</p>
            <p><strong>Current Checkpoint:</strong> {productDetails.currentCheckpoint}</p>
            <p><strong>Status:</strong> {productDetails.isDelivered}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
