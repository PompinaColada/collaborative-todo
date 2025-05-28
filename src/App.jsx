import { useState, useEffect } from 'react';
import Board        from './components/Board.jsx';
import Sidebar      from './components/Sidebar.jsx';
import TaskModal    from './components/TaskModal.jsx';
import { loadState, saveState } from './utils/storage.js';
import { log }                 from './utils/history.js';
import { asyncToggleDone, asyncRemoveTask } from './utils/asyncHelper.js';

const initialState = {
    columns: [{ id: 'col-pile', title: 'Куча', order: 0, collapsed: false }],
    tasks:   [],
};

export default function App() {
    const [columns, setColumns] = useState(() => {
        const saved = loadState()?.columns ?? initialState.columns;
        return saved.map((c, i) => ({
            id: c.id.toString(),
            title: c.title,
            order: typeof c.order === 'number' ? c.order : i,
            collapsed: !!c.collapsed,
        }));
    });
    const [tasks, setTasks] = useState(() => {
        const saved = loadState()?.tasks ?? initialState.tasks;
        return saved.map((t, i) => ({
            ...t,
            id: t.id.toString(),
            order: typeof t.order === 'number' ? t.order : i,
            sub: Array.isArray(t.sub)
                ? t.sub.map(s => ({ id: s.id.toString(), text: s.text, done: !!s.done }))
                : [],
        }));
    });

    const [currentCol, setCurrentCol]       = useState('col-pile');
    const [query, setQuery]                 = useState('');
    const [filter, setFilter]               = useState('all');
    const [sort, setSort]                   = useState('created');
    const [selectedTaskId, setSelected]     = useState(null);

    const [editingTask, setEditingTask]     = useState(null);
    const [isModalOpen, setIsModalOpen]     = useState(false);

    // Persist
    useEffect(() => {
        saveState({ columns, tasks });
    }, [columns, tasks]);

    // Helper: наступний order в колонці
    const nextOrderInCol = colId =>
        tasks
            .filter(t => t.columnId === colId)
            .reduce((m, t) => Math.max(m, t.order), -1) + 1;

    const addColumn = () => {
        const title = prompt('Нова колонка?');
        if (!title) return;
        const id = `col-${Date.now().toString(36)}`;
        setColumns(cs => [...cs, { id, title, order: cs.length, collapsed: false }]);
        log('column.create', { id, title });
        setCurrentCol(id);
    };
    const renameColumn = id => {
        const title = prompt('Нова назва?');
        if (!title) return;
        setColumns(cs => cs.map(c => c.id === id ? { ...c, title } : c));
        log('column.rename', { id, title });
    };
    const removeColumn = id => {
        if (!confirm('Видалити колонку?')) return;
        setTasks(ts => ts.map(t => t.columnId === id ? { ...t, columnId: 'col-pile' } : t));
        setColumns(cs => cs.filter(c => c.id !== id));
        log('column.delete', { id });
        setCurrentCol('col-pile');
    };
    const toggleCollapse = id =>
        setColumns(cs => cs.map(c => c.id === id ? { ...c, collapsed: !c.collapsed } : c));

    const reorderColumns = (from, to) => {
        const list = [...columns].sort((a, b) => a.order - b.order);
        const [mv] = list.splice(from, 1);
        list.splice(to, 0, mv);
        list.forEach((c, i) => c.order = i);
        setColumns(list);
        log('column.reorder', { from, to });
    };

    const addTask = t => {
        setTasks(ts => [...ts, t]);
        log('task.create', { id: t.id, title: t.title, columnId: t.columnId });
    };
    const updateTask = upd => {
        setTasks(ts => ts.map(t => t.id === upd.id ? upd : t));
        log('task.update', { id: upd.id, title: upd.title, columnId: upd.columnId });
    };

    const toggleDone = async id => {
        const raw = await asyncToggleDone(tasks, id, new AbortController().signal);
        const me  = raw.find(t => t.id === id.toString());
        let updated = raw;
        if (me?.sub?.length) {
            updated = raw.map(t =>
                t.id === me.id
                    ? { ...t, sub: t.sub.map(s => ({ ...s, done: !t.done })) }
                    : t
            );
        }
        setTasks(updated);
        log('task.toggle', { id: me.id, title: me.title, columnId: me.columnId });
    };

    const deleteTask = async id => {
        const me = tasks.find(t => t.id === id.toString());
        const upd = await asyncRemoveTask(tasks, id.toString(), new AbortController().signal);
        setTasks(upd);
        log('task.delete', { id: me.id, title: me.title, columnId: me.columnId });
    };

    const moveTask = (id, from, to, idx) => {
        setTasks(ts => {
            const strId = id.toString();
            const moved = ts.find(t => t.id.toString() === strId);
            if (!moved) return ts; // guard
            const target = ts
                .filter(t => t.columnId === to && t.id.toString() !== strId)
                .sort((a, b) => a.order - b.order);
            target.splice(idx, 0, moved);
            target.forEach((t, i) => t.order = i);
            return ts.map(t => {
                if (t.id.toString() === strId) {
                    return { ...t, columnId: to, order: idx };
                }
                const found = target.find(x => x.id.toString() === t.id.toString());
                return found ?? t;
            });
        });
        log('task.move', { id, from, to });
    };

    const reorderTask = (colId, from, to) => {
        setTasks(ts => {
            const list = ts.filter(t => t.columnId === colId).sort((a, b) => a.order - b.order);
            const [mv] = list.splice(from, 1);
            list.splice(to, 0, mv);
            list.forEach((t, i) => t.order = i);
            return ts.map(t => list.find(x => x.id === t.id) ?? t);
        });
        log('task.reorder', { colId, from, to });
    };

    const openNewModal  = () => { setEditingTask(null); setIsModalOpen(true); };
    const openEditModal = t => { setEditingTask(t); setIsModalOpen(true); };
    const closeModal    = () => { setIsModalOpen(false); setEditingTask(null); };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar
                columns={columns.sort((a,b)=>a.order-b.order)}
                selectedId={currentCol}
                onSelect={setCurrentCol}
                onAddTask={openNewModal}
                onAddColumn={addColumn}
                onRename={renameColumn}
                onRemove={removeColumn}
                onToggleCollapse={toggleCollapse}
                query={query} onSearch={setQuery}
                filter={filter} setFilter={setFilter}
                sort={sort} setSort={setSort}
                gotoTask={(colId, taskId) => {
                    // Auto expand & highlight
                    setColumns(cols => cols.map(c => c.id===colId ? { ...c, collapsed:false } : c));
                    setCurrentCol(colId);
                    setSelected(taskId);
                    setTimeout(()=>{
                        document.getElementById(`task-${taskId}`)?.scrollIntoView({behavior:'smooth',block:'center'});
                    },100);
                    setTimeout(()=>setSelected(null),2000);
                }}
            />

            <main className="flex-1 flex flex-col bg-white overflow-hidden">
                <Board
                    columns={columns}
                    tasks={tasks}
                    currentFilter={filter}
                    currentSort={sort}
                    search={query}
                    selectedTaskId={selectedTaskId}
                    moveTask={moveTask}
                    reorderTask={reorderTask}
                    reorderColumns={reorderColumns}
                    onToggleDone={toggleDone}
                    onDelete={deleteTask}
                    onEdit={openEditModal}
                    onToggleCollapse={toggleCollapse}
                />

                <TaskModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onCreate={t => addTask({ ...t, order: nextOrderInCol(t.columnId) })}
                    onUpdate={updateTask}
                    columnId={currentCol}
                    task={editingTask}
                />
            </main>
        </div>
    );
}
