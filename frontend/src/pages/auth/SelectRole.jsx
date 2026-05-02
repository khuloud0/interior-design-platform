import { useState } from "react";

function SelectRole() {
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setRole(e.target.value);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!role) {
      setError("Please select a role");
      return;
    }

    console.log("Selected role:", role);

    // TODO: navigate to next step based on selected role
  };

  return (
    <div className="select-role-container">
      <h2>Select Your Role</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="radio"
              name="role"
              value="homeowner"
              checked={role === "homeowner"}
              onChange={handleChange}
            />
            Homeowner
          </label>
        </div>

        <br />

        <div>
          <label>
            <input
              type="radio"
              name="role"
              value="designer"
              checked={role === "designer"}
              onChange={handleChange}
            />
            Designer
          </label>
        </div>

        <br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Continue</button>
      </form>
    </div>
  );
}

export default SelectRole;
