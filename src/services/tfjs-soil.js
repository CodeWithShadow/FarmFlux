const tf = window.tf;
import { SOIL_CLASSES } from '../utils/soilClasses';

let model = null;
let isLoading = false;

export async function loadSoilModel(onProgress) {
    if (model) return model;
    if (isLoading) {
        while (isLoading) await new Promise(r => setTimeout(r, 200));
        return model;
    }

    isLoading = true;
    try {
        try {
            model = await tf.loadGraphModel('indexeddb://farmflux-soil-model');
            isLoading = false;
            if (onProgress) onProgress(100);
            return model;
        } catch { /* not cached */ }

        if (onProgress) onProgress(10);

        model = await tf.loadGraphModel(
            'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/classification/3/default/1',
            {
                fromTFHub: true,
                onProgress: (fraction) => {
                    if (onProgress) onProgress(Math.round(fraction * 80) + 10);
                }
            }
        );

        try {
            await model.save('indexeddb://farmflux-soil-model');
        } catch { /* couldn't cache */ }

        if (onProgress) onProgress(100);
        isLoading = false;
        return model;
    } catch (err) {
        isLoading = false;
        throw new Error(`Failed to load soil model: ${err.message}`);
    }
}

export async function classifySoil(imageElement) {
    if (!model) await loadSoilModel();

    const tensor = tf.tidy(() => {
        let img = tf.browser.fromPixels(imageElement);
        img = tf.image.resizeBilinear(img, [224, 224]);
        img = img.toFloat().div(127.5).sub(1);
        return img.expandDims(0);
    });

    const predictions = await model.predict(tensor);
    const probabilities = await predictions.data();
    tensor.dispose();
    predictions.dispose();

    // Map ImageNet outputs to soil classes
    const soilProbs = new Float32Array(SOIL_CLASSES.length);
    for (let i = 0; i < SOIL_CLASSES.length; i++) {
        let sum = 0;
        const step = Math.floor(probabilities.length / SOIL_CLASSES.length);
        for (let j = 0; j < step; j++) {
            sum += probabilities[i * step + j] || 0;
        }
        soilProbs[i] = sum;
    }

    const maxProb = Math.max(...soilProbs);
    const expProbs = soilProbs.map(p => Math.exp(p - maxProb));
    const expSum = expProbs.reduce((a, b) => a + b, 0);
    const normalizedProbs = expProbs.map(p => p / expSum);

    const indexed = normalizedProbs.map((prob, idx) => ({ prob, idx }));
    indexed.sort((a, b) => b.prob - a.prob);

    const topSoilType = SOIL_CLASSES[indexed[0].idx];

    // Generate soil composition based on classified type
    const compositions = getSoilComposition(topSoilType.name);

    return {
        soilType: topSoilType,
        confidence: indexed[0].prob,
        allPredictions: indexed.slice(0, 5).map(item => ({
            ...SOIL_CLASSES[item.idx],
            confidence: item.prob,
        })),
        composition: compositions,
        phEstimate: topSoilType.phRange,
        nutrients: topSoilType.nutrients,
    };
}

function getSoilComposition(soilName) {
    const compositions = {
        'Alluvial Soil': { sand: 40, silt: 40, clay: 20, organic: 5 },
        'Black Cotton Soil': { sand: 20, silt: 30, clay: 45, organic: 8 },
        'Red Soil': { sand: 55, silt: 20, clay: 20, organic: 3 },
        'Laterite Soil': { sand: 60, silt: 15, clay: 22, organic: 2 },
        'Sandy Soil': { sand: 80, silt: 10, clay: 5, organic: 2 },
        'Clay Soil': { sand: 15, silt: 25, clay: 55, organic: 6 },
        'Loamy Soil': { sand: 35, silt: 35, clay: 20, organic: 8 },
        'Peaty Soil': { sand: 20, silt: 25, clay: 15, organic: 35 },
        'Saline Soil': { sand: 45, silt: 30, clay: 20, organic: 3 },
        'Mountain Soil': { sand: 50, silt: 25, clay: 15, organic: 10 },
    };
    return compositions[soilName] || { sand: 40, silt: 30, clay: 20, organic: 5 };
}
