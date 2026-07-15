"use client";
import { useState } from 'react';

export default function ModalAgregarAdmin({ isOpen, onClose, onAdminAdded }: { isOpen: boolean, onClose: () => void, onAdminAdded: () => void }) {
    const [formData, setFormData] = useState({ nombre: '', correo: '', contrasena: '', rol_id: 1 });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/admin/administradores`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, estado: true }) // Por defecto activo
            });

            if (response.ok) {
                onAdminAdded(); // Recarga la tabla
                onClose();      // Cierra el modal
            } else {
                alert("Error al crear el administrador");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl w-96 shadow-xl space-y-4">
                <h2 className="text-xl font-bold text-blue-900">Nuevo Administrador</h2>
                <input className="w-full p-2 border rounded" placeholder="Nombre" onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
                <input className="w-full p-2 border rounded" type="email" placeholder="Correo" onChange={(e) => setFormData({...formData, correo: e.target.value})} required />
                <input className="w-full p-2 border rounded" type="password" placeholder="Contraseña" onChange={(e) => setFormData({...formData, contrasena: e.target.value})} required />
                <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-blue-900 text-white rounded">Guardar</button>
                </div>
            </form>
        </div>
    );
}