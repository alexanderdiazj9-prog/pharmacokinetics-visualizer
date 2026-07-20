function f(aGut, aPlasma, ka, ke) {
    const dAGut = -ka * aGut;
    const dAPlasma = ka * aGut - ke * aPlasma;
    return {dAGut, dAPlasma};
}

function simulateOralFirstOrder(doses, F, ka, halfLife, vd, bw, h, tMax) {
    const ke = Math.log(2) / halfLife;      // halfLife is in hours
    const V = vd * bw       // vd is in L/kg, bw is in kg, and V is in L
    
    const hours = [];
    const concentrations = [];

    const sortedDoses = doses.slice().sort(function(a, b) { return a.time - b.time; });
    let doseIndex = 0;

    let aGut = 0;
    let aPlasma = 0;

    let t = 0;
    while (t <= tMax) {
        while (doseIndex < sortedDoses.length && sortedDoses[doseIndex].time <= t + 1e-9) {
            aGut += F * sortedDoses[doseIndex].amount;
            doseIndex++;
        }

        hours.push(t);
        concentrations.push(aPlasma / V);
        
        const k1 = f(aGut, aPlasma, ka, ke);
        const k2 = f(aGut + (h/2) * k1.dAGut, aPlasma + (h/2) * k1.dAPlasma, ka, ke);
        const k3 = f(aGut + (h/2) * k2.dAGut, aPlasma + (h/2) * k2.dAPlasma, ka, ke);
        const k4 = f(aGut + h * k3.dAGut, aPlasma + h * k3.dAPlasma, ka, ke);

        aGut = aGut + (h/6) * (k1.dAGut + 2*k2.dAGut + 2*k3.dAGut + k4.dAGut);
        aPlasma = aPlasma + (h/6) * (k1.dAPlasma + 2*k2.dAPlasma + 2*k3.dAPlasma + k4.dAPlasma);
        t += h;
        }

        return {hours, concentrations};
}

function fAlcohol(C1, C2, C3, k1, k2, a, vmax, km) {
    C1 = Math.max(0, C1); // stomach concentration mg/L
    C2 = Math.max(0, C2); // intestine concentration mg/L
    C3 = Math.max(0, C3); // blood concentration mg/L

    const dC1 = -(k1 * C1) / (1 + a * (C1 ** 2));
    const dC2 = (k1 * C1) / (1 + a * (C1 ** 2)) - (k2 * C2);

    let dC3;
    if (C3 > 0) {
        dC3 = (k2 * C2) - (vmax * C3) / (km + C3);
    } else {
        dC3 = (k2 * C2);
    }

    return {dC1, dC2, dC3};
}

function simulateAlcohol(doses, vd, k1, k2, a, vmax, km, bw, h, tMax) {
    const V = vd * bw
    const sortedDoses = doses.slice().sort(function(a,b) { return a.time - b.time; });
    let doseIndex = 0;

    const hours = [];
    const concentrations = [];

    let C1 = 0, C2 = 0, C3 = 0;

    let t = 0;
    while (t <= tMax) {
        while (doseIndex < sortedDoses.length && sortedDoses[doseIndex].time <= t + 1e-9) {
            const doseMg = sortedDoses[doseIndex].amount * 14000;
            C1 += doseMg / V;
            doseIndex++;
        }

        hours.push(t);
        concentrations.push(C3);

        const k1_ = fAlcohol(C1, C2, C3, k1, k2, a, vmax, km);
        const k2_ = fAlcohol(C1 + (h/2) * k1_.dC1, C2 + (h/2) * k1_.dC2, C3 + (h/2) * k1_.dC3, k1, k2, a, vmax, km);
        const k3_ = fAlcohol(C1 + (h/2) * k2_.dC1, C2 + (h/2) * k2_.dC2, C3 + (h/2) * k2_.dC3, k1, k2, a, vmax, km);
        const k4_ = fAlcohol(C1 + h * k3_.dC1, C2 + h * k3_.dC2, C3 + h * k3_.dC3, k1, k2, a, vmax, km);

        C1 = C1 + (h/6) * (k1_.dC1 + 2 * k2_.dC1 + 2 * k3_.dC1 + k4_.dC1);
        C2 = C2 + (h/6) * (k1_.dC2 + 2 * k2_.dC2 + 2 * k3_.dC2 + k4_.dC2);
        C3 = C3 + (h/6) * (k1_.dC3 + 2 * k2_.dC3 + 2 * k3_.dC3 + k4_.dC3);

        t += h;
    }

    return {hours, concentrations};
}

