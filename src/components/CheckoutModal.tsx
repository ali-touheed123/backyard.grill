import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, CreditCard, Truck, User, MapPin, ArrowRight, Loader2, ShoppingBag, ChevronLeft, Search } from 'lucide-react';
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
                        <div className="hidden md:flex md:w-80 lg:w-96 bg-muted/20 border-r border-border p-8 flex-col relative overflow-hidden">
                            {/* Decorative Background Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
                                <Search className="absolute -top-10 -right-10 w-40 h-40 rotate-12" />
                                <ShoppingBag className="absolute -bottom-10 -left-10 w-40 h-40 -rotate-12" />
                            </div>

                            <div className="relative z-10 flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-glow shrink-0">
                                    <ShoppingBag className="w-7 h-7 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-heading text-2xl font-bold tracking-tight">Your Order</h3>
                                    <p className="text-sm text-muted-foreground whitespace-nowrap">
                                        {items.length} {items.length === 1 ? 'item' : 'items'} from Backyard Grill
                                    </p>
                                </div>
                            </div>

                            <div className="relative z-10 flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-hide">
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex gap-4 group"
                                    >
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-border/50 shadow-sm group-hover:shadow-md transition-shadow">
                                            <img src={item.menuItem.image} alt={item.menuItem.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <h4 className="font-bold text-base truncate group-hover:text-primary transition-colors">{item.menuItem.name}</h4>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1">
                                                    <span className="w-1 h-1 rounded-full bg-primary/40" />
                                                    Qty: {item.quantity}
                                                </span>
                                                {item.selectedWeight && (
                                                    <span className="flex items-center gap-1">
                                                        <span className="w-1 h-1 rounded-full bg-primary/40" />
                                                        {item.selectedWeight} Kg
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-base font-bold text-primary mt-1">Rs {item.totalPrice.toLocaleString()}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="relative z-10 mt-8 space-y-4">
                                <div className="p-6 bg-background/50 rounded-3xl border border-border/50 backdrop-blur-sm shadow-sm space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Items Total</span>
                                        <span className="font-medium">Rs {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">Delivery</span>
                                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">Fast</span>
                                        </div>
                                        <span className="font-medium">Rs {deliveryFee.toLocaleString()}</span>
                                    </div>
                                    <div className="pt-3 mt-3 border-t border-dashed border-border flex justify-between items-baseline">
                                        <span className="font-heading font-bold text-xl">Grand Total</span>
                                        <div className="text-right">
                                            <span className="block text-2xl font-heading font-black text-primary">Rs {total.toLocaleString()}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Incl. all taxes</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Flow */}
                        <div className="flex-1 flex flex-col min-h-0 relative bg-background h-full">
                            {/* Header */}
                            <div className="p-6 md:p-8 border-b border-border/50 flex items-center justify-between shrink-0">
                                <div>
                                    <h2 className="font-heading text-3xl font-bold tracking-tight">Checkout</h2>
                                    {step !== 'confirming' && (
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 'details' ? 'bg-primary text-primary-foreground' : 'bg-success text-success-foreground'}`}>
                                                    {step === 'details' ? '1' : <Check className="w-3 h-3" />}
                                                </div>
                                                <span className={`text-sm font-semibold ${step === 'details' ? 'text-foreground' : 'text-muted-foreground text-success'}`}>Details</span>
                                            </div>
                                            <div className="w-8 h-[2px] bg-border rounded-full" />
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                                    2
                                                </div>
                                                <span className={`text-sm font-semibold ${step === 'payment' ? 'text-foreground' : 'text-muted-foreground'}`}>Payment</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="w-12 h-12 rounded-2xl bg-muted/30 hover:bg-muted flex items-center justify-center transition-all group active:scale-95"
                                    disabled={isSubmitting}
                                >
                                    <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                                </button>
                            </div>

                            {/* Content - Fixed Scrolling with min-h-0 */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-10 min-h-0">
                                {step === 'details' && (
                                    <motion.form
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        id="checkout-details"
                                        onSubmit={handleDetailsSubmit}
                                        className="space-y-10 max-w-xl mx-auto"
                                    >
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                                    <User className="w-5 h-5 text-primary" />
                                                </div>
                                                <h3 className="text-xl font-bold tracking-tight">Who's ordering?</h3>
                                            </div>

                                            <div className="bg-muted/30 p-8 rounded-[2rem] border border-border/50 space-y-6">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="firstName" className="text-sm font-bold ml-1">First Name</Label>
                                                        <Input id="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Ali" className="h-14 bg-background border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-base" required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="lastName" className="text-sm font-bold ml-1">Last Name</Label>
                                                        <Input id="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Khan" className="h-14 bg-background border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-base" required />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone" className="text-sm font-bold ml-1">Phone Number</Label>
                                                    <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+92 300 1234567" className="h-14 bg-background border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-base" required />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                                    <MapPin className="w-5 h-5 text-primary" />
                                                </div>
                                                <h3 className="text-xl font-bold tracking-tight">Delivery Address</h3>
                                            </div>

                                            <div className="bg-muted/30 p-8 rounded-[2rem] border border-border/50 space-y-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="address" className="text-sm font-bold ml-1">Full Address</Label>
                                                    <Input id="address" value={formData.address} onChange={handleInputChange} placeholder="House #, Street, Block, Area" className="h-14 bg-background border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-base" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="notes" className="text-sm font-bold ml-1">Delivery Notes (Optional)</Label>
                                                    <Input id="notes" value={formData.notes} onChange={handleInputChange} placeholder="e.g. Near Blue Mosque, Ring the bell" className="h-14 bg-background border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-base" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.form>
                                )}

                                {step === 'payment' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-10 max-w-xl mx-auto"
                                    >
                                        <div className="space-y-2 text-center text items-center justify-center flex flex-col">
                                            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-4">
                                                <CreditCard className="w-8 h-8 text-primary" />
                                            </div>
                                            <h3 className="text-2xl font-bold tracking-tight">Payment Method</h3>
                                            <p className="text-muted-foreground">Select how you'd like to pay for your order</p>
                                        </div>

                                        <RadioGroup value={paymentMethod} onValueChange={(val) => {
                                            if (val === 'card' || val === 'transfer') {
                                                toast.info(`${val === 'card' ? 'Debit/Credit Card' : 'Bank Transfer'} Coming Soon!`, {
                                                    description: "We are currently only accepting Cash on Delivery for the best service experience.",
                                                    icon: <Check className="w-5 h-5 text-primary" />
                                                });
                                                return;
                                            }
                                            setPaymentMethod(val);
                                        }} className="grid grid-cols-1 gap-5 pb-10">
                                            {[
                                                { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your food arrives', icon: Truck, soon: false },
                                                { id: 'card', label: 'Credit/Debit Card', desc: 'Securely pay via card', icon: CreditCard, soon: true },
                                                { id: 'transfer', label: 'Bank Transfer', desc: 'Direct bank account payment', icon: Check, soon: true },
                                            ].map((method) => (
                                                <Label
                                                    key={method.id}
                                                    htmlFor={method.id}
                                                    className={`group relative flex items-center justify-between p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 active:scale-[0.98] ${paymentMethod === method.id
                                                        ? 'border-primary bg-primary/[0.03] shadow-lg shadow-primary/5'
                                                        : method.soon ? 'border-border opacity-60 hover:opacity-100 hover:border-primary/30' : 'border-border hover:bg-muted/30 hover:border-primary/30'}`}
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className="relative">
                                                            <RadioGroupItem value={method.id} id={method.id} disabled={method.soon} className="w-5 h-5 border-2 border-primary" />
                                                            {method.soon && <div className="absolute inset-0 bg-background/50 cursor-not-allowed" />}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-bold text-lg">{method.label}</p>
                                                                {method.soon && (
                                                                    <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Soon</span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">{method.desc}</p>
                                                        </div>
                                                    </div>
                                                    <method.icon className={`w-8 h-8 transition-transform group-hover:scale-110 ${paymentMethod === method.id ? 'text-primary' : 'text-muted-foreground'}`} />
                                                </Label>
                                            ))}
                                        </RadioGroup>
                                    </motion.div>
                                )}

                                {step === 'confirming' && (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                        {isSubmitting ? (
                                            <div className="space-y-6">
                                                <div className="relative flex justify-center">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                        className="w-32 h-32 border-[6px] border-primary/10 border-t-primary rounded-full"
                                                    />
                                                    <ShoppingBag className="w-12 h-12 text-primary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce-slow" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-3xl font-bold tracking-tight">Placing Order...</h3>
                                                    <p className="text-muted-foreground text-lg">Hang tight, {formData.firstName}! Our chefs are ready.</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="space-y-8"
                                            >
                                                <div className="w-28 h-28 bg-success/20 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-success/20 border-4 border-background">
                                                    <Check className="w-14 h-14 text-success" />
                                                </div>
                                                <div className="space-y-3">
                                                    <h3 className="text-4xl font-heading font-black mb-2">Bon Appétit!</h3>
                                                    <div className="bg-muted/30 p-6 rounded-[2rem] border border-border/50 max-w-md mx-auto">
                                                        <p className="text-muted-foreground text-lg leading-relaxed">
                                                            Order <span className="text-foreground font-black">#BG-{Math.floor(1000 + Math.random() * 9000)}</span> is confirmed!
                                                            We'll bring your meal to <span className="text-foreground font-bold">{formData.address}</span> shortly.
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    className="h-16 px-10 rounded-[2rem] shadow-glow hover:shadow-hero transition-all duration-300 gap-3 text-xl font-bold"
                                                    onClick={handleClose}
                                                >
                                                    Track Your Order
                                                    <ArrowRight className="w-6 h-6" />
                                                </Button>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {step !== 'confirming' && (
                                <div className="p-4 md:p-10 border-t border-border/50 bg-background/80 backdrop-blur-xl z-30 shrink-0">
                                    <div className="md:hidden flex flex-col gap-2 mb-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground font-medium text-sm">Order Total</span>
                                            <span className="text-xl font-black text-primary">Rs {total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 max-w-xl mx-auto items-center">
                                        {step === 'payment' && (
                                            <button
                                                className="h-14 w-14 rounded-2xl bg-muted/50 hover:bg-muted flex items-center justify-center transition-all group shrink-0 active:scale-90"
                                                onClick={() => setStep('details')}
                                                disabled={isSubmitting}
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                        )}
                                        <Button
                                            className="flex-1 h-14 gap-3 text-lg font-bold shadow-glow rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            onClick={step === 'details' ? () => document.getElementById('checkout-details')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })) : handlePlaceOrder}
                                            disabled={isSubmitting}
                                        >
                                            {step === 'details' ? (
                                                <>
                                                    Next: Payment
                                                    <ArrowRight className="w-5 h-5" />
                                                </>
                                            ) : (
                                                <>
                                                    Complete Order • Rs {total.toLocaleString()}
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
