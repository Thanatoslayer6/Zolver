let interval = $('#interval');
let lowestLimit = $('#llimit');
let highestLimit = $('#hlimit');
let Submit_button = $('#go');
let Reset_button = $('#reset');
let Calculate_button = $('#calculate');
let paragraphs = $('p');
let table = $('.Content table');
let list = $('#methods');
let formulas = $('.formulas');

let classSize, row = [];
let info = {
    totalFrequency: 0,
    Efx: 0,
    Mean: 0,
    Median: 0,
    Mode: [],
    medianClassIndex: 0,
    modalClassIndex: [],
    Range: 0,
    Ef_x_mean: 0,
    Ef_x_mean_sqrd: 0,
    MeanDeviation: 0,
    StandardDeviation: 0,
    Variance: 0,
};
// Population

let showFormulaPopulation = () => {
    formulas.append(katex.renderToString(`
        \\text{Population Mean} \\qquad \\quad \\text{Median} \\qquad \\qquad \\qquad \\qquad \\text{Mode} \\newline
        \\qquad \\mu = \\frac{\\Sigma fx}{\\Sigma f}
        \\space \\tilde{x} = LB_{md} + (\\frac{\\frac{n}{2} - cf}{f})i
        \\qquad \\hat{x} = LB_{mo} + (\\frac{D_1}{D_1 + D_2})i
    `))

}
// Sample
let showFormulaSample = () => {
    formulas.append(katex.renderToString(`\\bar{x} = \\frac{\\Sigma fx}{\\Sigma f}`))
}

list.change(() => {
    Reset_button.click(); // Resets everything
    formulas.empty();
    if (list.val() == 1) { // Population
        // Render formulas
        showFormulaPopulation();
    } else if (list.val() == 2) { // Sample
        // Render formulas
        showFormulaSample();
    }
})

/*
Population:
- M.A.D & Variance = n
Sample:
- M.A.D & Variance = n - 1
No need to do anything on S.D just sqrt(Variance)
*/

/// If user refreshes the page
if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
    list.val(1);
    interval.val(0)
    lowestLimit.val(0)
    highestLimit.val(0)
}

Submit_button.click(() => {
    // Get class size
    classSize = Math.round((Number(highestLimit.val()) - Number(lowestLimit.val()))/Number(interval.val()));
    // First we clean the contents of the main content div
    table.empty(); // Empty the contents of the table, remove rows and columns
    table.show(); // Show the table
    Submit_button.hide() // Hide the current button
    Calculate_button.show(); // Show final button for calculation
    drawTableHeader(); // Draw the header or the uppermost row
    showTableLimits(); // Show the lower and upper limits
    askForFrequencies(); // Show the frequency textboxes
})

Reset_button.click(() => {
    // Reset variables
    info.totalFrequency = 0;
    info.Efx = 0;
    info.Mean = 0;
    info.Median = 0;
    info.Mode = [];
    info.Range = 0;
    info.medianClassIndex = 0;
    info.modalClassIndex = [];
    info.Ef_x_mean = 0;
    info.Ef_x_mean_sqrd = 0;
    info.MeanDeviation = 0;
    info.StandardDeviation = 0;
    info.Variance = 0;
    interval.val(0);
    lowestLimit.val(0);
    highestLimit.val(0);
    classSize = 0;
    // Reset elements show or hide them
    table.empty();
    table.hide();
    paragraphs.hide();
    Calculate_button.hide();
    Submit_button.show();
})

