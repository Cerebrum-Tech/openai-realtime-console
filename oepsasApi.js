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
  const url = `${YAPIKREDI_API_BASE_URL}/applications/esnek-hesap`;
  try {
    const response = await axios.post(url, data); // data = { customerId, limit }
    console.log(`API Response (Apply Esnek Hesap): ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    console.error(`API ERROR - applyForEsnekHesap: ${error.response?.data?.message}`);
    throw new Error("Esnek Hesap başvurusu oluşturulurken bir hata meydana geldi.");
  }
};

// Geri arama talebi kaydeder
export const scheduleCallback = async (data) => {
  const url = `${YAPIKREDI_API_BASE_URL}/callbacks`;
  try {
    const response = await axios.post(url, data); // data = { customerId, dateTime }
    console.log(`API Response (Schedule Callback): ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    console.error(`API ERROR - scheduleCallback: ${error.response?.data?.message}`);
    throw new Error("Geri arama talebi kaydedilemedi.");
  }
};

// Arama sonucunu kaydeder
export const logCallOutcome = async (data) => {
  const url = `${YAPIKREDI_API_BASE_URL}/call-logs`;
  try {
    const response = await axios.post(url, data); // data = { customerId, outcome, notes }
    console.log(`API Response (Log Outcome): ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    console.error(`API ERROR - logCallOutcome: ${error.response?.data?.message}`);
    throw new Error("Arama sonucu kaydedilemedi.");
  }
};

// Canlı temsilciye aktarım talebi oluşturur
export const requestAgentTransfer = async (data) => {
    const url = `${YAPIKREDI_API_BASE_URL}/transfers/agent`;
    try {
      const response = await axios.post(url, data); // data = { customerId, reason }
      console.log(`API Response (Agent Transfer): ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      console.error(`API ERROR - requestAgentTransfer: ${error.response?.data?.message}`);
      throw new Error("Temsilciye aktarım talebi oluşturulamadı.");
    }
  };