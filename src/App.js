import React,{ useState} from 'react' ;
import TextField from '@mui/material/TextField';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Registro from './views/registro';
import Dashboard from './views/dashboard';
import Home from './views/home';
import Register from './views/register';

function App() {

  return (
    <>
   <BrowserRouter>
   
   <Routes>
   <Route path ='/' element={<Navbar><Home/></Navbar>} />
    <Route path ='/dashboard' element={<Navbar><Dashboard/></Navbar>} />
    <Route path = '/registro' element={<Navbar><Register/></Navbar>} />
   </Routes>

   
   </BrowserRouter>

    </>

  );
}

export default App;
