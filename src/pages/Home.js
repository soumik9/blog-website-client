import React from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from './Shared/Loading'
import { Col, Container, Row } from 'react-bootstrap';

const Home = () => {

    let navigate = useNavigate();

    // get all posts
    const { data: posts, isLoading } = useQuery(['posts'], () =>
        fetch(`https://blog-soumik9.herokuapp.com/api/post/index`, {
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
        <Container className='my-5'>
            <Row className='g-5'>
                {
                    posts?.posts.map(post => (
                        <Col md={6} lg={6} key={post._id} className="card p-4">
                            <Link className='d-flex gap-5 text-decoration-none' to={`/post/${post._id}`}>
                                <div>
                                    {
                                        post.img ?
                                            <img height={200} src={`https://blog-soumik9.herokuapp.com/api/${post.img}`} alt="" />
                                            : <img height={200} src="http://placekitten.com/150/150" alt='' />
                                    }

                                </div>
                                <div>
                                    <h4 className="text-info">{post.title.substring(0, 50)}</h4>
                                    <p>By {post.author} <span className='text-info'>{post.createdAt}</span></p>
                                    <p>{post.desc.substring(0, 100)}</p>
                                </div>
                            </Link>
                            <div className='mt-3'>
                                <h2>Comments</h2>
                                {
                                    post?.commentId.length > 0 ? post?.commentId.map((comment, index) => <div key={index} className='comments bg-secondary px-4 py-2 mt-3'>
                                        <h4 className='text-white m-0'>{comment?.userId?.name ? comment?.userId?.name : 'No comment author'}</h4>
                                        <p className='text-white m-0'>{comment.text}</p>
                                    </div>) : <p>No comment on this post</p>
                                }
                            </div>
                        </Col>
                    ))
                }
            </Row>
        </Container>
    );
};

export default Home;