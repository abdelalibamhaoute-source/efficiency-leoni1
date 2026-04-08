import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import AlertMessage from '../../components/common/AlertMessage';
import ConfirmButton from '../../components/common/ConfirmButton';
import PageHeader from '../../components/common/PageHeader';
import ProductReferenceForm from '../../components/forms/ProductReferenceForm';
import EmptyState from '../../components/common/EmptyState';
import LoaderOverlay from '../../components/common/LoaderOverlay';

export default function ProductReferencesPage() {
    const [references, setReferences] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [search, setSearch] = useState('');
    const [editingReference, setEditingReference] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const loadReferences = async (page = 1, currentSearch = search) => {
        setLoading(true);
        setError('');

        try {
            const response = await api.get('/product-references', {
                params: {
                    page,
                    search: currentSearch,
                },
            });

            setReferences(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
            });
        } catch (err) {
            setError('Erreur lors du chargement des références.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReferences();
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        loadReferences(1, search);
    };

    const handleCreateOrUpdate = async (payload) => {
        setSubmitting(true);
        setMessage('');
        setError('');

        try {
            if (editingReference) {
                await api.put(`/product-references/${editingReference.id}`, payload);
                setMessage('Référence mise à jour avec succès.');
            } else {
                await api.post('/product-references', payload);
                setMessage('Référence créée avec succès.');
            }

            setEditingReference(null);
            loadReferences();
        } catch (err) {
            setError(err?.response?.data?.message || 'Erreur lors de l’enregistrement.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (referenceId) => {
        setMessage('');
        setError('');

        try {
            await api.delete(`/product-references/${referenceId}`);
            setMessage('Référence supprimée avec succès.');
            loadReferences();
        } catch (err) {
            setError(err?.response?.data?.message || 'Erreur lors de la suppression.');
        }
    };

    return (
        <div>
            <PageHeader
                title="Gestion des références"
                subtitle="Créer, modifier et supprimer les références produit."
            />

            <AlertMessage type="success" message={message} />
            <AlertMessage type="danger" message={error} />

            <div className="row g-4">
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="mb-3">
                                {editingReference ? 'Modifier référence' : 'Nouvelle référence'}
                            </h5>

                            <ProductReferenceForm
                                initialData={editingReference}
                                onSubmit={handleCreateOrUpdate}
                                submitting={submitting}
                            />

                            {editingReference && (
                                <button
                                    className="btn btn-secondary mt-3"
                                    onClick={() => setEditingReference(null)}
                                >
                                    Annuler
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <form className="row g-2 mb-3" onSubmit={handleSearch}>
                                <div className="col-md-9">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Rechercher une référence..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <button type="submit" className="btn btn-dark w-100">
                                        Rechercher
                                    </button>
                                </div>
                            </form>

                            {loading ? (
                                <LoaderOverlay text="Chargement des références..." />
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead>
                                            <tr>
                                                <th>Code</th>
                                                <th>Temps gamme</th>
                                                <th>Active</th>
                                                <th>Utilisations</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {references.length > 0 ? (
                                                references.map((reference) => (
                                                    <tr key={reference.id}>
                                                        <td>{reference.code}</td>
                                                        <td>{reference.gamme_time}</td>
                                                        <td>
                                                            <span className={`badge ${reference.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                                                {reference.is_active ? 'Oui' : 'Non'}
                                                            </span>
                                                        </td>
                                                        <td>{reference.efficiency_history_references_count}</td>
                                                        <td className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => setEditingReference(reference)}
                                                            >
                                                                Modifier
                                                            </button>

                                                            <ConfirmButton
                                                                onConfirm={() => handleDelete(reference.id)}
                                                            >
                                                                Supprimer
                                                            </ConfirmButton>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                    <tr>
                                                        <td colSpan="5" className="text-center">
                                                            <EmptyState
                                                                title="Aucune référence trouvée"
                                                                description="Ajoutez une nouvelle référence ou modifiez votre recherche."
                                                            />
                                                        </td>
                                                    </tr>

                                             )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {pagination && pagination.last_page > 1 && (
                                <div className="d-flex gap-2">
                                    {Array.from({ length: pagination.last_page }).map((_, index) => (
                                        <button
                                            key={index + 1}
                                            className={`btn btn-sm ${
                                                pagination.current_page === index + 1
                                                    ? 'btn-primary'
                                                    : 'btn-outline-primary'
                                            }`}
                                            onClick={() => loadReferences(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}