function getInstantaneousKe(victimDrug, keBase, inhibitorConcAtT, inhibitorDrug) {
    if (!victimDrug.enzymeReliance || !inhibitorDrug.inhibits) return keBase;

    let combinedRatio = 1;
    Object.keys(victimDrug.enzymeReliance).forEach(function(enzyme) {
        const fm = victimDrug.enzymeReliance[enzyme];
        const inhibitionData = inhibitorDrug.inhibits[enzyme];
        if (!inhibitionData) return;

        const instRatio = 1 + inhibitorConcAtT / inhibitionData.Ki;
        const enzymeAUCratio = 1 / (1 - fm + fm / instRatio);
        combinedRatio *= enzymeAUCratio;
    });

    return keBase / combinedRatio;
}

function simulateOralFirstOrderDynamic(doses, F, ka, halfLife, vd, bw, h, tMax, victimDrug, inhibitorDrug, inhibitorConc) {
    const keBase = Math.log(2) / halfLife;
    const V = vd * bw;
    const hours = [];
    const concentrations = [];
    const sortedDoses = doses.slice().sort(function(a, b) { return a.time - b.time; });
    let doseIndex = 0;

    let aGut = 0;
    let aPlasma = 0;
    let t = 0;
    let idx = 0;

    while (t <= tMax) {
        while (doseIndex < sortedDoses.length && sortedDoses[doseIndex].time <= t + 1e-9) {
            aGut += F * sortedDoses[doseIndex].amount;
            doseIndex++;
        }

        hours.push(t);
        concentrations.push(aPlasma / V);

        const I_t = inhibitorConc[idx] || 0;
        const I_next = inhibitorConc[idx + 1] !== undefined ? inhibitorConc[idx + 1] : I_t;
        const I_mid = (I_t + I_next) / 2;

        const ke_t = getInstantaneousKe(victimDrug, keBase, I_t, inhibitorDrug);
        const ke_mid = getInstantaneousKe(victimDrug, keBase, I_mid, inhibitorDrug);
        const ke_next = getInstantaneousKe(victimDrug, keBase, I_next, inhibitorDrug);

        const k1 = f(aGut, aPlasma, ka, ke_t);
        const k2 = f(aGut + (h/2)*k1.dAGut, aPlasma + (h/2)*k1.dAPlasma, ka, ke_mid);
        const k3 = f(aGut + (h/2)*k2.dAGut, aPlasma + (h/2)*k2.dAPlasma, ka, ke_mid);
        const k4 = f(aGut + h*k3.dAGut, aPlasma + h*k3.dAPlasma, ka, ke_next);

        aGut = aGut + (h/6) * (k1.dAGut + 2*k2.dAGut + 2*k3.dAGut + k4.dAGut);
        aPlasma = aPlasma + (h/6) * (k1.dAPlasma + 2*k2.dAPlasma + 2*k3.dAPlasma + k4.dAPlasma);

        t += h;
        idx++;
    }

    return { hours, concentrations };
}

function getDoses(drugKey) {
    if(!doseOverrides[drugKey]) {
        doseOverrides[drugKey] = [{amount: drugs[drugKey].defaultDose, time: 0}];
    }
    return doseOverrides[drugKey];
}

/* state */

let activeDrugs = [];
let doseOverrides = {};
let logScale = false;

/* rendering sidebar buttons */

