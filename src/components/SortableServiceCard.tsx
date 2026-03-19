"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ServiceCard } from "./ServiceCard";
import type { ServiceStatus } from "@/lib/types";

interface Props {
  service: ServiceStatus;
  index: number;
}

export function SortableServiceCard({ service, index }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ServiceCard
        service={service}
        index={index}
        dragHandleProps={listeners}
        isDragging={isDragging}
      />
    </div>
  );
}
