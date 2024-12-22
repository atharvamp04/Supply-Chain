import React from "react";

const AddCertification = ({ contract, productId, certifyingAuthority, setCertifyingAuthority, certificationType, setCertificationType }) => {
  const addCertification = async () => {
    if (!contract) return;
    try {
      const tx = await contract.addCertification(productId, certifyingAuthority, certificationType);
      await tx.wait();
      alert("Certification added successfully!");
    } catch (error) {
      console.error("Error adding certification:", error);
    }
  };

  return (
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
  );
};

export default AddCertification;
