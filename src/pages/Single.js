import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useUser from '../hooks/useUser';
import Loading from './Shared/Loading';

const Single = () => {

    const navigate = useNavigate();
    const { postId } = useParams();
    const { user, logged } = useUser();
    const [comment, setComment] = useState({ text: '', userId: '', postId: '' })
    const [loading, setLoading] = useState(false);

    // get single post
    const { data: post, isLoading, refetch } = useQuery(['post'], () =>
        fetch(`https://blog-soumik9.herokuapp.com/api/post/${postId}`, {
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

    // add new comment on specific post
    const handleComment = (e) => {
        e.preventDefault();
        setLoading(true);

        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('accessToken')}`
             },
            body: JSON.stringify(comment)
        };

        fetch('https://blog-soumik9.herokuapp.com/api/comment/create', requestOptions)
            .then(res => res.json())
            .then(data => {
                refetch();
                setLoading(false);
                if (data.success === true) {
                    setComment({ text: '', userId: '', postId: '' })
                    toast.success(`${data.message}`, { duration: 2000, position: 'top-right' });
                }
                if (data.success === false) {
                    toast.error(`${data.message}`, { duration: 2000, position: 'top-right' });
                }
            });
    }

    // loading
    if (isLoading || loading) { return <Loading /> }

    return (
        <Container className='my-4'>
            <Row>
                <Col>
                    <div className='d-flex gap-5 text-decoration-none card p-4'>
                        <div>
                            {
                                post?.post.img ?
                                    <img height={200} src={`https://blog-soumik9.herokuapp.com/api/${post?.post.img}`} alt="" />
                                    : <img height={200} src="http://placekitten.com/150/150" alt='' />
                            }

                        </div>
                        <div>
                            <h4 className="text-info">{post?.post.title}</h4>
                            <p>By {post?.post.author} <span className='text-info'>{post?.post.createdAt}</span></p>
                            <p>{post?.post.desc}</p>
                        </div>
                    </div>
                    <div className='mt-3'>
                        <h2>Comments</h2>
                        {
                            post?.post.commentId.length > 0 ? post?.post.commentId.map((comment, index) => <div key={index} className='comments bg-secondary px-4 py-2 mt-3'>
                                <h4 className='text-white m-0'>{comment?.userId?.name ? comment?.userId?.name : 'No comment author'}</h4>
                                <p className='text-white m-0'>{comment.text}</p>
                            </div>) : <p>No comment on this post</p>
                        }
                    </div>

                    {
                        logged ? <form className='mt-4' onSubmit={handleComment}>
                            <textarea type="text" placeholder='Your comment for this post' required className='w-100 form-control'
                                value={comment?.text} onChange={e => setComment({ ...comment, text: e.target.value, postId: post?.post._id, userId: user._id })}
                            ></textarea>
                            <div className="text-end mt-2">
                                <input type="submit" value='Add Comment' className='btn btn-info text-white' />
                            </div>

                        </form> : <h5 className='text-danger text-center py-4'>Logged in to continue comment</h5>
                    }

                </Col>
            </Row>
        </Container>
    );
};

export default Single;