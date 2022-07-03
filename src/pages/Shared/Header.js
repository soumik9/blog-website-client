import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import useUser from '../../hooks/useUser';

const Header = () => {

    const { user, setUser, logged, setLogged } = useUser();

    const handleLogout = () => {
        setUser({});
        setLogged(false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
    }

    return (
        <Navbar>
            <Container>
                <Navbar.Brand as={Link} to="/">Navbar</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/add-post">Add Post</Nav.Link>
                </Nav>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    
                    {
                        logged ? <>
                                <Navbar.Text>
                                    Signed in as: <a href="#login">{ user?.name }</a>
                                </Navbar.Text>
                                <button className='btn btn-info ms-3 text-white' onClick={handleLogout}>Logout</button>
                        </>  : <Link to='login'>Login</Link>
                    }

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;