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
                category: 'antihistamine',
                F: 0.72,
                ka: 1.59,
                halfLife: 9,
                vd: 17,
                defaultDose: 25,
                doseUnit: 'mg',
                doseLabel: 'diphenhydramine dose (mg)',
                color: '#4A7A6A',
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
                category: 'hormone',
                F: 0.21,
                ka: 12,
                halfLife: 0.9,
                vd: 1.2,
                defaultDose: 5,
                doseUnit: 'mg',
                doseLabel: 'melatonin dose (mg)',
                color: '#6B7A9C',
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
            tizanidine: {
                label: 'tizanidine',
                category: 'muscle_relaxant',
                F: 0.40,
                ka: 2.31,
                halfLife: 2.5,
                vd: 2.4,
                defaultDose: 4,
                doseUnit: 'mg',
                doseLabel: 'tizanidine dose (mg)',
                color: '#8C6B9C',
                model: 'oralFirstOrder',
                ranges: {},
                caveat: "Oral bioavailability (40% reported by FDA from 2013, reported range 20-34% from paper from 2023) is low due to extensive first-pass hepatic metabolism, meaning this one-compartment model's F and ka values are less certain than for high-bioavailability drugs. ka was back-calculated from a small 6 person study's absorption half-life from 1983.",
                info: {
                    route: 'oral administration',
                    metabolism: 'Extensive hepatic first-pass metbolism, primarily via CYP1A2, to inactive metabolites.',
                    source: '<a href="https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a204c899-a892-41db-a96b-45478e5588f2" target="_blank">DailyMed label</a>;<br>' +
                            '<a href="https://pubmed.ncbi.nlm.nih.gov/3447935/" target="_blank">Granfors et al., pharmacokinetics in healthy volunteers</a>' +
                            '<a href="https://www.accessdata.fda.gov/drugsatfda_docs/label/2013/021447s011_020397s026lbl.pdf" target="_blank">FDA PDF</a>;<br>',
                    compartments: [
                        {label: 'GI tract', caption: 'dose enters here'},
                        {label: 'blood', caption: 'measured concentration', highlight: true},
                        {label: 'eliminated', caption: 'excreted or metabolized'}
                    ],
                    rateLabels: ['ka', 'ke']
                },
                enzymeReliance: {CYP1A2: 0.98},
                inhibitorModelValid: false,
                ready: true
            },
            fluvoxamine: {
                label: 'fluvoxamine',
                category: 'antidepressant',
                F: 0.53,
                ka: 0.53,
                halfLife: 15,
                vd: 25,
                defaultDose: 50,
                doseUnit: 'mg',
                doseLabel: 'fluvoxamine dose (mg)',
                color: '#7A5C8C',
                model: 'oralFirstOrder',
                ranges: {},
                caveat: "ka was back-calculated from a reported tmax range of 2-8 hours (using the midpoint, ~5h), not a single point estimate. actual ka could plausibly range from ~0.2 to ~1.9 h⁻¹ depending on where in that range the true value falls, making this the least-constrained parameter in this entry. Half-life used here (15h) reflects single-dose kinetics; at steady state (reached after 5-10 days of daily dosing) half-life is reported to increase by 30-50%, and fluvoxamine also displays nonlinear pharmacokinetics at higher doses (disproportionately higher plasma concentrations), neither of which this single-dose first-order model captures. Vd (25 L/kg) comes from a secondary/tertiary pharmacology reference rather than a primary study, unlike most other values in this dictionary.",
                info: {
                    route: 'oral administration',
                    metabolism: 'Extensively metabolized in the liver via oxidative pathways to at least 11 metabolites, none pharmacologically active; also functions as a potent reversible inhibitor of CYP1A2.',
                    source: '<a href="https://www.accessdata.fda.gov/drugsatfda_docs/label/2007/021519lbl.pdf" target="_blank">FDA label (LUVOX)</a>;<br>' +
                            '<a href="https://pubmed.ncbi.nlm.nih.gov/7988100/" target="_blank">Perucca et al., Clinical Pharmacokinetics of Fluvoxamine</a>;<br>' +
                            '<a href="https://pharmacologymentor.com/drug-card/fluvoxamine/" target="_blank">Pharmacology Mentor (Vd reference)</a>',
                    compartments: [
                        {label: 'GI tract', caption: 'dose enters here'},
                        {label: 'blood', caption: 'measured concentration', highlight: true},
                        {label: 'eliminated', caption: 'excreted or metabolized'}
                    ],
                    rateLabels: ['ka', 'ke']
                },
                inhibits: {
                    CYP1A2: {Ki: 0.048} // mg/L, converted from 0.15 µM (MW ≈ 318 g/mol) — midpoint of 0.07-0.29 µM range across in vitro studies
                },
                ready: true
            },
            ciprofloxacin: {
                label: 'ciprofloxacin',
                category: 'antibiotic',
                F: 0.70,
                ka: 3.0,
                halfLife: 4,
                vd: 2.1,
                defaultDose: 500,
                doseUnit: 'mg',
                doseLabel: 'ciprofloxacin dose (mg)',
                color: '#B06A4F',
                model: 'oralFirstOrder',
                ranges: {},
                caveat: "Ki (5.2 mg/L) is NOT the in vitro value. The measured in vitro Ki for ciprofloxacin against CYP1A2 is very high (~73 mg/L / 220 µM), which would predict almost no clinical effect. Real clinical data shows a much stronger interaction than in vitro data predicts, a known and published discrepancy for this specific drug. This Ki was instead back-calculated from a clinical caffeine-clearance study (750mg ciprofloxacin dosing, ~45% reduction in caffeine clearance) combined with the FDA label's single-dose Cmax at that dose. This folds ciprofloxacin's true mechanism (which includes delaying the specific conversion of caffeine to paraxanthine, not just general competitive inhibition) into a single simplified parameter, and is derived from one clinical study rather than a pooled/consensus value. Vd (2.1 L/kg) reflects a specific study's steady-state estimate within a wider reported range of 1.74-5.0 L/kg. ka was back-calculated from a tmax range reported as 1-2 hours (using the low end, ~1h); the true value could be somewhat lower if tmax is closer to 2h.",
                info: {
                    route: 'oral administration',
                    metabolism: 'Predominantly renally eliminated (glomerular filtration and tubular secretion account for ~66% of total clearance); the remaining ~33% is nonrenal (partial hepatic metabolism, biliary excretion). Not itself a significant CYP1A2 substrate, but is a clinically potent inhibitor of CYP1A2-mediated metabolism of other drugs.',
                    source: '<a href="https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ef468722-68cd-440b-afd7-2285029db41f" target="_blank">DailyMed / FDA label (ciprofloxacin tablets)</a>;<br>' +
                            '<a href="https://journals.asm.org/doi/10.1128/aac.33.4.474" target="_blank">Healy et al. 1989, Antimicrob Agents Chemother (caffeine clearance study)</a>;<br>' +
                            '<a href="https://onlinelibrary.wiley.com/doi/full/10.1111/j.1742-7843.2008.00252.x" target="_blank">Karjalainen et al. 2008 (in vitro Ki, underprediction discussion)</a>',
                    compartments: [
                        {label: 'GI tract', caption: 'dose enters here'},
                        {label: 'blood', caption: 'measured concentration', highlight: true},
                        {label: 'eliminated', caption: 'excreted or metabolized'}
                    ],
                    rateLabels: ['ka', 'ke']
                },
                inhibits: {
                    CYP1A2: {Ki: 5.2} // mg/L, back-calculated from Healy et al. 1989 clinical clearance data
                },
                ready: true
            },

            mexiletine: {
                label: 'mexiletine',
                category: 'antiarrhymthmic',
                F: 0.9,
                ka: 0.94,
                halfLife: 10,
                vd: 5.5,
                defaultDose: 200,
                doseUnit: 'mg',
                doseLabel: 'mexiletine dose (mg)',
                color: '#8C4A4A',
                model: 'oralFirstOrder',
                ranges: {therapeuticLow: 0.75, therapeuticHigh: 2, toxic: 2},
                caveat: "enzymeReliance for CYP1A2 (fm = 0.30) uses the upper end of an in vitro range (7-30% of metabolism via CYP1A2, with CYP2D6 as the dominant pathway) rather than a single precise value, because a real clinical study found a 38% clearance decrease with fluvoxamine coadministration, which is a larger effect than the low end of the in vitro range alone would predict. This value is corroborated by that clinical finding but not precisely back-calculated from it, since the study's exact fluvoxamine dosing wasn't available. Mexiletine is also reported clinically as a moderate CYP1A2 inhibitor itself (relevant to drugs like caffeine or theophylline), but no inhibits/Ki value is included here yet. Vd (5.5 L/kg) reflects one specific dosing study; a wider range of 5-9 L/kg is reported elsewhere. Mexiletine is also a chiral drug (R/S enantiomers with different clearance and Vd) which this one-compartment model doesn't distinguish, similar to ibuprofen's caveat.",
                info: {
                    route: 'oral administration',
                    metabolism: 'Extensively hepatic; the major pathway is CYP2D6-mediated hydroxylation, with CYP1A2 contributing a smaller but clinically meaningful fraction. About 10-15% is excreted unchanged in the urine.',
                    source: '<a href="https://link.springer.com/content/pdf/10.2165/00003088-199937050-00002.pdf" target="_blank">Clinical Pharmacokinetics of Mexiletine, Clin Pharmacokinet 1999</a>;<br>' +
                            '<a href="https://pubmed.ncbi.nlm.nih.gov/2097598/" target="_blank">Pharmacokinetics after single oral 400mg dose (Vd, tmax)</a>;<br>' +
                            '<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC1873982/" target="_blank">Involvement of CYP1A2 in mexiletine metabolism (RAF study)</a>;<br>' +
                            '<a href="https://cdn.clinicaltrials.gov/large-docs/54/NCT02781454/Prot_000.pdf" target="_blank">Mexiletine in ALS trial protocol (fluvoxamine interaction, clearance data)</a>;<br>' +
                            '<a href="https://www.mayocliniclabs.com/test-catalog/overview/9245" target="_blank">Mayo Clinic Labs, Mexiletine Serum</a>',
                    compartments: [
                        {label: 'GI tract', caption: 'dose enters here'},
                        {label: 'blood', caption: 'measured concentration', highlight: true},
                        {label: 'eliminated', caption: 'excreted or metabolized'}
                    ],
                    rateLabels: ['ka', 'ke']
                },
                enzymeReliance: {CYP1A2: 0.30},
                ready: true
            },

            ethinylestradiol: {
                label: 'ethinylestradiol (OC)',
                category: 'contraceptive',
                F: 0.45,
                ka: 2.9,
                halfLife: 17,
                vd: 5.0,
                defaultDose: 0.03,
                doseUnit: 'mg',
                doseLabel: 'ethinylestradiol dose (mg)',
                color: '#9C7A94',
                model: 'oralFirstOrder',
                ranges: {},
                caveat: "This entry represents ethinylestradiol (EE), the estrogen component shared across most combined oral contraceptives. The progestin component varies by formulation and isn't part of the CYP1A2 story. No inhibits/Ki value is included, real-world data shows CYP1A2 inhibition by EE only emerges after chronic use (>3 months), not from a single dose, and is thought to work by modulating enzyme expression via estrogen receptor agonism rather than classic competitive occupancy of the enzyme. That means the effect doesn't track EE's plasma concentration curve the way this model's Ki-based inhibition system assumes, so forcing a competitive Ki here would misrepresent the actual mechanism, even though the real clinical effect (roughly a 40% reduction in caffeine clearance with regular use) is well-documented. Bioavailability (36-59% range) reflects significant and variable first-pass gut/hepatic metabolism. Tmax varies across sources (1.5h in most labeled data, up to 4h in at least one interaction study), possibly reflecting enterohepatic recirculation producing a secondary absorption peak, which this simple one-compartment model can't capture.",
                info: {
                    route: 'oral administration',
                    metabolism: 'Extensively metabolized, primarily via intestinal sulfation and hepatic CYP3A4-mediated 2-hydroxylation, plus glucuronidation. Not itself meaningfully cleared via CYP1A2, but with chronic use is associated with reduced CYP1A2 activity in other drugs via a non-classical (likely expression-modulating) mechanism.',
                    source: '<a href="https://link.springer.com/article/10.2165/00003088-200746020-00003" target="_blank">Pharmacokinetic Drug Interactions Involving 17α-Ethinylestradiol, Clin Pharmacokinet 2007</a>;<br>' +
                            '<a href="https://pubmed.ncbi.nlm.nih.gov/34342002/" target="_blank">Rodrigues 2022, Considerations Beyond CYP3A Induction/Inhibition</a>;<br>' +
                            '<a href="https://link.springer.com/article/10.1007/BF00544361" target="_blank">Impairment of caffeine clearance by chronic OC use, Eur J Clin Pharmacol</a>;<br>' +
                            '<a href="https://www.researchgate.net/publication/7565818" target="_blank">OC + gestodene effect on tizanidine via CYP1A2, corroborating interaction</a>',
                    compartments: [
                        {label: 'GI tract', caption: 'dose enters here'},
                        {label: 'blood', caption: 'measured concentration', highlight: true},
                        {label: 'eliminated', caption: 'excreted or metabolized'}
                    ],
                    rateLabels: ['ka', 'ke']
                },
                ready: false,
                listed: false
            },

            methoxsalen: {
                label: 'methoxsalen',
                category: 'photosensitizer',
                F: 0.80,
                ka: 0.83,
                halfLife: 2,
                vd: 4.0,
                defaultDose: 10,
                doseUnit: 'mg',
                doseLabel: 'methoxsalen dose (mg)',
                color: '#4A5E7A',
                model: 'oralFirstOrder',
                ranges: {},
                caveat: "No inhibits/Ki value is included, for the same reason as ethinylestradiol but more definitively documented here: methoxsalen is a mechanism-based (irreversible) CYP1A2 inhibitor, confirmed via covalent adduct formation with the enzyme. Its inhibitory effect persists after the drug has largely cleared plasma (recovery requires new enzyme synthesis, not just methoxsalen's own elimination), which is the opposite behavior of what this model's competitive-Ki system assumes. System ties inhibition strength directly to the inhibitor's real-time plasma concentration. A real clinical study confirms methoxsalen strongly inhibits caffeine metabolism in humans, so the effect is well-established, just not representable with this mechanism. Bioavailability (F = 0.80) is an estimate, not a directly sourced value, available literature compares formulations to each other (soft vs. hard capsule) rather than to an IV reference, so no absolute bioavailability percentage was found. Vd (1-9 L/kg reported) has an unusually wide range; 4 L/kg was chosen as a rough central estimate, not a literature consensus.",
                info: {
                    route: 'oral administration',
                    metabolism: 'Extensively hepatic; approximately 95% of a dose is excreted as metabolites, with essentially no unchanged drug excreted in urine. Acts as a mechanism-based (irreversible) inhibitor of CYP1A2 via covalent modification of the enzyme.',
                    source: '<a href="https://www.ncbi.nlm.nih.gov/books/NBK304315/" target="_blank">IARC Monograph, Methoxsalen plus UVA</a>;<br>' +
                            '<a href="https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=a6ec8292-9189-4ebd-862a-e1725eb29eef" target="_blank">DailyMed label, Methoxsalen Soft Gelatin Capsules</a>;<br>' +
                            '<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8116649/" target="_blank">Irreversible CYP1A2 inhibition mechanism (adduct formation)</a>;<br>' +
                            '<a href="https://pubmed.ncbi.nlm.nih.gov/3690940/" target="_blank">Methoxsalen is a potent inhibitor of caffeine metabolism in humans</a>',
                    compartments: [
                        {label: 'GI tract', caption: 'dose enters here'},
                        {label: 'blood', caption: 'measured concentration', highlight: true},
                        {label: 'eliminated', caption: 'excreted or metabolized'}
                    ],
                    rateLabels: ['ka', 'ke']
                },
                ready: false,
                listed: false
            },

            capmatinib: {
                label: 'capmatinib',
                category: 'antineoplastic',
                F: 0.50,
                ka: 2.1,
                halfLife: 6.5,
                vd: 3.35,
                defaultDose: 400,
                doseUnit: 'mg',
                doseLabel: 'capmatinib dose (mg)',
                color: '#5C4A7A',
                model: 'oralFirstOrder',
                ranges: {},
                caveat: "Bioavailability (F = 0.50) uses a mass-balance-derived fraction absorbed (49.6%) from a healthy-volunteer ADME study; the FDA label separately cites absorption of a single 400-mg dose as >70%. Vd (3.35 L/kg) was back-calculated from the same study's reported Vz/F (473 L) by multiplying back through that study's own F value, avoiding double-count bioavailability. Ki (3.2 mg/L) was back-calculated using this model's own competitive-inhibition formula, capmatinib's FDA-label caffeine AUC data (134% increase at steady state), and caffeine's existing enzymeReliance value.",
                info: {
                    route: 'oral administration',
                    metabolism: 'Primarily metabolized by CYP3A4 and aldehyde oxidase; not itself meaningfully cleared via CYP1A2. Acts as a moderate, reversible/competitive CYP1A2 inhibitor.',
                    source: '<a href="https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/213591s007lbl.pdf" target="_blank">FDA label, TABRECTA (capmatinib)</a>;<br>' +
                            '<a href="https://dmd.aspetjournals.org/article/S0090-9556(24)08007-3/fulltext" target="_blank">ADME of Capmatinib in Healthy Male Volunteers</a>;<br>' +
                            '<a href="https://onlinelibrary.wiley.com/doi/10.1111/cas.14254" target="_blank">Phase 1 study, steady-state Cmax at 400mg BID</a>',
                    compartments: [
                        {label: 'GI tract', caption: 'dose enters here'},
                        {label: 'blood', caption: 'measured concentration', highlight: true},
                        {label: 'eliminated', caption: 'excreted or metabolized'}
                    ],
                    rateLabels: ['ka', 'ke']
                },
                inhibits: {
                    CYP1A2: {Ki: 3.2}
                },
                ready: true
            },

            vemurafenib: {
                label: 'vemurafenib',
                category: 'antineoplastic',
                F: 0.578,
                ka: 1.65,
                halfLife: 57,
                vd: 1.51,
                defaultDose: 960,
                doseUnit: 'mg',
                doseLabel: 'vemurafenib dose (mg)',
                color: '#3D5C4A',
                model: 'oralFirstOrder',
                ranges: {},
                caveat: "Bioavailability (F = 0.578) comes from a dedicated absolute-bioavailability study, but the FDA label itself states vemurafenib's bioavailability has not been determined. Half-life (57h) reflects steady-state, multiple-dose kinetics; the single-dose half-life is much shorter (25h), meaning this model is more accurate for someone already on chronic dosing than for a single first dose. Ki (33.7 mg/L) was back-calculated the same way as capmatinib's, using this model's competitive-inhibition formula, vemurafenib's FDA-label caffeine interaction data (2.6-fold AUC increase at steady state), and caffeine's existing enzymeReliance value.",
                info: {
                    route: 'oral administration',
                    metabolism: 'Primarily hepatic, predominantly via CYP3A4, with minimal unchanged drug in urine. Acts as a moderate, reversible/competitive CYP1A2 inhibitor and a CYP3A4 inducer.',
                    source: '<a href="https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/202429s019lbl.pdf" target="_blank">FDA label, ZELBORAF (vemurafenib)</a>;<br>' +
                            '<a href="https://link.springer.com/article/10.1007/s40262-017-0523-7" target="_blank">Clinical Pharmacokinetics of Vemurafenib, Clin Pharmacokinet 2017</a>;<br>' +
                            '<a href="https://www.researchgate.net/publication/314197019_Clinical_Pharmacokinetics_of_Vemurafenib" target="_blank">Absolute bioavailability study (IV microdose)</a>',
                    compartments: [
                        {label: 'GI tract', caption: 'dose enters here'},
                        {label: 'blood', caption: 'measured concentration', highlight: true},
                        {label: 'eliminated', caption: 'excreted or metabolized'}
                    ],
                    rateLabels: ['ka', 'ke']
                },
                inhibits: {
                    CYP1A2: {Ki: 33.7}
                },
                ready: true
            },
       };