function renderPills() {
const pillList = document.getElementById('pillList');
pillList.innerHTML = '';

activeDrugs.forEach(function(drugKey) {
    const drug = drugs[drugKey];

    const pill = document.createElement('div');
    pill.className = 'drug-pill' + (drug.ready ? '' : ' inactive');
    pill.style.setProperty('--drug-color', drug.color);
    pill.style.cursor = 'pointer';
    pill.addEventListener('click', function() {
        openDrugPanel(drugKey);
    });


    const label = document.createElement('span');
    label.textContent = drug.label;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'x';
    removeBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        if (openPanelDrug === drugKey) {
            closeDrugPanel();
        }
        activeDrugs = activeDrugs.filter(function(d) { return d !== drugKey; });
        delete doseOverrides[drugKey];
        renderAll();
    });

    pill.appendChild(label);
    pill.appendChild(removeBtn);
    pillList.appendChild(pill);
});

const addBtn = document.getElementById('addDrugButton');
addBtn.style.display = activeDrugs.length >= 2 ? 'none' : 'flex';

}


const categoryLabels = {
    stimulant: 'stimulants',
    depressant: 'depressants',
    analgesic: 'analgesics',
    antihistamine: 'antihistamines',
    hormone: 'hormones',
    muscle_relaxant: 'muscle relaxants',
    antidepressant: 'antidepressants',
    antibiotic: 'antibiotics',
    antiarrhymthmic: 'antiarrhythmics',
    contraceptive: 'contraceptives',
    photosensitizer: 'photosensitizers',
    antineoplastic: 'antineoplastics',
};
/* rendering + add drug lists drugs not already active */
function renderDrugPicker () {
    const resultsContainer = document.getElementById('drugPickerResults');
    const query = document.getElementById('drugPickerSearch').value.trim().toLowerCase();
    resultsContainer.innerHTML = '';

    const available = Object.keys(drugs).filter(function(key) {
        return !activeDrugs.includes(key) && drugs[key].listed !== false;
    });

    const categorized = {};
    available.forEach(function(key) {
        const drug = drugs[key];
        const label = drug.label.toLowerCase();
        const catLabel = (categoryLabels[drug.category] || drug.category).toLowerCase();

        const matches = query === '' || label.includes (query) || catLabel.includes(query);
        if (!matches) return;

        if (!categorized[drug.category]) categorized[drug.category] = [];
        categorized[drug.category].push(key);
    });

    const categoryKeys = Object.keys(categorized).sort();

    if(categoryKeys.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'drug-picker-empty';
        empty.textContent = available.length === 0 ? 'all drugs active' : 'no matches';
        resultsContainer.appendChild(empty);
        return;
    }

    categoryKeys.forEach(function(catKey) {
        const section = document.createElement('div');
        section.className = 'drug-picker-category';

        const label = document.createElement('p');
        label.className = 'drug-picker-category-label';
        label.textContent = categoryLabels[catKey] || catKey;
        section.appendChild(label);

        const grid = document.createElement('div');
        grid.className = 'drug-picker-grid';

        categorized[catKey].forEach(function(drugKey) {
            const drug = drugs[drugKey];
            const item = document.createElement('button');
            item.className = 'drug-picker-item';
            item.style.setProperty('--drug-color', drug.color);
            item.textContent = drug.label;
            item.addEventListener('click', function () {
                if (activeDrugs.length >= 2) return;
                activeDrugs.push(drugKey);
                closeDrugPicker();
                renderAll();
            });
            grid.appendChild(item);
        });
        
        section.appendChild(grid);
        resultsContainer.appendChild(section);
    });
}

function openDrugPicker() {
    document.getElementById('drugPickerPanel').classList.add('open');
    document.getElementById('drugPickerSearch').value = '';
    renderDrugPicker();
    document.getElementById('drugPickerSearch').focus();
}

function closeDrugPicker() {
    document.getElementById('drugPickerPanel').classList.remove('open');
}

