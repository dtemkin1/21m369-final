import { ReactFlow, Background, Panel } from "@xyflow/react";
import { shallow } from "zustand/shallow";

import { useStore, type AudioStoreVal } from "./store";
import { nodeTypes } from "./audio";
import { cn } from "./lib/utils";
import { Button } from "./components/ui/button";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import { Card, CardContent } from "./components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const selector = (store: AudioStoreVal) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onNodesDelete: store.onNodesDelete,
  onEdgesChange: store.onEdgesChange,
  onEdgesDelete: store.onEdgesDelete,
  addEdge: store.addEdge,
  addOsc: () => store.createNode("osc"),
  addMic: () => store.createNode("mic"),
  addBiquad: () => store.createNode("biquad"),
  addConv: () => store.createNode("conv"),
  addDelay: () => store.createNode("delay"),
  addDraw: () => store.createNode("draw"),
  addGain: () => store.createNode("gain"),
  addWaveShaper: () => store.createNode("waveShaper"),
  isRunning: store.isRunning,
  toggleAudio: store.toggleAudio,
});

function App() {
  const store = useStore(selector, shallow);

  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={store.nodes}
      edges={store.edges}
      onNodesChange={store.onNodesChange}
      onNodesDelete={store.onNodesDelete}
      onEdgesChange={store.onEdgesChange}
      onEdgesDelete={store.onEdgesDelete}
      onConnect={store.addEdge}
      fitView
    >
      <Panel className={cn("space-x-4")} position="top-right">
        <Card>
          <CardContent className={cn("flex flex-col gap-4")}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Add Source</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={store.addOsc}>
                  Add Osc
                </DropdownMenuItem>
                <DropdownMenuItem onClick={store.addMic}>
                  Add Mic
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Add Effect</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={store.addBiquad}>
                  Add Biquad
                </DropdownMenuItem>
                <DropdownMenuItem onClick={store.addConv}>
                  Add Conv
                </DropdownMenuItem>
                <DropdownMenuItem onClick={store.addDelay}>
                  Add Delay
                </DropdownMenuItem>
                <DropdownMenuItem onClick={store.addGain}>
                  Add Gain
                </DropdownMenuItem>
                <DropdownMenuItem onClick={store.addWaveShaper}>
                  Add Wave Shaper
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Add Output</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={store.addDraw}>
                  Add Draw
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center space-x-2">
              <Switch
                checked={store.isRunning}
                onCheckedChange={store.toggleAudio}
                id="enable-audio-context"
              />
              <Label htmlFor="enable-audio-context">Audio Context?</Label>
            </div>
          </CardContent>
        </Card>
      </Panel>
      <Background />
    </ReactFlow>
  );
}

export default App;
