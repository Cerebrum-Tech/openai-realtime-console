import axios from 'axios';

const OEPSAS_API_BASE_URL = "https://oepsas.unicevap.com";

// ========================
// SUBSCRIPTION API FUNCTIONS
// ========================

export const createSubscription = async (data) => {
  const url = `${OEPSAS_API_BASE_URL}/subscription`;
  const response = await axios.post(url, data);
  return response.data;
};

export const getAllSubscriptions = async () => {
  const url = `${OEPSAS_API_BASE_URL}/subscription`;
  const response = await axios.get(url);
  return response.data;
};

export const getSubscriptionById = async (subscriptionId) => {
  const url = `${OEPSAS_API_BASE_URL}/subscription/${subscriptionId}`;
  const response = await axios.get(url);
  return response.data;
};

export const updateSubscription = async (subscriptionId, data) => {
  const url = `${OEPSAS_API_BASE_URL}/subscription/${subscriptionId}`;
  const response = await axios.patch(url, data);
  return response.data;
};

export const deleteSubscription = async (subscriptionId) => {
  const url = `${OEPSAS_API_BASE_URL}/subscription/${subscriptionId}`;
  const response = await axios.delete(url);
  return response.data;
};

// ========================
// ABONE BİLGİLERİ API FUNCTIONS
// ========================

