import { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import ColumnView from './components/ColumnView.jsx';

export default function App() {
    const [columns, setColumns] = useState([
        { id: 'col-pile', title: 'Куча' }
    ]);
    const [tasks, setTasks]   = useState([]);
    const [current, setCurrent] = useState('col-pile');

    const addTask = task => setTasks(prev => [...prev, task]);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar
                columns={columns}
                selectedId={current}
                onSelect={setCurrent}
                onAddTask={addTask}
            />
            <main className="flex-1 min-w-0 flex flex-col bg-gray-50 overflow-hidden">
                {(() => {
                    const column = columns.find(c => c.id === current);
                    const colTasks = tasks.filter(t => t.columnId === current);
                    return <ColumnView column={column} tasks={colTasks}/>;
                })()}
            </main>
        </div>
    );
}
