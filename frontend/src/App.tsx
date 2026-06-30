import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { JournalMetaProvider } from './context/JournalMetaContext';
import { SettingsProvider } from './context/SettingsContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
import AppLayout from './components/layout/AppLayout';
import { SettingsEffects } from './components/common/SettingsEffects';
import { PageLoader } from './components/common/PageLoader';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const OAuthCallbackPage = lazy(() => import('./pages/OAuthCallbackPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const JournalsPage = lazy(() => import('./pages/JournalsPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const TrashPage = lazy(() => import('./pages/TrashPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const JournalFormPage = lazy(() => import('./pages/JournalFormPage'));
const JournalDetailPage = lazy(() => import('./pages/JournalDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <SettingsProvider>
        <SettingsEffects />
        <AuthProvider>
          <JournalMetaProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

                  <Route element={<ProtectedRoute />}>
                    <Route path="/app" element={<AppLayout />}>
                      <Route index element={<Navigate to="dashboard" replace />} />
                      <Route path="dashboard" element={<DashboardPage />} />
                      <Route path="journals" element={<JournalsPage />} />
                      <Route path="journals/new" element={<JournalFormPage />} />
                      <Route path="journals/:id" element={<JournalDetailPage />} />
                      <Route path="favorites" element={<FavoritesPage />} />
                      <Route path="calendar" element={<CalendarPage />} />
                      <Route path="trash" element={<TrashPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                      <Route path="profile" element={<ProfilePage />} />
                      <Route element={<AdminRoute />}>
                        <Route path="admin/users" element={<AdminUsersPage />} />
                      </Route>
                    </Route>
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
            <Toaster richColors position="top-right" closeButton />
          </JournalMetaProvider>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
