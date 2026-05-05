let updatingTorque = false;
let updatingSocket = false;

const sockets = [
    { inches: 1/4, label: '1/4"' },
    { inches: 5/16, label: '5/16"' },
    { inches: 3/8, label: '3/8"' },
    { inches: 7/16, label: '7/16"' },
    { inches: 1/2, label: '1/2"' },
    { inches: 9/16, label: '9/16"' },
    { inches: 5/8, label: '5/8"' },
    { inches: 11/16, label: '11/16"' },
    { inches: 3/4, label: '3/4"' },
    { inches: 13/16, label: '13/16"' },
    { inches: 7/8, label: '7/8"' },
    { inches: 15/16, label: '15/16"' },
    { inches: 1, label: '1"' },
    { inches: 1 + 1/16, label: '1-1/16"' },
    { inches: 1 + 1/8, label: '1-1/8"' },
    { inches: 1 + 3/16, label: '1-3/16"' },
    { inches: 1 + 1/4, label: '1-1/4"' },
    { inches: 1 + 5/16, label: '1-5/16"' },
    { inches: 1 + 3/8, label: '1-3/8"' },
    { inches: 1 + 7/16, label: '1-7/16"' },
    { inches: 1 + 1/2, label: '1-1/2"' },
];

// TORQUE
document.getElementById("ftlbInput").addEventListener("input", e => {
    if (updatingTorque) return;
    let val = parseFloat(e.target.value);

    updatingTorque = true;
    document.getElementById("nmInput").value = isNaN(val) ? "" : (val * 1.35582).toFixed(2);
    updatingTorque = false;
});

document.getElementById("nmInput").addEventListener("input", e => {
    if (updatingTorque) return;
    let val = parseFloat(e.target.value);

    updatingTorque = true;
    document.getElementById("ftlbInput").value = isNaN(val) ? "" : (val / 1.35582).toFixed(2);
    updatingTorque = false;
});

// SOCKET FINDER
document.getElementById("mmInput").addEventListener("input", e => {
    if (updatingSocket) return;
    let mm = parseFloat(e.target.value);

    if (isNaN(mm)) return clearSockets();

    let inches = mm / 25.4;

    updatingSocket = true;
    document.getElementById("inchInput").value = inches.toFixed(4);
    updatingSocket = false;

    showSuggestions(inches);
});

document.getElementById("inchInput").addEventListener("input", e => {
    if (updatingSocket) return;
    let inches = parseFloat(e.target.value);

    if (isNaN(inches)) return clearSockets();

    updatingSocket = true;
    document.getElementById("mmInput").value = (inches * 25.4).toFixed(2);
    updatingSocket = false;

    showSuggestions(inches);
});

function showSuggestions(inches) {
    let lowerIdx = -1;
    let upperIdx = -1;
    const tolerance = 0.0001;

    for (let i = 0; i < sockets.length; i++) {
        if (sockets[i].inches <= inches + tolerance) {
            lowerIdx = i;
        }
    }

    let exactMatch =
        lowerIdx >= 0 &&
        Math.abs(sockets[lowerIdx].inches - inches) < tolerance;

    let s1 = document.getElementById("socket1");
    let s2 = document.getElementById("socket2");
    let note = document.getElementById("socketNote");

    if (exactMatch) {
        upperIdx = lowerIdx + 1 < sockets.length ? lowerIdx + 1 : -1;

        s1.textContent = "✓ Exact fit: " + sockets[lowerIdx].label;
        s2.textContent = upperIdx >= 0 ? "↑ Next size up: " + sockets[upperIdx].label : "";
        note.textContent = "Exact match found";
    }
    else if (lowerIdx >= 0) {
        upperIdx = lowerIdx + 1 < sockets.length ? lowerIdx + 1 : -1;

        let belowMm = sockets[lowerIdx].inches * 25.4;
        let aboveMm = upperIdx >= 0 ? sockets[upperIdx].inches * 25.4 : 0;
        let inputMm = inches * 25.4;

        s1.textContent = "↓ Size below: " + sockets[lowerIdx].label;
        s2.textContent =
            upperIdx >= 0 ? "↑ Size above: " + sockets[upperIdx].label : "(beyond range)";

        let noteBelow = Math.abs(inputMm - belowMm).toFixed(2) + "mm below";
        let noteAbove =
            upperIdx >= 0 ? Math.abs(aboveMm - inputMm).toFixed(2) + "mm above" : "";

        note.textContent = "Between sizes — " + noteBelow + " / " + noteAbove;
    }
    else {
        s1.textContent = "";
        s2.textContent = "";
        note.textContent = "Below smallest socket size (1/4\")";
    }
}

function clearSockets() {
    updatingSocket = true;
    document.getElementById("inchInput").value = "";
    document.getElementById("mmInput").value = "";
    updatingSocket = false;

    document.getElementById("socket1").textContent = "";
    document.getElementById("socket2").textContent = "";
    document.getElementById("socketNote").textContent = "";
}
