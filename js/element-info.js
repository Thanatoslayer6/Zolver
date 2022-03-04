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
        getInfoFromLastShell.hide();
        getInfoFromAtomicNumber.show();
        Submit_button.show();
    } else if (list.val() == 2) {
        Submit_button.hide();
        getInfoFromAtomicNumber.hide();
        getInfoFromLastShell.show();
    }
})

// Auto enter submit 1st option
atomicNum.keyup((event) => {
    if (event.keyCode == 13) {
        Submit_button.click()
    }
})

// LOGIC 2nd option
principalNum.keyup((event) => {
    if (event.keyCode == 13) {
        $('li#l').show();
    }
})