document.getElementById('addDrugButton').addEventListener('click', openDrugPicker);
document.getElementById('drugPickerClose').addEventListener('click', closeDrugPicker);
document.getElementById('drugPickerSearch').addEventListener('input', renderDrugPicker);

    /* rendering per-drug dose inputs */

function renderDoseInputs() {
    const container = document.getElementById('doseInputs');
    container.innerHTML = '';

    activeDrugs.forEach(function(drugKey) {
        const drug = drugs[drugKey];
        const doses = getDoses(drugKey);

        const group = document.createElement('div');
        group.className = 'input-group dose-group';
        group.style.setProperty('--input-color', drug.color);

        const label = document.createElement('label');
        label.textContent = drug.doseLabel;
        group.appendChild(label);

        const doseList = document.createElement('div');
        doseList.className = 'dose-list';

        doses.forEach(function(doseEntry, index) {
            const row = document.createElement('div');
            row.className = 'dose-row';

            const amountInput = document.createElement('input');
            amountInput.type = 'number';
            amountInput.className = 'dose-amount-input';
            amountInput.value = doseEntry.amount;
            amountInput.disabled = !drug.ready;
            amountInput.addEventListener('input', function() {
                doseEntry.amount = parseFloat(amountInput.value);
                updateChart();
            });

            const atLabel = document.createElement('span');
            atLabel.className = 'dose-at-label';
            atLabel.textContent = 'at';

            const timeInput = document.createElement('input');
            timeInput.type = 'number';
            timeInput.className = 'dose-time-input';
            timeInput.value = doseEntry.time;
            timeInput.min = 0;
            timeInput.step = 0.25;
            timeInput.disabled = !drug.ready;
            timeInput.addEventListener('input', function() {
                doseEntry.time = parseFloat(timeInput.value);
                updateChart();
            });
            
            const hLabel = document.createElement('span');
            hLabel.className = 'dose-hour-label';
            hLabel.textContent = 'h';

            row.appendChild(amountInput);
            row.appendChild(atLabel);
            row.appendChild(timeInput);
            row.appendChild(hLabel);

            const removeBtn = document.createElement('button');
            removeBtn.className = 'dose-remove-btn';
            removeBtn.textContent = 'x';

            if(doses.length > 1) {
                removeBtn.addEventListener('click', function() {
                    doses.splice(index, 1);
                    renderDoseInputs();
                    updateChart();
                });
            } else {
                removeBtn.disabled = true;
                removeBtn.style.visibility = 'hidden';
            }
            row.appendChild(removeBtn);

            doseList.appendChild(row);
        });
        group.appendChild(doseList);

        const addDoseBtn = document.createElement('button');
        addDoseBtn.className = 'add-dose-btn';
        addDoseBtn.textContent = '+ add dose';
        addDoseBtn.disabled = !drug.ready;
        addDoseBtn.addEventListener('click', function() {
            const lastTime = doses.length ? doses[doses.length - 1].time : 0;
            doses.push({amount: drug.defaultDose, time: lastTime + 4});
            renderDoseInputs();
            updateChart();
        });
        group.appendChild(addDoseBtn);

        container.appendChild(group);
    });
}

    /* rendering chart */
