import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { BiSolidFoodMenu } from "react-icons/bi";
import { Tooltip } from "react-tooltip";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <>
       <Navbar className="shadow-sm sticky-top bg-white w-100 " expand="md">
      <Container>
       

        <Navbar.Collapse id="basic-navbar-nav">

<button type="button" className="btn btn-secondary btn-lg active">
  <span className="mr-2">My Account</span>
</button>
          <Nav className="ml-auto text-sm text-gray-700">
          <Nav.Link href="#" className="mx-2 hover-text-primary-500 hover-font-medium">
              Contact Us
            </Nav.Link>
          <Nav.Link href="/surahs" className="mx-2 hover-text-primary-500 hover-font-medium">
              Surahs
            </Nav.Link>
            
            <Nav.Link href="/" className="mx-2 hover-text-primary-500 hover-font-medium">
              Home
            </Nav.Link>
            
          </Nav>

         
        </Navbar.Collapse>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Brand href="/" className="d-flex align-items-center">
          <span className="text-gray-700">Quran Reminder</span>
          <img src="/quranImg.png" width="70" height="70" className="mr-2" alt="logo" />
        </Navbar.Brand>

      </Container>
    </Navbar>
    </>
 
  );
};

export default NavBar;
