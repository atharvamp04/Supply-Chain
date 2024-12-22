// App.js
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import RegisterUser from "./components/RegisterUser";
import RegisterProduct from "./components/RegisterProduct";
import UpdateLocation from "./components/UpdateLocation";
import AddCertification from "./components/AddCertification";
import ProductDetails from "./components/ProductDetails";
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
  const [userType, setUserType] = useState("");
  const [userName, setUserName] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const contractABI = [
    // ABI code here
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "productId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "certifyingAuthority",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "certificationType",
          "type": "string"
        }
      ],
      "name": "CertificationAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "productId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "location",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "checkpoint",
          "type": "string"
        }
      ],
      "name": "LocationUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "productId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "location",
          "type": "string"
        }
      ],
      "name": "ProductDelivered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "productId",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "productName",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ProductRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "enum SupplyChain.UserType",
          "name": "userType",
          "type": "uint8"
        }
      ],
      "name": "UserRegistered",
      "type": "event"
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
          "name": "isDelivered",
          "type": "bool"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "certifyingAuthority",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "certificationType",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "internalType": "struct SupplyChain.Certification[]",
          "name": "certifications",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getUserType",
      "outputs": [
        {
          "internalType": "enum SupplyChain.UserType",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
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
        }
      ],
      "name": "markAsDelivered",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
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
          "internalType": "enum SupplyChain.UserType",
          "name": "userType",
          "type": "uint8"
        }
      ],
      "name": "registerUser",
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
    }
  ];

  const connectContract = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed or detected.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length === 0) throw new Error("No account found in MetaMask.");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(contractInstance);
      console.log("Contract connected successfully.");
    } catch (error) {
      alert(`Failed to connect: ${error.message}`);
    }
  };

  useEffect(() => {
    connectContract();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Supply Chain Management</h1>
      <RegisterUser contract={contract} setUserType={setUserType} setUserName={setUserName} userType={userType} userName={userName} />
      <RegisterProduct
        contract={contract}
        productId={productId}
        setProductId={setProductId}
        productName={productName}
        setProductName={setProductName}
        supplierName={supplierName}
        setSupplierName={setSupplierName}
        certificationDetails={certificationDetails}
        setCertificationDetails={setCertificationDetails}
      />
      <UpdateLocation
        contract={contract}
        productId={productId}
        location={location}
        setLocation={setLocation}
        checkpoint={checkpoint}
        setCheckpoint={setCheckpoint}
      />
      <AddCertification
        contract={contract}
        productId={productId}
        certifyingAuthority={certifyingAuthority}
        setCertifyingAuthority={setCertifyingAuthority}
        certificationType={certificationType}
        setCertificationType={setCertificationType}
      />
      <ProductDetails
        contract={contract}
        productId={productId}
        setProductId={setProductId}
        productDetails={productDetails}
        setProductDetails={setProductDetails}
      />
    </div>
  );
};

export default App;
