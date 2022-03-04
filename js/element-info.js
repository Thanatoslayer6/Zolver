let contentBox = $('.Content');
let atomicNum = $('#atomicNum');
let principalNum = $('#principalNum');
let azimuthalNum = $('#azimuthalNum');
let magneticNum = $('#magneticNum');
let electronSpin = $('#electronSpin');
let list = $('#methods')
let getInfoFromAtomicNumber = $('.getInfoFromAtomicNumber');
let getInfoFromLastShell = $('.getInfoFromLastShell');
let Submit_button = $('#go');
// If user changes option for getting info
list.change(() => {
    if (list.val() == 1) {
        getInfoFromLastShell.hide(); // hide the divs
        getInfoFromAtomicNumber.show(); // show what is needed
    } else if (list.val() == 2) {
        getInfoFromAtomicNumber.hide();
        getInfoFromLastShell.show();
    }
})

// ~~~~~~~~~~~~~~~ FIRST OPTION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let giveElementByAtomicNum = (num) => {
    contentBox.empty(); // Clear as first priority
    let data = elements[num - 1]; // grab the element
    // fix the diagram by creating num of boxes
    let numOfBoxes, diagram = "";
    if (data.quantum_numbers.azimuthalNum == 0) {
        numOfBoxes = 1;
    } else if (data.quantum_numbers.azimuthalNum == 1) {
        numOfBoxes = 3;
    } else if (data.quantum_numbers.azimuthalNum == 2) {
        numOfBoxes = 5;
    } else if (data.quantum_numbers.azimuthalNum == 3) {
        numOfBoxes = 7;
    }
    console.log(numOfBoxes)
    for (let i = 0; i < numOfBoxes; i++) {
        if (data.quantum_numbers.diagram[i] == undefined) {
            diagram += "[  ]";
        } else if (data.quantum_numbers.diagram[i] == "↑"){
            diagram += "[" + data.quantum_numbers.diagram[i] + "  ]";
        } else if (data.quantum_numbers.diagram[i] == "↓") {
             diagram += "[  " + data.quantum_numbers.diagram[i] + "]";           
        } else {
             diagram += "[ " + data.quantum_numbers.diagram[i] + " ]";           
        }
    }
    console.log(diagram)

    contentBox.append(`
        <h1>${data.name} [${data.symbol}] </h1>
        <h4> <u> Element Properties </u> </h4>
        <p> Atomic Number: ${data.atomic_num} </p>
        <p> Chemical Symbol: ${data.symbol} </p>
        <p> Element Group: ${data.group} </p>
        <p> Type of element: ${data.typeOfElement} </p>
        <p> Element Period: ${data.period} </p>
        <p> Atomic Mass: ${data.atomic_mass} </p>
        <p> Atomic Structure: 0 ${data.atomic_structure.join(') ')} </p>
        <p> Electron Configuration (long): ${data.long_econfig} </p>
        <p> Electron Configuration (short): ${data.short_econfig} </p>
        <p> Ionic charge / Oxidation State: ${data.charge}</p>
        <h4> <u> Quantum Properties </u> </h4>
        <p> Last Shell: ${data.quantum_numbers.lastShell}</p>
        <p> Principal number (n): ${data.quantum_numbers.principalNum}</p>
        <p> Angular / Azimuthal number (ℓ): ${data.quantum_numbers.azimuthalNum}</p>
        <p> Magnetic Quantum number (ℓ): ${data.quantum_numbers.magneticNum}</p>
        <p> Electron Spin number (ms): ${data.quantum_numbers.electronSpin}</p>
        <p> Diagram: ${diagram}</p>
        <h4> <u> Overview </u> </h4>
        <p> Discovered By: ${data.discovered_by} </p>
        <p> ${data.summary} </p>
        <p> Phase: ${data.phase} </p>
    `)
}
// END

// ~~~~~~~~~~~~~~~ SECOND OPTION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



// END
Submit_button.click(() => {
    if (list.val() == 1) {
        giveElementByAtomicNum(atomicNum.val());

    } else if (list.val() == 2) {

    }
})
// Auto enter submit 1st option
atomicNum.keyup((event) => {
    if (event.keyCode == 13) {
        Submit_button.click()
    }
})

// LOGIC 2nd option
// principalNum.keyup((event) => {
//     if (event.keyCode == 13) {
//     }
// })
