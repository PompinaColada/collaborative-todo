import { useState } from 'react';
import { incrementalCounter } from '../lib/generator.js';

const idGen = incrementalCounter(1000);

export default function TaskModal({ isOpen, onClose, onCreate, columnId }) {
    const [title, setTitle] = useState('');
    const [body, setBody]   = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        onCreate({
            id: idGen.next().value,
            title,
            body,
            createdAt: new Date().toLocaleString(),
            columnId,
        });
        setTitle('');
        setBody('');
        onClose();
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white rounded p-6 w-80">
                <h3 className="text-xl font-bold mb-4">Нова задача</h3>
                <input
                    className="w-full mb-3 border px-2 py-1"
                    placeholder="Заголовок"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
                <textarea
                    className="w-full mb-3 border px-2 py-1"
                    rows={4}
                    placeholder="Опис"
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    required
                />
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose}>Скасувати</button>
                    <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
                        Створити
                    </button>
                </div>
            </form>
        </div>
    );
}
