import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import AddPost from './pages/AddPost';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './pages/Shared/Header';
import NotFound from './pages/Shared/NotFound';
import Single from './pages/Single';

function App() {
  return (
    <div className="">
    
      <Header />
      <Toaster />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:postId" element={<Single />} />
        <Route path="/add-post" element={ <AddPost /> }  />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </div>
  );
}

export default App;
