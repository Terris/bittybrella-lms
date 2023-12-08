import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui";

interface SortableListProps {
  children: React.ReactNode;
  onUpdate: (updatedItems: string[]) => void;
  items: string[];
}

export function SortableList({ children, onUpdate, items }: SortableListProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id === over.id) return;

    const oldIndex = items.indexOf(active.id);
    const newIndex = items.indexOf(over.id);
    const newOrder = arrayMove(items, oldIndex, newIndex);
    onUpdate(newOrder);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

export function SortableListItem({
  id,
  children,
}: {
  id: number | string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="w-full flex flex-row items-start"
    >
      <Tooltip>
        <TooltipTrigger>
          <GripVertical
            className="flex-shrink-0 w-3 h-3 mr-1.5 mt-3 cursor-move"
            {...listeners}
          />
        </TooltipTrigger>
        <TooltipContent>Drag to rearrange</TooltipContent>
      </Tooltip>
      {children}
    </div>
  );
}
