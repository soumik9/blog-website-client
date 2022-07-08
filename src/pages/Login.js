import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Loading from './Shared/Loading';

const Login = () => {

    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');
    useEffect(() => {
        if (userId) { navigate('/'); }
    }, [userId, navigate])


    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const fetchLoginApi = async () => {
        setLoading(true);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        };

        fetch('http://localhost:5000/api/login', requestOptions)
        .then(res => res.json())
        .then(data => {
            setLoading(false);
            if (data.message) {
                toast.success(`${data.message}`, { duration: 2000, position: 'top-right' });
            }

            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('userId', data.userId);
                navigate('/');
            }
        });
    }

    const handleLogin = (e) => {
        e.preventDefault();
        const { email, password } = loginData;

        // error checking
        if (email === '' && password === '') {
            setError('Email and password filed required')
        } else if (email === '') {
            setError('Email filed is required')
        } else if (password === '') {
            setError('Password filed is required')
        } else {
            setError('');
            fetchLoginApi();
        }
    }

    if(loading){ return <Loading /> }

    return (
        <Container>
            <Row className='justify-content-center align-items-center' style={{ height: '80vh' }}>
                <Col md={6}>
                    <Form className='card shadow-sm pt-4 pb-5 px-3' onSubmit={handleLogin}>

                        <h1 className='text-center'>Login</h1>
                        {
                            error && <p className='text-center text-danger'>{error}</p>
                        }
                        <hr />

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
                        </Form.Group>
                       
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;