function updateChart() {
    const bw = parseFloat(document.getElementById('bodyWeightInput').value);
    const chartDiv = document.getElementById('chart');
    const emptyState = document.getElementById('emptyState');

    const readyDrugs = activeDrugs.filter(function(key) { return drugs[key].ready; });

    if (readyDrugs.length === 0) {
        Plotly.purge(chartDiv);
        chartDiv.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }

    chartDiv.style.display = 'block';
    emptyState.style.display = 'none';

    const traces = readyDrugs.map(function(drugKey) {
        const drug = drugs[drugKey];
        const doses = getDoses(drugKey);

        let result;
        if (drug.model === 'oralFirstOrder') {
            result = simulateOralFirstOrder(doses, drug.F, drug.ka, drug.halfLife, drug.vd, bw, 0.01, 24);
        } else if (drug.model === 'alcohol') {
            result = simulateAlcohol(doses, drug.vd, drug.k1, drug.k2, drug.a, drug.vmax, drug.km, bw, 0.01, 24);
        }
        return {drugKey, drug, baseline: result};
    });

    let interactionInfo = null;

    if (traces.length === 2 && traces[0].drug.model === 'oralFirstOrder' && traces[1].drug.model === 'oralFirstOrder') {
        const dynamicConcentrations = [
            [...traces[0].baseline.concentrations],
            [...traces[1].baseline.concentrations],
        ];

        for (let i = 0; i < 2; i++) {
            const victim = traces[i];
            const inhibitorEntry = traces[1 - i];

            if (victim.drug.enzymeReliance && inhibitorEntry.drug.inhibits) {
                const doses = getDoses(victim.drugKey);
                const inhibitorBaselineConcs = dynamicConcentrations[1 - i];

                victim.baseline = simulateOralFirstOrderDynamic(
                    doses, victim.drug.F, victim.drug.ka, victim.drug.halfLife, victim.drug.vd, bw,
                    0.01, 24, victim.drug, inhibitorEntry.drug, inhibitorEntry.baseline.concentrations
                );

                const sharedEnzyme = Object.keys(victim.drug.enzymeReliance).find(function(enzyme) {
                    return inhibitorEntry.drug.inhibits[enzyme];
                });

                if (sharedEnzyme) {
                    const Ki = inhibitorEntry.drug.inhibits[sharedEnzyme].Ki;
                    const inhibitorCmax = Math.max(...inhibitorBaselineConcs);
                    const keBase = Math.log(2) / victim.drug.halfLife;
                    const keInhibited = getInstantaneousKe(victim.drug, keBase, inhibitorCmax, inhibitorEntry.drug);
                    const percentReduction = (1 - keInhibited / keBase) * 100;

                    interactionInfo = {
                        victim: victim.drug,
                        inhibitor: inhibitorEntry.drug,
                        enzyme: sharedEnzyme,
                        Ki: Ki,
                        inhibitorCmax: inhibitorCmax,
                        percentReduction: percentReduction
                    };
                }
            }
        }
    }

renderInteractionCard(interactionInfo);

    /* rendering interaction card */
function renderInteractionCard(interaction) {
    const card = document.getElementById('interactionCard');
    if (!interaction) {
        card.style.display = 'none';
        card.innerHTML = '';
        return;
    }

    card.style.display = 'flex';

    card.innerHTML =
        '<div class="interaction-row">' +
            '<span class="interaction-drug" style="color:' + interaction.inhibitor.color + '">' + interaction.inhibitor.label + '</span>' +
            '<span class="interaction-arrow">inhibits ' + interaction.enzyme + ' →</span>' +
            '<span class="interaction-drug" style="color:' + interaction.victim.color + '">' + interaction.victim.label + ' clearance ↓</span>' +
        '</div>' +
        '<p class="interaction-text">' +
            'At ' + interaction.inhibitor.label + '\u2019s peak concentration (' + interaction.inhibitorCmax.toFixed(2) + ' mg/L), ' +
            'competitive inhibition of ' + interaction.enzyme + ' (Ki = ' + interaction.Ki + ' mg/L) reduces ' +
            interaction.victim.label + '\u2019s elimination rate by up to ' + interaction.percentReduction.toFixed(0) + '%.' +
        '</p>';
}

    const plotlyTraces = traces.map(function(t) {
        return {
            x: t.baseline.hours,
            y: logScale ? t.baseline.concentrations.map(v => Math.max(v, 1e-6)) : t.baseline.concentrations,
            type: 'scatter',
            mode: 'lines',
            name: t.drug.label,
            line: { color: t.drug.color, width: 2.5 }
        };
    });

    const alcoholActive = readyDrugs.includes('alcohol');
    const safety = buildSafetyShapes(readyDrugs);
    const layout = {
        margin: {t: 10, r: 80, l: 60, b: 40},
        xaxis: {title: 'time (hours)', gridcolor: '#EDEAE2'},
        yaxis: {
            title: 'concentration (mg/L)', 
            type: logScale ? 'log' : 'linear',
            gridcolor: '#EDEAE2',
            titlefont: {color: '#5B6B5B'},
            tickfont: {color: '#5B6B5B'},
            range: getAxisRange(plotlyTraces)
        },

        shapes: safety.shapes,
        annotations: safety.annotations,
        paper_bgcolor: '#FFFFFF',
        plot_bgcolor: '#FFFFFF',
        font: {family: 'JetBrains Mono, monospace', size: 12, color: '#1A1D1F'},
        showlegend: false
    };
        
    Plotly.newPlot(chartDiv, plotlyTraces, layout, {displayModeBar: false, responsive: true});

}

