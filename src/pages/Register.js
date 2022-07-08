import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import Loading from './Shared/Loading';

const Register = () => {

    const [register, setRegister] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchRegisterApi = async () => {
        setLoading(true);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(register)
        };

        fetch('https://blog-soumik9.herokuapp.com/api/user/create', requestOptions)
        .then(res => res.json())
        .then(data => {
            setLoading(false);
            if (data.success === true ) {
                setRegister({ name: '', email: '', password: '' })
                toast.success(`${data.message}`, { duration: 2000, position: 'top-right' });
            }
            if (data.success === false ) {
                toast.error(`${data.message}`, { duration: 2000, position: 'top-right' });
            }
        });
    }

    const handleRegister = e => {
        e.preventDefault();

        // error checking
        if (register.name === '' && register.email === '' && register.password === '') {
            setError('Name, Email and password filed required')
        }else if(register.name === '' && register.email){
            setError('Name and Email filed is required')
        }else if(register.name === '' && register.password){
            setError('Name and Pasword filed is required')
        }else if(register.email === '' && register.password){
            setError('Email and Pasword filed is required')
        }else if (register.name === '') {
            setError('Name filed is required')
        } else if (register.email === '') {
            setError('Email filed is required')
        } else if (register.password === '') {
            setError('Password filed is required')
        } else {
            setError('');
            fetchRegisterApi();
        }
    }

    if(loading){ return <Loading /> }

    return (
        <Container>
            <Row className='justify-content-center align-items-center' style={{ height: '80vh' }}>
                <Col md={6}>
                    <Form className='card shadow-sm pt-4 pb-5 px-3' onSubmit={handleRegister}>

                        <h1 className='text-center'>Register</h1>
                        {
                            error && <p className='text-center text-danger'>{error}</p>
                        }
                        <hr />

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Your Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your name" value={register?.name}
                            onChange={(e) => setRegister({ ...register, name: e.target.value })} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={register?.email}
                            onChange={(e) => setRegister({ ...register, email: e.target.value })} />
                        </Form.Group>
                       
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={register?.password}
                            onChange={(e) => setRegister({ ...register, password: e.target.value })} />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Register
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;