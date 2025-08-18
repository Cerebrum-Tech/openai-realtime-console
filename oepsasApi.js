
import fs from 'fs';
import axios from 'axios';


const YAPIKREDI_API_BASE_URL = "https://api.yapikredi.com/v1/assistant"; 


// Arama için müşteri verilerini çeker
export const getCustomerDataForCall = async (customerId) => {
  // NOT: Bu endpoint'ler varsayımsaldır. Kendi backend'inize göre düzenleyin.
  const url = `${YAPIKREDI_API_BASE_URL}/customers/${customerId}/call-data`;
  try {
    const response = await axios.get(url);
    console.log(`API Response (Customer Data): ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    console.error(`API ERROR - getCustomerDataForCall: ${error.response?.data?.message}`);
    throw new Error("Müşteri verileri alınırken bir hata oluştu.");
  }
};

// Esnek Hesap başvurusu oluşturur
export const applyForEsnekHesap = async (data) => {
  console.log(`MOCK API - Esnek Hesap başvurusu alındı:`, data);
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = {
        success: true,
        applicationId: `APP-${Date.now()}`,
        message: "Esnek Hesap başvurunuz başarıyla alınmıştır. Sonucu SMS ile bildirilecektir."
      };
      console.log(`MOCK API - Başvuru yanıtı:`, response);
      resolve(response);
    }, 1000);
  });
};


export const scheduleCallback = async (data) => {
  console.log(`API İstemcisi: Geri arama talebi sunucuya gönderiliyor...`, data);
  try {
  
    const response = await axios.post('/api/save-callback', data);
    
    console.log('Sunucudan gelen başarılı yanıt:', response.data);
  
    return response.data; 
  } catch (error) {
 
    console.error('Geri arama kaydı sırasında API hatası:', error.response?.data || error.message);
  
    throw new Error("Geri arama talebi sunucuya kaydedilemedi.");
  }
};


export const logCallOutcome = async (data) => {
  console.log(`MOCK API - Arama sonucu kaydedildi:`, data);
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = { success: true, message: "Arama sonucu başarıyla kaydedildi." };
      console.log(`MOCK API - Arama sonucu yanıtı:`, response);
      resolve(response);
    }, 300);
  });
};


export const requestAgentTransfer = async (data) => {
  console.log(`MOCK API - Temsilciye aktarım talebi:`, data);
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = {
        success: true,
        transferId: `TR-${Date.now()}`,
        message: "Talebiniz alınmıştır. Sizi en kısa sürede canlı temsilcimize aktarıyorum, lütfen hatta kalınız."
      };
      console.log(`MOCK API - Aktarım yanıtı:`, response);
      resolve(response);
    }, 1200);
  });
};