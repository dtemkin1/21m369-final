import { Handle, Position } from "@xyflow/react";
import { shallow } from "zustand/shallow";
import { useStore, type AudioStoreVal } from "../../store";
import { cn } from "@/lib/utils";
import { BaseNode } from "@/components/base-node";
import { useEffect, useRef, useState, type ChangeEventHandler } from "react";
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
  getAnalyzer: () =>
    store.nodes.find((nodeData) => nodeData.id === id) as
      | AnalyserNode
      | undefined,
});

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
  };
  selected: boolean;
}) {
  const { isRunning, setFFTSize, getAnalyzer } = useStore(
    selector(id),
    shallow
  );
  const [analyserData, setAnalyserData] = useState<{
    analyser: AnalyserNode;
    bufferLength: number;
    dataArray: Uint8Array;
  } | null>(null);

  useEffect(() => {
    if (isRunning && analyserData === null) {
      const analyser = getAnalyzer();
      if (!analyser) {
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setAnalyserData({ analyser, bufferLength, dataArray });
    } else if (!isRunning) {
      setAnalyserData(null);
    }
  }, [analyserData, getAnalyzer, isRunning]);

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

        {analyserData !== null ? (
          <WaveForm analyserData={analyserData} />
        ) : null}
      </div>
    </BaseNode>
  );
}

function animateBars(
  analyser: AnalyserNode,
  canvas: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  dataArray: Uint8Array,
  bufferLength: number
) {
  // Analyze the audio data using the Web Audio API's `getByteFrequencyData` method.
  analyser.getByteFrequencyData(dataArray);

  // Set the canvas fill style to black.
  canvasCtx.fillStyle = "#000";

  // Calculate the height of the canvas.
  const HEIGHT = canvas.height / 2;

  // Calculate the width of each bar in the waveform based on the canvas width and the buffer length.
  const barWidth = Math.ceil(canvas.width / bufferLength) * 2.5;

  // Initialize variables for the bar height and x-position.
  let barHeight;
  let x = 0;

  // Loop through each element in the `dataArray`.
  for (let i = 0; i < bufferLength; i++) {
    // Calculate the height of the current bar based on the audio data and the canvas height.
    barHeight = (dataArray[i] / 255) * HEIGHT;

    // Generate random RGB values for each bar.
    const maximum = 10;
    const minimum = -10;
    const r =
      242 + Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    const g =
      104 + Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    const b =
      65 + Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

    // Set the canvas fill style to the random RGB values.
    canvasCtx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";

    // Draw the bar on the canvas at the current x-position and with the calculated height and width.
    canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

    // Update the x-position for the next bar.
    x += barWidth + 1;
  }
}

const WaveForm = ({
  analyserData,
}: {
  analyserData: {
    analyser: AnalyserNode;
    bufferLength: number;
    dataArray: Uint8Array;
  };
}) => {
  // Ref for the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { dataArray, analyser, bufferLength } = analyserData;

  // Function to draw the waveform
  const draw = (
    dataArray: Uint8Array,
    analyser: AnalyserNode,
    bufferLength: number
  ) => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser) return;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    const animate = () => {
      requestAnimationFrame(animate);
      //   canvas.width = canvas.width;
      animateBars(analyser, canvas, canvasCtx, dataArray, bufferLength);
    };

    animate();
  };

  // Effect to draw the waveform on mount and update
  useEffect(() => {
    draw(dataArray, analyser, bufferLength);
  }, [dataArray, analyser, bufferLength]);

  // Return the canvas element
  return (
    <canvas
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: "-10",
      }}
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
};
