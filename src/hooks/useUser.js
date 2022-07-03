import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useUser = () => {
    let navigate = useNavigate();
    const [user, setUser] = useState({});
    const [userLoading, setUserLoading] = useState(false);
    const [logged, setLogged] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect( () => {
        if(userId){
            setUserLoading(true);
            fetch(`http://localhost:5000/api/user/${userId}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
            })
            .then(res => {
                if(res.status === 401 || res.status === 403){
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userId');
                    navigate('/login');
                    setLogged(false);
                    toast.error('Forbidden/Unauthorized access!', { duration: 2000, position: 'top-right', });
                }
                return res.json();
            })
            .then(data => {
                setUser(data.user);
                setLogged(true);
                setUserLoading(false);
            })
        }
    }, [ user, navigate, userId])

    return { user, setUser, userLoading, logged, setLogged };
}

export default useUser;