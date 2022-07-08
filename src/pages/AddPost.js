import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios'
import useUser from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loading from './Shared/Loading';

const AddPost = () => {
    const { logged } = useUser();
    const navigate = useNavigate();

    const [post, setPost] = useState({
        title: '', author: '', desc: '', img: ''
    })

    const [error, setError] = useState({
        title: '', author: '', desc: '', img: ''
    })

    const [loading, setLoading] = useState(false);

    // image
    const handleImageChange = e => {
        if (!e.target.files[0].name.match(/\.(jpg|jpeg|png|JPG|PNG)$/)) {
            setPost({ ...post, img: '' })
            setError({ ...error, img: 'Only jpg, jpeg & png file supported' });
        } else {
            setError({ ...error, img: '' });
            setPost({ ...post, img: e.target.files[0] })
        }
    }

    const handleAddPost = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(post);

        var formData = new FormData();
        formData.append('title', post.title);
        formData.append('img', post.img);
        formData.append('author', post.author);
        formData.append('desc', post.desc);

        const config = { headers: { 
            authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }};

        axios.post("http://localhost:5000/api/post/create", formData, config)
        .then(res => {
            console.log(res);
            setLoading(false);
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('userId');
                navigate('/login');
                toast.error('Forbidden/Unauthorized access!', { duration: 2000, position: 'top-right', });
            }

            if(res.status === 500){
                toast.success('Server error!', { duration: 2000, position: 'top-right', });
            }

            if(res.status === 200){
                setPost({  title: '', author: '', desc: '', img: '' });
                toast.success(res.data.message, { duration: 2000, position: 'top-right', });
            }
        })
    }

    if (!logged) { return <p>Please login to continue</p> }

    if(loading) {  return <Loading /> }

    return (
        <div className='mt-5'>
            <Container>
                <Row className='justify-content-center'>
                    <Col md={6}>
                        <Form className='card px-4 py-5 shadow-sm' onSubmit={handleAddPost}>
                            <Form.Group className="mb-3" controlId="title">
                                <Form.Label>Post title</Form.Label>
                                <Form.Control type="text" placeholder="Enter post title" 
                                value={post?.title} onChange={e => setPost({ ...post, title: e.target.value })} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="author">
                                <Form.Label>Post Author</Form.Label>
                                <Form.Control type="text" placeholder="Enter author name"
                                value={post?.author} onChange={e => setPost({ ...post, author: e.target.value })} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="desc">
                                <Form.Label>Post Description</Form.Label>
                                <Form.Control as="textarea" rows={3} value={post?.desc} onChange={e => setPost({ ...post, desc: e.target.value })} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="img">
                                <Form.Label>Post Image</Form.Label>
                                <Form.Control type="file" onChange={handleImageChange} />
                            </Form.Group>

                            <Button variant="primary" type="submit" className='mt-3'>
                                Add New Post
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>

        </div>
    );
};

export default AddPost;