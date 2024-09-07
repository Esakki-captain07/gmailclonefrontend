import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import gmail from '../assets/img/logo.png'; 
import useLogout from '../hooks/useLogout';

function TopBar({ toggleSidebar, handleSearch }) {
  const logout = useLogout();

  return (
    <Navbar className="bg-body-tertiary navbar-sticky">
      <Container fluid>
        <Navbar.Brand href="#home" className="d-flex align-items-center">
          <button className="btn btn-link" onClick={toggleSidebar}>
            <i className="bi bi-border-width h3"></i>
          </button>
          <img src={gmail} alt="Gmail Logo" style={{ marginLeft: '10px' }}className="topbar-logo" />
        </Navbar.Brand>

        <Form className="mx-auto" style={{ width: '50%' }}>
          <Form.Control type="search" placeholder="Search" className="custom-search" onChange={handleSearch} />
        </Form>

        <Nav className="ml-auto d-flex align-items-center topbar-nav">
          
          <Button variant="outline-secondary" onClick={logout}>
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default TopBar;
