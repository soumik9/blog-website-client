import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useUser = () => {
    let navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [logged, setLogged] = useState(true);
    const [userLoading, setUserLoading] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect( () => {
        if(userId){
            setUserLoading(true);
            fetch(`https://blog-soumik9.herokuapp.com/api/user/${userId}`, {
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
                    toast.error('Forbidden/Unauthorized access!', { duration: 2000, position: 'top-right', });
                }
                return res.json();
            })
            .then(data => {
                setUser(data.user);
                setLogged(true);
                setUserLoading(false);
            })
        }else{
            setUser(null)
            setLogged(false)
        }
    }, [ navigate, userId])

    return { user, userLoading, logged };
}

export default useUser;