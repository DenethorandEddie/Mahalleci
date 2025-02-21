import React from 'react';
import Layout from '../components/Layout';

export default function KVKKAydinlatmaMetni() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">KVKK Aydınlatma Metni</h1>
        <div className="prose max-w-none">
          <p className="text-lg">
            6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında 
            kişisel verilerinizin işlenmesi hakkında bilgilendirme.
          </p>
        </div>
      </div>
    </Layout>
  );
} 