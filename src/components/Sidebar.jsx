import { useState } from 'react';
import TaskModal from './TaskModal.jsx';
import SearchBar from './SearchBar.jsx';

export default function Sidebar({
                                    columns,
                                    selectedId,
                                    onSelect,
                                    onAddTask,
                                    query,
                                    onSearch
                                }) {
    const [open, setOpen] = useState(false);

    return (
        <aside className="w-72 flex-shrink-0 bg-gray-100 border-r p-4 min-h-screen">
            <SearchBar value={query} onChange={onSearch} />

            <button
                onClick={() => setOpen(true)}
                className="w-full mb-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                Створити задачу
            </button>

            <nav className="overflow-y-auto">
                {columns.map(col => (
                    <button
                        key={col.id}
                        onClick={() => onSelect(col.id)}
                        className={`block w-full text-left px-3 py-2 rounded mb-1 ${
                            selectedId === col.id
                                ? 'bg-blue-200 text-black'
                                : 'hover:bg-gray-200 text-black'
                        }`}
                    >
                        {col.title}
                    </button>
                ))}
            </nav>

            <TaskModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onCreate={onAddTask}
                columnId={selectedId}
            />
        </aside>
    );
}
