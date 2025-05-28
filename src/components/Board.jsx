import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ColumnView from './ColumnView.jsx';

export default function Board({
                                  columns,
                                  tasks,
                                  currentFilter,
                                  currentSort,
                                  search,
                                  selectedTaskId,
                                  moveTask,
                                  reorderTask,
                                  reorderColumns,
                                  onToggleDone,
                                  onDelete,
                                  onEdit,
                                  onToggleCollapse,
                              }) {
    const handleDragEnd = ({ draggableId, type, source, destination }) => {
        if (!destination) return;

        if (type === 'COLUMN') {
            if (source.index !== destination.index) {
                reorderColumns(source.index, destination.index);
            }
            return;
        }

        if (source.droppableId === destination.droppableId) {
            if (source.index !== destination.index) {
                reorderTask(source.droppableId, source.index, destination.index);
            }
        } else {
            moveTask(
                draggableId,
                source.droppableId,
                destination.droppableId,
                destination.index
            );
        }
    };

    const sortedCols = [...columns].sort((a, b) => a.order - b.order);

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
                droppableId="board"
                type="COLUMN"
                direction="horizontal"
                isDropDisabled={false}
                isCombineEnabled={false}
                ignoreContainerClipping={false}
            >
                {provBoard => (
                    <div
                        ref={provBoard.innerRef}
                        {...provBoard.droppableProps}
                        className="flex overflow-x-auto flex-1"
                    >
                        {sortedCols.map((col, idx) => (
                            <Draggable key={col.id} draggableId={col.id} index={idx}>
                                {provCol => (
                                    <div
                                        ref={provCol.innerRef}
                                        {...provCol.draggableProps}
                                        {...provCol.dragHandleProps}
                                        className="flex-shrink-0"
                                    >
                                        {col.collapsed ? (
                                            <div
                                                onClick={() => onToggleCollapse(col.id)}
                                                title={col.title}
                                                className="w-12 h-32 flex items-center justify-center
                                                bg-gray-100 border-r cursor-pointer select-none"
                                            >
                                                <span className="transform -rotate-90 text-xs">
                                                    {col.title}
                                                </span>
                                            </div>
                                        ) : (
                                            <ColumnView
                                                column={col}
                                                tasks={tasks.filter(t => t.columnId === col.id)}
                                                search={search}
                                                filter={currentFilter}
                                                sort={currentSort}
                                                selectedTaskId={selectedTaskId}
                                                onToggleDone={onToggleDone}
                                                onDelete={onDelete}
                                                onEdit={onEdit}
                                                onToggleCollapse={onToggleCollapse}
                                            />
                                        )}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provBoard.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
