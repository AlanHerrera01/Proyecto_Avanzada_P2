
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Users, UserCircle, FileText, Library } from 'lucide-react';
// Bootstrap Navbar aplicado


export const Navbar: React.FC = () => {
  const location = useLocation();

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <span className="bg-white rounded p-1 d-flex align-items-center justify-content-center" style={{height:36, width:36}}>
              <Library size={28} className="text-primary" />
            </span>
            <span className="fw-bold fs-4 text-white ms-2">Biblioteca virtual</span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/users" className={`nav-link d-flex align-items-center fw-semibold${location.pathname === '/users' ? ' active bg-white text-primary rounded shadow-sm px-3' : ''}`} style={location.pathname === '/users' ? {} : {color: 'white'}}> <UserCircle size={20} className="me-1" />Usuarios</Link>
              </li>
              <li className="nav-item">
                <Link to="/authors" className={`nav-link d-flex align-items-center fw-semibold${location.pathname === '/authors' ? ' active bg-white text-primary rounded shadow-sm px-3' : ''}`} style={location.pathname === '/authors' ? {} : {color: 'white'}}> <Users size={20} className="me-1" />Autores</Link>
              </li>
              <li className="nav-item">
                <Link to="/books" className={`nav-link d-flex align-items-center fw-semibold${location.pathname === '/books' ? ' active bg-white text-primary rounded shadow-sm px-3' : ''}`} style={location.pathname === '/books' ? {} : {color: 'white'}}> <BookOpen size={20} className="me-1" />Libros</Link>
              </li>
              <li className="nav-item">
                <Link to="/loans" className={`nav-link d-flex align-items-center fw-semibold${location.pathname === '/loans' ? ' active bg-white text-primary rounded shadow-sm px-3' : ''}`} style={location.pathname === '/loans' ? {} : {color: 'white'}}> <FileText size={20} className="me-1" />Préstamos</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
};
