import { Handle, Position } from "@xyflow/react";
import { shallow } from "zustand/shallow";
import { useStore, type AudioStoreVal } from "../../store";
import { cn } from "@/lib/utils";
import { BaseNode } from "@/components/base-node";
import { useEffect, useMemo, useRef, type ChangeEventHandler } from "react";
import {
  NodeHeader,
  NodeHeaderTitle,
  NodeHeaderActions,
  NodeHeaderDeleteAction,
} from "@/components/node-header";

const selector = (id: string) => (store: AudioStoreVal) => ({
  isRunning: store.isRunning,
  setFFTSize: ((e) =>
    store.updateNode(id, {
      fftSize: +e.target.value,
    })) as ChangeEventHandler<HTMLSelectElement>,
});

// credit for the animation code guide: https://dev.to/ssk14/visualizing-audio-as-a-waveform-in-react-o67
const animateBars = (
  getByteFrequencyData: (array: Uint8Array) => void,
  canvas: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  dataArray: Uint8Array<ArrayBuffer>,
  bufferLength: number
) => {
  getByteFrequencyData(dataArray);

  canvasCtx.fillStyle = "#000";

  const HEIGHT = canvas.height / 2;
  const barWidth = Math.ceil(canvas.width / bufferLength) * 2.5;

  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = (dataArray[i] / 255) * HEIGHT;

    const maximum = 10;
    const minimum = -10;
    const r =
      242 + Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    const g =
      104 + Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    const b =
      65 + Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

    canvasCtx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }
};

export default function Out({
  id,
  data,
  selected,
}: {
  id: string;
  data: {
    fftSize: number;
    smoothingTimeConstant: number;
    minDecibels: number;
    maxDecibels: number;
    getFrequencyBinCount: () => number;
    getByteFrequencyData: (array: Uint8Array) => void;
  };
  selected: boolean;
}) {
  const { setFFTSize } = useStore(selector(id), shallow);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const bufferLength = data.getFrequencyBinCount();
  const dataArray = useMemo(() => new Uint8Array(bufferLength), [bufferLength]);

  const draw = (
    dataArray: Uint8Array<ArrayBuffer>,
    getByteFrequencyData: (array: Uint8Array) => void,
    bufferLength: number
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    const animate = () => {
      requestAnimationFrame(animate);
      // eslint-disable-next-line no-self-assign
      canvas.width = canvas.width;
      animateBars(
        getByteFrequencyData,
        canvas,
        canvasCtx,
        dataArray,
        bufferLength
      );
    };

    animate();
  };

  useEffect(() => {
    draw(dataArray, data.getByteFrequencyData, bufferLength);
  }, [dataArray, data.getByteFrequencyData, bufferLength]);

  return (
    <BaseNode selected={selected}>
      <Handle className={cn("w-2 h-2")} type="target" position={Position.Top} />
      <NodeHeader className="-mx-3 -mt-2 border-b">
        <NodeHeaderTitle>Oscilloscope</NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderDeleteAction />
        </NodeHeaderActions>
      </NodeHeader>

      <div className="mt-2">
        <label className={cn("flex flex-col px-2 pt-1 pb-4")}>
          <p className={cn("text-xs font-bold mb-2")}>FFT Size</p>
          <select
            className={cn("nodrag")}
            value={data.fftSize}
            onChange={setFFTSize}
          >
            <option value={32}>32</option>
            <option value={64}>64</option>
            <option value={128}>128</option>
            <option value={256}>256</option>
            <option value={512}>512</option>
            <option value={1024}>1024</option>
            <option value={2048}>2048</option>
            <option value={4096}>4096</option>
            <option value={8192}>8192</option>
            <option value={16384}>16384</option>
            <option value={32768}>32768</option>
          </select>
        </label>
        <hr className={cn("border-gray-200 mx-2")} />

        <canvas ref={canvasRef} className={cn("nodrag")}></canvas>
      </div>
    </BaseNode>
  );
}
