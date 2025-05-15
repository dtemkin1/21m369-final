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
  setBuffer: ((e) =>
    store.updateNode(
      id,
      {
        buffer: e.target.files ? e.target.files[0].arrayBuffer() : null,
      },
      true
    )) as ChangeEventHandler<HTMLInputElement>,
  setNormalize: ((e) =>
    store.updateNode(id, {
      normalize: e.target.checked,
    })) as ChangeEventHandler<HTMLInputElement>,
});

export default function Conv({
  id,
  data,
  selected,
}: {
  id: string;
  data: { buffer: AudioBuffer | null; normalize: boolean };
  selected: boolean;
}) {
  const { setBuffer, setNormalize } = useStore(selector(id), shallow);

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
          <p className={cn("text-xs font-bold mb-2")}>Frequency</p>
          <input
            className={cn("nodrag")}
            type="file"
            accept="audio/*"
            onChange={setBuffer}
          />
        </label>

        <hr className={cn("border-gray-200 mx-2")} />

        <label className={cn("flex flex-col px-2 py-1")}>
          <p className={cn("text-xs font-bold mb-2")}>Normalize?</p>
          <input
            className={cn("nodrag")}
            type="checkbox"
            checked={data.normalize}
            onChange={setNormalize}
          />
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
