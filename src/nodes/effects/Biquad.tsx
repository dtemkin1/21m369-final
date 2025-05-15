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
  setQ: ((e) =>
    store.updateNode(id, {
      Q: +e.target.value,
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
  data: { frequency: number; Q: number; type: BiquadFilterType };
  selected: boolean;
}) {
  const { setFrequency, setQ, setType } = useStore(selector(id), shallow);

  return (
    <BaseNode selected={selected} className="px-3 py-2">
      <Handle className={cn("w-2 h-2")} type="target" position={Position.Top} />
      <NodeHeader className="-mx-3 -mt-2 border-b">
        <NodeHeaderTitle>Biquad</NodeHeaderTitle>
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

        {data.type == "lowpass" || data.type == "highpass" ? (
          <label className={cn("flex flex-col px-2 py-1")}>
            <p className={cn("text-xs font-bold mb-2")}>Q Factor</p>
            <input
              className={cn("nodrag")}
              type="number"
              min={-770.63678}
              max={+770.63678}
              value={data.Q}
              onChange={setQ}
            />
          </label>
        ) : null}

        {data.type == "bandpass" ||
        data.type == "notch" ||
        data.type == "allpass" ||
        data.type == "peaking" ? (
          <label className={cn("flex flex-col px-2 py-1")}>
            <p className={cn("text-xs font-bold mb-2")}>Q Factor</p>
            <input
              className={cn("nodrag")}
              type="number"
              min={-3.403e38}
              max={3.403e38}
              value={data.Q}
              onChange={setQ}
            />
          </label>
        ) : null}

        <hr className={cn("border-gray-200 mx-2")} />

        <label className={cn("flex flex-col px-2 pt-1 pb-4")}>
          <p className={cn("text-xs font-bold mb-2")}>Filter Type</p>
          <select className={cn("nodrag")} value={data.type} onChange={setType}>
            <option value="lowpass">lowpass</option>
            <option value="highpass">highpass</option>
            <option value="bandpass">bandpass</option>
            <option value="lowshelf">lowshelf</option>
            <option value="highshelf">highshelf</option>
            <option value="peaking">peaking</option>
            <option value="notch">notch</option>
            <option value="allpass">allpass</option>
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
