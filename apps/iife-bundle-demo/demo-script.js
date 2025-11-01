const { Utils, UniMap, ValueSet } = TsUtilsLib ?? window.TsUtilsLib;

const map = new UniMap();
map.set(1, "Hello");
map.set(2, "World");

const set = new ValueSet(["Hello", "World"]);
const arr = new Array(1, 3, 5, 7, 9);

document.getElementById('demo').innerHTML = `
<p>${Utils.Str.stringify(map)}</p>
<p>${Utils.Str.stringify(set)}</p>
<p>${Utils.Str.stringify(arr)}</p>
`;
