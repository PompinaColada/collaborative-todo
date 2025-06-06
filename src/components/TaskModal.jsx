import { useEffect, useState } from 'react';
import { emit, on } from "../utils/emitter.js";
import { incrementalCounter } from '../lib/generator.js';

const idGen = incrementalCounter(1);

export default function TaskModal({
                                      isOpen, onClose, onCreate, onUpdate, columnId, task
                                  }) {
    const [title, setTitle] = useState('');
    const [body, setBody]   = useState('');
    const [priority, setPr] = useState('low');
    const [datePart, setDatePart] = useState('');
    const [timePart, setTimePart] = useState('');
    const [subs, setSubs]   = useState([]);

    useEffect(() => {
        if (isOpen) {
            emit("modal:open", task ? { mode: "edit", id: task.id } : { mode: "create" });
        } else {
            emit("modal:close");
        }
    }, [isOpen, task]);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setBody(task.body);
            setPr(task.priority || "low");
            setSubs(task.sub || []);
            if (task.deadline) {
                const [d, t] = task.deadline.split("T");
                setDatePart(d);
                setTimePart(t?.slice(0, 5) || "");
            }
        } else {
            setTitle("");
            setBody("");
            setPr("low");
            setSubs([]);
            setDatePart("");
            setTimePart("");
        }
    }, [task, isOpen]);

    const addSub = () =>
        setSubs(s => [...s, {
            id: idGen.next().value.toString(),
            text: '',
            done: false
        }]);

    const updateSub = (subId, field, val) =>
        setSubs(s => {
            const next = s.map(x => x.id === subId ? { ...x, [field]: val } : x);
            emit("subtask:update", { taskId: task?.id, sub: next.find((x) => x.id === subId) }); /* 🟢 нове */

            if (task) {
                if (next.every(x => x.done)) {
                    onUpdate({ ...task, sub: next, done: true, completedAt: Date.now() });
                } else if (task.done) {
                    onUpdate({ ...task, sub: next, done: false, completedAt: null });
                }
            }
            return next;
        });

    const removeSub = (id) => {
        setSubs((s) => s.filter((x) => x.id !== id));
        emit("subtask:remove", { taskId: task?.id, subId: id });
    };

    const handleSubmit = e => {
        e.preventDefault();
        const clean = subs.filter(s => s.text.trim());
        const deadlineISO = datePart ? `${datePart}T${timePart || '23:59'}` : null;

        if (task) {
            onUpdate({ ...task, title, body, priority, deadline: deadlineISO, sub: clean });
            emit("task:update", { id: task.id });
        } else {
            const newTask = {
                id: idGen.next().value.toString(),
                title,
                body,
                priority,
                deadline: deadlineISO,
                createdAt: new Date().toISOString(),
                columnId,
                done: false,
                completedAt: null,
                order: 0,
                sub: clean,
            };
            onCreate(newTask);
            emit("task:create", newTask);
        }
        onClose();
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit}
                  className="bg-white rounded p-6 w-96 max-h-[95vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">{task ? 'Редагувати' : 'Нова'} задача</h3>
                <input className="w-full mb-3 border px-2 py-1"
                       placeholder="Заголовок" value={title}
                       onChange={e => setTitle(e.target.value)} required />

                <textarea className="w-full mb-3 border px-2 py-1" rows={3}
                          placeholder="Опис" value={body}
                          onChange={e => setBody(e.target.value)} required />

                <label className="block text-sm mb-1">Пріоритет:</label>
                <select className="w-full mb-3 border px-2 py-1"
                        value={priority} onChange={e => setPr(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                <label className="block text-sm mb-1">Дедлайн:</label>
                <input type="date" className="w-full mb-2 border px-2 py-1"
                       value={datePart} onChange={e => setDatePart(e.target.value)} />
                <label className="block text-sm mb-1">Час (опц.):</label>
                <input type="time" className="w-full mb-4 border px-2 py-1"
                       value={timePart} onChange={e => setTimePart(e.target.value)} />

                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold">Підзадачі</span>
                        <button type="button" onClick={addSub} className="text-green-600">＋</button>
                    </div>
                    {subs.map(sub => (
                        <div key={sub.id} className="flex items-center gap-2 mb-1">
                            <input type="checkbox" checked={sub.done}
                                   onChange={() => updateSub(sub.id, 'done', !sub.done)} />
                            <input className="flex-1 border px-1 py-0.5 text-sm"
                                   value={sub.text}
                                   onChange={e => updateSub(sub.id, 'text', e.target.value)} />
                            <button type="button" onClick={() => removeSub(sub.id)}
                                    className="text-red-600">🗑</button>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={onClose}>Скасувати</button>
                    <button type="submit"
                            className="bg-blue-600 text-white px-3 py-1 rounded">
                        {task ? 'Зберегти' : 'Створити'}
                    </button>
                </div>
            </form>
        </div>
    );
}
