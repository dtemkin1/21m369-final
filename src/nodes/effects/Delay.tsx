import { Handle, Position } from "@xyflow/react";
import { shallow } from "zustand/shallow";
import { useStore, type AudioStoreVal } from "../../store";
import type { ChangeEventHandler } from "react";
import { cn } from "@/lib/utils";
import { BaseNode } from "@/components/base-node";
import {
  NodeHeader,
  NodeHeaderTitle,
  NodeHeaderActions,
  NodeHeaderDeleteAction,
} from "@/components/node-header";

const selector = (id: string) => (store: AudioStoreVal) => ({
  setDelayTime: ((e) =>
    store.updateNode(id, {
      delayTime: +e.target.value,
    })) as ChangeEventHandler<HTMLInputElement>,
});

export default function Delay({
  id,
  data,
  selected,
}: {
  id: string;
  data: { delayTime: number };
  selected: boolean;
}) {
  const { setDelayTime } = useStore(selector(id), shallow);

  return (
    <BaseNode selected={selected} className="px-3 py-2">
      <Handle className={cn("w-2 h-2")} type="target" position={Position.Top} />
      <NodeHeader className="-mx-3 -mt-2 border-b">
        <NodeHeaderTitle>Delay</NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderDeleteAction />
        </NodeHeaderActions>
      </NodeHeader>
      <div className="mt-2">
        <label className={cn("flex flex-col px-2 py-1")}>
          <p className={cn("text-xs font-bold mb-2")}>Delay Time</p>
          <input
            className={cn("nodrag")}
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={data.delayTime}
            onChange={setDelayTime}
          />
          <p className={cn("text-right text-xs")}>{data.delayTime} s</p>
        </label>
      </div>

      <Handle
        className={cn("w-2 h-2")}
        type="source"
        position={Position.Bottom}
      />
    </BaseNode>
  );
}