Calculate_button.click(() => {
    // First let's hide the button itself so that only reset button is shown
    Calculate_button.hide();
    // Get all values in frequency column
    for (let i = 0; i < classSize; i++) {
        let freq = $(`tr td input#frequency-${i}`).val()
        row[i].frequency = Number(freq);
        if (i == 0) { // Get <cf
            row[i].cumulative_frequency = Number(freq);
        } else if (i >= 1) {
            row[i].cumulative_frequency = row[i - 1].cumulative_frequency + row[i].frequency
        }
        // Get midpoint * frequency
        row[i].fx = row[i].frequency * row[i].midpoint
        // Get lower boundary and upper boundaries
        row[i].lower_boundary = row[i].lower_limit - 0.5;
        row[i].upper_boundary = row[i].upper_limit + 0.5;
        // Get Total Frequency
        info.totalFrequency += row[i].frequency;
        // Get Efx
        info.Efx += row[i].fx;
    }
    // Get mean round to 4 decimal places
    info.Range = highestLimit.val() - lowestLimit.val();
    getMeasuresOfCentralTendency();
    getMeasuresOfVariability();
    showCalculatedValues();
    showTableLegend();
})

let getMeasuresOfCentralTendency = () => {
    let temp = 0; // Holder variable for all sorts of computations
    temp = (info.Efx/info.totalFrequency).toFixed(4); // Get mean
    info.Mean = Number(Decimal(temp).valueOf());
    // Get median class index
    info.medianClassIndex = row.findIndex(item => {
        return item.cumulative_frequency >= (info.totalFrequency/2)
    })
    // Get Modal class index and store in an array
    info.highestFrequency = Math.max(...(row.map(item => { return item.frequency })));
    for (let i = 0; i < classSize; i++) {
        if (row[i].frequency == info.highestFrequency) {
            info.modalClassIndex.push(i);
        }

    }
    // Calculate median
    if (info.medianClassIndex == 0) {
        temp = (row[info.medianClassIndex].lower_boundary + (((info.totalFrequency/2) - 0)/row[info.medianClassIndex].frequency) * Number(interval.val())).toFixed(4);
        // info.Median = row[info.medianClassIndex].lower_boundary + (((info.totalFrequency/2) - 0)/row[info.medianClassIndex].frequency) * Number(interval.val());
        info.Median = Number(Decimal(temp).valueOf());
    } else {
        temp = (row[info.medianClassIndex].lower_boundary + (((info.totalFrequency/2) - row[info.medianClassIndex - 1].cumulative_frequency)/row[info.medianClassIndex].frequency) * Number(interval.val())).toFixed(4);
        // info.Median = row[info.medianClassIndex].lower_boundary + (((info.totalFrequency/2) - row[info.medianClassIndex - 1].cumulative_frequency)/row[info.medianClassIndex].frequency) * Number(interval.val());
        info.Median = Number(Decimal(temp).valueOf());
    }

    // Calculate Mode
    // d1 before, d2 after
    for (let i = 0; i < info.modalClassIndex.length; i++) {
        if (info.modalClassIndex[i] == 0) { // If first index
            if (row.length == 1){ // if only 1 row exists in the entire table, (very rare)
                // info.Mode[i].lbmd = row[info.modalClassIndex[i]].lower_boundary;
                info.Mode[i] = {
                    lbmd: row[info.modalClassIndex[i]].lower_boundary,
                }
                info.Mode[i].d1 = info.Mode[i].d2 = row[info.modalClassIndex[i]].frequency;
            } else {
                info.Mode[i] = {
                    lbmd: row[info.modalClassIndex[i]].lower_boundary,
                    d1: row[info.modalClassIndex[i]].frequency - 0,
                    d2: row[info.modalClassIndex[i]].frequency - row[info.modalClassIndex[i] + 1].frequency,
                }
            }
        } else if (info.modalClassIndex[i] == info.modalClassIndex.length - 1) { // If last index
            info.Mode[i] = {
                lbmd: row[info.modalClassIndex[i]].lower_boundary,
                d1: row[info.modalClassIndex[i]].frequency - row[info.modalClassIndex[i] - 1].frequency,
                d2: row[info.modalClassIndex[i]].frequency - 0,
            } 
        } else { // if center or the modal class it at the middle
            info.Mode[i] = {
                lbmd: row[info.modalClassIndex[i]].lower_boundary,
                d1: row[info.modalClassIndex[i]].frequency - row[info.modalClassIndex[i] - 1].frequency,
                d2: row[info.modalClassIndex[i]].frequency - row[info.modalClassIndex[i] + 1].frequency,
            }
        }
        temp = (info.Mode[i].lbmd + (info.Mode[i].d1/(info.Mode[i].d1 + info.Mode[i].d2)) * Number(interval.val())).toFixed(4);
        info.Mode[i].value = Number(Decimal(temp).valueOf());
        // info.Mode[i].value = Decimal(info.Mode[i].lbmd).add(info.Mode[i].d1/(info.Mode[i].d1 + info.Mode[i].d2)).times(interval.val());
    }
    
}

