import React, { useState, useEffect } from 'react';
import { 
  getAllBannersAdmin, 
  saveBanners, 
  getCarouselSettings, 
  saveCarouselSettings, 
  resetBannersToDefault,
  DEFAULT_BANNERS 
} from '../../services/bannerService';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  RotateCcw, 
  Sliders, 
  Image as ImageIcon, 
  Calendar, 
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import HeroCarousel from '../../components/HeroCarousel';
import OptimizedImage from '../../components/OptimizedImage';

const PRESET_IMAGES = [
  { label: 'Hero Campaign (22K Gold Model)', url: '/assets/hero_campaign.webp' },
  { label: 'Bridal Campaign (Regal Bride)', url: '/assets/bridal_campaign.webp' },
  { label: 'Festive Campaign (Temple Gold)', url: '/assets/festival_campaign.webp' },
  { label: 'Occasion Festive', url: '/assets/occasion_festival.webp' },
  { label: 'Category Necklace (Kasu Mala)', url: '/assets/category_necklace.webp' },
  { label: 'Category Gold (Artisan Choker)', url: '/assets/category_gold.webp' },
  { label: 'Category Bangles (Nakshi)', url: '/assets/category_bangles.webp' },
  { label: 'Craftsmanship (Artisan Hand)', url: '/assets/craftsmanship.webp' },
  { label: 'Category Bridal (Jewellery Set)', url: '/assets/category_bridal.webp' },
];

