// Needed elements
let list = $('#methods');
let contentBox = $('.Content');
let graph = $('#normal_curve');
let Submit_button = $('#go');

// All input boxes
let z = $(`#zinput-${list.val()}`);
let score = $(`#xscore-${list.val()}`);
let mean = $(`#mean-${list.val()}`);
let SD = $(`#SD-${list.val()}`);

let resetInputBoxes = () => {
    $("input[type=number]").val(0);
}

// Render the equations (KaTex)
$('#eq-1').append(katex.renderToString("z = \\frac{x - \\mu}{\\sigma}"))
$('#eq-2').append(katex.renderToString("x = z\\sigma + \\mu"))
$('#eq-3').append(katex.renderToString("\\mu = x - z\\sigma"))
$('#eq-4').append(katex.renderToString("\\sigma = \\frac{x - \\mu}{z}"))
// END

// PLOT using (plotly.py)
let plotDistributionCurve = (lowerLimit, upperLimit, xscr, SD, mean, arealeft, arearight) => {
    let X = [], Y = [], Y_till_z_score = [], Y_till_end = [], X_till_z_score = [], X_till_end = [];
    for (let i = lowerLimit; i <= upperLimit; i = i + 0.01){
        y = (1/(Math.sqrt(2*Math.PI)*SD))*(Math.pow(Math.E,(-0.5*Math.pow(((i-mean)/SD), 2))))
        X.push(i);
        Y.push(y);
        if (i < xscr) {
            X_till_z_score.push(i);
            Y_till_z_score.push(y);
        } else if (i > xscr){
            X_till_end.push(i);
            Y_till_end.push(y);
        }
    }
    let trace0 = {
        x: X,
        y: Y,
        fill:'none',
        type:'scatter',
    };

    let trace1 = {
        x: X_till_z_score,
        y: Y_till_z_score,
        fill: 'tozeroy',
        type: 'scatter',
        name: `P(z < 0) = ${arealeft}`
    };

    let trace2 = {
        x: X_till_end,
        y: Y_till_end,
        fill: 'tozeroy',
        type: 'scatter',
        name: `P(z > 0) = ${arearight}`
    };

    layout = {
        plot_bgcolor: "rgba(200,200,200,120)",
        paper_bgcolor: "rgba(200,200,200,120)",
        xaxis: {
            range: [lowerLimit, upperLimit]
        },
        shapes: [{
            type: 'line',
            x0: mean,
            y0: 0,
            x1: mean,
            y1: Math.max(...Y),
            line: {
                color: 'rgb(250, 10, 10)',
                width: 2
            }
        }],
    }

  let data = [trace0, trace1, trace2];
  Plotly.newPlot('normal_curve', data, layout);
}
// END

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
    graph.empty();
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
    z = $(`#zinput-${list.val()}`);
    score = $(`#xscore-${list.val()}`);
    mean = $(`#mean-${list.val()}`);
    SD = $(`#SD-${list.val()}`);
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
    contentBox.append(`<br>`)
    // contentBox.append(`The z value is: ${zvalue}`);
    contentBox.append(katex.renderToString(`z = ${zvalue}`));
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
    graph.empty();
    if (list.val() == 1) {
        area = getArea(z.val());
        zvalue = z.val();
        showInfo(zvalue, area);
        plotDistributionCurve(-4, 4, zvalue, 1, 0, area.toFixed(4), (1 - area).toFixed(4));
    } else if (list.val() == 2) {
        area = getArea(getZValue(score.val(), mean.val(), SD.val()));
        zvalue = getZValue(score.val(), mean.val(), SD.val());
        scr = (zvalue * SD.val()) + Number(mean.val());
        showInfo(zvalue, area);
        plotDistributionCurve(Number(mean.val()) - 4*SD.val(), Number(mean.val()) + 4*SD.val(), scr, SD.val(), mean.val(), area.toFixed(4), (1 - area).toFixed(4));
    } else if (list.val() == 3) { // Score
        scr = (z.val() * SD.val()) + Number(mean.val());
        area = getArea(getZValue(scr, mean.val(), SD.val()));
        zvalue = getZValue(scr, mean.val(), SD.val());
        // contentBox.append(`x = ${scr}`);
        contentBox.append(katex.renderToString(`x = ${scr}`));
        showInfo(zvalue, area);
        plotDistributionCurve(Number(mean.val()) - 4*SD.val(), Number(mean.val()) + 4*SD.val(), scr, SD.val(), mean.val(), area.toFixed(4), (1 - area).toFixed(4));
    } else if (list.val() == 4) { // Mean
        mn = Number(score.val()) - (z.val() * SD.val());
        area = getArea(getZValue(score.val(), mn, SD.val()));
        zvalue = getZValue(score.val(), mn, SD.val());
        scr = (zvalue * SD.val()) + mn;
        // contentBox.append(`Mean = ${mn}`);
        contentBox.append(katex.renderToString(`\\mu = ${mn}`));
        showInfo(zvalue, area);
        plotDistributionCurve(Number(mean.val()) - 4*SD.val(), Number(mean.val()) + 4*SD.val(), scr, SD.val(), mn, area.toFixed(4), (1 - area).toFixed(4));
    } else if (list.val() == 5) { // SD
        stdv = (score.val() - mean.val())/z.val()
        area = getArea(getZValue(score.val(), mean.val(), stdv));
        zvalue = getZValue(score.val(), mean.val(), stdv);
        scr = (zvalue * stdv) + Number(mean.val());
        // contentBox.append(`Standard Deviation = ${stdv}`);
        contentBox.append(katex.renderToString(`\\sigma = ${stdv}`));
        showInfo(zvalue, area);
        plotDistributionCurve(Number(mean.val()) - 4*SD.val(), Number(mean.val()) + 4*SD.val(), zvalue, stdv, mean.val(), area.toFixed(4), (1 - area).toFixed(4));
    }
})

