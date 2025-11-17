import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { bookService } from '../services/bookService';
import { authorService } from '../services/authorService';
import type { Book, BookFormData, Author } from '../types';

export const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BookFormData>();

  useEffect(() => {
    loadBooks();
    loadAuthors();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAll();
      setBooks(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar libros');
    } finally {
      setLoading(false);
    }
  };

  const loadAuthors = async () => {
    try {
      const data = await authorService.getAll();
      setAuthors(data);
    } catch (err) {
      console.error('Error al cargar autores');
    }
  };

  const onSubmit = async (data: BookFormData) => {
    try {
      setLoading(true);
      const formData = {
        ...data,
        autorId: Number(data.autorId),
      };
      if (editingBook) {
        await bookService.update(editingBook.id, formData);
      } else {
        await bookService.create(formData);
      }
      await loadBooks();
      handleCloseModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar libro');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este libro?')) return;
    
    try {
      setLoading(true);
      await bookService.delete(id);
      await loadBooks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar libro');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    reset(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
    reset({ titulo: '', autorId: 0 });
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="bg-white rounded-4 shadow-sm px-4 py-4 mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-md-between">
          <div>
            <h1 className="display-4 fw-bold mb-1" style={{ color: '#1565c0', letterSpacing: '-1px' }}>Catálogo de Libros</h1>
            <p className="text-secondary mb-0" style={{ fontSize: '1.1rem' }}>Explora y administra tu colección literaria</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="btn btn-primary d-flex align-items-center px-4 py-2 fs-5 shadow-sm"
            style={{ minWidth: 160 }}
          >
            <Plus size={22} className="me-2" />
            Nuevo Libro
          </Button>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
            <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Error:"><use xlinkHref="#exclamation-triangle-fill" /></svg>
            <span>{error}</span>
          </div>
        )}

        {loading && books.length === 0 ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-secondary fw-semibold">Cargando libros...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-5">
            <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '80px', height: '80px'}}>
              <BookOpen size={40} className="text-primary" />
            </div>
            <p className="text-secondary fs-5 fw-semibold">No hay libros registrados</p>
            <p className="text-muted">Comienza agregando tu primer libro</p>
          </div>
        ) : (
          <div className="row g-4">
            {books.map((book) => (
              <div key={book.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <div className="card-header bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{height: '90px'}}>
                    <BookOpen size={40} className="text-primary opacity-50" />
                  </div>
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title fw-bold text-dark mb-1 text-truncate">{book.titulo}</h5>
                      <p className="card-text text-secondary mb-2 text-truncate">{book.autorNombre}</p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span className={`badge rounded-pill px-3 py-2 fw-bold ${book.disponible ? 'bg-success bg-opacity-75' : 'bg-danger bg-opacity-75'}`}>{book.disponible ? '✓ Disponible' : '✗ Prestado'}</span>
                      <div className="d-flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => handleEdit(book)}>
                          <Edit2 size={16} />
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(book.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingBook ? 'Editar Libro' : 'Nuevo Libro'}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <Input
                label="Título del Libro"
                placeholder="Ingresa el título completo"
                {...register('titulo', { 
                  required: 'El título es obligatorio',
                })}
                error={errors.titulo?.message}
              />
            </div>
            <div className="mb-3">
              <Select
                label="Autor"
                {...register('autorId', { 
                  required: 'El autor es obligatorio',
                })}
                options={authors.map(a => ({ value: a.id, label: a.nombre }))}
                error={errors.autorId?.message}
              />
            </div>
            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : editingBook ? 'Actualizar' : 'Crear Libro'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
