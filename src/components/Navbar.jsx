import React, { useState } from 'react';
import { Nav, NavItem } from 'reactstrap';
import { Avatar, Menu, MenuItem } from '@mui/material';
import { green } from '@mui/material/colors';
import ListIcon from '@mui/icons-material/List';
import IconButton from '@mui/material/IconButton';
import { useNavigate, Link } from "react-router-dom";
import NavMenu from './NavMenu'; 
import '../css/Navbar.css';
import 'bootstrap/dist/css/bootstrap.css';
import LogoFinal from '../assets/SISTEC.png';

const Navbar = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mostrar, setMostar] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMostar(!mostrar);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    navigate('/');
    setMostar(false);
  };

  const modalAvatar1 = () => {
    navigate("/");
    setMostar(false);
  };

  const permissions = [
    {nombre:'Inicio', ruta:'/'},
    {nombre:'Registro', ruta:'/registro'},
    {nombre:'Dashboard', ruta:'/dashboard'},
  ]

  return (
    <div>
      <nav>
        <Nav className="navbar desktop">
          <NavItem>
            <img src={LogoFinal} height={50} alt="" /> 
          </NavItem>
          {permissions.map((perm) => (
            <NavItem key={perm.nombre}>
              <Link to={perm.ruta} className='linksnavbar' onClick={() => setMostar(false)}>
                {perm.nombre}
              </Link>
            </NavItem>
          ))}
          <Avatar
            sx={{ bgcolor: green[500] }}
            onClick={handleAvatarClick}
            aria-controls="avatar-menu"
            aria-haspopup="true"
          >
           A
          </Avatar>
          <Menu
            id="avatar-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={modalAvatar1}>Salir</MenuItem>
          </Menu>
        </Nav>
        <Nav className="navbar mobile">
          <NavItem>
            <img src={LogoFinal} height={55} alt="" />
          </NavItem>
          <NavItem>
            <IconButton aria-label="delete" className="menu" onClick={toggleMenu}><ListIcon /></IconButton>
          </NavItem>
        </Nav>
        <NavMenu mostrar={mostrar} toggleMenu={toggleMenu} permissions={permissions} />
      </nav>
      <div className="page-content">{children}</div>
    </div>
  );
};

export default Navbar;
