

import React from 'react';
import { Nav, NavItem } from 'reactstrap';
import { Link } from 'react-router-dom';

const NavMenu = ({ mostrar, toggleMenu, permissions }) => {
  return (
    <Nav className={mostrar ? 'navbar navMenu' : 'navbar navMenu hide'}>
      {permissions.filter(item => item.permiso && item.menu).map((perm) => (
        <NavItem key={perm.nombre}>
          <Link to={perm.ruta} className='linksnavbar' onClick={toggleMenu}>
            {perm.nombre}
          </Link>
        </NavItem>
      ))}
      <NavItem>
        <Link className='linksnavbar' to={"/configuracion"} onClick={() => { toggleMenu(); }}>Configuraciones</Link>
      </NavItem>
      <NavItem>
        <Link className='linksnavbar' to={"/"} onClick={() => { toggleMenu(); }}>Salir</Link>
      </NavItem>
    </Nav>
  );
};

export default NavMenu;