const AdminHeroBanners = () => {
  const [banners, setBanners] = useState([]);
  const [settings, setSettings] = useState(getCarouselSettings());
  const [editingBanner, setEditingBanner] = useState(null);
  const [isNewBanner, setIsNewBanner] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(null);

  useEffect(() => {
    setBanners(getAllBannersAdmin());
    setSettings(getCarouselSettings());
  }, []);

  const showToast = (message) => {
    setSaveToast(message);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Reordering handlers
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...banners];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    // Update order numbers
    updated.forEach((b, i) => { b.order = i + 1; });
    setBanners(updated);
    saveBanners(updated);
    showToast('Banner moved up');
  };

  const handleMoveDown = (index) => {
    if (index === banners.length - 1) return;
    const updated = [...banners];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    // Update order numbers
    updated.forEach((b, i) => { b.order = i + 1; });
    setBanners(updated);
    saveBanners(updated);
    showToast('Banner moved down');
  };

  // Toggle active/hidden
  const handleToggleActive = (id) => {
    const updated = banners.map((b) => 
      b.id === id ? { ...b, isActive: !b.isActive } : b
    );
    setBanners(updated);
    saveBanners(updated);
    showToast('Banner visibility updated');
  };

  // Delete banner
  const handleDeleteBanner = (id) => {
    if (banners.length <= 1) {
      alert('You must keep at least 1 hero banner.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this promotional banner?')) {
      const updated = banners.filter((b) => b.id !== id);
      updated.forEach((b, i) => { b.order = i + 1; });
      setBanners(updated);
      saveBanners(updated);
      showToast('Banner deleted');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (banner) => {
    setEditingBanner({ ...banner });
    setIsNewBanner(false);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    const newBanner = {
      id: `banner-${Date.now()}`,
      order: banners.length + 1,
      isActive: true,
      badgeText: '22K BIS 916 GOLD',
      eyebrow: 'NEW COLLECTION',
      title: 'TIMELESS JEWELLERY\nFOR EVERY MOMENT',
      description: 'Handcrafted gold jewellery for celebrations, traditions and everyday elegance.',
      desktopImage: '/assets/hero_campaign.webp',
      mobileImage: '/assets/hero_campaign.webp',
      imagePosition: 'center 15%',
      primaryBtnText: 'SHOP NOW',
      primaryBtnLink: '/shop',
      secondaryBtnText: 'EXPLORE ALL',
      secondaryBtnLink: '/collections',
      theme: 'cream-gold',
      startDate: '',
      endDate: '',
    };
    setEditingBanner(newBanner);
    setIsNewBanner(true);
  };

  // Save banner form
  const handleSaveBannerForm = (e) => {
    e.preventDefault();
    let updated;
    if (isNewBanner) {
      updated = [...banners, { ...editingBanner, order: banners.length + 1 }];
    } else {
      updated = banners.map((b) => (b.id === editingBanner.id ? editingBanner : b));
    }
    setBanners(updated);
    saveBanners(updated);
    setEditingBanner(null);
    showToast(isNewBanner ? 'New banner added successfully' : 'Banner saved successfully');
  };

  // Save Carousel Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    saveCarouselSettings(settings);
    showToast('Carousel settings saved');
  };

  // Reset to defaults
  const handleResetDefaults = () => {
    if (window.confirm('Reset all hero banners and settings to initial factory defaults?')) {
      const reset = resetBannersToDefault();
      setBanners(reset.banners);
      setSettings(reset.settings);
      showToast('Reset to default promotional banners');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-lumiere-deep text-white px-5 py-3 rounded shadow-lg border border-lumiere-gold flex items-center gap-2 animate-fadeIn">
          <Check size={18} className="text-lumiere-gold" />
          <span className="text-xs font-semibold tracking-wide">{saveToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-lumiere-border">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-lumiere-gold uppercase mb-1">
            <span>HOMEPAGE MANAGEMENT</span>
            <span>·</span>
            <span>HERO BANNERS</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-lumiere-charcoal uppercase">
            Hero Banner Carousel
          </h1>
          <p className="text-xs text-lumiere-muted mt-1">
            Configure dynamic promotional campaigns, seasonal schedules, and rotating interval timings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreviewOpen(!previewOpen)}
            className="inline-flex items-center gap-2 bg-white border border-lumiere-border hover:border-lumiere-gold text-lumiere-text px-4 py-2 text-xs font-semibold rounded uppercase tracking-wider transition-colors"
          >
            <Eye size={15} />
            <span>{previewOpen ? 'Hide Preview' : 'Live Preview'}</span>
          </button>
          
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-lumiere-deep hover:bg-lumiere-gold text-white px-4 py-2 text-xs font-semibold rounded uppercase tracking-wider transition-colors shadow-sm"
          >
            <Plus size={16} />
            <span>Add New Banner</span>
          </button>
        </div>
      </div>

      {/* Live Preview Box */}
      {previewOpen && (
        <div className="bg-white border-2 border-lumiere-gold/40 rounded-lg p-4 shadow-elevated animate-fadeIn">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-lumiere-border">
            <span className="text-xs font-bold text-lumiere-gold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>Live Carousel Preview</span>
            </span>
            <span className="text-[11px] text-lumiere-muted">
              Auto-rotating every {(settings.autoplayInterval / 1000).toFixed(1)}s
            </span>
          </div>
          <div className="rounded overflow-hidden border border-lumiere-border">
            <HeroCarousel />
          </div>
        </div>
      )}

      {/* Banner List Table / Cards */}
      <div className="bg-white border border-lumiere-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 bg-lumiere-cream/30 border-b border-lumiere-border flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-lumiere-text uppercase">
            Active Campaign Banners ({banners.length})
          </h2>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-[11px] text-lumiere-muted hover:text-lumiere-gold flex items-center gap-1 transition-colors"
            title="Restore default 4 campaigns"
          >
            <RotateCcw size={13} />
            <span>Reset to Defaults</span>
          </button>
        </div>

        <div className="divide-y divide-lumiere-border">
          {banners.map((banner, index) => {
            const isFirst = index === 0;
            const isLast = index === banners.length - 1;
            const hasSchedule = banner.startDate || banner.endDate;

            return (
              <div 
                key={banner.id}
                className={`p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
                  banner.isActive ? 'hover:bg-lumiere-bg/40' : 'bg-gray-50/80 opacity-75'
                }`}
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <span className="font-serif font-bold text-sm text-lumiere-muted w-6 text-center shrink-0">
                    0{index + 1}
                  </span>

                  {/* Thumbnail */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded bg-lumiere-cream border border-lumiere-border overflow-hidden shrink-0 relative">
                    <OptimizedImage 
                      src={banner.desktopImage} 
                      alt={banner.eyebrow}
                      className="w-full h-full object-cover" 
                      sizes="thumbnail"
                      aspectRatio="1/1"
                    />
                    {!banner.isActive && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[9px] font-bold uppercase">
                        Hidden
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lumiere-cream border border-lumiere-border text-lumiere-gold uppercase tracking-wider">
                        {banner.eyebrow || 'Campaign'}
                      </span>
                      {banner.badgeText && (
                        <span className="text-[9px] font-semibold text-lumiere-muted uppercase">
                          · {banner.badgeText}
                        </span>
                      )}
                      {hasSchedule && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                          <Calendar size={10} />
                          <span>
                            {banner.startDate ? banner.startDate : 'Now'} → {banner.endDate ? banner.endDate : 'Ongoing'}
                          </span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-sm sm:text-base font-bold text-lumiere-text truncate uppercase">
                      {banner.title.replace('\n', ' — ')}
                    </h3>
                    
                    <p className="text-xs text-lumiere-muted truncate max-w-md mt-0.5">
                      {banner.description}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-lumiere-muted">
                      <span>CTA: <strong className="text-lumiere-text">{banner.primaryBtnText}</strong> ({banner.primaryBtnLink})</span>
                      <span>·</span>
                      <span>Theme: <strong className="text-lumiere-text">{banner.theme || 'cream-gold'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right: Controls (Reorder, Edit, Toggle, Delete) */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {/* Reorder Up */}
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={isFirst}
                    className={`p-2 rounded border border-lumiere-border text-lumiere-text transition-colors ${
                      isFirst ? 'opacity-30 cursor-not-allowed' : 'hover:border-lumiere-gold hover:text-lumiere-gold bg-white'
                    }`}
                    title="Move Up"
                  >
                    <ArrowUp size={15} />
                  </button>

                  {/* Reorder Down */}
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={isLast}
                    className={`p-2 rounded border border-lumiere-border text-lumiere-text transition-colors ${
                      isLast ? 'opacity-30 cursor-not-allowed' : 'hover:border-lumiere-gold hover:text-lumiere-gold bg-white'
                    }`}
                    title="Move Down"
                  >
                    <ArrowDown size={15} />
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(banner)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-lumiere-border hover:border-lumiere-gold text-lumiere-text hover:text-lumiere-gold text-xs font-semibold rounded transition-colors"
                  >
                    <Edit3 size={14} />
                    <span>Edit</span>
                  </button>

                  {/* Toggle Active / Hide */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(banner.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 border text-xs font-semibold rounded transition-colors ${
                      banner.isActive
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                        : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    {banner.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                    <span>{banner.isActive ? 'Active' : 'Hidden'}</span>
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="p-2 rounded border border-red-200 text-red-600 hover:bg-red-50 bg-white transition-colors"
                    title="Delete Banner"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Carousel Timing & Transition Settings */}
      <div className="bg-white border border-lumiere-border rounded-lg p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-lumiere-border">
          <Sliders size={18} className="text-lumiere-gold" />
          <h2 className="font-serif text-lg font-bold text-lumiere-text uppercase">
            Carousel Autoplay & Behavior Settings
          </h2>
        </div>

        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end">
          <div>
            <label className="block text-xs font-bold text-lumiere-text uppercase tracking-wider mb-1.5">
              Autoplay Interval
            </label>
            <select
              value={settings.autoplayInterval}
              onChange={(e) => setSettings({ ...settings, autoplayInterval: Number(e.target.value) })}
              className="w-full bg-lumiere-bg border border-lumiere-border text-xs px-3 py-2.5 rounded focus:outline-none focus:border-lumiere-gold"
            >
              <option value={3500}>3.5 Seconds (Fast)</option>
              <option value={4000}>4.0 Seconds</option>
              <option value={4500}>4.5 Seconds (Recommended)</option>
              <option value={5000}>5.0 Seconds</option>
              <option value={6000}>6.0 Seconds (Relaxed)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-lumiere-text uppercase tracking-wider mb-1.5">
              Transition Style
            </label>
            <select
              value={settings.transitionEffect}
              onChange={(e) => setSettings({ ...settings, transitionEffect: e.target.value })}
              className="w-full bg-lumiere-bg border border-lumiere-border text-xs px-3 py-2.5 rounded focus:outline-none focus:border-lumiere-gold"
            >
              <option value="smooth-fade-slide">Smooth Fade + Slide (Default)</option>
              <option value="fade">Subtle Crossfade</option>
              <option value="slide">Horizontal Slide</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-lumiere-deep hover:bg-lumiere-gold text-white text-xs font-semibold py-2.5 px-4 rounded uppercase tracking-wider transition-colors shadow-sm"
            >
              Save Carousel Settings
            </button>
          </div>
        </form>
      </div>

      {/* Edit / Add Modal */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-lumiere-border rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 animate-fadeIn">
            
            <div className="flex items-center justify-between pb-4 border-b border-lumiere-border mb-6">
              <div>
                <span className="text-[10px] font-bold text-lumiere-gold uppercase tracking-widest block">
                  {isNewBanner ? 'NEW BANNER' : 'EDIT BANNER'}
                </span>
                <h3 className="font-serif text-xl font-bold text-lumiere-text uppercase">
                  {isNewBanner ? 'Create Promotional Campaign' : `Edit: ${editingBanner.eyebrow || 'Banner'}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBannerForm} className="space-y-5">
              
              {/* Row 1: Eyebrow & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-lumiere-text uppercase mb-1">
                    Eyebrow / Campaign Tag *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBanner.eyebrow}
                    onChange={(e) => setEditingBanner({ ...editingBanner, eyebrow: e.target.value })}
                    placeholder="e.g. NEW COLLECTION or FESTIVE EDIT"
                    className="w-full bg-lumiere-bg border border-lumiere-border text-xs px-3 py-2.5 rounded focus:outline-none focus:border-lumiere-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-lumiere-text uppercase mb-1">
                    Authenticity Badge Text
                  </label>
                  <input
                    type="text"
                    value={editingBanner.badgeText}
                    onChange={(e) => setEditingBanner({ ...editingBanner, badgeText: e.target.value })}
                    placeholder="e.g. 22K BIS 916 GOLD"
                    className="w-full bg-lumiere-bg border border-lumiere-border text-xs px-3 py-2.5 rounded focus:outline-none focus:border-lumiere-gold"
                  />
                </div>
              </div>

              {/* Row 2: Title */}
              <div>
                <label className="block text-xs font-bold text-lumiere-text uppercase mb-1">
                  Banner Heading (Use Newline for line-break) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  placeholder="e.g. TIMELESS JEWELLERY&#10;FOR EVERY MOMENT"
                  className="w-full bg-lumiere-bg border border-lumiere-border text-xs px-3 py-2.5 rounded focus:outline-none focus:border-lumiere-gold font-serif"
                />
              </div>

              {/* Row 3: Description */}
              <div>
                <label className="block text-xs font-bold text-lumiere-text uppercase mb-1">
                  Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingBanner.description}
                  onChange={(e) => setEditingBanner({ ...editingBanner, description: e.target.value })}
                  placeholder="Handcrafted gold jewellery for celebrations, traditions and everyday elegance."
                  className="w-full bg-lumiere-bg border border-lumiere-border text-xs px-3 py-2.5 rounded focus:outline-none focus:border-lumiere-gold"
                />
              </div>

              {/* Row 4: Desktop Image & Mobile Image with Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-lumiere-text uppercase mb-1 flex items-center justify-between">
                    <span>Desktop Image URL *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBanner.desktopImage}
                    onChange={(e) => setEditingBanner({ ...editingBanner, desktopImage: e.target.value })}
                    className="w-full bg-lumiere-bg border border-lumiere-border text-xs px-3 py-2.5 rounded focus:outline-none focus:border-lumiere-gold mb-1.5"
                  />
                  {/* Preset quick selection */}
                  <select
                    onChange={(e) => {
                      if (e.target.value) setEditingBanner({ ...editingBanner, desktopImage: e.target.value });
                    }}
                    value=""
                    className="w-full bg-white border border-lumiere-border text-[11px] text-lumiere-muted px-2 py-1.5 rounded"
                  >
                    <option value="">Choose from library assets...</option>
                    {PRESET_IMAGES.map((img) => (
                      <option key={img.url} value={img.url}>{img.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-lumiere-text uppercase mb-1 flex items-center justify-between">
                    <span>Mobile Image URL *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBanner.mobileImage}
                    onChange={(e) => setEditingBanner({ ...editingBanner, mobileImage: e.target.value })}
                    className="w-full bg-lumiere-bg border border-lumiere-border text-xs px-3 py-2.5 rounded focus:outline-none focus:border-lumiere-gold mb-1.5"
                  />
                  {/* Preset quick selection */}
                  <select
                    onChange={(e) => {
                      if (e.target.value) setEditingBanner({ ...editingBanner, mobileImage: e.target.value });
                    }}
                    value=""
                    className="w-full bg-white border border-lumiere-border text-[11px] text-lumiere-muted px-2 py-1.5 rounded"
                  >
                    <option value="">Choose from library assets...</option>
                    {PRESET_IMAGES.map((img) => (
                      <option key={img.url} value={img.url}>{img.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Object Position & Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-lumiere-text uppercase mb-1">
                    Image Focus Position
                  </label>
                  <select
                    value={editingBanner.imagePosition || 'center 15%'}
                    onChange={(e) => setEditingBanner({ ...editingBanner, imagePosition: e.target.value })}
                    className="w-full bg-lumiere-bg border border-lumiere-border text-xs px-3 py-2.5 rounded focus:outline-none focus:border-lumiere-gold"
                  >
                    <option value="center 15%">Center 15% (Focus on Model Face/Necklace)</option>
                    <option value="center 20%">Center 20% (Bridal Focus)</option>
                    <option value="center center">Center Center (Balanced)</option>
                    <option value="center top">Center Top</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-lumiere-text uppercase mb-1">
                    Color Accent Theme
                  </label>
                  <select
                    value={editingBanner.theme || 'cream-gold'}
                    onChange={(e) => setEditingBanner({ ...editingBanner, theme: e.target.value })}
                    className="w-full bg-lumiere-bg border border-lumiere-border text-xs px-3 py-2.5 rounded focus:outline-none focus:border-lumiere-gold"
                  >
                    <option value="cream-gold">Warm Cream & Gold (Classic Identity)</option>
                    <option value="bridal-crimson">Bridal Crimson (Warm Festive Rose)</option>
                    <option value="festive-maroon">Festive Maroon (Utsav Gold & Maroon)</option>
                    <option value="luxury-offer">Luxury Offer (Deep Amber & Gold)</option>
                  </select>
                </div>
              </div>

              {/* Row 6: CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-lumiere-text uppercase mb-1">
                    Primary Button Text & Link *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Button Text"
                      value={editingBanner.primaryBtnText}
                      onChange={(e) => setEditingBanner({ ...editingBanner, primaryBtnText: e.target.value })}
                      className="bg-lumiere-bg border border-lumiere-border text-xs px-3 py-2 rounded focus:outline-none focus:border-lumiere-gold"
                    />
                    <input
                      type="text"
                      required
                      placeholder="/shop"
                      value={editingBanner.primaryBtnLink}
                      onChange={(e) => setEditingBanner({ ...editingBanner, primaryBtnLink: e.target.value })}
                      className="bg-lumiere-bg border border-lumiere-border text-xs px-3 py-2 rounded focus:outline-none focus:border-lumiere-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-lumiere-text uppercase mb-1">
                    Secondary Button (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="e.g. EXPLORE ALL"
                      value={editingBanner.secondaryBtnText || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, secondaryBtnText: e.target.value })}
                      className="bg-lumiere-bg border border-lumiere-border text-xs px-3 py-2 rounded focus:outline-none focus:border-lumiere-gold"
                    />
                    <input
                      type="text"
                      placeholder="/collections"
                      value={editingBanner.secondaryBtnLink || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, secondaryBtnLink: e.target.value })}
                      className="bg-lumiere-bg border border-lumiere-border text-xs px-3 py-2 rounded focus:outline-none focus:border-lumiere-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Row 7: Scheduling (Optional) */}
              <div className="p-4 bg-lumiere-cream/30 border border-lumiere-border rounded">
                <span className="text-xs font-bold text-lumiere-text uppercase block mb-2 flex items-center gap-1.5">
                  <Calendar size={14} className="text-lumiere-gold" />
                  <span>Optional Campaign Scheduling</span>
                </span>
                <p className="text-[11px] text-lumiere-muted mb-3">
                  Set optional start and end dates. The carousel will automatically hide this banner after the end date expires.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-lumiere-text uppercase mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={editingBanner.startDate || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, startDate: e.target.value })}
                      className="w-full bg-white border border-lumiere-border text-xs px-3 py-2 rounded focus:outline-none focus:border-lumiere-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-lumiere-text uppercase mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={editingBanner.endDate || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, endDate: e.target.value })}
                      className="w-full bg-white border border-lumiere-border text-xs px-3 py-2 rounded focus:outline-none focus:border-lumiere-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="bannerIsActive"
                  checked={editingBanner.isActive}
                  onChange={(e) => setEditingBanner({ ...editingBanner, isActive: e.target.checked })}
                  className="w-4 h-4 text-lumiere-gold rounded border-lumiere-border focus:ring-lumiere-gold"
                />
                <label htmlFor="bannerIsActive" className="text-xs font-bold text-lumiere-text uppercase cursor-pointer">
                  Banner is Active and Visible on Homepage
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-lumiere-border">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-5 py-2.5 border border-lumiere-border hover:bg-gray-100 text-xs font-semibold rounded uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-lumiere-deep hover:bg-lumiere-gold text-white text-xs font-semibold rounded uppercase tracking-wider transition-colors shadow-sm"
                >
                  {isNewBanner ? 'Create Banner' : 'Save Changes'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminHeroBanners;
