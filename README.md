# Pharmacokinetics Visualizer
Interactive tool for visualizing drug concentration over time. Models various drugs using published PK parameters and RK4 numerical integration. Adjustable body weight and dose inputs, with therapeutic, toxic, and lethal threshold markers. Built for educational exploration only.
# Limitations
This project was built by a high school student for educational exploration and personal learning. Please read the following before using this tool:
Accuracy: Pharmacokinetic parameters (absorption rates, elimination constants, volume of distribution, bioavailability, thresholds) were sourced from publicly available literature. Some values may be incomplete, outdated, or sourced from studies with small sample sizes. I am not a pharmacologist, clinician, or certified medical professional.
Simplified models: Some drugs deviate from first-order elimination at higher doses, shifting toward zero-order or Michaelis-Menten kinetics. Where full parameter data was unavailable or behind paywalls, simpler models were used. This means accuracy decreases at higher dose ranges.
Individual variation: Body weight is adjustable, but many other factors affecting drug concentration — liver function, kidney function, genetic metabolism differences, tolerance, food intake, drug interactions, and more — are not modeled.
Thresholds: Therapeutic, toxic, and lethal thresholds vary widely across published sources and between individuals. The values used here are rough reference points, not reliable clinical predictors.
Not medical advice: This tool must not be used for any clinical, medical, or safety decisions. It is for educational exploration only.
