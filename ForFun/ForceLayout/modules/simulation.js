import { basicGraph } from "./graphStructure.js";
function applyCenterGravity(graph, forceMap, center, stepSize = 0.001, gravityForce = 1.0) {
    graph.state.forEach((realPos, node) => {
        console.log("node: ", node);
        const forceNode = forceMap.get(node);
        if ((forceNode === null || forceNode === void 0 ? void 0 : forceNode.x) !== undefined && (forceNode === null || forceNode === void 0 ? void 0 : forceNode.y) !== undefined) {
            let diffX = center.x - realPos.x;
            let diffY = center.y - realPos.y;
            //let force: number = Math.sqrt(diffX**2 + diffY**2);
            // Apply gravity to foceMap
            //console.log("forceY: ", gravityForce * diffY * stepSize);
            //console.log("forceX: ", gravityForce * diffX * stepSize);
            console.log("diffX: ", diffX);
            console.log("diffY: ", diffY);
            console.log("-----------");
            forceMap.set(node, { x: forceNode.x + gravityForce * diffX * stepSize,
                y: forceNode.y + gravityForce * diffY * stepSize });
        }
    });
}
function applyNodeRepulsion(graph, forceMap, repulsionForce = 0.5, repulsionRange = 0.2, stepSize = 0.001) {
    graph.state.forEach((nodePos, node) => {
        graph.state.forEach((neighPos, neighbor) => {
            const neighForceNode = forceMap.get(neighbor);
            if (neighForceNode !== undefined && node !== neighbor) {
                let diffX = neighPos.x - nodePos.x;
                let diffY = neighPos.y - nodePos.y;
                let dist = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
                forceMap.set(neighbor, { x: neighForceNode.x + stepSize * repulsionForce * diffX / (Math.max(dist, repulsionRange)),
                    y: neighForceNode.y + stepSize * repulsionForce * diffY / (Math.max(dist, repulsionRange)) });
            }
        });
    });
}
export function step(graph, center = { x: 0, y: 0 }, gravityForce = 7, repulsionForce = 0.5, stepSize = 0.001) {
    console.log("step");
    let forceMap = new Map;
    graph.set.forEach((node) => {
        forceMap.set(node, { x: 0, y: 0 });
    });
    applyCenterGravity(graph, forceMap, center, stepSize, gravityForce);
    applyNodeRepulsion(graph, forceMap, repulsionForce, stepSize = stepSize);
    // Apply final force
    forceMap.forEach((realPos, node) => {
        let gNode = graph.state.get(node);
        if ((gNode === null || gNode === void 0 ? void 0 : gNode.x) !== undefined, (gNode === null || gNode === void 0 ? void 0 : gNode.y) !== undefined) {
            graph.state.set(node, { x: gNode.x + realPos.x, y: gNode.y + realPos.y });
        }
    });
    return graph.state;
}
function main() {
    console.log(basicGraph.state);
    basicGraph.state = step(basicGraph);
    console.log(basicGraph.state);
    basicGraph.state = step(basicGraph);
    console.log(basicGraph.state);
    basicGraph.state = step(basicGraph);
    console.log(basicGraph.state);
}
main();
