const context = new AudioContext();
const nodes = new Map<string, AudioNode>();

context.suspend();
nodes.set('output', context.destination);

import Osc from "./nodes/source/Osc";
import Mic from "./nodes/source/Mic";
import Amp from "./nodes/effects/Amp";
import Out from "./nodes/out/Out";
import Draw from "./nodes/out/Draw";

export const nodeTypes = {
    // sources
    osc: Osc,
    mic: Mic,
    // effects
    amp: Amp,
    // outputs
    out: Out,
    draw: Draw
} as const;

export function isRunning() {
    return context.state === 'running';
}

export function toggleAudio() {
    return isRunning() ? context.suspend() : context.resume();
}

export function createAudioNode(id: string, type: keyof typeof nodeTypes, data: Record<string, unknown>) {
    switch (type) {
        case 'osc': {
            const node = context.createOscillator();
            node.frequency.value = data.frequency as number;
            node.type = data.type as OscillatorType;
            node.start();

            nodes.set(id, node);
            break;
        }

        case 'amp': {
            const node = context.createGain();
            node.gain.value = data.gain as number;

            nodes.set(id, node);
            break;
        }

        case 'mic': {
            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                const node = context.createMediaStreamSource(stream);
                nodes.set(id, node);
            }).catch((err) => {
                console.error('Error accessing microphone:', err);
            });

            break;
        }

        case "draw": {
            const node = context.createAnalyser();
            node.fftSize = data.fftSize as number;
            node.smoothingTimeConstant = data.smoothingTimeConstant as number;
            node.minDecibels = data.minDecibels as number;
            node.maxDecibels = data.maxDecibels as number;

            nodes.set(id, node);
            break;
        }
    }
}

export function updateAudioNode(id: string, data: Record<string, unknown>) {
    const node = nodes.get(id);

    for (const [key, val] of Object.entries(data)) {
        // @ts-expect-error just trust me :(
        if (node && (node[key] instanceof AudioParam)) {
            // @ts-expect-error just trust me :(
            (node[key] as AudioParam).value = val as number;
        } else {
            // @ts-expect-error just trust me :(
            node[key] = val;
        }
    }
}

export function removeAudioNode(id: string) {
    const node = nodes.get(id);

    node?.disconnect();
    (node as AudioScheduledSourceNode | undefined)?.stop?.();

    nodes.delete(id);
}

export function connect(sourceId: string, targetId: string) {
    const source = nodes.get(sourceId);
    const target = nodes.get(targetId);

    if (target) { source?.connect(target); }
}

export function disconnect(sourceId: string, targetId: string) {
    const source = nodes.get(sourceId);
    const target = nodes.get(targetId);

    if (target) { source?.disconnect(target); }
}