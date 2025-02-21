import React from 'react';
import Layout from '../components/Layout';

export default function KullanimKosullari() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Kullanım Koşulları</h1>
        <div className="prose max-w-none">
          <p className="text-lg">
            Bu kullanım koşulları, Mahalleci platformunu kullanırken uymanız 
            gereken kuralları ve şartları belirtir.
          </p>
        </div>
      </div>
    </Layout>
  );
} 