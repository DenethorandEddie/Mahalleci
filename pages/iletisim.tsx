import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Head from 'next/head';
import emailjs from '@emailjs/browser';

export default function Iletisim() {
  useEffect(() => {
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!);
  }, []);

  const [formStatus, setFormStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      if (result.text === 'OK') {
        setFormStatus('success');
        if (formRef.current) {
          formRef.current.reset();
        }
      }
    } catch (error) {
      console.error('Email gönderme hatası:', error);
      setFormStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Bize Ulaşın | Mahalleci</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="pt-0">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#dd6b20] to-[#e53e3e] w-full">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white mb-6 text-5xl font-bold"
            >
              Bize Ulaşın
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/90 max-w-3xl text-xl"
            >
              Sorularınız, önerileriniz veya işbirliği talepleriniz için bizimle iletişime geçin.
            </motion.p>
          </div>
        </div>

        {/* İletişim Bilgileri ve Form */}
        <div className="w-full bg-white dark:bg-[#0f1729]">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">İletişim Bilgileri</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                      <i className="fas fa-envelope text-orange-500"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">E-posta</h3>
                      <p className="text-gray-600 dark:text-gray-300">info@mahalleci.com</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                      <i className="fas fa-map-marker-alt text-orange-500"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Adres</h3>
                      <p className="text-gray-600 dark:text-gray-300">İstanbul, Türkiye</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">İletişim Formu</h2>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      name="from_name"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      name="from_email"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Konu
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mesaj
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    ></textarea>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Gönderiliyor...' : 'Gönder'}
                  </Button>

                  {formStatus === 'success' && (
                    <p className="text-green-500 text-center">Mesajınız başarıyla gönderildi!</p>
                  )}
                  {formStatus === 'error' && (
                    <p className="text-red-500 text-center">Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.</p>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 