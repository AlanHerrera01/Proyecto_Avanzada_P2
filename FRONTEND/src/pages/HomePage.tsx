import React from 'react';
import { Library } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light" style={{paddingTop: '5rem'}}>
      <div className="card shadow-lg text-center animate__animated animate__fadeInDown" style={{maxWidth: 480}}>
        <div className="card-body">
          <Library size={56} className="mx-auto mb-3 text-primary" />
          <h1 className="display-5 fw-bold mb-2">Bienvenido a la Biblioteca Virtual</h1>
          <p className="text-secondary mb-2">Gestiona usuarios, autores, libros y préstamos de manera sencilla y profesional.</p>
          <p className="text-muted mb-4">Utiliza el menú superior para navegar por las secciones.</p>
          <a href="/books" className="btn btn-primary btn-lg shadow-sm animate__animated animate__pulse animate__infinite">Explorar Libros</a>
        </div>
      </div>
    </div>
  );
};
