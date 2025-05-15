import { applyNodeChanges, applyEdgeChanges, type Node, type Edge, type OnNodesChange, type OnEdgesChange, type OnConnect, type OnNodesDelete, type OnEdgesDelete } from '@xyflow/react';
import { nanoid } from 'nanoid';
import { createWithEqualityFn } from 'zustand/traditional';
import {
    isRunning,
    toggleAudio,
    createAudioNode,
    updateAudioNode,
    removeAudioNode,
    connect,
    disconnect,
    nodeTypes
} from "./audio";

export interface AudioStore {
    nodes: Node[];
    edges: Edge[];
    isRunning: boolean;
}

export interface AudioStoreVal extends AudioStore {
    toggleAudio: () => void;
    onNodesChange: OnNodesChange<Node>;
    createNode: (type: keyof typeof nodeTypes) => void;
    updateNode: (id: string, data: Record<string, unknown>) => void;
    onNodesDelete: OnNodesDelete<Node>;
    onEdgesChange: OnEdgesChange<Edge>;
    addEdge: OnConnect;
    onEdgesDelete: OnEdgesDelete<Edge>;
}

export const useStore = createWithEqualityFn<AudioStoreVal>((set, get) => ({
    nodes: [
        { id: "output", type: "out", position: { x: 50, y: 250 }, data: {}, undeletable: true },
    ],
    edges: [

    ],
    isRunning: isRunning(),

    toggleAudio() {
        toggleAudio().then(() => {
            set({ isRunning: isRunning() });
        });
    },

    onNodesChange: ((changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    }) as OnNodesChange<Node>,

    createNode: ((type: keyof typeof nodeTypes) => {
        const id = nanoid();

        switch (type) {
            case "osc": {
                const data = { frequency: 440, type: "sine" };
                const position = { x: 0, y: 0 };

                createAudioNode(id, type, data);
                set({ nodes: [...get().nodes, { id, type, data, position }] });

                break;
            }

            case "mic": {
                const data = {};
                const position = { x: 0, y: 0 };

                createAudioNode(id, type, data);
                set({ nodes: [...get().nodes, { id, type, data, position }] });

                break;
            }

            case "amp": {
                const data = { gain: 0.5 };
                const position = { x: 0, y: 0 };

                createAudioNode(id, type, data);
                set({ nodes: [...get().nodes, { id, type, data, position }] });

                break;
            }

            case "biquad": {
                const data = { frequency: 440, Q: 1, type: "lowpass" };
                const position = { x: 0, y: 0 };

                createAudioNode(id, type, data);
                set({ nodes: [...get().nodes, { id, type, data, position }] });

                break;
            }

            case "conv": {
                const data = { buffer: null, normalize: false };
                const position = { x: 0, y: 0 };

                createAudioNode(id, type, data);
                set({ nodes: [...get().nodes, { id, type, data, position }] });

                break;
            }

            case "delay": {
                const data = { delayTime: 0.0 };
                const position = { x: 0, y: 0 };

                createAudioNode(id, type, data);
                set({ nodes: [...get().nodes, { id, type, data, position }] });

                break;
            }

            case "draw": {
                const data = { fftSize: 2048, smoothingTimeConstant: 0.8, minDecibels: -100, maxDecibels: -30 };
                const position = { x: 0, y: 0 };

                createAudioNode(id, type, data);
                set({ nodes: [...get().nodes, { id, type, data, position }] });

                break;
            }

            default: {
                break;
            }
        }
    }),

    updateNode: ((id: string, data: Record<string, unknown>) => {
        updateAudioNode(id, data);
        set({
            nodes: get().nodes.map((node) =>
                node.id === id
                    ? { ...node, data: Object.assign(node.data, data) }
                    : node
            ),
        });
    }),

    onNodesDelete: ((deleted) => {
        for (const { id } of deleted) {
            removeAudioNode(id);
        }
    }) as OnNodesDelete<Node>,

    onEdgesChange: ((changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    }) as OnEdgesChange<Edge>,

    addEdge: ((data) => {
        const id = nanoid(6);
        const edge = { id, ...data };

        connect(edge.source, edge.target);
        set({ edges: [edge, ...get().edges] });
    }) as OnConnect,

    onEdgesDelete: ((deleted) => {
        for (const { source, target } of deleted) {
            disconnect(source, target);
        }
    }) as OnEdgesDelete<Edge>,
}));