import { Handle, Position } from "@xyflow/react";
// import { shallow } from "zustand/shallow";
// import { useStore, type AudioStoreVal } from "../../store";
import { cn } from "@/lib/utils";
import { BaseNode } from "@/components/base-node";
import { useEffect, useRef } from "react";

// const selector = (store: AudioStoreVal) => ({
//   isRunning: store.isRunning,
// });

export default function FileIn({
  data,
  selected,
}: {
  id: string;
  data: { mediaElement: HTMLAudioElement };
  selected: boolean;
}) {
  // const { isRunning } = useStore(selector, shallow);

  const audioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current && data.mediaElement) {
      audioRef.current.appendChild(data.mediaElement);
    }
  }, [data.mediaElement]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      if (data.mediaElement) {
        data.mediaElement.pause();
        data.mediaElement.src = url;
        data.mediaElement.load();
      } else {
        data.mediaElement = new Audio(url);
      }

      data.mediaElement.controls = true;
      data.mediaElement.loop = true;
      data.mediaElement.autoplay = true;
      data.mediaElement.src = url;
      data.mediaElement.play();
    }
  };

  return (
    <BaseNode selected={selected}>
      <div className="mt-2">
        <label className={cn("flex flex-col px-2 py-1")}>
          <p className={cn("text-xs font-bold mb-2")}>Input Audio File</p>
          <input
            className={cn("nodrag")}
            type="file"
            accept="audio/*"
            onChange={inputChangeHandler}
          />
        </label>

        <div ref={audioRef}></div>
      </div>
      <Handle
        className={cn("w-2 h-2")}
        type="source"
        position={Position.Bottom}
      />
    </BaseNode>
  );
}
