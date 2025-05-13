import { Handle, Position } from "@xyflow/react";
import { shallow } from "zustand/shallow";
import { useStore, type AudioStoreVal } from "../../store";
import { cn } from "@/lib/utils";
import { BaseNode } from "@/components/base-node";

const selector = (store: AudioStoreVal) => ({
  isRunning: store.isRunning,
});

export default function Out({ selected }: { selected: boolean }) {
  const { isRunning } = useStore(selector, shallow);

  return (
    <BaseNode selected={selected}>
      <Handle className={cn("w-2 h-2")} type="target" position={Position.Top} />

      {isRunning ? (
        <span role="img" aria-label="mute">
          🔈
        </span>
      ) : (
        <span role="img" aria-label="unmute">
          🔇
        </span>
      )}
    </BaseNode>
  );
}
