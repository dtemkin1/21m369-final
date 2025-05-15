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
  setCurve: (async (e) =>
    store.updateNode(id, {
      curve: new Float32Array(e.target.value.split(",").map(Number)),
    })) as ChangeEventHandler<HTMLInputElement>,
  setOversample: ((e) =>
    store.updateNode(id, {
      oversample: e.target.value,
    })) as ChangeEventHandler<HTMLSelectElement>,
});

export default function WaveShaper({
  id,
  data,
  selected,
}: {
  id: string;
  data: {
    curve: Float32Array;
    oversample: OverSampleType;
  };
  selected: boolean;
}) {
  const { setCurve, setOversample } = useStore(selector(id), shallow);

  return (
    <BaseNode selected={selected} className="px-3 py-2">
      <Handle className={cn("w-2 h-2")} type="target" position={Position.Top} />
      <NodeHeader className="-mx-3 -mt-2 border-b">
        <NodeHeaderTitle>Convolver</NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderDeleteAction />
        </NodeHeaderActions>
      </NodeHeader>
      <div className="mt-2">
        <label className={cn("flex flex-col px-2 py-1")}>
          <p className={cn("text-xs font-bold mb-2")}>
            Curve Array (comma separated)
          </p>
          <input
            className={cn("nodrag")}
            type="text"
            value={data.curve?.toString()}
            onChange={setCurve}
          />
        </label>

        <hr className={cn("border-gray-200 mx-2")} />

        <label className={cn("flex flex-col px-2 pt-1 pb-4")}>
          <p className={cn("text-xs font-bold mb-2")}>Oversample</p>
          <select
            className={cn("nodrag")}
            value={data.oversample}
            onChange={setOversample}
          >
            <option value="none">none</option>
            <option value="2x">2x</option>
            <option value="4x">4x</option>
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
