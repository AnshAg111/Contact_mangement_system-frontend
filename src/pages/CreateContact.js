import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ToastContext from "../context/ToastContext";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import Grid from '@mui/material/Grid2';

const CreateContact = () => {
  const { toast } = useContext(ToastContext);
  const [userDetails, setUserDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    job_title: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await fetch(`http://localhost:8000/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(userDetails),
    });
    const result = await res.json();
    if (!result.error) {
      toast.success(`Created [${userDetails.first_name} ${userDetails.last_name}] contact`);
      setUserDetails({ first_name: "", last_name: "", email: "", phone: "", company: "", job_title: "" });
      navigate("/contacts"); // Redirect to contact list or another page
    } else {
      toast.error(result.error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Contact
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="first_name"
              name="first_name"
              label="First Name"
              variant="outlined"
              value={userDetails.first_name}
              onChange={handleInputChange}
              placeholder="John"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="last_name"
              name="last_name"
              label="Last Name"
              variant="outlined"
              value={userDetails.last_name}
              onChange={handleInputChange}
              placeholder="Doe"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="email"
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              value={userDetails.email}
              onChange={handleInputChange}
              placeholder="johndoe@example.com"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="phone"
              name="phone"
              label="Phone Number"
              type="tel"
              variant="outlined"
              value={userDetails.phone}
              onChange={handleInputChange}
              placeholder="+977 987654321"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="company"
              name="company"
              label="Company"
              variant="outlined"
              value={userDetails.company}
              onChange={handleInputChange}
              placeholder="Your current company..."
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="job_title"
              name="job_title"
              label="Job Title"
              variant="outlined"
              value={userDetails.job_title}
              onChange={handleInputChange}
              placeholder="e.g., Analyst, Content Creator, Web Developer"
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Add Contact
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CreateContact;
