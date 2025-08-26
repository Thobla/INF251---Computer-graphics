import { basicGraph } from "./graphStructure.js";
function applyCenterGravity(graph, forceMap, center, stepSize = 0.001) {
    graph.state.forEach((realPos, node) => {
        console.log("node: ", node);
        const forceNode = forceMap.get(node);
        if ((forceNode === null || forceNode === void 0 ? void 0 : forceNode.x) !== undefined && (forceNode === null || forceNode === void 0 ? void 0 : forceNode.y) !== undefined) {
            let diffX = center.x - realPos.x;
            let diffY = center.x - realPos.y;
            //let force: number = Math.sqrt(diffX**2 + diffY**2);
            // Apply gravity to foceMap
            forceMap.set(node, { x: forceNode.x + diffX * stepSize,
                y: forceNode.y + diffY * stepSize });
        }
    });
}
export function step(graph, center = { x: 0, y: 0 }) {
    let forceMap = new Map;
    graph.set.forEach((node) => {
        forceMap.set(node, { x: 0, y: 0 });
    });
    applyCenterGravity(graph, forceMap, center);
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
