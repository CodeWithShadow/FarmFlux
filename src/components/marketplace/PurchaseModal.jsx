import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, CreditCard, ShoppingBag } from 'lucide-react';
import useStore from '../../store/useStore';

export default function PurchaseModal({ listing, onClose, onComplete }) {
    const { user } = useStore();
    const [status, setStatus] = useState('confirm'); // confirm | processing | success

    if (!listing) return null;

    const handleConfirm = async () => {
        setStatus('processing');
        // Simulate network request for 1.5 seconds
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setStatus('success');
    };

    const handleClose = () => {
        if (status === 'success') {
            onComplete(listing.id);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={status !== 'processing' ? handleClose : undefined}>
            <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                className="bg-farm-bg-secondary border border-farm-border rounded-xl p-6 w-full max-w-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {status === 'confirm' && (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-syne font-bold text-xl text-farm-text flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-farm-accent" />
                                Checkout (Test Mode)
                            </h2>
                            <button onClick={handleClose} className="text-farm-text-muted hover:text-farm-text transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                            <div className="bg-farm-bg p-4 rounded-lg border border-farm-border">
                                <h3 className="text-farm-text font-bold text-lg">{listing.crop_name}</h3>
                                <p className="text-farm-text-secondary text-sm">Seller: {listing.seller_name}</p>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-farm-text-muted">Quantity</span>
                                <span className="text-farm-text font-medium">{listing.quantity} {listing.unit || 'kg'}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-farm-text-muted">Location</span>
                                <span className="text-farm-text font-medium">{listing.location || 'India'}</span>
                            </div>
                            
                            <div className="border-t border-farm-border pt-4 mt-4 flex justify-between items-center">
                                <span className="text-farm-text font-bold">Total Price</span>
                                <span className="text-farm-accent font-mono text-xl font-bold">₹{listing.price?.toLocaleString()}</span>
                            </div>
                        </div>

                        {!user && (
                            <p className="text-sm text-farm-warning mb-4">
                                You are not logged in. You can still test this flow locally.
                            </p>
                        )}
                        
                        <div className="flex gap-3">
                            <button onClick={handleClose} className="flex-1 py-3 bg-farm-bg border border-farm-border text-farm-text rounded-lg hover:border-farm-text-muted transition-colors font-dm font-medium">
                                Cancel
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleConfirm}
                                className="flex-1 py-3 bg-farm-accent text-farm-bg font-syne font-bold rounded-lg flex items-center justify-center gap-2"
                            >
                                <CreditCard className="w-4 h-4" />
                                Buy Now
                            </motion.button>
                        </div>
                    </>
                )}

                {status === 'processing' && (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 border-4 border-farm-border border-t-farm-accent rounded-full animate-spin"></div>
                        <p className="text-farm-text font-syne font-bold text-lg animate-pulse">Processing Mock Transaction...</p>
                        <p className="text-farm-text-muted text-sm font-dm">Simulating gateway connection</p>
                    </div>
                )}

                {status === 'success' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-8 flex flex-col items-center justify-center space-y-4 text-center"
                    >
                        <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            transition={{ type: 'spring', delay: 0.2 }}
                            className="w-16 h-16 bg-farm-accent/20 rounded-full flex items-center justify-center text-farm-accent mb-2"
                        >
                            <CheckCircle className="w-8 h-8" />
                        </motion.div>
                        <h2 className="text-farm-text font-syne font-bold text-2xl">Purchase Successful!</h2>
                        <p className="text-farm-text-secondary font-dm text-sm mb-6">
                            This was a simulated transaction. In a real environment, the seller would be notified and funds transferred.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleClose}
                            className="w-full py-3 bg-farm-accent text-farm-bg font-syne font-bold rounded-lg"
                        >
                            Continue Browsing
                        </motion.button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
