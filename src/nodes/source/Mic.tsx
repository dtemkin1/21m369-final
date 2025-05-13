import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { BaseNode } from "@/components/base-node";

export default function Mic({ selected }: { selected: boolean }) {
  return (
    <BaseNode selected={selected}>
      <Handle
        className={cn("w-2 h-2")}
        type="source"
        position={Position.Bottom}
      />
      <span role="img" aria-label="microphone">
        🎤
      </span>
    </BaseNode>
  );
}
