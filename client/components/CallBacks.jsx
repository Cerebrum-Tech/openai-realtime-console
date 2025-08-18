import { useEffect, useState } from "react";
import { Calendar, User, Clock, RefreshCw, ChevronDown, Trash2, Edit, Save, X } from 'react-feather';

export default function CallBacks() {
  const [callbacks, setCallbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  
  // YENİ: Düzenleme modunu ve geçici veriyi yöneten state'ler
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempData, setTempData] = useState({ aranacakMusteri: '', aranacakZaman: '' });

  // --- API İletişim Fonksiyonları ---

  const fetchCallbacks = async () => {
    setIsLoading(true);
    setEditingIndex(null); // Yenileme sırasında düzenleme modunu kapat
    try {
      const response = await fetch('/api/get-callbacks');
      const data = await response.json();
      const sortedData = data.sort((a, b) => new Date(b.aranacakZaman) - new Date(a.aranacakZaman));
      setCallbacks(sortedData);
    } catch (error) {
      console.error("Geri arama verileri alınırken hata:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // YENİ: Listeyi sunucuya kaydeden merkezi fonksiyon
  const updateCallbacksOnServer = async (newList) => {
    try {
      await fetch('/api/update-callbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newList),
      });
      // Değişiklik sonrası listeyi yeniden sunucudan çekerek arayüzü anında güncelle
      await fetchCallbacks(); 
    } catch (error) {
      console.error("Liste güncellenirken hata:", error);
    }
  };

  // --- Buton Fonksiyonları ---

  const handleDelete = (indexToDelete) => {
    if (window.confirm("Bu kaydı silmek istediğinizden emin misiniz?")) {
      const newList = callbacks.filter((_, index) => index !== indexToDelete);
      updateCallbacksOnServer(newList);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    const itemToEdit = callbacks[index];
    const localDateTime = new Date(new Date(itemToEdit.aranacakZaman).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    setTempData({ aranacakMusteri: itemToEdit.aranacakMusteri, aranacakZaman: localDateTime });
  };

  const handleSave = (indexToSave) => {
    const newList = [...callbacks];
    newList[indexToSave] = {
      ...newList[indexToSave],
      aranacakMusteri: tempData.aranacakMusteri,
      aranacakZaman: new Date(tempData.aranacakZaman).toISOString(),
    };
    updateCallbacksOnServer(newList);
    setEditingIndex(null);
  };

  useEffect(() => {
    fetchCallbacks();
  }, []);

  return (
    <section className="h-full w-full flex flex-col bg-gray-50 rounded-md p-4">
      <div 
        className="flex justify-between items-center mb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-bold">Geri Aranacaklar Listesi</h2>
        <div className="flex items-center gap-2">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    fetchCallbacks();
                }} 
                disabled={isLoading} 
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
            >
            <RefreshCw size={18} />
          </button>
          <ChevronDown 
            size={20} 
            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>
      
      {isExpanded && (
        <div className="overflow-y-auto flex-grow">
          {isLoading ? ( <p className="text-gray-500">Yükleniyor...</p> ) 
          : callbacks.length === 0 ? ( <p className="text-gray-500">Geri arama kaydı bulunamadı.</p> ) 
          : (
            <ul className="space-y-3">
              {callbacks.map((call, index) => (
                <li key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                  {editingIndex === index ? (
                    // --- DÜZENLEME MODU ---
                    <div className="space-y-2">
                        <input type="text" value={tempData.aranacakMusteri} onChange={(e) => setTempData({...tempData, aranacakMusteri: e.target.value})} className="w-full p-1 border rounded" />
                        <input type="datetime-local" value={tempData.aranacakZaman} onChange={(e) => setTempData({...tempData, aranacakZaman: e.target.value})} className="w-full p-1 border rounded" />
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleSave(index)} className="p-2 text-green-600 hover:text-green-800" title="Kaydet"><Save size={18}/></button>
                            <button onClick={() => setEditingIndex(null)} className="p-2 text-gray-500 hover:text-gray-700" title="İptal"><X size={18}/></button>
                        </div>
                    </div>
                  ) : (
                    // --- NORMAL GÖRÜNÜM ---
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center font-semibold text-gray-800">
                          <User size={16} className="mr-2 text-indigo-500" />
                          <span>{call.aranacakMusteri}</span>
                        </div>
                        <div className="flex items-center">
                          <button onClick={() => handleEdit(index)} className="p-1 text-blue-500 hover:text-blue-700" title="Düzenle"><Edit size={16}/></button>
                          <button onClick={() => handleDelete(index)} className="p-1 text-red-500 hover:text-red-700" title="Sil"><Trash2 size={16}/></button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-2 flex items-center">
                        <Calendar size={14} className="mr-2" />
                        <span>Aranacak Tarih: {new Date(call.aranacakZaman).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1 flex items-center">
                        <Clock size={14} className="mr-2" />
                        <span>Aranacak Saat: {new Date(call.aranacakZaman).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}