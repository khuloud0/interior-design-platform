import { useState } from "react";

function DesignForm() {
  const [formData, setFormData] = useState({
    roomType: "",
    size: "",
    style: "",
    color: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // 
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Design Request</h2>

      <input
        name="roomType"
        placeholder="Room Type"
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="size"
        placeholder="Size"
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="style"
        placeholder="Style"
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="color"
        placeholder="Color"
        onChange={handleChange}
      />

      <br /><br />

      <button type="submit">Submit</button>
    </form>
  );
}

export default DesignForm;