export const createAboneBilgileri = async (data) => {
  const url = `${OEPSAS_API_BASE_URL}/abone-bilgileri`;
  console.log(`API Request URL: ${url}`);
  console.log(`API Request Data: ${JSON.stringify(data, null, 2)}`);
  
  try {
    const response = await axios.post(url, data);
    console.log(`API Response Status: ${response.status}`);
    console.log(`API Response Data: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    console.log(`❌ API ERROR - Status: ${error.response?.status}`);
    console.log(`❌ API ERROR - Response: ${JSON.stringify(error.response?.data)}`);
    console.log(`❌ API ERROR - Request Data: ${JSON.stringify(data, null, 2)}`);
    
    // Parse and translate error messages
    if (error.response?.data?.message) {
      let errorMessage;
      if (Array.isArray(error.response.data.message)) {
        const translatedMessages = error.response.data.message.map(msg => {
          if (msg.includes("TC Kimlik Numarası 11 haneli olmalıdır")) {
            return "TC Kimlik numaranızı 11 haneli olarak giriniz";
          } else if (msg.includes("tcKimlikNo must be shorter than or equal to 11 characters")) {
            return "TC Kimlik numaranız 11 haneden uzun olamaz";
          } else if (msg.includes("Geçerli bir telefon numarası giriniz")) {
            return "Telefon numaranızı geçerli formatta giriniz (örn: 05551234567)";
          } else if (msg.toLowerCase().includes("telefon")) {
            return "Telefon numarası geçerli formatta olmalıdır";
          } else if (msg.toLowerCase().includes("email")) {
            return "E-posta adresi geçerli formatta olmalıdır";
          } else if (msg.toLowerCase().includes("adres")) {
            return "Adres bilgisi eksik veya hatalı";
          }
          return msg;
        });
        errorMessage = translatedMessages.join(", ");
      } else {
        errorMessage = error.response.data.message;
      }
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const getAllAboneBilgileri = async (page = null, limit = null, abonelikDurumu = null) => {
  const url = `${OEPSAS_API_BASE_URL}/abone-bilgileri`;
  const params = {};
  if (page !== null) params.page = page;
  if (limit !== null) params.limit = limit;
  if (abonelikDurumu !== null) params.abonelikDurumu = abonelikDurumu;
  
  const response = await axios.get(url, { params });
  return response.data;
};

export const searchAboneBilgileri = async (options = {}) => {
  const url = `${OEPSAS_API_BASE_URL}/abone-bilgileri/search`;
  const params = {};
  
  if (options.limit !== undefined && options.limit !== null) params.limit = options.limit;
  if (options.page !== undefined && options.page !== null) params.page = options.page;
  if (options.abonelikDurumu !== undefined && options.abonelikDurumu !== null) params.abonelikDurumu = options.abonelikDurumu;
  if (options.sehir !== undefined && options.sehir !== null) params.sehir = options.sehir;
  if (options.adSoyad !== undefined && options.adSoyad !== null) params.adSoyad = options.adSoyad;
  if (options.telefon !== undefined && options.telefon !== null) params.telefon = options.telefon;
  if (options.aboneNo !== undefined && options.aboneNo !== null) params.aboneNo = options.aboneNo;
  if (options.tcKimlikNo !== undefined && options.tcKimlikNo !== null) params.tcKimlikNo = options.tcKimlikNo;
  
  const response = await axios.get(url, { params });
  return response.data;
};

export const getAboneByTcKimlikNo = async (tcKimlikNo) => {
  const url = `${OEPSAS_API_BASE_URL}/abone-bilgileri/tc/${tcKimlikNo}`;
  console.log(`API Request URL: ${url}`);
  
  try {
    const response = await axios.get(url);
    console.log(`API Response Status: ${response.status}`);
    console.log(`API Response Data: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    console.log(`❌ API ERROR - Status: ${error.response?.status}`);
    console.log(`❌ API ERROR - Response: ${JSON.stringify(error.response?.data)}`);
    
    // Parse and translate error messages
    if (error.response?.data?.message) {
      let errorMessage;
      if (Array.isArray(error.response.data.message)) {
        const translatedMessages = error.response.data.message.map(msg => {
          if (msg.includes("TC Kimlik Numarası 11 haneli olmalıdır")) {
            return "TC Kimlik numaranızı 11 haneli olarak giriniz";
          } else if (msg.includes("tcKimlikNo must be shorter than or equal to 11 characters")) {
            return "TC Kimlik numaranız 11 haneden uzun olamaz";
          } else if (msg.includes("Geçerli bir telefon numarası giriniz")) {
            return "Telefon numaranızı geçerli formatta giriniz (örn: 05551234567)";
          } else if (msg.toLowerCase().includes("telefon")) {
            return "Telefon numarası geçerli formatta olmalıdır";
          } else if (msg.toLowerCase().includes("email")) {
            return "E-posta adresi geçerli formatta olmalıdır";
          } else if (msg.toLowerCase().includes("adres")) {
            return "Adres bilgisi eksik veya hatalı";
          }
          return msg;
        });
        errorMessage = translatedMessages.join(", ");
      } else {
        errorMessage = error.response.data.message;
      }
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const getAboneByAboneNo = async (aboneNo) => {
  const url = `${OEPSAS_API_BASE_URL}/abone-bilgileri/abone-no/${aboneNo}`;
  const response = await axios.get(url);
  return response.data;
};

export const getAboneByTelefon = async (telefon) => {
  const url = `${OEPSAS_API_BASE_URL}/abone-bilgileri/telefon/${telefon}`;
  const response = await axios.get(url);
  return response.data;
};

export const getAboneById = async (aboneId) => {
  const url = `${OEPSAS_API_BASE_URL}/abone-bilgileri/${aboneId}`;
  const response = await axios.get(url);
  return response.data;
};

export const updateAboneBilgileri = async (aboneId, data) => {
  const url = `${OEPSAS_API_BASE_URL}/abone-bilgileri/${aboneId}`;
  console.log(`UPDATE API Request URL: ${url}`);
  console.log(`UPDATE API Request Data: ${JSON.stringify(data, null, 2)}`);
  
  try {
    const response = await axios.patch(url, data);
    console.log(`UPDATE API Response Status: ${response.status}`);
    console.log(`UPDATE API Response Data: ${JSON.stringify(response.data)}`);
    return response.data;
  } catch (error) {
    console.log(`❌ UPDATE API ERROR - Status: ${error.response?.status}`);
    console.log(`❌ UPDATE API ERROR - Response: ${JSON.stringify(error.response?.data)}`);
    
    // Parse and translate error messages
    if (error.response?.data?.message) {
      let errorMessage;
      if (Array.isArray(error.response.data.message)) {
        const translatedMessages = error.response.data.message.map(msg => {
          if (msg.includes("TC Kimlik Numarası 11 haneli olmalıdır")) {
            return "TC Kimlik numaranızı 11 haneli olarak giriniz";
          } else if (msg.includes("tcKimlikNo must be shorter than or equal to 11 characters")) {
            return "TC Kimlik numaranız 11 haneden uzun olamaz";
          } else if (msg.includes("Geçerli bir telefon numarası giriniz")) {
            return "Telefon numaranızı geçerli formatta giriniz (örn: 05551234567)";
          } else if (msg.toLowerCase().includes("telefon")) {
            return "Telefon numarası geçerli formatta olmalıdır";
          } else if (msg.toLowerCase().includes("email")) {
            return "E-posta adresi geçerli formatta olmalıdır";
          } else if (msg.toLowerCase().includes("adres")) {
            return "Adres bilgisi eksik veya hatalı";
          }
          return msg;
        });
        errorMessage = translatedMessages.join(", ");
      } else {
        errorMessage = error.response.data.message;
      }
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const updateAboneBilgileriByTc = async (tcKimlikNo, data) => {
  console.log(`UPDATE BY TC - TC: ${tcKimlikNo}`);
  console.log(`UPDATE BY TC - Data: ${JSON.stringify(data, null, 2)}`);
  
  try {
    // First get the subscriber info by TC number
    const aboneBilgileri = await getAboneByTcKimlikNo(tcKimlikNo);
    const aboneId = aboneBilgileri.id;
    
    if (!aboneId) {
      throw new Error("Abone ID bulunamadı");
    }
    
    console.log(`UPDATE BY TC - Found abone_id: ${aboneId}`);
    
    // Now update with the actual abone_id
    return await updateAboneBilgileri(aboneId, data);
  } catch (error) {
    console.log(`❌ UPDATE BY TC ERROR: ${error}`);
    throw new Error(`TC Kimlik numarası ${tcKimlikNo} ile abone bulunamadı veya güncelleme yapılamadı: ${error.message}`);
  }
};

export const deleteAboneBilgileri = async (aboneId) => {
  const url = `${OEPSAS_API_BASE_URL}/abone-bilgileri/${aboneId}`;
  const response = await axios.delete(url);
  return response.data;
};

export const updateAbonelikDurumu = async (aboneId, data) => {
  const url = `${OEPSAS_API_BASE_URL}/abone-bilgileri/${aboneId}/abonelik-durumu`;
  const response = await axios.patch(url, data);
  return response.data;
};

export const updateBakiye = async (aboneId, data) => {
  const url = `${OEPSAS_API_BASE_URL}/abone-bilgileri/${aboneId}/bakiye`;
  const response = await axios.patch(url, data);
  return response.data;
};

// ========================
// TICKET SYSTEM API FUNCTIONS
// ========================

export const createTicket = async (data) => {
  const url = `${OEPSAS_API_BASE_URL}/tickets`;
  const response = await axios.post(url, data);
  return response.data;
};

export const getAllTickets = async (page = null, limit = null, durum = null, tip = null, oncelik = null) => {
  const url = `${OEPSAS_API_BASE_URL}/tickets`;
  const params = {};
  if (page !== null) params.page = page;
  if (limit !== null) params.limit = limit;
  if (durum !== null) params.durum = durum;
  if (tip !== null) params.tip = tip;
  if (oncelik !== null) params.oncelik = oncelik;
  
  const response = await axios.get(url, { params });
  return response.data;
};

export const searchTickets = async (options = {}) => {
  const url = `${OEPSAS_API_BASE_URL}/tickets/search`;
  const params = {};
  
  if (options.limit !== undefined && options.limit !== null) params.limit = options.limit;
  if (options.page !== undefined && options.page !== null) params.page = options.page;
  if (options.endDate !== undefined && options.endDate !== null) params.endDate = options.endDate;
  if (options.startDate !== undefined && options.startDate !== null) params.startDate = options.startDate;
  if (options.arizaAdresi !== undefined && options.arizaAdresi !== null) params.arizaAdresi = options.arizaAdresi;
  if (options.duyguAnalizi !== undefined && options.duyguAnalizi !== null) params.duyguAnalizi = options.duyguAnalizi;
  if (options.atananPersonel !== undefined && options.atananPersonel !== null) params.atananPersonel = options.atananPersonel;
  if (options.aboneId !== undefined && options.aboneId !== null) params.aboneId = options.aboneId;
  if (options.oncelik !== undefined && options.oncelik !== null) params.oncelik = options.oncelik;
  if (options.tip !== undefined && options.tip !== null) params.tip = options.tip;
  if (options.durum !== undefined && options.durum !== null) params.durum = options.durum;
  if (options.baslik !== undefined && options.baslik !== null) params.baslik = options.baslik;
  
  const response = await axios.get(url, { params });
  return response.data;
};

export const searchArizaTickets = async (limit = null, page = null, durum = null, mahalle = null, ilce = null, sehir = null) => {
  const url = `${OEPSAS_API_BASE_URL}/tickets/ariza/search`;
  const params = {};
  if (limit !== null) params.limit = limit;
  if (page !== null) params.page = page;
  if (durum !== null) params.durum = durum;
  if (mahalle !== null) params.mahalle = mahalle;
  if (ilce !== null) params.ilce = ilce;
  if (sehir !== null) params.sehir = sehir;
  
  const response = await axios.get(url, { params });
  return response.data;
};

export const getTicketDurumRaporu = async () => {
  const url = `${OEPSAS_API_BASE_URL}/tickets/reports/durum`;
  const response = await axios.get(url);
  return response.data;
};

export const getTicketDuyguRaporu = async () => {
  const url = `${OEPSAS_API_BASE_URL}/tickets/reports/duygu`;
  const response = await axios.get(url);
  return response.data;
};

export const getTicketsByAboneId = async (aboneId, page = null, limit = null) => {
  const url = `${OEPSAS_API_BASE_URL}/tickets/abone/${aboneId}`;
  const params = {};
  if (page !== null) params.page = page;
  if (limit !== null) params.limit = limit;
  
  const response = await axios.get(url, { params });
  return response.data;
};

export const getTicketByTicketNo = async (ticketNo) => {
  const url = `${OEPSAS_API_BASE_URL}/tickets/ticket-no/${ticketNo}`;
  const response = await axios.get(url);
  return response.data;
};

export const getTicketById = async (ticketId) => {
  const url = `${OEPSAS_API_BASE_URL}/tickets/${ticketId}`;
  const response = await axios.get(url);
  return response.data;
};

export const updateTicket = async (ticketId, data) => {
  const url = `${OEPSAS_API_BASE_URL}/tickets/${ticketId}`;
  const response = await axios.patch(url, data);
  return response.data;
};

export const deleteTicket = async (ticketId) => {
  const url = `${OEPSAS_API_BASE_URL}/tickets/${ticketId}`;
  const response = await axios.delete(url);
  return response.data;
};

export const updateTicketDurum = async (ticketId, data) => {
  const url = `${OEPSAS_API_BASE_URL}/tickets/${ticketId}/durum`;
  const response = await axios.patch(url, data);
  return response.data;
};

export const assignPersonelToTicket = async (ticketId, data) => {
  const url = `${OEPSAS_API_BASE_URL}/tickets/${ticketId}/personel`;
  const response = await axios.patch(url, data);
  return response.data;
};

export const updateTicketSentiment = async (ticketId, data) => {
  const url = `${OEPSAS_API_BASE_URL}/tickets/${ticketId}/sentiment`;
  const response = await axios.post(url, data);
  return response.data;
};

export const analyzeSentiment = async (data) => {
  const url = `${OEPSAS_API_BASE_URL}/tickets/sentiment/analyze`;
  const response = await axios.post(url, data);
  return response.data;
};