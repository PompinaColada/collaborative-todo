import { useState } from 'react';
import SearchBar from './SearchBar.jsx';
import { getHistory } from '../utils/history.js';

export default function Sidebar({
                                    columns,
                                    selectedId,
                                    onSelect,
                                    onAddTask,
                                    onAddColumn,
                                    onRename,
                                    onRemove,
                                    onToggleCollapse,
                                    query, onSearch,
                                    filter, setFilter,
                                    sort, setSort,
                                    gotoTask
                                }) {
    const [showLog, setShowLog] = useState(false);

    const filters = [
        { id: 'all',     label: 'Усі' },
        { id: 'active',  label: 'Активні' },
        { id: 'done',    label: 'Виконані' },
        { id: 'overdue', label: 'Просрочені' },
    ];
    const sorts = [
        { id: 'created',   label: 'Створення' },
        { id: 'deadline',  label: 'Дедлайн' },
        { id: 'completed', label: 'Виконання' },
        { id: 'priority',  label: 'Пріоритет' },
    ];

    return (
        <aside className="w-72 flex-shrink-0 bg-gray-100 border-r p-4 min-h-screen flex flex-col">
            <SearchBar value={query} onChange={onSearch} />

            <label className="block text-sm mt-4 mb-1">Фільтр:</label>
            <select className="w-full mb-2 border px-2 py-1" value={filter} onChange={e => setFilter(e.target.value)}>
                {filters.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>

            <label className="block text-sm mb-1">Сортувати за:</label>
            <select className="w-full mb-4 border px-2 py-1" value={sort} onChange={e => setSort(e.target.value)}>
                {sorts.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>

            <button onClick={onAddTask}
                    className="w-full mb-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >＋ Задача</button>

            <nav className="flex-1 overflow-y-auto mb-4">
                {columns.map(col => (
                    <div key={col.id} className="flex items-center mb-1">
                        <button onClick={() => onSelect(col.id)}
                                className={`flex-1 text-left px-2 py-1 rounded ${
                                    selectedId === col.id ? 'bg-blue-200' : 'hover:bg-gray-200'
                                }`}>
                            {col.title}
                        </button>
                        <button onClick={() => onToggleCollapse(col.id)}
                                className="px-1 text-gray-600 hover:text-black" title="Згорнути/розгорнути">
                            {col.collapsed ? '▸' : '▾'}
                        </button>
                        {col.id !== 'col-pile' && <>
                            <button onClick={() => onRename(col.id)} className="px-1 text-gray-500 hover:text-gray-700" title="Перейменувати">🖉</button>
                            <button onClick={() => onRemove(col.id)} className="px-1 text-red-500 hover:text-red-700" title="Видалити">✕</button>
                        </>}
                    </div>
                ))}
            </nav>

            <button onClick={onAddColumn}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >＋ Колонка</button>

            <button onClick={() => setShowLog(!showLog)}
                    className="w-full mt-3 py-1 border rounded text-sm hover:bg-gray-200"
            >{showLog ? '✖ Приховати історію' : '🕘 Показати історію'}</button>

            {showLog && (
                <ul className="mt-2 h-40 overflow-y-auto text-xs border-t pt-2">
                    {getHistory().slice(0, 20).map(ev => (
                        <li key={ev.uid} className="mb-1">
                            <span className="text-gray-500">{new Date(ev.ts).toLocaleTimeString()} </span>
                            <span>{ev.type}</span>{' '}
                            {ev.title && (
                                <button onClick={() => gotoTask(ev.columnId, ev.id)}
                                        className="text-blue-600 underline" title="Перейти до задачі">
                                    {ev.title}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
}
