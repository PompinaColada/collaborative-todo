import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./context/AuthContext.jsx";
import LoginPage    from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import BoardsPage   from "./pages/BoardsPage.jsx";

function ProtectedRoute({ children }) {
    const { authed } = useAuth();
    return authed ? children : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login"    element={<LoginPage />}    />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <BoardsPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
