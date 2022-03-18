// Needed elements
let list = $('#methods');
let contentBox = $('.Content');
let Submit_button = $('#go');
// All input boxes
let z = $('#zinput');
let score = $('#xscore');
let mean = $('#mean');
let SD = $('#SD');

let resetInputBoxes = () => {
    $("input[type=number]").val(0);
}

/// If user refreshes the page
if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
    list.val(1);
    resetInputBoxes(); // Call reset function
}

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
    resetInputBoxes();
    if (list.val() == 1) { // If user chooses 1st option or "Get info from Z-Value"
        $('.getZValue').hide(); // hide
        $('.getScore').hide();
        $('.getSD').hide();
        $('.getMean').hide();
        $('.getInfoFromZValue').show(); // show the right method
    } else if (list.val() == 2) { // If user chooses 2nd option or "Get Z-Value"
        $('.getInfoFromZValue').hide();
        $('.getScore').hide();
        $('.getSD').hide();
        $('.getMean').hide();
        $('.getZValue').show(); // show the right method
    } else if (list.val() == 3) {
        $('.getInfoFromZValue').hide();
        $('.getSD').hide();
        $('.getMean').hide();
        $('.getZValue').hide();
        $('.getScore').show();
    } else if (list.val() == 4) {
        $('.getInfoFromZValue').hide();
        $('.getScore').hide();
        $('.getZValue').hide();
        $('.getSD').hide();
        $('.getMean').show();
    } else if (list.val() == 5) {
        $('.getInfoFromZValue').hide();
        $('.getScore').hide();
        $('.getMean').hide();
        $('.getZValue').hide();
        $('.getSD').show();
    }
})


// Allow enter key to submit at the last input box
z.keyup((event) => {
    if (event.keyCode == 13) {
        Submit_button.click();
    }
});

SD.keyup((event) => {
    if (event.keyCode == 13) {
        Submit_button.click()        
    }
})

let showInfo = (zvalue, area) => {
    contentBox.append(`The z value is: ${zvalue}`);
    contentBox.append(`<h3>Less than (left)</h3>`);
    contentBox.append(`<p> The area under the curve is: ${area.toFixed(4)} </p>`);
    contentBox.append(`<p> The probability or P(z < ${zvalue}): ${(area * 100).toFixed(2)}% </p>`);
    contentBox.append(`<h3>Greater than (right)</h3>`);
    contentBox.append(`<p> The area under the curve is: ${(1 - area).toFixed(4)} </p>`);
    contentBox.append(`<p> The probability or P(z > ${zvalue}): ${((1 - area) * 100).toFixed(2)}% </p>`);   
}

Submit_button.click(() => {
    // First we clean the contents of the main content div
    contentBox.empty();
    if (list.val() == 1) {
        area = getArea(z.val());
        zvalue = z.val();
        showInfo(zvalue, area); // Call function
    } else if (list.val() == 2) {
        area = getArea(getZValue(score.val(), mean.val(), SD.val()));
        zvalue = getZValue(score.val(), mean.val(), SD.val());
        showInfo(zvalue, area);
    } else if (list.val() == 3) { // Score
        contentBox.append(`= ${(z.val() * SD.val()) + mean.val()}`);
    }
})

