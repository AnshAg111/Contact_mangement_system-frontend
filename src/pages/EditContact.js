import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import AuthContext from "../context/AuthContext";
import ToastContext from "../context/ToastContext";

const EditContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);

  const [userDetails, setUserDetails] = useState({
    first_name: "",
    last_name:"",
    email: "",
    phone: "",
    company:"",
    job_title:"",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await fetch(`http://localhost:8000/api/contact`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id, ...userDetails }),
    });
    const result = await res.json();
    if (!result.error) {
      toast.success(`updated [${userDetails.first_name} ${userDetails.last_name}] contact`);

      setUserDetails({ first_name: "", last_name: "", email: "", phone: "", company:"", job_title:"" });
      navigate("/mycontacts");
    } else {
      toast.error(result.error);
    }
  };

  useEffect(async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/contact/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await res.json();
      setUserDetails({
        first_name: result.first_name,
        last_name: result.last_name,
        email: result.email,
        phone: result.phone,
        company: result.company,
        job_title: result.job_title,
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <>
      {loading ? (
        <Spinner splash="Loading Contact..." />
      ) : (
        <>
          <h2>Edit your contact</h2>

          <form onSubmit={handleSubmit}>
          <div className="form-group">
          <label htmlFor="first_name" className="form-label mt-4">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="first_name"
            name="name"
            value={userDetails.first_name}
            onChange={handleInputChange}
            placeholder="John"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name" className="form-label mt-4">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="last_name"
            name="name"
            value={userDetails.last_name}
            onChange={handleInputChange}
            placeholder="Doe"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="emailInput" className="form-label mt-4">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="emailInput"
            name="email"
            value={userDetails.email}
            onChange={handleInputChange}
            placeholder="johndoe@example.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneInput" className="form-label mt-4">
            Phone Number
          </label>
          <input
            type="number"
            className="form-control"
            id="phoneInput"
            name="phone"
            value={userDetails.phone}
            onChange={handleInputChange}
            placeholder="+977 987654321"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="company" className="form-label mt-4">
            Company
          </label>
          <input
            type="text"
            className="form-control"
            id="company"
            name="company"
            value={userDetails.company}
            onChange={handleInputChange}
            placeholder="your current company..."
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="job_title" className="form-label mt-4">
            Job title
          </label>
          <input
            type="text"
            className="form-control"
            id="job_title"
            name="job_title"
            value={userDetails.job_title}
            onChange={handleInputChange}
            placeholder="e.g. Analyst, Content creator, Web developer, etc."
            required
          />
        </div>
            <input
              type="submit"
              value="Save Changes"
              className="btn btn-info my-2"
            />
          </form>
        </>
      )}
    </>
  );
};

export default EditContact;