import React from "react";

const ProductDetails = ({ contract, productId, setProductId, productDetails, setProductDetails }) => {
  const getProductDetails = async () => {
    if (!productId) {
      alert("Please enter a valid product ID.");
      return;
    }
    try {
      const product = await contract.getProduct(productId);
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
    }
  };

  return (
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
  );
};

export default ProductDetails;
