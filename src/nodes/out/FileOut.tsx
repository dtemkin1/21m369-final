import { Handle, Position } from "@xyflow/react";
import { shallow } from "zustand/shallow";
import { useStore, type AudioStoreVal } from "../../store";
import { cn } from "@/lib/utils";
import { BaseNode } from "@/components/base-node";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

const selector = (store: AudioStoreVal) => ({
  isRunning: store.isRunning,
});

export default function FileOut({
  data,
  selected,
}: {
  id: string;
  data: { stream: MediaStream };
  selected: boolean;
}) {
  const { isRunning } = useStore(selector, shallow);
  const [recording, setRecording] = useState(false);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder>(null);

  const mimeType = "audio/webm";

  const handleRecordButtonClick = () => {
    if (!recording) {
      const media = new MediaRecorder(data.stream, { mimeType });
      mediaRecorder.current = media;
      mediaRecorder.current.start();
      setRecording(true);

      const localAudioChunks = [] as Blob[];
      mediaRecorder.current.ondataavailable = (event) => {
        if (typeof event.data === "undefined") return;
        if (event.data.size === 0) return;
        localAudioChunks.push(event.data);
      };
      setChunks(localAudioChunks);
    } else {
      setRecording(false);
      if (mediaRecorder.current === null) return;
      mediaRecorder.current.stop();
      mediaRecorder.current.onstop = () => {
        //creates a blob file from the audiochunks data
        const audioBlob = new Blob(chunks, { type: mimeType });
        //creates a playable URL from the blob file.
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudio(audioUrl);
        setChunks([]);
      };
    }
  };

  return (
    <BaseNode selected={selected}>
      <Handle className={cn("w-2 h-2")} type="target" position={Position.Top} />

      <Button disabled={!isRunning} onClick={handleRecordButtonClick}>
        {recording ? "⏺️" : "⏹️"}
      </Button>

      {audio ? (
        <div className="audio-container">
          <audio src={audio} controls></audio>
          <Button asChild>
            <a download href={audio}>
              Download Recording
            </a>
          </Button>
        </div>
      ) : null}
    </BaseNode>
  );
}
