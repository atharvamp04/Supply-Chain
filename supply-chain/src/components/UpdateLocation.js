import React from "react";

const UpdateLocation = ({ contract, productId, location, setLocation, checkpoint, setCheckpoint }) => {
  const updateLocation = async () => {
    if (!contract) return;
    try {
      const tx = await contract.updateLocation(productId, location, checkpoint);
      await tx.wait();
      alert("Location updated successfully!");
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  return (
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
  );
};

export default UpdateLocation;
