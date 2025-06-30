import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

export default function PaginaSegura({ children }) {
    const navegacao = useNavigate();
    const [autenticado, setAutenticado] = useState(null); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navegacao('/login');
        } else {
            setAutenticado(true);
        }
    }, [navegacao]);

    if (autenticado === null) {
        return <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
            <p>Verificando autenticação...</p>; 
              </div>
        
    }

    return children;
}
