
import fs from 'fs';
import axios from 'axios';
const YAPIKREDI_API_BASE_URL = "https://api.yapikredi.com/v1/assistant";
const LOG_FILE_PATH = './call_back.json';


const mockCustomerDatabase = {
  "1": { 
    customerName: "Tolga Tunç",
    currentEhLimit: 15000,
    ehPreApprovalLimit: 150000,
    ehInterestRate: 5.00,
    bikPreApprovalLimit: 200000,
    bikInterestRate: 4.59,
    hasCreditCard: true,
    creditCardLimit: 80000,
  },
  "2": { 
    customerName: "Alp Eren Özalp",
    currentEhLimit: 10000,
    ehPreApprovalLimit: 100000,
    ehInterestRate: 5.00,
    bikPreApprovalLimit: 150000,
    bikInterestRate: 4.65,
    hasCreditCard: true,
    creditCardLimit: 50000,
  },
  "3": { 
    customerName: "Zeynep Yılmaz",
    currentEhLimit: 5000,
    ehPreApprovalLimit: 25000,
    ehInterestRate: 5.10,
    bikPreApprovalLimit: null, // BIK ön onayı yok
    bikInterestRate: null,
    hasCreditCard: true,
    creditCardLimit: 30000,
  },
  "4": { 
    customerName: "Mehmet Kaya",
    currentEhLimit: 0,
    ehPreApprovalLimit: null, 
    ehInterestRate: null,
    bikPreApprovalLimit: 75000,
    bikInterestRate: 4.85,
    hasCreditCard: false,
    creditCardLimit: 0,
  },
  "5": { 
    customerName: "Ayşe Demir",
    currentEhLimit: 0,
    ehPreApprovalLimit: null,
    ehInterestRate: null,
    bikPreApprovalLimit: null,
    bikInterestRate: null,
    hasCreditCard: true,
    creditCardLimit: 15000,
  }
};

const appendToLog = (logData) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...logData,
  };
  
  fs.appendFile(LOG_FILE_PATH, JSON.stringify(logEntry) + '\n', (err) => {
    if (err) {
      console.error('Log dosyasına yazılırken hata oluştu:', err);
    }
  });
};

export const getCustomerDataForCall = async ({ customerId }) => {
  console.log(`MOCK API - Müşteri verisi isteniyor: ID ${customerId}`);

  return new Promise((resolve, reject) => {
    setTimeout(() => { 
      const customerData = mockCustomerDatabase[customerId];
      if (customerData) {
        console.log(`MOCK API - Veri bulundu ve döndürülüyor:`, customerData);
        resolve(customerData);
      } else {
        const errorMsg = `Müşteri ID'si '${customerId}' ile bulunamadı.`;
        console.error(`MOCK API HATA - ${errorMsg}`);
        reject(new Error(errorMsg));
      }
    }, 500); 
  });
};


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