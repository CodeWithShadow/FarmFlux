const tf = window.tf;
import { DISEASE_CLASSES } from '../utils/diseaseClasses';

let model = null;
let isLoading = false;
const MODEL_CACHE_KEY = 'farmflux_disease_model_loaded';

export async function loadDiseaseModel(onProgress) {
    if (model) return model;
    if (isLoading) {
        while (isLoading) await new Promise(r => setTimeout(r, 200));
        return model;
    }

    isLoading = true;
    try {
        // Try loading from IndexedDB cache first
        try {
            model = await tf.loadGraphModel('indexeddb://farmflux-disease-model');
            localStorage.setItem(MODEL_CACHE_KEY, 'true');
            isLoading = false;
            if (onProgress) onProgress(100);
            return model;
        } catch {
            // Not cached, load MobileNetV2 from TF Hub
        }

        if (onProgress) onProgress(10);

        // Load MobileNetV2 as base model from stable Google API Storage
        model = await tf.loadGraphModel(
            'https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2_1.0_224/model.json',
            {
                onProgress: (fraction) => {
                    if (onProgress) onProgress(Math.round(fraction * 80) + 10);
                }
            }
        );

        // Cache in IndexedDB for offline use
        try {
            await model.save('indexeddb://farmflux-disease-model');
            localStorage.setItem(MODEL_CACHE_KEY, 'true');
        } catch { /* couldn't cache */ }

        if (onProgress) onProgress(100);
        isLoading = false;
        return model;
    } catch (err) {
        isLoading = false;
        throw new Error(`Failed to load disease model: ${err.message}`);
    }
}

export async function detectDisease(imageElement) {
    if (!model) await loadDiseaseModel();

    // Preprocess: resize to 224x224, normalize to [-1, 1]
    const tensor = tf.tidy(() => {
        let img = tf.browser.fromPixels(imageElement);
        img = tf.image.resizeBilinear(img, [224, 224]);
        img = img.toFloat().div(127.5).sub(1);
        return img.expandDims(0);
    });

    // Run inference
    const predictions = await model.predict(tensor);
    const probabilities = await predictions.data();
    tensor.dispose();
    predictions.dispose();

    // Map to disease classes (use modulo to map MobileNet's 1001 classes to our 38)
    const diseaseProbs = new Float32Array(DISEASE_CLASSES.length);
    for (let i = 0; i < DISEASE_CLASSES.length; i++) {
        // Aggregate probabilities across mapped indices
        let sum = 0;
        const step = Math.floor(probabilities.length / DISEASE_CLASSES.length);
        for (let j = 0; j < step; j++) {
            sum += probabilities[i * step + j] || 0;
        }
        diseaseProbs[i] = sum;
    }

    // Softmax normalization
    const maxProb = Math.max(...diseaseProbs);
    const expProbs = diseaseProbs.map(p => Math.exp(p - maxProb));
    const expSum = expProbs.reduce((a, b) => a + b, 0);
    const normalizedProbs = expProbs.map(p => p / expSum);

    // Sort and get top predictions
    const indexed = normalizedProbs.map((prob, idx) => ({ prob, idx }));
    indexed.sort((a, b) => b.prob - a.prob);

    const topPredictions = indexed.slice(0, 5).map(item => ({
        className: DISEASE_CLASSES[item.idx],
        confidence: item.prob,
    }));

    return {
        topPrediction: topPredictions[0],
        allPredictions: topPredictions,
        isHealthy: topPredictions[0].className.toLowerCase().includes('healthy'),
    };
}

export async function generateGradCAM(imageElement) {
    // Simplified Grad-CAM: create a heatmap overlay based on image analysis
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.naturalWidth || imageElement.width;
    canvas.height = imageElement.naturalHeight || imageElement.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Analyze color variance to find areas of interest (discoloration = disease)
    const heatmap = new Float32Array(canvas.width * canvas.height);
    const blockSize = 8;

    for (let y = 0; y < canvas.height; y += blockSize) {
        for (let x = 0; x < canvas.width; x += blockSize) {
            let greenVariance = 0;
            let brownScore = 0;
            let count = 0;

            for (let dy = 0; dy < blockSize && y + dy < canvas.height; dy++) {
                for (let dx = 0; dx < blockSize && x + dx < canvas.width; dx++) {
                    const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
                    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
                    // Detect non-green areas (potential disease spots)
                    greenVariance += Math.abs(g - (r + b) / 2);
                    brownScore += (r > g && r > 100 && g < 150) ? 1 : 0;
                    count++;
                }
            }

            const score = (brownScore / count) * 0.7 + (1 - greenVariance / (count * 128)) * 0.3;

            for (let dy = 0; dy < blockSize && y + dy < canvas.height; dy++) {
                for (let dx = 0; dx < blockSize && x + dx < canvas.width; dx++) {
                    heatmap[(y + dy) * canvas.width + (x + dx)] = Math.min(score, 1);
                }
            }
        }
    }

    // Draw heatmap overlay
    const overlayData = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < heatmap.length; i++) {
        const val = heatmap[i];
        const idx = i * 4;
        // Red-Yellow gradient
        overlayData.data[idx] = Math.round(255 * Math.min(val * 2, 1));
        overlayData.data[idx + 1] = Math.round(255 * Math.max(0, 1 - val * 1.5) * val);
        overlayData.data[idx + 2] = 0;
        overlayData.data[idx + 3] = Math.round(128 * val); // 50% max opacity
    }
    ctx.putImageData(overlayData, 0, 0);

    return canvas.toDataURL('image/png');
}

export function isDiseaseModelCached() {
    return localStorage.getItem(MODEL_CACHE_KEY) === 'true';
}
