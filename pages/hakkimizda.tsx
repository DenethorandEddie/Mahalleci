import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import Head from 'next/head';

export default function Hakkimizda() {
  return (
    <Layout>
      <Head>
        <title>Hakkımızda | Mahalleci</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="pt-0">
        {/* Hero Section - Tam genişlik */}
        <div className="bg-gradient-to-r from-[#dd6b20] to-[#e53e3e] w-full">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white mb-6 text-5xl font-bold"
            >
              Mahalleci Hakkında
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/90 max-w-3xl text-xl"
            >
              Türkiye'nin mahallelerini keşfetmenizi ve mahalleniz hakkında bilgi edinmenizi sağlayan yenilikçi platformunuz.
            </motion.p>
          </div>
        </div>

        {/* Misyon & Vizyon - Tam genişlik */}
        <div className="w-full bg-white dark:bg-[#0f1729]">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
              >
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center mb-6">
                  <i className="fas fa-bullseye text-orange-500 text-2xl"></i>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Misyonumuz</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  İnsanların mahalle seçimlerinde doğru kararlar vermelerine yardımcı olmak ve mahalle sakinleri arasında güçlü bir topluluk oluşturmak.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
              >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mb-6">
                  <i className="fas fa-eye text-blue-500 text-2xl"></i>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Vizyonumuz</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Türkiye'nin en güvenilir ve kapsamlı mahalle bilgi platformu olmak ve insanların yaşam kalitesini artırmak.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Değerlerimiz - Tam genişlik */}
        <div className="w-full bg-white dark:bg-[#0f1729]">
          <div className="max-w-7xl mx-auto px-6">
            {/* Ayırıcı çizgi */}
            <div className="border-t border-gray-200 dark:border-gray-800 mb-24"></div>
            
            <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent py-2">
              Değerlerimiz
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-24">
              {[
                {
                  icon: "fas fa-heart",
                  title: "Güvenilirlik",
                  description: "Doğru ve güncel bilgiler sunarak kullanıcılarımızın güvenini kazanıyoruz."
                },
                {
                  icon: "fas fa-users",
                  title: "Topluluk",
                  description: "Mahalle sakinleri arasında güçlü bağlar kurulmasını destekliyoruz."
                },
                {
                  icon: "fas fa-shield-alt",
                  title: "Şeffaflık",
                  description: "Tüm süreçlerimizde açık ve şeffaf bir yaklaşım benimsiyoruz."
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + (index * 0.2) }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <i className={`${value.icon} text-orange-500 text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 