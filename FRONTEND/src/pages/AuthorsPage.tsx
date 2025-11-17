import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { authorService } from '../services/authorService';
import type { Author, AuthorFormData } from '../types';

export const AuthorsPage: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AuthorFormData>();

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      setLoading(true);
      const data = await authorService.getAll();
      setAuthors(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar autores');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: AuthorFormData) => {
    try {
      setLoading(true);
      if (editingAuthor) {
        await authorService.update(editingAuthor.id, data);
      } else {
        await authorService.create(data);
      }
      await loadAuthors();
      handleCloseModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar autor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este autor?')) return;
    try {
      setLoading(true);
      await authorService.delete(id);
      await loadAuthors();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar autor');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    reset(author);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAuthor(null);
    reset();
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="bg-white rounded-4 shadow-sm px-4 py-4 mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-md-between">
          <div>
            <h1 className="display-4 fw-bold mb-1" style={{ color: '#1565c0', letterSpacing: '-1px' }}>Autores</h1>
            <p className="text-secondary mb-0" style={{ fontSize: '1.1rem' }}>Gestiona los autores de tu biblioteca</p>
          </div>
          <Button 
            onClick={() => {
              setEditingAuthor(null);
              reset();
              setIsModalOpen(true);
            }}
            className="btn btn-primary d-flex align-items-center px-4 py-2 fs-5 shadow-sm"
            style={{ minWidth: 180 }}
          >
            <Plus size={22} className="me-2" />
            Nuevo Autor
          </Button>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
            <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Error:"><use xlinkHref="#exclamation-triangle-fill" /></svg>
            <span>{error}</span>
          </div>
        )}

        {loading && authors.length === 0 ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-secondary fw-semibold">Cargando autores...</p>
          </div>
        ) : authors.length === 0 ? (
          <div className="text-center py-5">
            <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '80px', height: '80px'}}>
              <Users size={40} className="text-primary" />
            </div>
            <p className="text-secondary fs-5 fw-semibold">No hay autores registrados</p>
            <p className="text-muted">Comienza agregando tu primer autor</p>
          </div>
        ) : (
          <div className="row g-4">
            {authors.map((author) => (
              <div key={author.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  <div className="card-header bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{height: '90px'}}>
                    <Users size={40} className="text-primary opacity-50" />
                  </div>
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title fw-bold text-dark mb-1 text-truncate">{author.nombre}</h5>
                      <p className="card-text text-secondary mb-2 text-truncate">{author.nacionalidad}</p>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(author)}>
                        <Edit2 size={16} />
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(author.id)}>
                        <Trash2 size={16} />
                      </Button>
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
          title={editingAuthor ? 'Editar Autor' : 'Nuevo Autor'}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">Nombre Completo</label>
              <input
                className={`form-control${errors.nombre ? ' is-invalid' : ''}`}
                placeholder="Ingresa el nombre del autor"
                {...register('nombre', { 
                  required: 'El nombre es obligatorio',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                })}
              />
              {errors.nombre && (
                <div className="invalid-feedback d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M7.001 4a1 1 0 1 1 2 0l-.35 4.5a.65.65 0 0 1-1.3 0L7.001 4zm1 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                  <span className="ms-1">{errors.nombre.message}</span>
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Nacionalidad</label>
              <input
                className={`form-control${errors.nacionalidad ? ' is-invalid' : ''}`}
                placeholder="Ej: Mexicana, Española, etc."
                {...register('nacionalidad', { 
                  required: 'La nacionalidad es obligatoria',
                })}
              />
              {errors.nacionalidad && (
                <div className="invalid-feedback d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M7.001 4a1 1 0 1 1 2 0l-.35 4.5a.65.65 0 0 1-1.3 0L7.001 4zm1 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>
                  <span className="ms-1">{errors.nacionalidad.message}</span>
                </div>
              )}
            </div>
            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : editingAuthor ? 'Actualizar' : 'Crear Autor'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
