import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, RotateCcw, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { loanService } from '../services/loanService';
import { userService } from '../services/userService';
import { bookService } from '../services/bookService';
import type { Loan, LoanFormData, User, Book } from '../types';

export const LoansPage: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LoanFormData>();

  useEffect(() => {
    loadLoans();
    loadUsers();
    loadBooks();
  }, []);

  const loadLoans = async () => {
    try {
      setLoading(true);
      const data = await loanService.getAll();
      setLoans(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar préstamos');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      console.error('Error al cargar usuarios');
    }
  };

  const loadBooks = async () => {
    try {
      const data = await bookService.getAll();
      setBooks(data.filter(b => b.disponible));
    } catch (err) {
      console.error('Error al cargar libros');
    }
  };

  const onSubmit = async (data: LoanFormData) => {
    try {
      setLoading(true);
      const formData = {
        usuarioId: Number(data.usuarioId),
        libroId: Number(data.libroId),
      };
      await loanService.create(formData);
      await loadLoans();
      await loadBooks();
      handleCloseModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear préstamo');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id: number) => {
    if (!confirm('¿Confirmar devolución del libro?')) return;
    try {
      setLoading(true);
      await loanService.returnBook(id);
      await loadLoans();
      await loadBooks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al devolver libro');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset({ usuarioId: 0, libroId: 0 });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="bg-white rounded-4 shadow-sm px-4 py-4 mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-md-between">
          <div>
            <h1 className="display-4 fw-bold mb-1" style={{ color: '#1565c0', letterSpacing: '-1px' }}>Control de Préstamos</h1>
            <p className="text-secondary mb-0" style={{ fontSize: '1.1rem' }}>Gestiona los préstamos y devoluciones de libros</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="btn btn-primary d-flex align-items-center px-4 py-2 fs-5 shadow-sm"
            style={{ minWidth: 180 }}
          >
            <Plus size={22} className="me-2" />
            Nuevo Préstamo
          </Button>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
            <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Error:"><use xlinkHref="#exclamation-triangle-fill" /></svg>
            <span>{error}</span>
          </div>
        )}

        {loading && loans.length === 0 ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-secondary fw-semibold">Cargando préstamos...</p>
          </div>
        ) : loans.length === 0 ? (
          <div className="text-center py-5">
            <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '80px', height: '80px'}}>
              <FileText size={40} className="text-primary" />
            </div>
            <p className="text-secondary fs-5 fw-semibold">No hay préstamos registrados</p>
            <p className="text-muted">Comienza registrando tu primer préstamo</p>
          </div>
        ) : (
          <div className="table-responsive rounded-3 shadow-sm border bg-white">
            <table className="table align-middle mb-0">
              <thead className="table-primary">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Usuario</th>
                  <th scope="col">Libro</th>
                  <th scope="col">Fecha Préstamo</th>
                  <th scope="col">Fecha Devolución</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td><span className="fw-bold text-primary">#{loan.id}</span></td>
                    <td><span className="fw-semibold text-dark">{loan.usuarioNombre}</span></td>
                    <td className="text-secondary">{loan.libroTitulo}</td>
                    <td className="text-secondary small">{formatDate(loan.fechaPrestamo)}</td>
                    <td className="text-secondary small">{loan.fechaDevolucion ? formatDate(loan.fechaDevolucion) : '-'}</td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 fw-bold ${loan.fechaDevolucion ? 'bg-secondary bg-opacity-75' : 'bg-warning bg-opacity-75'}`}>{loan.fechaDevolucion ? '✓ Devuelto' : '⏱ Activo'}</span>
                    </td>
                    <td>
                      {!loan.fechaDevolucion && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleReturn(loan.id)}
                        >
                          <RotateCcw size={16} className="me-1" />
                          Devolver
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Nuevo Préstamo"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <Select
                label="Usuario"
                {...register('usuarioId', { 
                  required: 'El usuario es obligatorio',
                })}
                options={users.map(u => ({ value: u.id, label: `${u.nombre} (${u.email})` }))}
                error={errors.usuarioId?.message}
              />
            </div>
            <div className="mb-3">
              <Select
                label="Libro"
                {...register('libroId', { 
                  required: 'El libro es obligatorio',
                })}
                options={books.map(b => ({ value: b.id, label: b.titulo }))}
                error={errors.libroId?.message}
              />
            </div>
            {books.length === 0 && (
              <div className="alert alert-warning d-flex align-items-center gap-2" role="alert">
                <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Advertencia:"><use xlinkHref="#exclamation-triangle-fill" /></svg>
                <span>No hay libros disponibles para préstamo</span>
              </div>
            )}
            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || books.length === 0}>
                {loading ? 'Guardando...' : 'Registrar Préstamo'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
