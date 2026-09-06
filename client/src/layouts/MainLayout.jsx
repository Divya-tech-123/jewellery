import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AnnouncementBar from '../components/AnnouncementBar';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import SearchDrawer from '../components/SearchDrawer';
import QuickViewModal from '../components/QuickViewModal';
import ConsultationModal from '../components/ConsultationModal';
import StoreLocatorModal from '../components/StoreLocatorModal';

const MainLayout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isStoreLocatorOpen, setIsStoreLocatorOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [consultationSubject, setConsultationSubject] = useState('');

  const handleOpenConsultation = (subject = '') => {
    setConsultationSubject(subject);
    setIsConsultationOpen(true);
  };

  const handleOpenQuickView = (product) => {
    setQuickViewProduct(product);
  };

  return (
    <div className="min-h-screen flex flex-col bg-lumiere-bg text-lumiere-text pb-16 lg:pb-0">
      <AnnouncementBar onOpenStoreLocator={() => setIsStoreLocatorOpen(true)} />
      
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      <main className="flex-1">
        <Outlet context={{ onQuickView: handleOpenQuickView, onOpenConsultation: handleOpenConsultation }} />
      </main>

      <Footer onOpenStoreLocator={() => setIsStoreLocatorOpen(true)} />

      {/* Mobile Fixed Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Drawers & Modals */}
      <CartDrawer />
      
      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <QuickViewModal
        isOpen={!!quickViewProduct}
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenConsultation={handleOpenConsultation}
      />

      <ConsultationModal
        isOpen={isConsultationOpen}
        initialItemName={consultationSubject}
        onClose={() => setIsConsultationOpen(false)}
      />

      <StoreLocatorModal
        isOpen={isStoreLocatorOpen}
        onClose={() => setIsStoreLocatorOpen(false)}
        onBookConsultation={() => handleOpenConsultation('Boutique Private Chamber')}
      />
    </div>
  );
};

export default MainLayout;
