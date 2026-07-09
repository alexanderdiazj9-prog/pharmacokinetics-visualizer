const drugs = {
            caffeine: {
                label: 'caffeine',
                category: 'stimulant',
                F: 1.0, // no units
                ka: 4.94, // h^-1
                halfLife: 5, // hours
                vd: 0.7, // L/kg
                defaultDose: 200, //mg
                doseUnit: 'mg',
                doseLabel: 'caffeine dose(mg)',
                color: '#C4502E',
                scaleTier: 'low',
                model: 'oralFirstOrder',
                ranges: {therapeuticLow: 1, therapeuticHigh: 10, toxic: 15, lethal: 80},
                caveat: "Half-life varies widely by individual (1.5-9.5h reported); 4h value reflects a specific literature source, not a universal constant.",
                info: {
                    route: 'oral administration',
                    metabolism: 'Hepatic oxidation primarily via CYP1A2 (95%) via N-demethylation to paraxanthine, theobromine, and theophylline.',
                    source: 'NCBI Bookshelf; liebertpub.com/doi/10.1089/caff.2017.0011',
                    compartments: [
                        {label: 'GI tract', caption: 'dose enters here'},
                        {label: 'blood', caption: 'measured concentration', highlight: true},
                        {label: 'eliminated', caption: 'excreted or metabolized'}
                    ],
                    rateLabels: ['ka', 'ke']
                },
                enzymeReliance: {CYP1A2: 0.95},
                ready:true
            },
            alcohol: {
                label: 'alcohol',
                category: 'depressant',
                vd: 0.68, // L/kg male avg is 0.68, female is 0.55
                k1: 5.55, // h^-1 gastric emptying constant
                k2: 7.05, // h^-1 intestinal absorption constant
                a: 0.42/1e6, // L^2/mg^2 stomach quadratic feedback parameter
                vmax: 470, // mg/(L*h) max elimination rate
                km: 380, // mg/L Michaelis-Menten constant
                doseUnit: 'std drinks',
                doseLabel: 'alcohol dose (std drinks)',
                defaultDose: 2,
                color: '#2E5C6E',
                scaleTier: 'high',
                model: 'alcohol',
                ranges: {drivingLimit: 800, toxic: 2500, lethal: 4000},
                caveat: "Absorption parameters carry high individual variability.",
                info: {
                    route: 'oral administration',
                    metabolism: 'Hepatic via alcohol dehydrogenase (ADH) to acetaldehyde, then aldehyde dehydrogenase (ALDH) to acetate.',
                    source: '...',
                    compartments: [
                        {label: 'stomach', caption: 'dose enters here'},
                        {label: 'intestine', caption: 'passes through'},
                        {label: 'blood', caption: 'measured as BAC', highlight: true},
                        {label: 'eliminated', caption: 'rate can saturate'}
                    ],
                    rateLabels: ['k1', 'k2', null],
                },
                ready: true
            },
            ibuprofen: {
                label: 'ibuprofen',
                category: 'analgesic',
                F: 1.0, // no units
                ka: 1.2, // h^-1 unsure
                halfLife: 2, // hours unsure
                vd: 0.1, // L/kg
                defaultDose: 200, //mg
                doseUnit: 'mg',
                doseLabel: 'ibuprofen dose (mg)',
                color: '#5B6B5B',
                scaleTier: 'low',
                model: 'oralFirstOrder',
                ranges: {therapeuticLow: 15, therapeuticHigh: 35, toxic: 300, lethal: 700},
                caveat: "Ibuprofen exhibits nonlinear pharmacokinetics from saturable plasma protein binding, meaning clearance actually changes with dose. This single-ka/ke model assumes fixed first-order kinetics, so accuracy likely degrades at higher doses. Ibuprofen is also a racemic mixture (R/S enantiomers with different activity and interconversion) which this model doesn't distinguish.",
                info: {
                    route: 'oral administration',
                    metabolism: 'Hepatic oxidation via CYP2C9 to inactive metabolites (hydroxyl-ibuprofen and carboxy-ibuprofen).',
                    source: '...',
                    compartments: [
                        {label: 'GI tract', caption: 'dose enters here'},
                        {label: 'blood', caption: 'measured concentration', highlight: true},
                        {label: 'eliminated', caption: 'excreted or metabolized'}
                    ],
                    rateLabels: ['ka', 'ke']
                },
                ready: true
            },
            acetaminophen: {
                label: 'acetaminophen',
                category: 'analgesic',
                F: 0.8,
                ka: 2.4,
                halfLife: 2.5,
                vd: 0.95,
                defaultDose: 325,
                doseUnit: 'mg',
                doseLabel: 'acetaminophen dose (mg)',
                color: '#A6824A',
                scaleTier: 'low',
                model: 'oralFirstOrder',
                ranges: {therapeuticLow: 10, therapeuticHigh: 30, toxic: 150},
                caveat: "At therapeutic doses, acetaminophen is cleared mainly by two saturable conjugation pathways; at toxic/overdose levels these pathways saturate and a larger share shifts to the toxic oxidative pathway. This single ka/ke first-order model does not capture that shift, so it becomes progressively less accurate the closer values get to the toxic range. Toxicity threshold (150 mg/L) also reflects a clinical reference point measured specifically at 4 hours post-ingestion, actual risk depends on timing.",
                info: {
                    route: 'oral administration',
                    metabolism: 'Mainly hepatic glucuronidation and sulfation; a minor fraction is oxidized by CYP2E1 to the toxic metabolite NAPQI.',
                    source: '...',
                    compartments: [
                        {label: 'GI tract', caption: 'dose enters here'},
                        {label: 'blood', caption: 'measured concentration', highlight: true},
                        {label: 'eliminated', caption: 'excreted or metabolized'}
                    ],
                    rateLabels: ['ka', 'ke']
                },
                ready: true
            },
            diphenhydramine: {
                label: 'diphenhydramine',
                category: 'depressant',
                F: 0.72,
                ka: 1.59,
                halfLife: 9,
                vd: 17,
                defaultDose: 25,
                doseUnit: 'mg',
                doseLabel: 'diphenhydramine dose (mg)',
                color: '#4A7A6A',
                scaleTier: 'low',
                model: 'oralFirstOrder',
                ranges: {therapeuticLow: 0.015, therapeuticHigh: 0.112, toxic: 1, lethal: 5},
                caveat: "Vd = 17 L/kg reflects a one-compartment model, which is what this graph uses. A separate source reports Vd = 4.54 L/kg from two-compartment analysis after blood/tissue equilibration, which is not used here. Because diphenhydramine is highly lipophilic, real plasma levels likely decline faster than this model predicts shortly after peak (a true distribution phase this model can't capture), before settling closer to the modeled curve during the slower terminal phase. ka was back-calculated from tmax rather than directly sourced.",
                info: {
                    route: 'oral administration',
                    metabolism: 'Extensive hepatic first-pass metabolism, primarily mediated by CYP2D6 via sequential N-demethylation.',
                    source: '<a href="https://www.ncbi.nlm.nih.gov/books/NBK526010/" target="_blank">https://www.ncbi.nlm.nih.gov/books/NBK526010/</a>;<br>' +
                '<a href="https://www.ncbi.nlm.nih.gov/books/NBK557578/" target="_blank">https://www.ncbi.nlm.nih.gov/books/NBK557578/</a>;<br>' +
                '<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5947143/" target="_blank">https://pmc.ncbi.nlm.nih.gov/articles/PMC5947143/</a>',
                    compartments: [
                        {label: 'GI tract', caption: 'dose enters here'},
                        {label: 'blood', caption: 'measured concentration', highlight: true},
                        {label: 'eliminated', caption: 'excreted or metabolized'}
                    ],
                    rateLabels: ['ka', 'ke']
                },
                ready: true
            },
            melatonin: {
                label: 'melatonin',
                category: 'depressant',
                F: 0.21,
                ka: 12,
                halfLife: 0.9,
                vd: 1.2,
                defaultDose: 5,
                doseUnit: 'mg',
                doseLabel: 'melatonin dose (mg)',
                color: '#6B7A9C',
                scaleTier: 'low',
                model: 'oralFirstOrder',
                ranges: {},
                caveat: "Bioavailability (9-33% reported range, ~15% typical) and other PK parameters vary severalfold across studies, largely due to extensive and variable first-pass hepatic metabolism. Values used here reflect one study, not a stable consensus.",
                info: {
                    route: 'oral administration',
                    metabolism: 'Extensive hepatic first-pass metabolism, primarily via CYP1A2 6-hydroxylation followed by sulfate conjugation.',
                    source: '<a href="https://link.springer.com/article/10.1007/s00228-015-1873-4" target="_blank">https://link.springer.com/article/10.1007/s00228-015-1873-4</a>;<br>' +
                            '<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4759723/" target="_blank">https://pmc.ncbi.nlm.nih.gov/articles/PMC4759723/</a>;<br>' +
                            '<a href="https://www.academia.edu/118566773/Formulation_and_pharmacokinetics_of_melatonin" target="_blank">https://www.academia.edu/118566773/Formulation_and_pharmacokinetics_of_melatonin</a>;<br>' +
                            '<a href="https://pubmed.ncbi.nlm.nih.gov/6493445/" target="_blank">https://pubmed.ncbi.nlm.nih.gov/6493445/</a>;<br>' +
                            '<a href="https://pubmed.ncbi.nlm.nih.gov/15616152/" target="_blank">https://pubmed.ncbi.nlm.nih.gov/15616152/</a>',
                    compartments: [
                        {label: 'GI tract', caption: 'dose enters here'},
                        {label: 'blood', caption: 'measured concentration', highlight: true},
                        {label: 'eliminated', caption: 'excreted or metabolized'}
                    ],
                    rateLabels: ['ka', 'ke']
                },
                ready: true
            },
       };