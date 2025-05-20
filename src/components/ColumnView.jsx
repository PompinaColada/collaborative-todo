export default function ColumnView({ column, tasks }) {
    return (
        <div className="flex-1 p-4 overflow-y-auto h-full">
            <h2 className="text-2xl font-bold mb-4 text-black">{column.title}</h2>
            <ul className="space-y-3">
                {tasks.map(task => (
                    <li key={task.id} className="bg-white p-4 rounded shadow">
                        <div className="flex justify-between mb-2">
                            <strong className="text-black">#{task.id} {task.title}</strong>
                            <span className="text-sm text-gray-500">{task.createdAt}</span>
                        </div>
                        <p className="text-black">{task.body}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