document.getElementById('bodyWeightInput').addEventListener('input', updateChart);

document.getElementById('scaleToggle').addEventListener('click', function() {
    logScale = !logScale;
    this.textContent = logScale ? 'linear scale' : 'log scale';
    this.classList.toggle('active', logScale);
    updateChart();
});

/* master render */
function renderAll() {
    renderPills();
    renderDoseInputs();
    updateChart();
}

renderAll();

/* info button */
const disclaimerOverlay = document.getElementById('disclaimerOverlay');
const acknowledgeButton = document.getElementById('acknowledgeButton');
const modalCloseButton = document.getElementById('modalCloseButton');
const infoButton = document.getElementById('infoButton');

function openModal(isFirstVisit) {
    disclaimerOverlay.classList.add('open');
    acknowledgeButton.style.display = isFirstVisit ? 'block' : 'none';
    modalCloseButton.style.display = isFirstVisit ? 'none' : 'block';
    document.getElementById('modalTitle').textContent = isFirstVisit ? 'before you begin' : 'limitations';
}

function closeModal() {
    disclaimerOverlay.classList.remove('open');
}

openModal(true);

acknowledgeButton.addEventListener('click', function() {
    closeModal();
});

modalCloseButton.addEventListener('click', closeModal);

infoButton.addEventListener('click', function() {
    openModal(false);
});

function buildSafetyShapes(readyDrugs) {
    const shapes = [];
    const annotations = [];

    const rangeLabels = {
        drivingLimit: 'U.S. legal driving limit (0.08%)',
        toxic: 'toxic threshold',
        lethal: 'lethal threshold'
    };

    readyDrugs.forEach(function(drugKey) {
        const drug = drugs[drugKey];
        if (!drug.ranges) return;

        // shaded therapuetic band (flat-range drugs only)
        if (drug.ranges && drug.ranges.therapeuticLow !== undefined) {
            shapes.push({
                type: 'rect',
                xref: 'paper', x0: 0, x1: 1,
                yref: 'y', y0: drug.ranges.therapeuticLow, y1: drug.ranges.therapeuticHigh,
                fillcolor: drug.color, opacity: 0.08, line: {width: 0}
            });
            annotations.push({
                xref: 'paper', x: 0, xanchor: 'left',
                yref: 'y', y: drug.ranges.therapeuticHigh, yanchor: 'bottom',
                text: drug.label + ' therapeutic range',
                showarrow: false,
                font: {color: drug.color, size: 10}
            });
        }

        // flat threshold lines (toxic/lethal/drivingLimit)
        ['toxic', 'lethal', 'drivingLimit'].forEach(function(key) {
            if (drug.ranges && drug.ranges[key] !== undefined) {
                shapes.push({
                    type: 'line',
                    xref: 'paper', x0: 0, x1: 1,
                    yref: 'y', y0: drug.ranges[key], y1: drug.ranges[key],
                    line: {color: drug.color, width: 1.5, dash: 'dot'}
                });
                annotations.push({
                    xref: 'paper', x: 1, xanchor: 'right',
                    yref: 'y', y: drug.ranges[key], yanchor: 'bottom',
                    text: key === 'drivingLimit' ? rangeLabels[key] : drug.label + ' ' + rangeLabels[key],
                    showarrow: false,
                    font: {color: drug.color, size: 10}
                });
            }
        });


    });

    return {shapes: shapes, annotations: annotations};
}

