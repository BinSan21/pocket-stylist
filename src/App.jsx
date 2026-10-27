import { useState } from 'react';
import { MapPin, ShoppingBag, Heart, Search, ChevronLeft, Layers, Home, X, Plus } from 'lucide-react';

const INVENTORY = [
  { id: 1, name: "Red Corduroy Shirt", price: 45.00, sizes: ["S", "M", "L"], location: "Floor 2, Aisle 4 - Casual Tops", category: "tops", image: "/pocket-stylist/image_c5b61e.jpg" },
  { id: 2, name: "Brown Knit Polo", price: 38.00, sizes: ["M", "L"], location: "Floor 2, Aisle 4 - Casual Tops", category: "tops", image: "/pocket-stylist/image_c5b5c2.jpg" },
  { id: 3, name: "Black Sweatpants", price: 55.00, sizes: ["S", "M", "L", "XL"], location: "Floor 1, Aisle 2 - Activewear", category: "bottoms", image: "/pocket-stylist/image_c5b29c.png" },
  { id: 4, name: "Olive Cargo Pants", price: 65.00, sizes: ["M", "L", "XL"], location: "Floor 1, Aisle 6 - Streetwear", category: "bottoms", image: "/pocket-stylist/image_c5b295.jpg" },
  { id: 5, name: "Khaki Chinos", price: 60.00, sizes: ["S", "M", "L"], location: "Floor 1, Aisle 5 - Mens Bottoms", category: "bottoms", image: "/pocket-stylist/image_c5b259.jpg" },
  { id: 6, name: "Black Cargo Pants", price: 68.00, sizes: ["M", "L"], location: "Floor 1, Aisle 6 - Streetwear", category: "bottoms", image: "/pocket-stylist/image_c5b21e.png" },
  { id: 7, name: "Layered Grey Hoodie", price: 50.00, sizes: ["S", "M", "L"], location: "Floor 2, Aisle 1 - Outerwear", category: "tops", image: "/pocket-stylist/image_c56064.jpg" },
  { id: 8, name: "Graphic Off-Shoulder", price: 32.00, sizes: ["XS", "S", "M"], location: "Floor 3, Aisle 2 - Womens", category: "tops", image: "/pocket-stylist/image_c55c24.png" },
  { id: 9, name: "Cropped Leather Moto", price: 120.00, sizes: ["S", "M"], location: "Floor 3, Aisle 5 - Womens Outerwear", category: "tops", image: "/pocket-stylist/image_c55b85.jpg" },
  { id: 10, name: "Wide Leg Denim", price: 75.00, sizes: ["26", "28", "30"], location: "Floor 3, Aisle 8 - Denim", category: "bottoms", image: "/pocket-stylist/image_c55802.jpg" }
];

