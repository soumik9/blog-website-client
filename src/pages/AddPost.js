import React from 'react';
import useUser from '../hooks/useUser';

const AddPost = () => {

    const { logged } = useUser();

    if(!logged){ return <p>Login to continue</p> }

    return (
        <div>add
            
        </div>
    );
};

export default AddPost;