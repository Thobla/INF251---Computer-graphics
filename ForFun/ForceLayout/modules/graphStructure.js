export { basicGraph };
let basicState = new Map;
[...Array(6).keys()].forEach((node) => {
    console.log("size: ", basicState.size);
    basicState.set(node, { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 });
});
//let basicState: State = new Map<GNode<number>, Pos2D>([
//    [0, {x: 1.5, y: 1.2}],
//    [1, {x: 2.5, y: -3.2}],
//    [2, {x: -2.9, y: -2.2}],
//    [3, {x: 3.5, y: -1.2}],
//    [4, {x: 3.9, y: 3.4}],
//    [5, {x: 0.5, y: 0.5}]
//])
let edgeList = new Array([0, 2], [0, 3], [1, 3], [1, 4], [2, 4], [3, 4], [3, 5]);
var basicGraph = {
    state: basicState,
    set: new Set(basicState.keys()),
    edgeList: edgeList,
    n: basicState.size,
    m: edgeList.length
};
