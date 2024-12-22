import React from "react";

const RegisterUser = ({ contract, setUserType, setUserName, userType, userName }) => {
  const registerUser = async () => {
    if (!contract || !userType || !userName) return;
    try {
      const tx = await contract.registerUser(userType, userName);
      await tx.wait();
      alert("User registered successfully!");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
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
  );
};

export default RegisterUser;
