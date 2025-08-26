import { State, Pos2D, G, GNode, basicGraph } from "./graphStructure.js";
function applyCenterGravity(graph: G, forceMap: State, center: Pos2D, stepSize = 0.001){
    graph.state.forEach((realPos: Pos2D, node: GNode<number>) => {
        console.log("node: ", node);
        const forceNode = forceMap.get(node);
        if (forceNode?.x !== undefined && forceNode?.y !== undefined){
            let diffX: number = center.x - realPos.x;
            let diffY: number = center.x - realPos.y;
            //let force: number = Math.sqrt(diffX**2 + diffY**2);
            // Apply gravity to foceMap
            forceMap.set(node, {x: forceNode.x + diffX * stepSize,
                                y: forceNode.y + diffY * stepSize})
        }
    })
}

export function step(graph: G,
              center: Pos2D = {x:0, y:0}){
    let forceMap: State = new Map<GNode<number>, Pos2D>;
    graph.set.forEach((node: GNode<number>) => {
        forceMap.set(node, {x: 0, y: 0});
    })
    applyCenterGravity(graph, forceMap, center);

    // Apply final force
    forceMap.forEach((realPos: Pos2D, node: GNode<number>) => {
        let gNode = graph.state.get(node);
        if (gNode?.x !== undefined, gNode?.y !== undefined){
            graph.state.set(node, {x: gNode.x + realPos.x, y: gNode.y + realPos.y});
        }
    })
    return graph.state;
}

function main(): void{
    console.log(basicGraph.state)
    basicGraph.state = step(basicGraph)
    console.log(basicGraph.state)
    basicGraph.state = step(basicGraph)
    console.log(basicGraph.state)
    basicGraph.state = step(basicGraph)
    console.log(basicGraph.state)

}

main()
