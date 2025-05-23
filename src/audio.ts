const context = new AudioContext();
const nodes = new Map<string, AudioNode>();

context.suspend();
nodes.set('output', context.destination);

import Osc from "./nodes/source/Osc";
import Mic from "./nodes/source/Mic";
import FileIn from "./nodes/source/FileIn";

import Gain from "./nodes/effects/Gain";
import Biquad from "./nodes/effects/Biquad";
import Conv from "./nodes/effects/Conv";
import Delay from "./nodes/effects/Delay";
import WaveShaper from "./nodes/effects/WaveShape";

import Out from "./nodes/out/Out";
import FileOut from "./nodes/out/FileOut";
import Draw from "./nodes/out/Draw";

export const nodeTypes = {
    // sources
    osc: Osc,
    mic: Mic,
    fileIn: FileIn,
    // effects
    biquad: Biquad,
    conv: Conv,
    delay: Delay,
    gain: Gain,
    waveShaper: WaveShaper,
    // outputs
    out: Out,
    fileOut: FileOut,
    draw: Draw
};

export function isRunning() {
    return context.state === 'running';
}

export function toggleAudio() {
    return isRunning() ? context.suspend() : context.resume();
}

export async function createAudioNode(id: string, type: keyof typeof nodeTypes, data: Record<string, unknown>) {
    switch (type) {
        case 'osc': {
            const node = context.createOscillator();
            node.frequency.value = data.frequency as number;
            node.detune.value = data.detune as number;
            node.type = data.type as OscillatorType;
            node.start();

            nodes.set(id, node);
            break;
        }

        case 'mic': {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const node = context.createMediaStreamSource(stream);

            nodes.set(id, node);
            break;
        }

        case "fileIn": {
            const node = context.createMediaElementSource(data.mediaElement as HTMLAudioElement);
            data.mediaElement = node.mediaElement;

            nodes.set(id, node);
            break;
        }

        case 'gain': {
            const node = context.createGain();
            node.gain.value = data.gain as number;

            nodes.set(id, node);
            break;
        }

        case 'biquad': {
            const node = context.createBiquadFilter();
            node.frequency.value = data.frequency as number;
            node.detune.value = data.detune as number;
            node.Q.value = data.Q as number;
            node.gain.value = data.gain as number;
            node.type = data.type as BiquadFilterType;

            nodes.set(id, node);
            break;
        }

        case 'conv': {
            const node = context.createConvolver();
            node.buffer = data.buffer as AudioBuffer | null;
            node.normalize = data.normalize as boolean;

            nodes.set(id, node);
            break;
        }

        case 'delay': {
            const node = context.createDelay();
            node.delayTime.value = data.delayTime as number;

            nodes.set(id, node);
            break;
        }

        case 'waveShaper': {
            const node = context.createWaveShaper();
            node.curve = data.curve as Float32Array;
            node.oversample = data.oversample as OverSampleType;

            nodes.set(id, node);
            break;
        }

        case "fileOut": {
            const node = context.createMediaStreamDestination();
            data.stream = node.stream;

            nodes.set(id, node);
            break;
        }

        case "draw": {
            const node = context.createAnalyser();
            node.fftSize = data.fftSize as number;
            node.smoothingTimeConstant = data.smoothingTimeConstant as number;
            node.minDecibels = data.minDecibels as number;
            node.maxDecibels = data.maxDecibels as number;

            data.getFrequencyBinCount = () => node.frequencyBinCount;
            data.getByteFrequencyData = (array: Uint8Array) => node.getByteFrequencyData(array);

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