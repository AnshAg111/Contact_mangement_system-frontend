
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  CircularProgress,
} from "@mui/material";
import ToastContext from "../context/ToastContext";

const AllContact = () => {
  const { toast } = useContext(ToastContext);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({});
  const [contacts, setContacts] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/mycontacts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        if (!result.error) {
          setContacts(result.contacts);
        } else {
          console.error(result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const deleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        const res = await fetch(`http://localhost:8000/api/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        if (!result.error) {
          setContacts(result.myContacts);
          toast.success("Deleted contact");
          setShowModal(false);
        } else {
          toast.error(result.error);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const filteredContacts = contacts.filter(
      (contact) =>
        contact.first_name.toLowerCase().includes(searchInput.toLowerCase()) ||
        contact.last_name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setContacts(filteredContacts);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Contacts
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={() => window.location.reload()}
          sx={{ mb: 2 }}
        >
          Reload Contacts
        </Button>
        <hr />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {contacts.length === 0 ? (
            <Typography variant="h6" align="center">
              No contacts created yet.
            </Typography>
          ) : (
            <Box>
              <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: "flex", mb: 3 }}>
                <TextField
                  id="searchInput"
                  name="searchInput"
                  label="Search Contacts"
                  variant="outlined"
                  fullWidth
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  sx={{ mr: 2 }}
                />
                <Button variant="contained" color="primary" type="submit">
                  Search
                </Button>
              </Box>

              <Typography variant="body1" gutterBottom>
                Total Contacts: <strong>{contacts.length}</strong>
              </Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Job Title</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow
                        key={contact._id}
                        hover
                        onClick={() => {
                          setModalData(contact);
                          setShowModal(true);
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{contact.first_name}</TableCell>
                        <TableCell>{contact.last_name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>{contact.company}</TableCell>
                        <TableCell>{contact.job_title}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="contact-modal-title"
        aria-describedby="contact-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="contact-modal-title" variant="h6" component="h2" gutterBottom>
            {modalData.first_name} {modalData.last_name}
          </Typography>
          <Typography>
            <strong>Email:</strong> {modalData.email}
          </Typography>
          <Typography>
            <strong>Phone:</strong> {modalData.phone}
          </Typography>
          <Typography>
            <strong>Company:</strong> {modalData.company}
          </Typography>
          <Typography>
            <strong>Job Title:</strong> {modalData.job_title}
          </Typography>

          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              component={Link}
              to={`/edit/${modalData._id}`}
              variant="contained"
              color="info"
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteContact(modalData._id)}
            >
              Delete
            </Button>
            <Button variant="outlined" color="warning" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default AllContact;