import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, 
    withXSRFToken: true,   
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor de respuestas: Atrapa los errores 401 globalmente
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Verificamos si la petición que falló fue la comprobación de sesión (/api/user)
            const isUserCheck = error.config?.url?.includes('/api/user');

            // Rutas donde NO queremos que un 401 nos devuelva a la fuerza al login
            const rutasExentas = ['/login', '/register', '/forgot-password', '/reset-password'];
            const esRutaExenta = rutasExentas.some(ruta => window.location.pathname.startsWith(ruta));

            // Solo redirigimos si NO es la revisión de usuario y NO estamos en una ruta exenta
            if (!isUserCheck && !esRutaExenta) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;