let getMeasuresOfVariability = () => {
    let temp = 0; // Holder variable for precision
    for (let i = 0; i < classSize; i++) {
        // Get |x - Mean|
        temp = Decimal(row[i].midpoint).minus(info.Mean).abs().toFixed(4);
        row[i].x_mean = Number(Decimal(temp).valueOf());
        // Get |x - Mean|^2
        temp = Decimal(row[i].x_mean).pow(2).toFixed(4);
        row[i].x_mean_sqrd = Number(Decimal(temp).valueOf());
        // Get f|x - Mean|
        temp = Decimal(row[i].x_mean).times(row[i].frequency).toFixed(4);
        row[i].fx_mean = Number(Decimal(temp).valueOf());
        // Get f|x - Mean|^2
        temp = Decimal(row[i].x_mean_sqrd).times(row[i].frequency).toFixed(4);
        row[i].fx_mean_sqrd = Number(Decimal(temp).valueOf());
        // GET SUMMATION for f|x-Mean| and f|x-Mean|^2
        info.Ef_x_mean += row[i].fx_mean;
        info.Ef_x_mean_sqrd += row[i].fx_mean_sqrd;
    }
    // Get precise answers for SUMMATION
    temp = info.Ef_x_mean.toFixed(4);
    info.Ef_x_mean = Number(Decimal(temp).valueOf());
    temp = info.Ef_x_mean_sqrd.toFixed(4);
    info.Ef_x_mean_sqrd = Number(Decimal(temp).valueOf());
    // Get Mean deviation
    temp = Decimal(info.Ef_x_mean).dividedBy(info.totalFrequency).toFixed(4);
    info.MeanDeviation = Number(Decimal(temp).valueOf());
    // Variance
    temp = Decimal(info.Ef_x_mean_sqrd).dividedBy(info.totalFrequency).toFixed(4);
    info.Variance = Number(Decimal(temp).valueOf());
    // Standard deviation
    temp = Decimal(info.Variance).sqrt().toFixed(4);
    info.StandardDeviation = Number(Decimal(temp).valueOf());
}
let showTableLegend = () => {
    paragraphs.show();
    paragraphs.css('display', 'inline');
    $(`table tr#${info.medianClassIndex}`).css('background', 'rebeccapurple'); //MEDIAN CLASS
    for (let i = 0; i < info.modalClassIndex.length; i++) {
        if (info.medianClassIndex == info.modalClassIndex[i]) {
            $(`table tr#${info.modalClassIndex[i]}`).css('background', 'mediumvioletred'); // IF MEDIAN AND MODAL CLASS
        } else {
            $(`table tr#${info.modalClassIndex[i]}`).css('background', '#C84B31'); //MODAL CLASS
        }
    }
}

