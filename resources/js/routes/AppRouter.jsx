/*import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/auth/LoginPage';
import EfficiencyCalculationPage from '../pages/calculations/EfficiencyCalculationPage';
import UsersConfigurationPage from '../pages/configuration/UsersConfigurationPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import EfficiencyHistoryPage from '../pages/history/EfficiencyHistoryPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProductReferencesPage from '../pages/references/ProductReferencesPage';
import StatisticsPage from '../pages/statistics/StatisticsPage';
import TeamsPage from '../pages/teams/TeamsPage';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

function AdminOnlyRoute({ children }) {
    const { isAdmin, loading } = useAuth();

    if (loading) {
        return <div className="p-4">Chargement...</div>;
    }

    if (!isAdmin) {
        return <NotFoundPage />;
    }

    return children;
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <DashboardPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/calculations"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <EfficiencyCalculationPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/history"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <EfficiencyHistoryPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/statistics"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <StatisticsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/teams"
                    element={
                        <ProtectedRoute>
                            <AdminOnlyRoute>
                                <AppLayout>
                                    <TeamsPage />
                                </AppLayout>
                            </AdminOnlyRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/references"
                    element={
                        <ProtectedRoute>
                            <AdminOnlyRoute>
                                <AppLayout>
                                    <ProductReferencesPage />
                                </AppLayout>
                            </AdminOnlyRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/configuration/users"
                    element={
                        <ProtectedRoute>
                            <AdminOnlyRoute>
                                <AppLayout>
                                    <UsersConfigurationPage />
                                </AppLayout>
                            </AdminOnlyRoute>
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}*/
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/auth/LoginPage';
import EfficiencyCalculationPage from '../pages/calculations/EfficiencyCalculationPage';
import UsersConfigurationPage from '../pages/configuration/UsersConfigurationPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import EfficiencyHistoryPage from '../pages/history/EfficiencyHistoryPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProductReferencesPage from '../pages/references/ProductReferencesPage';
import StatisticsPage from '../pages/statistics/StatisticsPage';
import TeamsPage from '../pages/teams/TeamsPage';

function AdminOnlyRoute({ children }) {
    const { isAdmin, loading } = useAuth();

    if (loading) {
        return <div className="p-4">Chargement...</div>;
    }

    if (!isAdmin) {
        return <NotFoundPage />;
    }

    return children;
}

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <DashboardPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/calculations"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <EfficiencyCalculationPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/history"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <EfficiencyHistoryPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/statistics"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <StatisticsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/teams"
                    element={
                        <ProtectedRoute>
                            <AdminOnlyRoute>
                                <AppLayout>
                                    <TeamsPage />
                                </AppLayout>
                            </AdminOnlyRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/references"
                    element={
                        <ProtectedRoute>
                            <AdminOnlyRoute>
                                <AppLayout>
                                    <ProductReferencesPage />
                                </AppLayout>
                            </AdminOnlyRoute>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/configuration/users"
                    element={
                        <ProtectedRoute>
                            <AdminOnlyRoute>
                                <AppLayout>
                                    <UsersConfigurationPage />
                                </AppLayout>
                            </AdminOnlyRoute>
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </AnimatePresence>
    );
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <AnimatedRoutes />
        </BrowserRouter>
    );
}