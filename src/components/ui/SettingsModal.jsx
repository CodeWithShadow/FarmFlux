import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Info, ExternalLink, Save, Check } from 'lucide-react';
import useStore from '../../store/useStore';

export default function SettingsModal({ isOpen, onClose }) {
    const { geminiApiKey, setGeminiApiKey } = useStore();
    const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey);
    const [saved, setSaved] = useState(false);

    if (!isOpen) return null;

    const handleSave = () => {
        setGeminiApiKey(apiKeyInput.trim());
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        setTimeout(() => onClose(), 2500);
    };

    const handleClear = () => {
        setApiKeyInput('');
        setGeminiApiKey('');
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 30 }}
                    className="bg-farm-bg-secondary border border-farm-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between p-6 border-b border-farm-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-farm-accent/20 flex items-center justify-center text-farm-accent">
                                <Key className="w-5 h-5" />
                            </div>
                            <h2 className="font-syne font-bold text-xl text-farm-text">Settings</h2>
                        </div>
                        <button onClick={onClose} className="p-2 text-farm-text-muted hover:text-farm-text hover:bg-farm-card rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <label className="text-xs text-farm-text-muted uppercase tracking-wider font-mono mb-2 block focus:text-farm-accent transition-colors">
                                Gemini API Key (Optional)
                            </label>
                            <input
                                type="password"
                                value={apiKeyInput}
                                onChange={(e) => setApiKeyInput(e.target.value)}
                                placeholder="AIza... (Leave blank to use default)"
                                className="w-full px-4 py-3 bg-farm-bg border border-farm-border rounded-lg text-farm-text font-dm text-sm focus:border-farm-accent focus:ring-1 focus:ring-farm-accent transition-all input-animated"
                            />
                            
                            <div className="mt-4 p-4 rounded-lg bg-farm-card/50 border border-farm-border/50 flex gap-3 text-sm">
                                <Info className="w-5 h-5 text-farm-accent flex-shrink-0 mt-0.5" />
                                <div className="space-y-2 text-farm-text-secondary">
                                    <p>
                                        The app will use its default API key. However, if the default key is rate-limited or fails, AI features (Yield Prediction, Irrigation, Urban Farming, Marketplace) may not work.
                                    </p>
                                    <p>
                                        You can provide your own free Gemini API key to ensure these features always work. Your key is stored locally in your browser and never sent to our servers.
                                    </p>
                                    <a 
                                        href="https://aistudio.google.com/app/apikey" 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-farm-accent hover:underline font-medium mt-1"
                                    >
                                        Get a free API key <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-farm-bg border-t border-farm-border">
                        {apiKeyInput ? (
                            <button 
                                onClick={handleClear}
                                className="text-sm font-dm text-farm-danger hover:underline px-2"
                            >
                                Clear Key
                            </button>
                        ) : <div></div>}
                        
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg font-dm text-sm text-farm-text-secondary hover:text-farm-text transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-syne font-bold text-sm transition-all shadow-md ${
                                    saved ? 'bg-farm-success text-white' : 'bg-farm-accent text-farm-bg hover:shadow-lg hover:-translate-y-0.5'
                                }`}
                            >
                                {saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save</>}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
