import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { memoize } from '../lib/memoize.js';

const filterFn = memoize((list, q) =>
    list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.body.toLowerCase().includes(q)
    )
);

const isOverdue = t =>
    !t.done && t.deadline && new Date(t.deadline) < Date.now();

const fmt = iso => (iso ? new Date(iso).toLocaleString() : '—');

export default function ColumnView({
                                       column,
                                       tasks,
                                       search,
                                       filter,
                                       sort,
                                       selectedTaskId,
                                       onToggleDone,
                                       onDelete,
                                       onEdit,
                                       onToggleCollapse
                                   }) {
    let list = tasks;
    if (filter === 'active')  list = list.filter(t => !t.done);
    if (filter === 'done')    list = list.filter(t => t.done);
    if (filter === 'overdue') list = list.filter(isOverdue);

    const prW = { high: 0, medium: 1, low: 2 };
    list = list.slice().sort((a, b) => {
        if (filter === 'done')                return (b.completedAt ?? 0) - (a.completedAt ?? 0);
        if (sort === 'priority')              return prW[a.priority] - prW[b.priority];
        if (sort === 'deadline') {
            const da = a.deadline ? new Date(a.deadline) : Infinity;
            const db = b.deadline ? new Date(b.deadline) : Infinity;
            return da - db;
        }
        if (sort === 'completed')             return (b.completedAt ?? 0) - (a.completedAt ?? 0);
        return (a.order ?? 0) - (b.order ?? 0);
    });

    const shown = search ? filterFn(list, search.toLowerCase()) : list;

    return (
        <div className="w-96 flex-shrink-0 p-4 flex flex-col h-full">
            <h2
                className="text-xl font-bold mb-3 cursor-pointer select-none"
                onClick={() => onToggleCollapse(column.id)}
            >
                {column.title}
            </h2>

            {column.collapsed ? (
                <div className="italic text-gray-500">(згорнуто)</div>
            ) : (
                <Droppable
                    droppableId={column.id}
                    type="TASK"
                    isDropDisabled={false}
                    isCombineEnabled={false}
                    ignoreContainerClipping={false}
                >
                {provided => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex-1 overflow-y-auto"
                    >
                        {shown.map((task, idx) => {
                            const total = task.sub?.length || 0;
                            const done  = task.sub?.filter(s => s.done).length || 0;
                            return (
                                <Draggable
                                    key={task.id.toString()}
                                    draggableId={task.id.toString()}
                                    index={idx}
                                >
                                    {prov => (
                                        <div
                                            id={`task-${task.id}`}
                                            ref={prov.innerRef}
                                            {...prov.draggableProps}
                                            {...prov.dragHandleProps}
                                            className={`
                                            w-full p-4 mb-3 rounded shadow flex justify-between
                                            ${isOverdue(task) ? 'bg-red-300' : 'bg-white'}
                                            ${task.priority ? `priority-${task.priority}` : ''}
                                            ${task.id === selectedTaskId ? 'ring-2 ring-blue-400' : ''}
                                            `}
                                        >
                                            <div className="flex flex-col flex-1">
                                                <div className="flex justify-between items-start">
                                                    <strong className={task.done ? 'line-through' : ''}>
                                                        {task.title}
                                                    </strong>
                                                    <small className="text-gray-500 text-xs">
                                                        {fmt(task.deadline)}
                                                    </small>
                                                </div>
                                                <p className={task.done ? 'line-through opacity-60' : ''}>
                                                    {task.body}
                                                </p>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                                                    <label className="flex items-center gap-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={task.done}
                                                            onChange={() => onToggleDone(task.id)}
                                                        />
                                                        Виконано
                                                    </label>
                                                    {total > 0 && (
                                                        <span>Підзадачі: {done} / {total}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 ml-4">
                                                <button
                                                    onClick={() => onEdit(task)}
                                                    className="text-blue-600 text-sm"
                                                    title="Редагувати"
                                                >✏️</button>
                                                <button
                                                    onClick={() => onDelete(task.id)}
                                                    className="text-red-600 text-sm"
                                                    title="Видалити"
                                                >🗑</button>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            );
                        })}
                            {provided.placeholder}
                    </div>
                )}
            </Droppable>
                )}
        </div>
    );
}