let showCalculatedValues = () => {
    for (let k = 0; k < 9; k++){
        for (let i = 0; i < classSize; i++) {
            if (k == 0) { // Show midpoint
                $(`tr#${i}`).append(`<td> ${row[i].midpoint} </td>`)
            } else if (k == 1) { // Show frequency * midpoint
                $(`tr#${i}`).append(`<td> ${row[i].fx} </td>`)
            } else if (k == 2) { // Show lower boundary
                $(`tr#${i}`).append(`<td> ${row[i].lower_boundary} </td>`)
            } else if (k == 3) { // Show upper boundary
                $(`tr#${i}`).append(`<td> ${row[i].upper_boundary} </td>`)
            } else if (k == 4) { // Show cumulative frequency
                $(`tr#${i}`).append(`<td> ${row[i].cumulative_frequency} </td>`)
            } else if (k == 5) { // measures of variablity (show |x - mean|)
                $(`tr#${i}`).append(`<td> ${row[i].x_mean} </td>`)
            } else if (k == 6) { // |x - mean|^2
                $(`tr#${i}`).append(`<td> ${row[i].x_mean_sqrd} </td>`)
            } else if (k == 7) {
                $(`tr#${i}`).append(`<td> ${row[i].fx_mean} </td>`)
            } else if (k == 8) {
                $(`tr#${i}`).append(`<td> ${row[i].fx_mean_sqrd} </td>`)
            }
        }
    }
    table.append(`
        <tr id=${classSize}>
            <td>Range = ${info.Range}</td>
            <td>Σ𝑓 = ${info.totalFrequency}</td>
            <td> </td>
            <td>Σ𝑓x = ${info.Efx}</td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> Σ𝑓|x - x̄| = ${info.Ef_x_mean}</td>
            <td> Σ𝑓|x - x̄|² = ${info.Ef_x_mean_sqrd}</td>
        </tr>`) 
    // Measures of central tendency
    table.append(`
        <tr id=${classSize + 1}>
            <td colspan=2 style="padding: 10px;">Mean (x̄) = ${info.Mean} </td>
            <td colspan=2 style="padding: 10px;">Median (x̃) = ${info.Median}</td>
        </tr>
        `)
    info.Mode.forEach((item, index) => {
        $(`table tr#${classSize + 1}`).append(`
        <td colspan=1 style="padding: 10px;">Mode ${index + 1} (X̂) = ${item.value}</td>
        `)
    })
    // Measures of variability
    table.append(`
        <tr id=${classSize + 2}>
            <td colspan=3 style="padding: 20px;">Mean Deviation (𝑴.𝑫) = ${info.MeanDeviation} </td>
            <td colspan=3 style="padding: 20px;">Variance (σ²) = ${info.Variance}</td>
            <td colspan=3 style="padding: 20px;">Standard Deviation (σ) = ${info.StandardDeviation}</td>
        </tr>
        `)
}

let drawTableHeader = () => {
    table.append(`
        <tr id="header">
            <th> 𝒊 </th>
            <th> 𝑓 </th>
            <th> x </th>
            <th> 𝑓x </th>
            <th> L.B </th>
            <th> U.B </th>
            <th> cf </th>
            <th> |x - x̄| </th>
            <th> |x - x̄|² </th>
            <th> 𝑓|x - x̄| </th>
            <th> 𝑓|x - x̄|² </th>
        </tr>
    `)
}
let showTableLimits = () => {
    let temp = Number(lowestLimit.val()) + Number(interval.val()) - 1;
    for (let i = 0; i < classSize; i++) {
        if (i == 0) {
            row[i] = {
                lower_limit: Number(lowestLimit.val()),
                upper_limit: temp,
                midpoint: (Number(lowestLimit.val()) + temp)/2
            }
            table.append(`<tr id=${i}> <td> ${row[i].lower_limit} - ${row[i].upper_limit} </td> </tr>`)
        } else {
            row[i] = {
                lower_limit: temp,
                upper_limit: temp + (Number(interval.val()) - 1),
                midpoint: (temp + (temp + Number(interval.val()) - 1))/2
            }
            table.append(`<tr id=${i}> <td> ${row[i].lower_limit} - ${row[i].upper_limit} </td> </tr>`)
            temp += Number(interval.val()) - 1;
        }
        temp++;
    }
}

let askForFrequencies = () => {
    for (let i = 0; i < classSize; i++) {
        $(`tr#${i}`).append(`
            <td> 
                <input type="number" value="0" id="frequency-${i}"/>
            </td>
        `)
    } 
}

highestLimit.keyup((event) => {
    if (event.keyCode == 13) {
        Submit_button.click()        
    }
})
