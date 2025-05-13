import { ReactFlow, Background, Panel } from "@xyflow/react";
import { shallow } from "zustand/shallow";

import { useStore, type AudioStoreVal } from "./store";
import { nodeTypes } from "./audio";
import { cn } from "./lib/utils";
import { Button } from "./components/ui/button";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import { Card, CardContent } from "./components/ui/card";

const selector = (store: AudioStoreVal) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onNodesDelete: store.onNodesDelete,
  onEdgesChange: store.onEdgesChange,
  onEdgesDelete: store.onEdgesDelete,
  addEdge: store.addEdge,
  addOsc: () => store.createNode("osc"),
  addAmp: () => store.createNode("amp"),
  addMic: () => store.createNode("mic"),
  addDraw: () => store.createNode("draw"),
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
            <div className={cn("flex flex-row gap-4 align-center")}>
              <span>Add sources:</span>
              <Button onClick={store.addOsc}>Add Osc</Button>
              <Button onClick={store.addMic}>Add Mic</Button>
            </div>
            <div className={cn("flex flex-row gap-4 align-center")}>
              <span>Add effects:</span>
              <Button onClick={store.addAmp}>Add Amp</Button>
            </div>
            <div className={cn("flex flex-row gap-4 align-center")}>
              <span>Add outputs:</span>
              <Button onClick={store.addDraw}>Add Draw</Button>
            </div>
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
