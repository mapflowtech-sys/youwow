'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import AuthModal from './components/AuthModal';
import PartnersList from './components/PartnersList';
import PartnerStats from './components/PartnerStats';
import CreatePartnerModal from './components/CreatePartnerModal';
import type { Partner } from '@/types/affiliate';

export default function AdminPartnersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем авторизацию
  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_auth');
    if (authStatus !== 'true') {
      setIsLoading(false);
    }
  }, []);

  // Загружаем список партнёров
  const loadPartners = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/partners/list');
      const data = await response.json();

      if (data.success) {
        setPartners(data.partners);

        // Автовыбор первого партнёра
        if (data.partners.length > 0 && !selectedPartnerId) {
          setSelectedPartnerId(data.partners[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading partners:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPartnerId]);

  // Обработчик успешной авторизации
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    loadPartners();
  };

  // Обработчик создания нового партнёра
  const handlePartnerCreated = (newPartner: Partner) => {
    setPartners(prev => [newPartner, ...prev]);
    setSelectedPartnerId(newPartner.id);
    setIsCreateModalOpen(false);
  };

  // Если не авторизован - показываем модальное окно
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
        <AuthModal onSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">
                YouWow
              </h1>
              <span className="text-white/60">|</span>
              <span className="text-white/80">Админ-панель партнёров</span>
            </div>

            <button
              onClick={() => {
                sessionStorage.removeItem('admin_auth');
                setIsAuthenticated(false);
              }}
              className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - список партнёров */}
          <div className="lg:col-span-3">
            <PartnersList
              partners={partners}
              selectedPartnerId={selectedPartnerId}
              onSelectPartner={setSelectedPartnerId}
              onCreatePartner={() => setIsCreateModalOpen(true)}
              isLoading={isLoading}
            />
          </div>

          {/* Main Panel - статистика */}
          <div className="lg:col-span-9">
            {selectedPartnerId ? (
              <PartnerStats
                partnerId={selectedPartnerId}
                onPartnerUpdate={loadPartners}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-12 text-center"
              >
                <p className="text-white/60 text-lg">
                  Выберите партнёра из списка или создайте нового
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно создания партнёра */}
      <CreatePartnerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handlePartnerCreated}
      />
    </div>
  );
}
