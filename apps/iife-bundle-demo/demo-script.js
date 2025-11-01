const {
    getLibInfo,
    Utils,
    DefaultArray,
    IndexArray,
    SignedIndexArray,
    LinkedList,
    UniMap,
    BiMap,
    TriMap,
    ValueSet,
    Rect,
    AnchoredRect,
    Vec
} = TsUtilsLib ?? window.TsUtilsLib;

const arr1 = new Array(1, 3, 5, 7, 9);
const arr2 = new DefaultArray([1, 3, 5, 7], 9);
const arr3 = new IndexArray([[1, 3], [5, 7], [9, 0]]);
const arr4 = new SignedIndexArray([[-1, 3], [5, 7], [-9, 0]]);
const arr5 = new LinkedList([1, 2, 3, 4]);
const set = new ValueSet(["Hello", "World!"]);
const map1 = new UniMap([[1, "Hello"], [2, "World!"]]);
const map2 = new BiMap([[1, 2, "Hello"], [2, 4, "World!"]]);
const map3 = new TriMap([[1, 2, 3, "Hello"], [2, 4, 8, "World!"]]);
const rect = new Rect(1, 2, 3, 4);
const arect = new AnchoredRect(1, 2, 3, 4, 5, 6);
const vec = new Vec(1,2,3,4);

document.getElementById('demo').innerHTML = `
    <p>${getLibInfo()}</p>
    <p>${Utils.Str.stringify(arr1)}</p>
    <p>${Utils.Str.stringify(arr2)}</p>
    <p>${Utils.Str.stringify(arr3)}</p>
    <p>${Utils.Str.stringify(arr4)}</p>
    <p>${Utils.Str.stringify(arr5)}</p>
    <p>${Utils.Str.stringify(set)}</p>
    <p>${Utils.Str.stringify(map1)}</p>
    <p>${Utils.Str.stringify(map2)}</p>
    <p>${Utils.Str.stringify(map3)}</p>
    <p>${Utils.Str.stringify(rect)}</p>
    <p>${Utils.Str.stringify(arect)}</p>
    <p>${Utils.Str.stringify(vec)}</p>
`;
