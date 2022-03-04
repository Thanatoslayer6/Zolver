// Needed elements
let list = $('#methods');
let contentBox = $('.Content');
let Submit_button = $('#go');
// All input boxes
let inputBox_1 = $('#zinput');
let score = $('#xscore');
let mean = $('#mean');
let SD = $('#SD');

let getArea = x => {
    // return 0.5 * erfc(-x * Math.SQRT1_2);
    return (1 - erf(-x * Math.SQRT1_2)) * 0.5
}

let getZValue = (score, mean, SD) => {
    return ((score - mean)/SD).toFixed(2);
}

// Main logic (hide divs and show divs depending on dropdown box list)
list.change(() => {
    // Clear content div when dropdown list changes
    contentBox.empty();
    if (list.val() == 1) { // If user chooses 1st option or "Get info from Z-Value"
        score.val(0);
        mean.val(0);
        SD.val(0);
        $('.getZValue').hide(); // hide
        $('.getInfoFromZValue').show(); // show the right method
    } else if (list.val() == 2) { // If user chooses 2nd option or "Get Z-Value"
        inputBox_1.val(0); // clear all inputs by resetting to 0
        $('.getInfoFromZValue').hide(); // show the right method
        $('.getZValue').show(); // hide    
    }
})


// Allow enter key to submit at the last input box
inputBox_1.keyup((event) => {
    if (event.keyCode === 13) {
        Submit_button.click();
    }
});

SD.keyup((event) => {
    if (event.keyCode == 13) {
        Submit_button.click()        
    }
})

Submit_button.click(() => {
    // First we clean the contents of the main content div
    contentBox.empty();
    if (list.val() == 1) {
        area = getArea(inputBox_1.val());
        zvalue = inputBox_1.val();
    } else if (list.val() == 2) {
        area = getArea(getZValue(score.val(), mean.val(), SD.val()));
        zvalue = getZValue(score.val(), mean.val(), SD.val());
    }
    contentBox.append(`The z value is: ${zvalue}`);
    contentBox.append(`<h3>Less than (left)</h3>`);
    contentBox.append(`<p> The area under the curve is: ${area.toFixed(4)} </p>`);
    contentBox.append(`<p> The probability or P(z < ${zvalue}): ${(area * 100).toFixed(2)}% </p>`);
    contentBox.append(`<h3>Greater than (right)</h3>`);
    contentBox.append(`<p> The area under the curve is: ${(1 - area).toFixed(4)} </p>`);
    contentBox.append(`<p> The probability or P(z > ${zvalue}): ${((1 - area) * 100).toFixed(2)}% </p>`);
})