const StoreMap = ({ items }) => {
  const activeAisles = items.filter(Boolean).map(item => {
    const match = item.location.match(/Aisle (\d+)/);
    return match ? parseInt(match[1]) : null;
  });

  const aisles = [
    { id: 1, x: 25, y: 25 }, { id: 2, x: 115, y: 25 }, { id: 3, x: 205, y: 25 }, { id: 4, x: 295, y: 25 },
    { id: 5, x: 25, y: 115 }, { id: 6, x: 115, y: 115 }, { id: 7, x: 205, y: 115 }, { id: 8, x: 295, y: 115 },
  ];

  return (
    <svg viewBox="0 0 400 210" className="w-full h-full p-2">
      <rect x="5" y="5" width="390" height="200" rx="12" fill="none" stroke="#7E5B42" strokeOpacity="0.2" strokeWidth="4" />
      <rect x="150" y="180" width="100" height="25" rx="4" fill="#D5CABD" />
      <text x="200" y="196" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#7E5B42" letterSpacing="2">CHECKOUT</text>

      {aisles.map(aisle => {
        const isActive = activeAisles.includes(aisle.id);
        return (
          <g key={aisle.id} transform={`translate(${aisle.x}, ${aisle.y})`}>
            <rect 
              width="80" 
              height="65" 
              rx="8" 
              fill={isActive ? '#8BA888' : '#FBF9F6'} 
              stroke={isActive ? '#6B8369' : '#D5CABD'} 
              strokeWidth="2" 
              style={{ transition: 'all 0.5s ease' }} 
            />
            <text x="40" y="32" textAnchor="middle" fontSize="14" fontWeight="bold" fill={isActive ? '#FFFFFF' : '#7E5B42'} className="font-serif">
              Aisle {aisle.id}
            </text>
            {isActive && <circle cx="40" cy="48" r="4" fill="#FFFFFF" className="animate-pulse" />}
          </g>
        );
      })}
    </svg>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState('catalog');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [canvasItems, setCanvasItems] = useState({ top: null, bottom: null });
  const [bagItems, setBagItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentView('product');
  };

  const addToCanvas = (product) => {
    if (product.category === 'bottoms') {
      setCanvasItems({ ...canvasItems, bottom: product });
    } else {
      setCanvasItems({ ...canvasItems, top: product });
    }
    setCurrentView('canvas');
  };

  const handleAddOutfitToBag = () => {
    const currentOutfit = [canvasItems.top, canvasItems.bottom].filter(Boolean);
    const newBag = [...bagItems];
    
    currentOutfit.forEach(item => {
      if (!newBag.some(bagItem => bagItem.id === item.id)) {
        newBag.push(item);
      }
    });
    
    setBagItems(newBag);
    setCurrentView('bag');
  };

  const toggleSave = (e, product) => {
    e.stopPropagation(); 
    if (savedItems.some(item => item.id === product.id)) {
      setSavedItems(savedItems.filter(item => item.id !== product.id));
    } else {
      setSavedItems([...savedItems, product]);
    }
  };

  const hasItemsOnCanvas = canvasItems.top || canvasItems.bottom;
  
  const subtotal = bagItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08; 
  const total = subtotal + tax;

  const filteredInventory = INVENTORY.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-warm-beige text-mocha-brown font-sans pb-20 max-w-md mx-auto shadow-xl relative overflow-hidden">
      
      <header className="pt-8 pb-4 px-6 sticky top-0 bg-warm-beige/90 backdrop-blur-sm z-10">
        {currentView !== 'catalog' ? (
          <button onClick={() => setCurrentView('catalog')} className="flex items-center text-mocha-brown font-semibold mb-2">
            <ChevronLeft size={20} /> Back
          </button>
        ) : null}
        <h1 className="font-serif text-4xl font-bold tracking-tight text-center mt-2">Pocket Stylist</h1>
        <p className="text-center text-sm opacity-70 italic font-serif">Find the fit, right where it sits.</p>
      </header>

      <main className="px-6 py-4">
        
        {/* VIEW 1: CATALOG */}
        {currentView === 'catalog' && (
          <div className="animate-fade-in">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 opacity-50" size={20} />
              <input 
                type="text" 
                placeholder="Search styles, tops, pants..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/50 border border-mocha-brown/20 rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-sage-green" 
              />
            </div>
            
            <h2 className="font-serif text-2xl font-semibold mb-4">
              {searchQuery ? `Search Results (${filteredInventory.length})` : 'New Arrivals'}
            </h2>

            {filteredInventory.length === 0 ? (
              <div className="text-center py-12 opacity-60">
                <p className="font-serif text-lg">No styles found matching "{searchQuery}"</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-sm underline font-semibold text-mocha-brown"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredInventory.map((item) => {
                  const isSaved = savedItems.some(saved => saved.id === item.id);
                  return (
                    <div key={item.id} onClick={() => handleProductClick(item)} className="cursor-pointer group">
                      <div className="aspect-[3/4] rounded-2xl mb-2 flex items-center justify-center shadow-sm border border-mocha-brown/10 overflow-hidden group-hover:shadow-md transition-all bg-white p-2">
                         <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply contrast-125" />
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-sm leading-tight truncate w-32">{item.name}</h3>
                          <p className="text-sm opacity-70">${item.price.toFixed(2)}</p>
                        </div>
                        <button onClick={(e) => toggleSave(e, item)} className={`transition-opacity ${isSaved ? 'text-red-500 opacity-100' : 'opacity-40 hover:opacity-100'}`}>
                          <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: PRODUCT DETAIL */}
        {currentView === 'product' && selectedProduct && (
          <div className="animate-fade-in">
            <div className="aspect-[3/4] w-full rounded-3xl mb-6 shadow-sm overflow-hidden border border-mocha-brown/10 bg-white p-4 relative">
              <button 
                onClick={(e) => toggleSave(e, selectedProduct)} 
                className="absolute top-4 right-4 z-10 p-3 bg-white/80 rounded-full shadow-sm"
              >
                <Heart size={20} className={savedItems.some(item => item.id === selectedProduct.id) ? 'text-red-500' : 'text-mocha-brown'} fill={savedItems.some(item => item.id === selectedProduct.id) ? "currentColor" : "none"} />
              </button>
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-contain mix-blend-multiply contrast-125" />
            </div>
            
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="font-serif text-3xl font-bold">{selectedProduct.name}</h2>
                <p className="text-xl mt-1">${selectedProduct.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-sm mb-3 opacity-80">Available Sizes</h4>
              <div className="flex gap-3">
                {selectedProduct.sizes.map(size => (
                  <div key={size} className="w-12 h-12 rounded-full border-2 border-mocha-brown/20 flex items-center justify-center font-bold text-sm bg-white shadow-sm">
                    {size}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/60 rounded-xl p-4 mb-6 border border-sage-green/30 flex items-start gap-3">
              <div className="bg-sage-green/20 p-2 rounded-full mt-1">
                <MapPin className="text-sage-green" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Store Location</h4>
                <p className="text-sm opacity-80 mb-1">{selectedProduct.location}</p>
                <p className="text-xs text-sage-green font-semibold">Walk 15ft straight, on your left.</p>
              </div>
            </div>

            <button onClick={() => addToCanvas(selectedProduct)} className="w-full mt-4 bg-mocha-brown text-warm-beige py-4 rounded-full font-bold text-lg shadow-lg hover:bg-mocha-brown/90 transition-colors flex justify-center items-center gap-2">
              <Layers size={20} /> Add to Mannequin
            </button>
          </div>
        )}

        {/* VIEW 3: STYLING CANVAS */}
        {currentView === 'canvas' && (
          <div className="animate-fade-in flex flex-col pb-6">
            <h2 className="font-serif text-2xl font-semibold mb-2 text-center">Fitting Room</h2>
            <p className="text-center text-sm opacity-70 mb-4">Mix and match your perfect outfit.</p>
            
            <div className="w-full max-w-[260px] h-[400px] mx-auto bg-warm-beige border-2 border-mocha-brown/20 rounded-3xl relative shadow-inner overflow-hidden mb-6">
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-15 pointer-events-none">
                <svg viewBox="0 0 100 200" className="w-[60%] h-[80%] text-mocha-brown">
                  <circle cx="50" cy="30" r="14" fill="currentColor" />
                  <path d="M 30 55 C 30 45 70 45 70 55 L 62 110 L 38 110 Z" fill="currentColor" />
                  <rect x="38" y="115" width="10" height="60" rx="5" fill="currentColor" />
                  <rect x="52" y="115" width="10" height="60" rx="5" fill="currentColor" />
                </svg>
              </div>

              {canvasItems.top && (
                <>
                  <div className="absolute top-[5%] left-0 w-full h-[55%] z-20 flex justify-center items-center pointer-events-none mix-blend-multiply">
                    <img src={canvasItems.top.image} alt="Top" className="w-full h-full object-contain scale-110" />
                  </div>
                  <button onClick={() => setCanvasItems({...canvasItems, top: null})} className="absolute top-4 right-4 z-30 bg-white/90 border border-mocha-brown/20 text-mocha-brown shadow-md rounded-full p-2 active:bg-warm-beige">
                    <X size={14} strokeWidth={3} />
                  </button>
                </>
              )}

              {canvasItems.bottom && (
                <>
                  <div className="absolute top-[45%] left-0 w-full h-[55%] z-10 flex justify-center items-center pointer-events-none mix-blend-multiply">
                    <img src={canvasItems.bottom.image} alt="Bottom" className="w-full h-full object-contain scale-110" />
                  </div>
                  <button onClick={() => setCanvasItems({...canvasItems, bottom: null})} className="absolute bottom-4 right-4 z-30 bg-white/90 border border-mocha-brown/20 text-mocha-brown shadow-md rounded-full p-2 active:bg-warm-beige">
                    <X size={14} strokeWidth={3} />
                  </button>
                </>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => setCurrentView('catalog')} className="bg-white border-2 border-mocha-brown/20 py-3 rounded-xl font-bold text-sm flex justify-center items-center gap-2 hover:bg-warm-beige transition-colors">
                <Plus size={16} /> Top
              </button>
              <button onClick={() => setCurrentView('catalog')} className="bg-white border-2 border-mocha-brown/20 py-3 rounded-xl font-bold text-sm flex justify-center items-center gap-2 hover:bg-warm-beige transition-colors">
                <Plus size={16} /> Bottom
              </button>
            </div>
            
            <button 
              onClick={handleAddOutfitToBag}
              disabled={!hasItemsOnCanvas}
              className={`w-full py-4 rounded-full font-bold text-lg shadow-lg transition-colors flex justify-center items-center gap-2 ${hasItemsOnCanvas ? 'bg-mocha-brown text-white hover:bg-mocha-brown/90' : 'bg-mocha-brown/40 text-white/70 cursor-not-allowed'}`}
            >
              <ShoppingBag size={20} /> Add Outfit to Bag
            </button>
          </div>
        )}

        {/* VIEW 4: STORE NAVIGATION */}
        {currentView === 'navigation' && (
          <div className="animate-fade-in pb-6">
            <h2 className="font-serif text-2xl font-semibold mb-2 text-center">Store Route</h2>
            <p className="text-center text-sm opacity-70 mb-6">Find your bagged items on the floor.</p>

            <div className="bg-[#EAE4D9] rounded-3xl h-56 mb-6 flex items-center justify-center relative overflow-hidden shadow-inner border-2 border-mocha-brown/10">
               <StoreMap items={bagItems} />
            </div>

            <h3 className="font-bold mb-4 px-2">Item Locations</h3>
            <div className="space-y-3">
              {bagItems.map((item, index) => (
                <div key={index} className="flex gap-4 bg-white p-4 rounded-2xl border border-mocha-brown/10 shadow-sm items-center">
                  <div className="w-16 h-16 bg-warm-beige rounded-xl p-2 shrink-0 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply contrast-125" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight mb-1">{item.name}</h4>
                    <div className="flex items-start gap-1 text-sage-green">
                      <MapPin size={16} className="mt-0.5 shrink-0" />
                      <span className="text-sm font-semibold">{item.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setCurrentView('bag')} className="w-full mt-6 bg-white border-2 border-mocha-brown/20 text-mocha-brown py-4 rounded-full font-bold shadow-sm hover:bg-warm-beige transition-colors">
              Back to Bag
            </button>
          </div>
        )}

        {/* VIEW 5: SHOPPING BAG */}
        {currentView === 'bag' && (
          <div className="animate-fade-in pb-6">
            <h2 className="font-serif text-2xl font-semibold mb-2 text-center">Outfit Summary</h2>
            <p className="text-center text-sm opacity-70 mb-6">Review your styled items.</p>

            {bagItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-mocha-brown/10 shadow-sm mt-10">
                <ShoppingBag size={48} className="mx-auto text-mocha-brown/20 mb-4" />
                <h3 className="font-bold text-lg mb-2">Your bag is empty</h3>
                <p className="text-sm opacity-70 mb-6">Style an outfit on the canvas and add it here!</p>
                <button 
                  onClick={() => setCurrentView('catalog')}
                  className="bg-mocha-brown text-warm-beige px-6 py-3 rounded-full font-bold shadow-md hover:bg-mocha-brown/90 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {bagItems.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl border border-mocha-brown/10 shadow-sm items-center relative">
                      <button 
                        onClick={() => setBagItems(bagItems.filter(i => i.id !== item.id))} 
                        className="absolute top-2 right-2 opacity-40 hover:opacity-100 p-2 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                      <div className="w-20 h-20 bg-warm-beige rounded-xl p-2 shrink-0 flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply contrast-125" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm leading-tight mb-1 pr-6">{item.name}</h4>
                        <p className="text-xs opacity-70 mb-2">Size: {item.sizes[1]}</p>
                        <p className="font-bold text-sage-green">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl p-5 border border-mocha-brown/10 shadow-sm mb-6">
                  <h3 className="font-bold mb-4 border-b border-mocha-brown/10 pb-2">Price Estimate</h3>
                  <div className="flex justify-between mb-2 text-sm opacity-80">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-4 text-sm opacity-80">
                    <span>Estimated Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-mocha-brown/10">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setCurrentView('navigation')}
                  className="w-full bg-sage-green text-white py-4 rounded-full font-bold text-lg shadow-lg hover:bg-sage-green/90 transition-colors flex justify-center items-center gap-2"
                >
                  <MapPin size={20} /> Find Items in Store
                </button>
              </>
            )}
          </div>
        )}

        {/* VIEW 6: SAVED / WISHLIST */}
        {currentView === 'saved' && (
          <div className="animate-fade-in pb-6">
            <h2 className="font-serif text-2xl font-semibold mb-2 text-center">Saved Styles</h2>
            <p className="text-center text-sm opacity-70 mb-6">Your curated wishlist.</p>

            {savedItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-mocha-brown/10 shadow-sm mt-10">
                <Heart size={48} className="mx-auto text-mocha-brown/20 mb-4" />
                <h3 className="font-bold text-lg mb-2">No saved items yet</h3>
                <p className="text-sm opacity-70 mb-6">Tap the heart on items you love to save them here.</p>
                <button 
                  onClick={() => setCurrentView('catalog')}
                  className="bg-mocha-brown text-warm-beige px-6 py-3 rounded-full font-bold shadow-md hover:bg-mocha-brown/90 transition-colors"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {savedItems.map((item) => (
                  <div key={item.id} onClick={() => handleProductClick(item)} className="cursor-pointer group relative">
                    <button 
                      onClick={(e) => toggleSave(e, item)}
                      className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 rounded-full shadow-sm text-red-500 hover:scale-110 transition-transform"
                    >
                      <Heart size={16} fill="currentColor" />
                    </button>
                    <div className="aspect-[3/4] rounded-2xl mb-2 flex items-center justify-center shadow-sm border border-mocha-brown/10 overflow-hidden group-hover:shadow-md transition-all bg-white p-2">
                       <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply contrast-125" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm leading-tight truncate w-full">{item.name}</h3>
                      <p className="text-sm opacity-70">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-mocha-brown/10 px-6 py-4 flex justify-between items-center z-30">
        <button onClick={() => setCurrentView('catalog')} className={`flex flex-col items-center gap-1 ${currentView === 'catalog' ? 'text-mocha-brown' : 'text-mocha-brown/40'}`}>
          <Home size={24} />
          <span className="text-[10px] font-bold">Shop</span>
        </button>
        <button onClick={() => setCurrentView('canvas')} className={`flex flex-col items-center gap-1 ${currentView === 'canvas' ? 'text-mocha-brown' : 'text-mocha-brown/40'}`}>
          <Layers size={24} />
          <span className="text-[10px] font-bold">Canvas</span>
        </button>
        <button onClick={() => setCurrentView('saved')} className={`flex flex-col items-center gap-1 ${currentView === 'saved' ? 'text-mocha-brown' : 'text-mocha-brown/40'}`}>
          <Heart size={24} />
          <span className="text-[10px] font-bold">Saved</span>
        </button>
        <button onClick={() => setCurrentView('bag')} className={`flex flex-col items-center gap-1 ${(currentView === 'bag' || currentView === 'navigation') ? 'text-mocha-brown' : 'text-mocha-brown/40'}`}>
          <ShoppingBag size={24} />
          <span className="text-[10px] font-bold">Bag</span>
        </button>
      </nav>

    </div>
  );
}