function getAxisRange(plotlyTraces) {
    let max = 0;
    let min = Infinity;

    plotlyTraces.forEach(function(t) {
        const traceMax = Math.max(...t.y);
        if (traceMax > max) max = traceMax;
        t.y.forEach(function(v) {
            if (v > 1e-6 && v < min) min = v;
        });
    });

    if (logScale) {
        const lo = Math.log10(min === Infinity ? 1e-3 : min * 0.5);
        const hi = Math.log10(max > 0 ? max * 3 : 10);
        return [lo, hi];
    }

    return [0, max > 0 ? max * 3 : 10];
}

// info drug panel
const drugPanel = document.getElementById('drugPanel');
const drugPanelClose = document.getElementById('drugPanelClose');
let openPanelDrug = null;

function openDrugPanel(drugKey) {
    const drug = drugs[drugKey];
    if (!drug.info) return;

    if(openPanelDrug === drugKey) {
        closeDrugPanel();
        return;
    }

    openPanelDrug = drugKey;
    document.getElementById('drugPanelTitle').textContent = drug.label;
    document.getElementById('drugPanelRoute').textContent = drug.info.route;
    document.getElementById('drugPanelMetabolism').textContent = drug.info.metabolism;
    document.getElementById('drugPanelSource').innerHTML = drug.info.source;

    const grid = document.getElementById('drugPanelGrid');
    grid.innerHTML = '';
    const statFields = ['F', 'ka', 'halfLife', 'vd'];
    const statLabels = {F: 'F', ka: 'ka', halfLife: 'half-life (h)', vd: 'VD (L/kg)'};
    statFields.forEach(function(field) {
        if(drug[field] === undefined) return;
        const stat = document.createElement('div');
        stat.className = 'drug-panel-stat';
        stat.innerHTML = '<p class="drug-panel-stat-label">' + statLabels[field] + '</p>' + '<p class="drug-panel-stat-value">' + drug[field] + '</p>';
        grid.appendChild(stat);
    });

    drugPanel.style.setProperty('--drug-color', drug.color);
    document.getElementById('drugPanelDiagram').innerHTML = buildCompartmentDiagram(drug);

    drugPanel.classList.add('open');

    const caveatLabel = document.getElementById('drugPanelCaveatLabel');
    const caveatText = document.getElementById('drugPanelCaveat');

    if (drug.caveat) {
        caveatLabel.style.display = 'block';
        caveatText.style.display = 'block';
        caveatText.textContent = drug.caveat;
    } else {
        caveatLabel.style.display = 'none';
        caveatText.style.display = 'none';
    }
}

function closeDrugPanel() {
    openPanelDrug = null;
    drugPanel.classList.remove('open');
}

drugPanelClose.addEventListener('click', closeDrugPanel);

function buildCompartmentDiagram(drug) {
    if (!drug.info.compartments) return '';

    let html = '<div class="drug-panel-diagram">';
    drug.info.compartments.forEach(function(comp, i) {
        const boxClass = comp.highlight ? ' highlight' : (comp.warn ? ' warn' : '');
        html += '<div class="compartment-box' + boxClass + '">' +
                    '<p class="compartment-label">' + comp.label + '</p>' +
                    '<p class="compartment-caption">' + comp.caption + '</p>' +
                '</div>';
        if (i < drug.info.compartments.length - 1) {
            const rate = drug.info.rateLabels[i];
            html += '<div class="compartment-arrow">' +
                        '<span class="arrow-glyph">↓</span>' +
                        (rate ? '<span>' + rate + '</span>' : '') +
                    '</div>';
        }
    });
    html += '</div>';
    return html;
}


