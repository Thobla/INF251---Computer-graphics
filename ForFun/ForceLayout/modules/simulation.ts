import { State, Pos2D, G, GNode, basicGraph } from "./graphStructure.js";
function applyCenterGravity(graph: G, forceMap: State, center: Pos2D, stepSize = 0.001, gravityForce = 1.0){
    graph.state.forEach((realPos: Pos2D, node: GNode<number>) => {
        const forceNode = forceMap.get(node);
        if (forceNode?.x !== undefined && forceNode?.y !== undefined){
            let diffX: number = center.x - realPos.x;
            let diffY: number = center.y - realPos.y;
            //let force: number = Math.sqrt(diffX**2 + diffY**2);
            // Apply gravity to foceMap
            forceMap.set(node, {x: forceNode.x + gravityForce * diffX * stepSize,
                                y: forceNode.y + gravityForce * diffY * stepSize})
        }
    })
}

function applyNodeRepulsion(graph: G,
                            forceMap: State,
                            repulsionForce: number = 0.5,
                            repulsionRange: number = 0.2,
                            stepSize: number = 0.001){
    graph.state.forEach((nodePos: Pos2D, node: GNode<number>) => {
        graph.state.forEach((neighPos: Pos2D, neighbor: GNode<number>) =>{
            const neighForceNode = forceMap.get(neighbor);
            if (neighForceNode !== undefined && node !== neighbor){
                let diffX: number = neighPos.x - nodePos.x;
                let diffY: number = neighPos.y - nodePos.y;
                let dist: number = Math.sqrt(diffX**2 + diffY**2);

                forceMap.set(neighbor, {x: neighForceNode.x + stepSize*repulsionForce*diffX/(Math.max(dist, repulsionRange)),
                                        y: neighForceNode.y + stepSize*repulsionForce*diffY/(Math.max(dist, repulsionRange))})
            }
        })
    })
}

export function step(graph: G,
                    center: Pos2D = {x:0, y:0},
                    gravityForce = 7,
                    repulsionForce = 0.5,
                    stepSize = 0.001){
    console.log("step");
    let forceMap: State = new Map<GNode<number>, Pos2D>;
    graph.set.forEach((node: GNode<number>) => {
        forceMap.set(node, {x: 0, y: 0});
    })
    applyCenterGravity(graph, forceMap, center, stepSize, gravityForce);

    applyNodeRepulsion(graph, forceMap, repulsionForce, stepSize=stepSize)

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
