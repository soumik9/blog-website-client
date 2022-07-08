import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import useUser from '../../hooks/useUser';

const Header = () => {

    const { user } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        navigate('/login');
    }

    return (
        <Navbar>
            <Container>
                <Navbar.Brand as={Link} to="/">BLOGGER</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/add-post">Add Post</Nav.Link>
                </Nav>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">

                    {
                        user && <>
                            <Navbar.Text>
                                Signed in as: <a href="#login">{user.name}</a>
                            </Navbar.Text>
                            <button className='btn btn-info ms-3 text-white' onClick={handleLogout}>Logout</button>
                        </>
                    }
                    {
                        !user && <>
                            <Link to='login' className='me-3'>Login</Link>
                            <Link to='register'>Register</Link>
                        </>
                    }

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;