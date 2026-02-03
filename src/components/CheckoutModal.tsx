import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CreditCard, Truck, User, MapPin, ArrowRight, Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'details' | 'payment' | 'confirming';

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
    const [step, setStep] = useState<Step>('details');
    const { items, getSubtotal, clearCart } = useCartStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        notes: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const subtotal = getSubtotal();
    const deliveryFee = 150;
    const total = subtotal + deliveryFee;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('payment');
    };

    const handlePlaceOrder = async () => {
        setIsSubmitting(true);
        setStep('confirming');

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 3000));

            toast.success('Order Placed Successfully!', {
                description: `Your order for Rs ${total.toLocaleString()} is being prepared.`,
            });
            // Cart will be cleared when user clicks "Track Your Order" or closes the modal from success state
        } catch (error) {
            toast.error('Failed to place order', {
                description: 'Please try again later.',
            });
            setStep('payment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (isSubmitting) return;
        if (step === 'confirming' && !isSubmitting) {
            clearCart();
            setStep('details');
        }
        onClose();
    };

    if (items.length === 0 && step !== 'confirming') return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-foreground/60 backdrop-blur-md z-[60]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 md:inset-4 lg:inset-10 xl:inset-20 z-[70] bg-background rounded-none md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
                    >
                        {/* Left Side: Order Summary (Visible on Desktop) */}
                        <div className="hidden md:flex md:w-1/3 bg-muted/30 border-r border-border p-8 flex-col">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-glow">
                                    <ShoppingBag className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-heading text-xl font-bold">Order Summary</h3>
                                    <p className="text-sm text-muted-foreground">{items.length} items from Backyard Grill</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border">
                                            <img src={item.menuItem.image} alt={item.menuItem.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm truncate">{item.menuItem.name}</h4>
                                            <div className="flex flex-col text-xs text-muted-foreground">
                                                <span>Qty: {item.quantity}</span>
                                                {item.selectedWeight && <span>Weight: {item.selectedWeight} Kg</span>}
                                            </div>
                                            <p className="text-sm font-bold text-primary mt-1">Rs {item.totalPrice.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-border space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>Rs {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Delivery Fee</span>
                                    <span>Rs {deliveryFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold pt-2 border-t border-dashed border-border">
                                    <span>Total</span>
                                    <span className="text-primary">Rs {total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Flow */}
                        <div className="flex-1 flex flex-col relative">
                            {/* Header */}
                            <div className="p-6 md:p-8 border-b border-border flex items-center justify-between">
                                <div>
                                    <h2 className="font-heading text-2xl md:text-3xl font-bold">Checkout</h2>
                                    {step !== 'confirming' && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                            <span className={step === 'details' ? 'text-primary font-bold' : ''}>1. Details</span>
                                            <ArrowRight className="w-3 h-3" />
                                            <span className={step === 'payment' ? 'text-primary font-bold' : ''}>2. Payment</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="w-12 h-12 rounded-2xl hover:bg-muted flex items-center justify-center transition-colors group"
                                    disabled={isSubmitting}
                                >
                                    <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                                {step === 'details' && (
                                    <motion.form
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        id="checkout-details"
                                        onSubmit={handleDetailsSubmit}
                                        className="space-y-6 max-w-lg mx-auto"
                                    >
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-bold flex items-center gap-2">
                                                <User className="w-5 h-5 text-primary" />
                                                Personal Information
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input id="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Ali" className="h-12" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input id="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Khan" className="h-12" required />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+92 300 1234567" className="h-12" required />
                                        </div>

                                        <div className="pt-4 space-y-2 border-t border-border">
                                            <h3 className="text-lg font-bold flex items-center gap-2">
                                                <MapPin className="w-5 h-5 text-primary" />
                                                Delivery Address
                                            </h3>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Full Address</Label>
                                            <Input id="address" value={formData.address} onChange={handleInputChange} placeholder="House #, Street, Block, Area" className="h-12" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                                            <Input id="notes" value={formData.notes} onChange={handleInputChange} placeholder="e.g. Near Blue Mosque, Ring the bell" className="h-12" />
                                        </div>
                                    </motion.form>
                                )}

                                {step === 'payment' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-8 max-w-lg mx-auto"
                                    >
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-bold flex items-center gap-2">
                                                <CreditCard className="w-5 h-5 text-primary" />
                                                Choose Payment Method
                                            </h3>
                                            <p className="text-sm text-muted-foreground">Select how you'd like to pay for your order</p>
                                        </div>

                                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 gap-4">
                                            {[
                                                { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your food arrives', icon: Truck },
                                                { id: 'card', label: 'Credit/Debit Card', desc: 'Securely pay via card', icon: CreditCard },
                                                { id: 'transfer', label: 'Bank Transfer', desc: 'Direct bank account payment', icon: Check },
                                            ].map((method) => (
                                                <Label
                                                    key={method.id}
                                                    htmlFor={method.id}
                                                    className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all hover:bg-muted/50 ${paymentMethod === method.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-border'}`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <RadioGroupItem value={method.id} id={method.id} />
                                                        <div>
                                                            <p className="font-bold">{method.label}</p>
                                                            <p className="text-xs text-muted-foreground">{method.desc}</p>
                                                        </div>
                                                    </div>
                                                    <method.icon className="w-6 h-6 text-primary" />
                                                </Label>
                                            ))}
                                        </RadioGroup>
                                    </motion.div>
                                )}

                                {step === 'confirming' && (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                        {isSubmitting ? (
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                                                    <Loader2 className="w-10 h-10 text-primary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                                </div>
                                                <h3 className="text-2xl font-bold">Placing Your Order...</h3>
                                                <p className="text-muted-foreground">Hold tight, {formData.firstName}, your delicious meal is just a few steps away!</p>
                                            </div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="space-y-6"
                                            >
                                                <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-success/10">
                                                    <Check className="w-12 h-12 text-success" />
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl font-bold mb-2">Order Confirmed!</h3>
                                                    <p className="text-muted-foreground max-w-md mx-auto">
                                                        Thank you {formData.firstName}! your order #BG-{Math.floor(1000 + Math.random() * 9000)} has been received and is being prepared for delivery to {formData.address}.
                                                    </p>
                                                </div>
                                                <Button
                                                    className="h-14 px-8 rounded-2xl shadow-glow gap-2 text-lg"
                                                    onClick={handleClose}
                                                >
                                                    Track Your Order
                                                    <ArrowRight className="w-5 h-5" />
                                                </Button>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {step !== 'confirming' && (
                                <div className="p-6 md:p-8 border-t border-border bg-muted/10 backdrop-blur-sm">
                                    <div className="md:hidden flex justify-between items-center mb-6">
                                        <span className="text-muted-foreground">Order Total (Incl. Delivery)</span>
                                        <span className="text-2xl font-bold text-primary">Rs {total.toLocaleString()}</span>
                                    </div>

                                    <div className="flex gap-4 max-w-lg mx-auto">
                                        {step === 'payment' && (
                                            <Button
                                                variant="outline"
                                                className="flex-1 h-14 rounded-2xl text-lg"
                                                onClick={() => setStep('details')}
                                                disabled={isSubmitting}
                                            >
                                                Back
                                            </Button>
                                        )}
                                        <Button
                                            className="flex-[2] h-14 gap-2 text-lg shadow-glow rounded-2xl"
                                            onClick={step === 'details' ? () => document.getElementById('checkout-details')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })) : handlePlaceOrder}
                                            disabled={isSubmitting}
                                        >
                                            {step === 'details' ? (
                                                <>
                                                    Continue to Payment
                                                    <ArrowRight className="w-5 h-5" />
                                                </>
                                            ) : (
                                                <>
                                                    Place Order • Rs {total.toLocaleString()}
                                                    <Check className="w-5 h-5" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
