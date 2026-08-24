import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { PublicDataProvider } from '@/contexts/PublicDataContext'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { LoginPage } from '@/pages/admin/LoginPage'
import { ManagementIndexPage } from '@/pages/admin/ManagementIndexPage'
import { IdentityManagementPage } from '@/pages/admin/IdentityManagementPage'
import { IntellectManagementPage } from '@/pages/admin/IntellectManagementPage'
import { PassionManagementPage } from '@/pages/admin/PassionManagementPage'
import IdentityPage from '@/pages/public/identity/IdentityPage'
import IntellectPage from '@/pages/public/intellect/IntellectPage'
import PassionPage from '@/pages/public/passion/PassionPage'

/** Mounts PublicDataProvider once for the whole public site instead of per-page,
 *  so profile/socials aren't refetched every time someone navigates between
 *  Identity/Intellect/Passion. */
function PublicLayout() {
  return (
    <PublicDataProvider>
      <Outlet />
    </PublicDataProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" toastOptions={{ style: { fontSize: 13 } }} />
      <Routes>
        <Route path="/" element={<Navigate to="/identity" replace />} />

        <Route element={<PublicLayout />}>
          <Route path="/identity" element={<IdentityPage />} />
          <Route path="/intellect" element={<IntellectPage />} />
          <Route path="/passion" element={<PassionPage />} />
        </Route>

        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin/management"
          element={
            <ProtectedRoute>
              <ManagementIndexPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/management/identity"
          element={
            <ProtectedRoute>
              <IdentityManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/management/intellect"
          element={
            <ProtectedRoute>
              <IntellectManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/management/passion"
          element={
            <ProtectedRoute>
              <PassionManagementPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/identity" replace />} />
      </Routes>
    </ThemeProvider>
  )
}
