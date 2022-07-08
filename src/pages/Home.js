import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from './Shared/Loading'
import { Col, Container, Row } from 'react-bootstrap';

const Home = () => {

    let navigate = useNavigate();

    // get all posts
    const { data: posts, isLoading, refetch } = useQuery(['posts'], () =>
        fetch(` http://localhost:5000/api/post/index`, {
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userId');
                    navigate('/login');
                    toast.error('Forbidden/Unauthorized access!', { duration: 2000, position: 'top-right', });
                }
                if (res.status === 500) {
                    toast.error('Forbidden/Unauthorized access!', { duration: 2000, position: 'top-right', });
                }
                return res.json();
            }))


    if (isLoading) { return <Loading /> }

    return (
        <Container className='mt-5'>
            <Row className='g-5'>
                {
                    posts?.posts.map(post => (
                        <Col md={6} lg={6} key={post._id} className="card p-4">
                            <Link className='d-flex gap-5 text-decoration-none' to={`/post/${post._id}`}>
                                <div>
                                    {
                                        post.img ? 
                                        <img height={200} src={`http://localhost:5000/api/${post.img}`} alt="" />
                                        : <img height={200} src="http://placekitten.com/150/150" alt='' />
                                    }
                                    
                                </div>
                                <div>
                                    <h4 className="text-info">{ post.title }</h4>
                                    <p>By { post.author } <span className='text-info'>{ post.createdAt }</span></p>
                                    <p>{ post.desc }</p>
                                </div>
                            </Link>
                            <div className='comments bg-secondary px-4 py-2 mt-3'>
                                <p className='text-white m-0'>Name: gg</p>
                                <p className='text-white m-0'>comment is here</p>
                            </div>
                        </Col>
                    ))
                }
            </Row>
        </Container>
    );
};

export default Home;