import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee, Utensils, Home as HomeIcon, MapPin,
  Star, Clock, Phone, Mail, Award, Check, Sparkles,
  MessageCircle, Heart, Music, Calendar, Plus, X,
  ChevronRight, ArrowRight, Loader2, ShoppingBag, Eye
} from 'lucide-react';

import Navbar from './components/Navbar';
import PageLoader from './components/PageLoader';
import CustomCursor from './components/CustomCursor';
import { dbService, BookingData } from './services/db';

// Suppress unused import warnings for lucide icons used in data arrays
void Calendar; void ChevronRight; void ArrowRight;

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg className="text-current" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  isSpecial?: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const menuData: MenuItem[] = [
  { id: 'spec-1', name: 'Pasta in Pink Sauce', category: 'Pasta', description: 'Freshly made penne tossed in a rich, creamy blend of tangy tomato and smooth cream cheese sauces, topped with fresh parsley.', price: 250, image: '/pasta_pink_sauce.jpg', isVeg: true, isSpecial: true },
  { id: 'spec-2', name: 'Hazelnut Coffee', category: 'Coffee', description: 'Silky espresso combined with freshly steamed milk and a rich, toasted hazelnut infusion, finished with premium latte art.', price: 160, image: '/hazelnut_coffee.jpg', isVeg: true, isSpecial: true },
  { id: 'spec-3', name: 'Strawberry Mocktail', category: 'Mocktails', description: 'Refreshing layered sparkling mocktail with fresh crushed strawberries, lime juice, mint leaves, and edible rose petals.', price: 150, image: '/strawberry_mocktail_poster.jpg', isVeg: true, isSpecial: true },
  { id: 'spec-4', name: 'Veggie Supreme Pizza', category: 'Pizza', description: 'Thin-crust Neapolitan pizza loaded with red bell peppers, sweet corn, black olives, onions, and jalapeños on a fresh mozzarella base.', price: 280, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', isVeg: true, isSpecial: true },
  { id: 'cof-1', name: 'Vietnam Iced Coffee', category: 'Coffee', description: 'Traditional slow-dripped dark roast coffee sweetened with condensed milk over ice. A bold, velvety pick-me-up.', price: 180, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80', isVeg: true },
  { id: 'cof-2', name: 'Espresso Romano', category: 'Coffee', description: "A double shot of pure espresso served with a fresh slice of lemon on the side, highlighting the coffee's citric acidity.", price: 140, image: 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?auto=format&fit=crop&w=600&q=80', isVeg: true },
  { id: 'cof-3', name: 'Caramel Macchiato', category: 'Coffee', description: 'Steamed milk stained with espresso and sweetened with vanilla syrup, drizzled with thick, buttery caramel sauce.', price: 170, image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80', isVeg: true },
  { id: 'mock-1', name: 'Passionfruit Mojito', category: 'Mocktails', description: 'Exotic passionfruit pulp muddled with fresh mint, lime slices, and sparkling soda. Zesty and tropical.', price: 160, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80', isVeg: true },
  { id: 'mock-2', name: 'Tropical Green Slush', category: 'Mocktails', description: 'A frozen blended blend of fresh green apple juice, kiwi, and lime mint, served chilled in a coupe glass.', price: 150, image: '/slush_drinks.jpg', isVeg: true },
  { id: 'pas-1', name: 'Alfredo Penne White Sauce', category: 'Pasta', description: 'Penne cooked in a rich, buttery, and garlic-infused parmesan cream sauce, garnished with sautéed mushrooms.', price: 240, image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80', isVeg: true },
  { id: 'piz-1', name: 'Paneer Tikka Pizza', category: 'Pizza', description: 'Tandoori spiced paneer cubes, capsicum, red onions, and fresh coriander over a tikka masala infused marinara base.', price: 260, image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80', isVeg: true },
  { id: 'chi-1', name: 'Schezwan Noodles', category: 'Chinese', description: 'Stir-fried Hakka noodles tossed with crunchy vegetables in our fiery in-house Schezwan red pepper sauce.', price: 190, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80', isVeg: true },
  { id: 'san-1', name: 'Pesto Caprese Panini', category: 'Sandwiches', description: 'Artisanal sourdough bread layered with walnut basil pesto, thick buffalo mozzarella, tomatoes, and balsamic reduction.', price: 180, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', isVeg: true },
  { id: 'des-1', name: 'Classic Tiramisu Cup', category: 'Desserts', description: 'Rich layers of espresso-soaked ladyfingers, whipped mascarpone cream cheese, and a heavy dusting of cocoa powder.', price: 220, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80', isVeg: true },
  { id: 'des-2', name: 'Brownie with Ice Cream', category: 'Desserts', description: 'Warm, gooey dark chocolate fudge brownie served on a hot sizzler plate with a scoop of premium vanilla bean gelato.', price: 190, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80', isVeg: true },
];

const experienceCards = [
  { icon: Coffee, title: 'Signature Coffee', desc: 'Crafted with premium travel-sourced single-origin beans, roasted locally for ultimate freshness.' },
  { icon: Utensils, title: 'Chef Specials', desc: 'Curated artisanal menus prepared by award-winning chefs, blending global flavors.' },
  { icon: Sparkles, title: 'Birthday Decoration', desc: 'Beautiful custom table sets with balloons, photo grids, and premium decor plates.' },
  { icon: Heart, title: 'Couple Decoration', desc: 'A romantic setup at our special Couple Corner featuring red balloons and rose petal designs.' },
  { icon: Award, title: 'Party Booking', desc: 'Host high-end corporate events, anniversaries, or private gatherings with ease.' },
  { icon: Music, title: 'Live Music Night', desc: 'Weekly live acoustic sets and soft jazz to elevate your dining experience.' },
];

const galleryImages = [
  { src: '/interior_balloons.jpg', category: 'Interior', title: 'Cosy Warm Seating' },
  { src: '/slush_drinks.jpg', category: 'Drinks', title: 'Frozen Slush Mocktails' },
  { src: '/pasta_pink_sauce.jpg', category: 'Food', title: 'Creamy Pink Penne' },
  { src: '/hazelnut_coffee.jpg', category: 'Drinks', title: 'Premium Hazelnut Latte' },
  { src: '/outdoor_decoration.jpg', category: 'Outdoor Seating', title: 'Romantic Outdoor Space' },
  { src: '/front_exterior_night.jpg', category: 'Interior', title: 'Main Storefront Facade' },
  { src: '/signboard_matte.png', category: 'Events', title: '365 Branding' },
  { src: '/strawberry_mocktail_poster.jpg', category: 'Drinks', title: 'Handcrafted Strawberry Refresher' },
  { src: '/menu_mockup.png', category: 'Food', title: 'Artisanal Travel Menu' },
];

export default function App() {
  const [activeMenuCategory, setActiveMenuCategory] = useState('Coffee');
  const [activeGalleryCategory, setActiveGalleryCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartBadgeAnimation, setCartBadgeAnimation] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingSeating, setBookingSeating] = useState<'indoor' | 'outdoor'>('indoor');
  const [bookingRequest, setBookingRequest] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [liveAvailability, setLiveAvailability] = useState<{ available: boolean; remaining: number }>({ available: true, remaining: 5 });

  useEffect(() => {
    if (bookingDate && bookingTime) {
      dbService.checkAvailability(bookingDate, bookingTime).then(setLiveAvailability);
    }
  }, [bookingDate, bookingTime]);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { ...item, quantity: 1 }];
    });
    setCartBadgeAnimation(true);
    setTimeout(() => setCartBadgeAnimation(false), 300);
  };

  const removeFromCart = (itemId: string) => setCart((prev) => prev.filter((item) => item.id !== itemId));

  const updateQuantity = (itemId: string, amount: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  };

  const getTotalPrice = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone || !bookingEmail || !bookingDate || !bookingTime) {
      setBookingStatus({ success: false, message: 'Please complete all required fields.' });
      return;
    }
    setBookingLoading(true);
    setBookingStatus(null);
    const bookingPayload: BookingData = { name: bookingName, phone: bookingPhone, email: bookingEmail, date: bookingDate, timeSlot: bookingTime, guests: Number(bookingGuests), seatingType: bookingSeating, specialRequest: bookingRequest };
    const res = await dbService.saveBooking(bookingPayload);
    setBookingLoading(false);
    if (res.success) {
      setBookingStatus({ success: true, message: res.message });
      setBookingName(''); setBookingPhone(''); setBookingEmail(''); setBookingDate(''); setBookingRequest('');
      dbService.checkAvailability(bookingDate, bookingTime).then(setLiveAvailability);
    } else {
      setBookingStatus({ success: false, message: res.message });
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
  };

  const menuCategories = ['Coffee', 'Mocktails', 'Pasta', 'Pizza', 'Chinese', 'Sandwiches', 'Desserts'];
  const galleryCategories = ['All', 'Food', 'Drinks', 'Interior', 'Outdoor Seating', 'Events'];
  const filteredMenuItems = menuData.filter((item) => item.category === activeMenuCategory);
  const filteredGalleryItems = activeGalleryCategory === 'All' ? galleryImages : galleryImages.filter((item) => item.category === activeGalleryCategory);

  return (
    <div className="relative min-h-screen bg-background-luxury text-white overflow-x-hidden">
      <PageLoader />
      <CustomCursor />
      <Navbar />

      {/* 1. HERO SECTION */}
      <section id="home" className="relative isolate bg-background-luxury overflow-hidden" style={{ minHeight: '100vh' }}>
        <div className="absolute inset-0 -z-10">
          <img src="/interior_balloons.jpg" alt="365 Café Warm Ambience" className="absolute inset-0 w-full h-full object-cover brightness-[0.14] blur-[3px] scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-background-luxury via-transparent to-black/80" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-28 lg:pt-32 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5 text-center lg:text-left flex flex-col items-center lg:items-start justify-start pt-4 lg:pt-8">
              <motion.h1 initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.7 }} className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-2 leading-none">
                Good Food.
              </motion.h1>
              <motion.h2 initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.1, duration: 0.7 }} className="font-serif italic text-4xl sm:text-5xl md:text-6xl font-medium text-accent-luxury mb-6" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                Great Moments.
              </motion.h2>
              <motion.p initial={{ y: 15 }} animate={{ y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="text-sm md:text-base text-gray-luxury max-w-md font-light mb-8 leading-relaxed">
                A cozy café with delicious food, refreshing drinks and the perfect vibe to relax, work or catch up.
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <a href="#menu" className="btn-gold px-8 py-3.5 rounded-full text-xs uppercase tracking-widest text-background-luxury shadow-lg w-56 sm:w-auto text-center">Explore Menu</a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="btn-outline px-8 py-3.5 rounded-full text-xs uppercase tracking-widest hover:text-accent-luxury w-56 sm:w-auto text-center flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <div className="w-0 h-0 border-y-4 border-y-transparent border-l-6 border-l-white ml-0.5" />
                  </div>
                  Watch Video
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 relative h-[380px] sm:h-[420px] lg:h-[440px] w-full hidden md:block select-none">
              <div className="absolute top-0 right-0 w-[55%] h-[50%] z-20">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="w-full h-full rounded-luxury overflow-hidden border border-white/10 shadow-2xl">
                  <img src="/slush_drinks.jpg" alt="Tropical drinks" className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700" loading="lazy" />
                </motion.div>
              </div>
              <div className="absolute top-[25%] left-0 w-[55%] h-[50%] z-30">
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="w-full h-full rounded-luxury overflow-hidden border border-white/10 shadow-2xl">
                  <img src="/pasta_pink_sauce.jpg" alt="Pasta bowl" className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-700" loading="lazy" />
                </motion.div>
              </div>
              <div className="absolute bottom-0 right-[5%] w-[45%] h-[40%] z-40">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="w-full h-full rounded-luxury overflow-hidden border border-white/10 shadow-2xl">
                  <img src="/hazelnut_coffee.jpg" alt="Latte coffee" className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-700" loading="lazy" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 mt-12 pb-16">
          <div className="glass-panel py-8 px-6 rounded-luxury border border-white/10 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-6 divide-x-0 md:divide-x divide-white/10">
            <div className="flex items-center gap-4 p-2"><Coffee size={24} className="text-accent-luxury shrink-0" /><div><h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Great Coffee</h4><p className="text-[10px] text-gray-luxury mt-1 font-light leading-relaxed">Freshly brewed to perfection.</p></div></div>
            <div className="flex items-center gap-4 p-2"><Utensils size={24} className="text-accent-luxury shrink-0" /><div><h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Delicious Food</h4><p className="text-[10px] text-gray-luxury mt-1 font-light leading-relaxed">A wide range of cuisines made with love.</p></div></div>
            <div className="flex items-center gap-4 p-2"><HomeIcon size={24} className="text-accent-luxury shrink-0" /><div><h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Cozy Ambience</h4><p className="text-[10px] text-gray-luxury mt-1 font-light leading-relaxed">The perfect place to relax and unwind.</p></div></div>
            <div className="flex items-center gap-4 p-2"><MapPin size={24} className="text-accent-luxury shrink-0" /><div><h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Great Location</h4><p className="text-[10px] text-gray-luxury mt-1 font-light leading-relaxed">Easy to find, hard to forget.</p></div></div>
          </div>
        </div>
      </section>

      {/* 2. SPECIALTIES & ABOUT US */}
      <section className="py-32 max-w-7xl mx-auto px-6 md:px-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h2 className="font-serif text-3xl font-bold tracking-wide text-white">Our Specialties</h2>
              <div className="flex items-center gap-2 mt-3">
                <div className="h-[1px] bg-accent-luxury w-8" />
                <svg className="w-4 h-4 text-accent-luxury fill-transparent stroke-current stroke-2" viewBox="0 0 24 24"><path d="M3 20L10 8L15 15L21 5" /></svg>
                <div className="h-[1px] bg-accent-luxury w-3" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {menuData.filter(i => i.isSpecial).map((item) => (
                <div key={item.id} className="bg-secondary-luxury/40 border border-white/5 rounded-luxury overflow-hidden p-3 flex flex-col justify-between hover:border-accent-luxury/20 transition-all duration-300 group">
                  <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                    <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xs font-bold text-white mb-1 truncate">{item.name}</h4>
                    <span className="text-xs text-accent-luxury font-semibold">₹{item.price}</span>
                  </div>
                  <button onClick={() => addToCart(item)} className="w-full bg-white/5 hover:bg-accent-luxury hover:text-background-luxury text-center py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider mt-4 transition-colors">Add to Cart</button>
                </div>
              ))}
            </div>
            <div className="text-center md:text-left pt-2">
              <a href="#menu" className="btn-gold px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest text-background-luxury inline-block hover:scale-105">View Full Menu</a>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row gap-8 items-center lg:items-start h-full">
            <div className="flex-1 space-y-4">
              <div><h3 className="font-serif text-2xl font-bold text-white">About Us</h3><div className="h-[1px] bg-accent-luxury w-6 mt-2" /></div>
              <p className="text-xs text-gray-luxury leading-relaxed font-light">The Travel Café is more than just a café – it's a place where good food meets good vibes.</p>
              <p className="text-xs text-gray-luxury leading-relaxed font-light">Whether you're here for a quick coffee, a hearty meal, or a relaxed evening with friends, we promise you'll feel right at home.</p>
              <div className="pt-2"><a href="#about" className="btn-gold px-6 py-2.5 rounded-full text-[10px] font-semibold uppercase tracking-widest text-background-luxury inline-block">Know More</a></div>
            </div>
            <div className="w-48 h-72 relative rounded-luxury overflow-hidden border border-white/10 shrink-0 hidden sm:block">
              <img src="/interior_balloons.jpg" alt="Cafe Interior" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background-luxury/70 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. STATS */}
      <section id="about" className="py-12 bg-secondary-luxury/20 border-y border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="glass-panel p-6 rounded-luxury border border-white/5"><span className="text-2xl md:text-3xl font-serif font-bold text-accent-luxury block mb-1">10,000+</span><span className="text-[9px] uppercase font-bold tracking-widest text-white/55">Happy Customers</span></div>
          <div className="glass-panel p-6 rounded-luxury border border-white/5"><span className="text-2xl md:text-3xl font-serif font-bold text-accent-luxury block mb-1">150+</span><span className="text-[9px] uppercase font-bold tracking-widest text-white/55">Menu Items</span></div>
          <div className="glass-panel p-6 rounded-luxury border border-white/5"><span className="text-2xl md:text-3xl font-serif font-bold text-accent-luxury block mb-1">4.9★</span><span className="text-[9px] uppercase font-bold tracking-widest text-white/55">Rating & Reviews</span></div>
          <div className="glass-panel p-6 rounded-luxury border border-white/5"><span className="text-2xl md:text-3xl font-serif font-bold text-accent-luxury block mb-1">Fresh</span><span className="text-[9px] uppercase font-bold tracking-widest text-white/55">Ingredients Daily</span></div>
        </div>
      </section>

      {/* 4. MENU */}
      <section id="menu" className="py-24 max-w-7xl mx-auto px-6 md:px-12 relative z-20">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest text-accent-luxury uppercase block mb-2">A Taste of Travel</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-wide">Explore Our Culinary Map</h2>
          <div className="w-6 h-[1px] bg-accent-luxury mx-auto mt-4" />
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-16 max-w-4xl mx-auto">
          {menuCategories.map((category) => (
            <button key={category} onClick={() => setActiveMenuCategory(category)} className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${activeMenuCategory === category ? 'bg-accent-luxury text-background-luxury font-bold shadow-md' : 'bg-white/5 text-gray-luxury hover:bg-white/10 hover:text-white border border-white/5'}`}>{category}</button>
          ))}
        </div>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredMenuItems.map((item) => (
              <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} key={item.id} className="group bg-secondary-luxury/40 hover:bg-secondary-luxury rounded-luxury border border-white/5 p-5 flex flex-col justify-between transition-all duration-300 hover:border-accent-luxury/20">
                <div>
                  <div className="relative h-48 rounded-xl overflow-hidden mb-5">
                    <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm border border-white/10">
                      <div className={`w-2 h-2 rounded-full flex items-center justify-center border ${item.isVeg ? 'border-green-500' : 'border-red-500'}`}><div className={`w-1 h-1 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} /></div>
                      <span className="text-[8px] uppercase font-bold tracking-wider text-white">{item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                    </div>
                    <div className="absolute bottom-3 right-3 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-accent-luxury font-bold text-xs border border-accent-luxury/20">₹{item.price}</div>
                  </div>
                  <h3 className="font-serif text-base font-bold text-white mb-2 group-hover:text-accent-luxury transition-colors">{item.name}</h3>
                  <p className="text-xs text-gray-luxury font-light leading-relaxed mb-6 line-clamp-2">{item.description}</p>
                </div>
                <button onClick={() => addToCart(item)} className="w-full btn-outline group-hover:btn-gold group-hover:text-background-luxury text-center py-2.5 rounded-full text-[10px] font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300"><Plus size={12} /> Add to Cart</button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 5. EXPERIENCES */}
      <section className="py-24 bg-secondary-luxury border-y border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-widest text-accent-luxury uppercase block mb-2">Elevate Your Moments</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-wide">Curated Experiences</h2>
            <div className="w-6 h-[1px] bg-accent-luxury mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {experienceCards.map((exp, index) => {
              const IconComp = exp.icon;
              return (
                <motion.div key={exp.title} initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.6 }} className="glass-panel p-8 rounded-luxury border border-white/5 relative hover:border-accent-luxury/30 transition-all duration-300 group">
                  <div className="absolute top-0 left-0 w-24 h-24 bg-accent-luxury/5 rounded-full blur-2xl group-hover:bg-accent-luxury/10 transition-colors pointer-events-none" />
                  <div className="w-14 h-14 rounded-full bg-accent-luxury/15 border border-accent-luxury/20 flex items-center justify-center text-accent-luxury mb-6 group-hover:scale-110 transition-transform duration-300"><IconComp size={24} /></div>
                  <h3 className="font-serif text-lg font-bold text-white mb-3">{exp.title}</h3>
                  <p className="text-xs text-gray-luxury font-light leading-relaxed">{exp.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. GALLERY */}
      <section id="gallery" className="py-24 max-w-7xl mx-auto px-6 md:px-12 relative z-20">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest text-accent-luxury uppercase block mb-2">Cinematic Vibe</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-wide">Atmosphere & Visuals</h2>
          <div className="w-6 h-[1px] bg-accent-luxury mx-auto mt-4" />
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {galleryCategories.map((category) => (
            <button key={category} onClick={() => setActiveGalleryCategory(category)} className={`px-6 py-2.5 rounded-full text-[10px] font-semibold uppercase tracking-widest transition-all duration-500 border ${activeGalleryCategory === category ? 'bg-gradient-to-r from-accent-luxury to-[#A97A4C] text-background-luxury border-accent-luxury font-bold shadow-md shadow-accent-luxury/20 scale-105' : 'bg-white/5 text-gray-luxury border-white/5 hover:border-accent-luxury/30 hover:text-white'}`}>{category}</button>
          ))}
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {filteredGalleryItems.map((img, idx) => (
            <motion.div layout key={img.src} initial={{ scale: 0.92, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.05 }} className="masonry-item relative group rounded-luxury overflow-hidden border border-white/5 cursor-pointer shadow-lg shadow-black/45 hover:border-accent-luxury/30 hover:shadow-accent-luxury/5 transition-all duration-500" onClick={() => setLightboxImage({ src: img.src, title: img.title })}>
              <div className="absolute inset-4 border border-accent-luxury/25 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-[25]" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                <div className="w-12 h-12 rounded-full bg-accent-luxury text-background-luxury flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-xl"><Eye size={18} /></div>
              </div>
              <img src={img.src} alt={img.title} width={500} height={400} className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent opacity-65 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <div className="absolute bottom-6 left-6 right-6 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-500 z-20 text-left">
                <span className="text-[9px] uppercase font-bold tracking-widest text-accent-luxury mb-1 block drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">{img.category}</span>
                <h4 className="font-serif text-base font-bold text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)]">{img.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. BOOK A TABLE */}
      <section id="book-table" className="py-24 bg-secondary-luxury/30 border-y border-white/5 relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <span className="text-xs font-semibold tracking-widest text-accent-luxury uppercase block mb-1">Reserve Your Spot</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-white">Book a Table</h2>
            <div className="h-[1px] bg-accent-luxury w-8 mt-2 mb-4" />
            <p className="text-xs text-gray-luxury font-light mb-8">Plan your visit and we'll take care of the rest.</p>
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input type="text" required value={bookingName} onChange={(e) => setBookingName(e.target.value)} placeholder="Full Name" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-luxury focus:outline-none transition-colors placeholder:text-white/30 text-white" />
                <input type="tel" required value={bookingPhone} onChange={(e) => setBookingPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-luxury focus:outline-none transition-colors placeholder:text-white/30 text-white" />
              </div>
              <input type="email" required value={bookingEmail} onChange={(e) => setBookingEmail(e.target.value)} placeholder="Email Address" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-luxury focus:outline-none transition-colors placeholder:text-white/30 text-white" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input type="date" required value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-luxury focus:outline-none transition-colors text-white cursor-pointer [color-scheme:dark]" />
                <select required value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-luxury focus:outline-none transition-colors text-white cursor-pointer">
                  {['11:00 AM','12:30 PM','02:00 PM','03:30 PM','05:00 PM','06:30 PM','08:00 PM','09:30 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <select value={bookingGuests} onChange={(e) => setBookingGuests(Number(e.target.value))} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-luxury focus:outline-none transition-colors text-white cursor-pointer">
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                </select>
                <select value={bookingSeating} onChange={(e) => setBookingSeating(e.target.value as 'indoor' | 'outdoor')} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-luxury focus:outline-none transition-colors text-white cursor-pointer">
                  <option value="indoor">Indoor Seating</option>
                  <option value="outdoor">Outdoor Seating</option>
                </select>
              </div>
              <textarea value={bookingRequest} onChange={(e) => setBookingRequest(e.target.value)} placeholder="Special Requests (e.g. Birthday decor, rose petals, silent zone...)" rows={2} className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-accent-luxury focus:outline-none transition-colors placeholder:text-white/30 text-white resize-none" />
              {bookingDate && (
                <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl">
                  <div className={`w-2 h-2 rounded-full ${liveAvailability.available ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-[10px] text-white/80 font-light uppercase tracking-wider">{liveAvailability.available ? `Available: ${liveAvailability.remaining} tables left for this slot` : 'Fully booked for this slot'}</span>
                </div>
              )}
              <button type="submit" disabled={bookingLoading || (bookingDate ? !liveAvailability.available : false)} className="btn-gold w-full py-4 rounded-xl text-xs font-semibold uppercase tracking-widest text-background-luxury shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none">
                {bookingLoading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : 'Book Now'}
              </button>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5 text-[10px] uppercase tracking-widest text-gray-luxury font-medium">
                <span className="flex items-center gap-1"><Check size={12} className="text-accent-luxury" /> Instant Confirmation</span>
                <span className="flex items-center gap-1"><Check size={12} className="text-accent-luxury" /> No Booking Fees</span>
                <span className="flex items-center gap-1"><Check size={12} className="text-accent-luxury" /> Easy & Secure</span>
              </div>
            </form>
          </div>
          <div className="w-full lg:w-1/2 relative">
            <div className="relative h-[480px] w-full rounded-luxury overflow-hidden border border-white/10 shadow-2xl">
              <img src="/outdoor_decoration.jpg" alt="Romantic Seating Setup" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background-luxury/75 via-black/10 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-24 max-w-5xl mx-auto px-6 md:px-12 text-center relative z-20">
        <span className="text-xs font-semibold tracking-widest text-accent-luxury uppercase block mb-2">Guest Journal</span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-wide">Reviews & Love</h2>
        <div className="w-6 h-[1px] bg-accent-luxury mx-auto mt-4 mb-16" />
        <div className="glass-panel p-8 md:p-16 rounded-luxury border border-white/5 relative">
          <div className="absolute top-4 left-6 text-7xl font-serif text-accent-luxury/10 select-none pointer-events-none">"</div>
          <div className="flex justify-center gap-1 mb-6">{[1,2,3,4,5].map((s) => <Star key={s} size={16} className="fill-accent-luxury text-accent-luxury" />)}</div>
          <p className="font-serif italic text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-8">"The Travel Café is an absolute masterpiece! We reserved a decorated couple table for our anniversary. The outdoor space was beautifully filled with red balloons and fresh rose petals, exactly like our request. The Pasta in Pink Sauce and Strawberry Mocktail were culinary perfection."</p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent-luxury/20 border border-accent-luxury/20 relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Aishwarya R." className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="text-left"><h4 className="font-serif text-sm font-bold text-white">Aishwarya R.</h4><p className="text-[10px] text-gray-luxury tracking-widest uppercase">Verified Traveler</p></div>
          </div>
        </div>
      </section>

      {/* 9. INSTAGRAM GRID */}
      <section className="py-24 bg-secondary-luxury border-y border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 text-center sm:text-left">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-accent-luxury uppercase block mb-1">Social Journal</span>
              <h3 className="font-serif text-2xl font-bold text-white tracking-wide">Instagram Feed</h3>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-xs text-gray-luxury hover:text-accent-luxury transition-colors mt-1 inline-block">@365travelcafe</a>
            </div>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border border-accent-luxury/30 hover:border-accent-luxury bg-accent-luxury/5 hover:bg-accent-luxury hover:text-background-luxury text-accent-luxury rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-md hover:scale-105"><InstagramIcon size={14} /> Follow Us</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {galleryImages.slice(0, 6).map((img, i) => {
              const igStats = [{ likes: 142, comments: 8 },{ likes: 235, comments: 14 },{ likes: 189, comments: 11 },{ likes: 304, comments: 25 },{ likes: 167, comments: 9 },{ likes: 278, comments: 16 }][i] || { likes: 150, comments: 10 };
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.5 }} className="relative aspect-square rounded-2xl overflow-hidden group border border-white/5 cursor-pointer shadow-lg hover:border-accent-luxury/35 transition-all duration-500">
                  <div className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80 group-hover:bg-accent-luxury group-hover:text-background-luxury group-hover:border-transparent transition-all duration-500"><InstagramIcon size={13} /></div>
                  <img src={img.src} alt="Insta post" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 group-hover:blur-[1px] transition-all duration-700 brightness-90 group-hover:brightness-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  <div className="absolute inset-0 z-20 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"><Heart size={14} className="fill-white text-white" /><span>{igStats.likes}</span></div>
                    <div className="flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"><MessageCircle size={14} className="fill-white text-white" /><span>{igStats.comments}</span></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. CONTACT */}
      <section id="contact" className="py-24 max-w-7xl mx-auto px-6 md:px-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-xs font-semibold tracking-widest text-accent-luxury uppercase block mb-2">Connect With Us</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-wide mb-8">Contact & Location</h2>
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4"><div className="w-10 h-10 rounded-full bg-accent-luxury/10 flex items-center justify-center text-accent-luxury shrink-0"><MapPin size={18} /></div><div><h4 className="font-serif text-sm font-bold text-white mb-1">Our Café Address</h4><p className="text-xs text-gray-luxury leading-relaxed font-light">123, Green Park Road, Near Central Plaza, Your City, India.</p></div></div>
              <div className="flex items-start gap-4"><div className="w-10 h-10 rounded-full bg-accent-luxury/10 flex items-center justify-center text-accent-luxury shrink-0"><Clock size={18} /></div><div><h4 className="font-serif text-sm font-bold text-white mb-1">Opening Hours</h4><p className="text-xs text-gray-luxury leading-relaxed font-light">Monday – Sunday: 10:00 AM – 11:00 PM</p></div></div>
              <div className="flex items-start gap-4"><div className="w-10 h-10 rounded-full bg-accent-luxury/10 flex items-center justify-center text-accent-luxury shrink-0"><Phone size={18} /></div><div><h4 className="font-serif text-sm font-bold text-white mb-1">Call & Reservations</h4><p className="text-xs text-gray-luxury leading-relaxed font-light">+91 98765 43210</p></div></div>
            </div>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-xs font-semibold uppercase tracking-widest transition-colors shadow-md hover:scale-105"><MessageCircle size={16} /> Chat on WhatsApp</a>
          </div>
          <div className="w-full rounded-luxury overflow-hidden border border-white/10 shadow-2xl relative">
            <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.4338944517316!2d77.20455831508216!3d28.567228882442484!2m3!1f0!2f0!3f0!3m2!1i1280!2i725!4f13.1!3m3!1m2!1s0x390d027bda4628ef%3A0xa19bfbc60e28c70d!2sGreen%20Park%20Extension%2C%20Green%20Park%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1650000000000!5m2!1sen!2sin" width="100%" height="380" style={{ border: 0 }} allowFullScreen={false} loading="lazy" className="grayscale invert opacity-80" title="365 The Travel Cafe Google Map Location" />
          </div>
        </div>
      </section>

      {/* 11. NEWSLETTER */}
      <section className="py-12 max-w-7xl mx-auto px-6 md:px-12 relative z-20">
        <div className="glass-panel p-8 md:p-12 rounded-luxury border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
            <div className="w-14 h-14 rounded-full border border-accent-luxury/30 flex items-center justify-center text-accent-luxury shrink-0"><Mail size={22} /></div>
            <div><h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">Stay Updated</h3><p className="text-[11px] text-gray-luxury font-light leading-relaxed mt-1">Subscribe to get updates on new dishes, offers and upcoming events.</p></div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 max-w-md">
            <input type="email" required placeholder="Enter your email" className="bg-[#1A1A1A] border border-white/10 rounded-xl px-5 py-3.5 text-xs focus:border-accent-luxury focus:outline-none transition-colors w-full md:w-64 placeholder:text-white/45 text-white" />
            <button type="submit" className="btn-gold px-6 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest text-background-luxury w-full sm:w-auto text-center">Subscribe</button>
          </form>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="bg-[#0A0A0A] py-16 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-white/5">
            <div className="lg:col-span-5 space-y-6 text-left">
              <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="inline-block">
                <div className="relative w-44 h-16">
                  <img src="/logo-cropped.png" alt="365 The Travel Café Logo" className="absolute inset-0 w-full h-full object-contain object-left" />
                </div>
              </a>
              <div className="space-y-2 text-xs text-gray-luxury font-light leading-relaxed">
                <p>© 2024 The Travel Café 365. All rights reserved.</p>
                <p className="flex items-center gap-1 text-[10px] tracking-wide mt-1">Designed with <Heart size={10} className="fill-red-500 text-red-500" /> for good food lovers.</p>
              </div>
            </div>
            <div className="lg:col-span-2 text-left">
              <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-6">Quick Links</h4>
              <ul className="space-y-3 text-xs text-gray-luxury font-light">
                {[['#home','Home'],['#about','About Us'],['#menu','Menu'],['#gallery','Gallery'],['#book-table','Book a Table'],['#contact','Contact Us']].map(([href, label]) => (
                  <li key={href}><a href={href} onClick={(e) => handleNavClick(e as React.MouseEvent<HTMLAnchorElement>, href)} className="hover:text-accent-luxury transition-colors">{label}</a></li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-3 text-left">
              <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-6">Contact Us</h4>
              <ul className="space-y-3 text-xs text-gray-luxury font-light">
                <li className="flex items-center gap-2"><Phone size={12} className="text-accent-luxury" /> +91 98765 43210</li>
                <li className="flex items-center gap-2"><Mail size={12} className="text-accent-luxury" /> thetravelcafe365@gmail.com</li>
                <li className="flex items-center gap-2"><MapPin size={12} className="text-accent-luxury" /> 123, Green Park, Your City</li>
                <li className="flex items-center gap-2"><Clock size={12} className="text-accent-luxury" /> Mon – Sun : 10:00 AM – 11:00 PM</li>
              </ul>
            </div>
            <div className="lg:col-span-2 text-left">
              <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-6">Follow Us</h4>
              <div className="flex items-center gap-3">
                {['instagram','facebook','whatsapp','google'].map((social) => (
                  <a key={social} href={`https://${social}.com`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white hover:text-accent-luxury hover:border-accent-luxury transition-colors uppercase text-[9px] font-bold">{social[0]}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Booking Success Modal */}
      <AnimatePresence>
        {bookingStatus && bookingStatus.success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 select-none">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass-panel p-8 md:p-12 rounded-luxury border border-accent-luxury/20 max-w-md w-full text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-accent-luxury/10 rounded-full blur-3xl pointer-events-none" />
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-6">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}><Check size={32} /></motion.div>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-4">Reservation Confirmed!</h3>
              <p className="text-xs text-gray-luxury leading-relaxed font-light mb-8">{bookingStatus.message} A confirmation with reservation details has been sent to your contacts.</p>
              <button onClick={() => setBookingStatus(null)} className="btn-gold px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest text-background-luxury shadow-md hover:scale-105">Close Window</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightboxImage(null)} className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 cursor-zoom-out">
            <button onClick={() => setLightboxImage(null)} className="absolute top-6 right-6 p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-colors"><X size={24} /></button>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} transition={{ type: 'spring', damping: 25 }} className="relative max-w-4xl max-h-[80vh] w-full aspect-video rounded-luxury overflow-hidden border border-white/15 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <img src={lightboxImage.src} alt={lightboxImage.title} className="absolute inset-0 w-full h-full object-contain" />
            </motion.div>
            <span className="font-serif text-base font-medium text-white/90 mt-6 tracking-wide select-none">{lightboxImage.title}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <motion.button initial={{ scale: 0, y: 50 }} animate={{ scale: 1, y: 0 }} className="fixed bottom-6 right-6 z-30 btn-gold w-14 h-14 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-105" onClick={() => setIsCartOpen(true)}>
          <div className="relative">
            <ShoppingBag size={20} />
            <motion.span key={cart.length} animate={{ scale: cartBadgeAnimation ? [1, 1.4, 1] : 1 }} className="absolute -top-3.5 -right-3.5 bg-red-500 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-background-luxury">
              {cart.reduce((tot, item) => tot + item.quantity, 0)}
            </motion.span>
          </div>
        </motion.button>
      )}

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black z-40" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 200 }} className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-secondary-luxury border-l border-white/5 p-6 flex flex-col justify-between z-50">
              <div>
                <div className="flex justify-between items-center pb-5 border-b border-white/5 mb-6">
                  <div className="flex items-center gap-2 text-accent-luxury"><ShoppingBag size={20} /><h3 className="font-serif text-lg font-bold text-white">Your Tray Cart</h3></div>
                  <button onClick={() => setIsCartOpen(false)} className="p-1 text-white hover:text-accent-luxury"><X size={20} /></button>
                </div>
                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-4"><Coffee size={36} className="text-white/20 mx-auto" /><p className="text-xs text-gray-luxury font-light">Your tray is currently empty.</p></div>
                ) : (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center bg-white/5 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10">
                          <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0"><h4 className="font-serif text-xs font-bold text-white truncate">{item.name}</h4><span className="text-[10px] text-accent-luxury font-semibold mt-0.5 block">₹{item.price}</span></div>
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-1 shrink-0">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-5 h-5 rounded-md hover:bg-white/5 flex items-center justify-center text-xs font-bold">-</button>
                          <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-5 h-5 rounded-md hover:bg-white/5 flex items-center justify-center text-xs font-bold">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="p-1 text-white/40 hover:text-red-400 shrink-0" aria-label="Remove item"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="border-t border-white/5 pt-6 space-y-4">
                  <div className="flex justify-between items-center text-sm font-semibold"><span className="text-gray-luxury font-light">Subtotal Amount</span><span className="text-accent-luxury font-bold text-base">₹{getTotalPrice()}</span></div>
                  <p className="text-[10px] text-gray-luxury font-light">GST and service charges included.</p>
                  <button onClick={() => { alert('Checkout process: Confirmed order!'); setCart([]); setIsCartOpen(false); }} className="w-full btn-gold py-4 rounded-full text-xs font-semibold uppercase tracking-widest text-background-luxury shadow-lg text-center">Confirm Order (₹{getTotalPrice()})</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
