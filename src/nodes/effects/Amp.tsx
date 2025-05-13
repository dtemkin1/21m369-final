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
  setGain: ((e) =>
    store.updateNode(id, {
      gain: +e.target.value,
    })) as ChangeEventHandler<HTMLInputElement>,
});

export default function Osc({
  id,
  data,
  selected,
}: {
  id: string;
  data: { gain: number };
  selected: boolean;
}) {
  const { setGain } = useStore(selector(id), shallow);

  return (
    <BaseNode selected={selected} className="px-3 py-2">
      <Handle className={cn("w-2 h-2")} type="target" position={Position.Top} />
      <NodeHeader className="-mx-3 -mt-2 border-b">
        <NodeHeaderTitle>Amp</NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderDeleteAction />
        </NodeHeaderActions>
      </NodeHeader>
      <div className="mt-2">
        <label className={cn("flex flex-col px-2 pt-1 pb-4")}>
          <p className={cn("text-xs font-bold mb-2")}>Gain</p>
          <input
            className={cn("nodrag")}
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={data.gain}
            onChange={setGain}
          />
          <p className={cn("text-right text-xs")}>{data.gain.toFixed(2)}</p>
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
