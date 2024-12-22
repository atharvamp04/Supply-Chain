import React from "react";

const RegisterProduct = ({ contract, productId, setProductId, productName, setProductName, supplierName, setSupplierName, certificationDetails, setCertificationDetails }) => {
  const registerProduct = async () => {
    if (!contract) return;
    try {
      const tx = await contract.registerProduct(productId, productName, supplierName, certificationDetails);
      await tx.wait();
      alert("Product registered successfully!");
    } catch (error) {
      console.error("Error registering product:", error);
    }
  };

  return (
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
  );
};

export default RegisterProduct;
