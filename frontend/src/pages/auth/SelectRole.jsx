import { useState } from "react";

function SelectRole() {
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected role:", role); // مؤقت
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Select Your Role</h2>

      <label>
        <input
          type="radio"
          name="role"
          value="homeowner"
          onChange={(e) => setRole(e.target.value)}
        />
        Homeowner
      </label>

      <br /><br />

      <label>
        <input
          type="radio"
          name="role"
          value="designer"
          onChange={(e) => setRole(e.target.value)}
        />
        Designer
      </label>

      <br /><br />

      <button type="submit">Continue</button>
    </form>
  );
}

export default SelectRole;
