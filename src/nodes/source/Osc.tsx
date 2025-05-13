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
  setFrequency: ((e) =>
    store.updateNode(id, {
      frequency: +e.target.value,
    })) as ChangeEventHandler<HTMLInputElement>,
  setType: ((e) =>
    store.updateNode(id, {
      type: e.target.value,
    })) as ChangeEventHandler<HTMLSelectElement>,
});

export default function Osc({
  id,
  data,
  selected,
}: {
  id: string;
  data: { frequency: number; type: string };
  selected: boolean;
}) {
  const { setFrequency, setType } = useStore(selector(id), shallow);

  return (
    <BaseNode selected={selected} className="px-3 py-2">
      <NodeHeader className="-mx-3 -mt-2 border-b">
        <NodeHeaderTitle>Oscillator</NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderDeleteAction />
        </NodeHeaderActions>
      </NodeHeader>
      <div className="mt-2">
        <label className={cn("flex flex-col px-2 py-1")}>
          <p className={cn("text-xs font-bold mb-2")}>Frequency</p>
          <input
            className={cn("nodrag")}
            type="range"
            min="10"
            max="1000"
            value={data.frequency}
            onChange={setFrequency}
          />
          <p className={cn("text-right text-xs")}>{data.frequency} Hz</p>
        </label>

        <hr className={cn("border-gray-200 mx-2")} />

        <label className={cn("flex flex-col px-2 pt-1 pb-4")}>
          <p className={cn("text-xs font-bold mb-2")}>Waveform</p>
          <select className={cn("nodrag")} value={data.type} onChange={setType}>
            <option value="sine">sine</option>
            <option value="triangle">triangle</option>
            <option value="sawtooth">sawtooth</option>
            <option value="square">square</option>
          </select>
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
