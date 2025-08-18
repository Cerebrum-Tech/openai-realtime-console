import { useEffect, useState } from "react";
import { tools, systemPrompts, defaultPromptKey } from "../../toolsConfig.js"; 
import * as bankApi from "../../oepsasApi.js"; 

// YENİ: İsimleri Müşteri ID'lerine çevirmek için bir harita (sözlük)
// Harf büyüklüğü sorunlarını önlemek için tüm isimler küçük harfle yazılmıştır.
const customerNameToIdMap = {
  "zeynep yılmaz": "3",
  "mehmet kaya": "4",
  "ayşe demir": "5",
  "tolga tunç": "1",
  "alp eren özalp": "2"
};

// GÜNCELLENMİŞ: API fonksiyonlarına tüm parametre nesnesini geçirmek daha güvenlidir.
const toolFunctions = {
  get_customer_data_for_call: async (params) => {
    return await bankApi.getCustomerDataForCall(params);
  },
  apply_for_esnek_hesap: async (params) => {
    return await bankApi.applyForEsnekHesap(params);
  },
  schedule_callback: async (params) => {
    return await bankApi.scheduleCallback(params);
  },
  log_call_outcome: async (params) => {
    return await bankApi.logCallOutcome(params);
  },
  request_agent_transfer: async (params) => {
    return await bankApi.requestAgentTransfer(params);
  }
};


function FunctionCallOutput({ functionCallOutput }) {
  const { name, arguments: args } = functionCallOutput;
  
  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold">Fonksiyon: {name}</p>
      <pre className="text-xs bg-gray-100 rounded-md p-2 overflow-x-auto">
        {JSON.stringify(JSON.parse(args), null, 2)}
      </pre>
    </div>
  );
}


export default function ToolPanel({
  isSessionActive,
  sendClientEvent,
  events,
}) {
  const [toolsAdded, setToolsAdded] = useState(false);
  const [functionCallOutputs, setFunctionCallOutputs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPromptKey, setSelectedPromptKey] = useState(defaultPromptKey);

  const handlePromptChange = (event) => {
    setSelectedPromptKey(event.target.value);
  };

  
  useEffect(() => {
    if (!events || events.length === 0) return;

    const firstEvent = events[events.length - 1];
    
    if (!toolsAdded && firstEvent.type === "session.created") {
      console.log("Oturum oluşturuldu, seçilen rolün talimatları ile güncelleniyor:", selectedPromptKey);
      
      const sessionUpdate = {
        type: "session.update",
        session: {
          instructions: systemPrompts[selectedPromptKey].instructions,
          tools: tools,
          tool_choice: "auto",
        },
      };

      sendClientEvent(sessionUpdate);
      setToolsAdded(true);
    }

    const mostRecentEvent = events[0];
    
    if (
      mostRecentEvent.type === "response.done" &&
      mostRecentEvent.response.output
    ) {
      mostRecentEvent.response.output.forEach(async (output) => {
        if (output.type === "function_call") {
          console.log("Asistandan fonksiyon çağrısı alındı:", output);
          setFunctionCallOutputs(prev => [...prev, output]);
          
          if (!isProcessing) {
            setIsProcessing(true);
            try {
              // GÜNCELLENMİŞ VE AKILLI TRY/CATCH BLOĞU
              const functionName = output.name;
              let functionArgs = JSON.parse(output.arguments); // Değişebileceği için 'let' kullanıldı
              
              // ---------- AKILLI ÇEVİRİ MANTIĞI BAŞLANGICI ----------
              // Eğer çağrılan fonksiyon 'get_customer_data_for_call' ise ve customerId argümanı varsa
              if (functionName === 'get_customer_data_for_call' && functionArgs.customerId) {
                  const customerIdArg = functionArgs.customerId.toLowerCase().trim();
                  
                  // Eğer gelen argüman bir isim ise (haritada var mı diye kontrol et)
                  if (customerNameToIdMap[customerIdArg]) {
                      const newId = customerNameToIdMap[customerIdArg];
                      console.log(`[İsimden ID'ye Çeviri] '${customerIdArg}' ismi, '${newId}' ID'sine çevrildi.`);
                      // Fonksiyon argümanlarını doğru ID ile güncelle
                      functionArgs.customerId = newId;
                  }
              }
         

              if (toolFunctions[functionName]) {
                console.log(`Fonksiyon çalıştırılıyor: ${functionName}`, functionArgs);
                const result = await toolFunctions[functionName](functionArgs);
                console.log(`Fonksiyon sonucu başarıyla alındı:`, result);
                
               
                sendClientEvent({
                  type: "conversation.item.create",
                  item: {
                    type: "function_call_output",
                    call_id: output.call_id,
                    output: JSON.stringify(result)
                  }
                });
              
                sendClientEvent({ type: "response.create" });
              } else {
                console.error(`Hata: Fonksiyon bulunamadı: ${functionName}`);
                sendClientEvent({
                  type: "conversation.item.create",
                  item: {
                    type: "function_call_output",
                    call_id: output.call_id,
                    output: JSON.stringify({ error: `Fonksiyon ${functionName} bulunamadı.` })
                  }
                });
                sendClientEvent({ type: "response.create" });
              }
            } catch (error) {
              console.error("Fonksiyon çalıştırılırken bir hata oluştu:", error);
              sendClientEvent({
                type: "conversation.item.create",
                item: {
                  type: "function_call_output",
                  call_id: output.call_id,
                  output: JSON.stringify({ error: "API işlemi sırasında bir hata oluştu.", details: error.message })
                }
              });
              sendClientEvent({ type: "response.create" });
            } finally {
              setIsProcessing(false);
            }
          }
        }
      });
    }
  }, [events, toolsAdded, sendClientEvent, isProcessing, selectedPromptKey]);


  useEffect(() => {
    if (!isSessionActive) {
      setToolsAdded(false);
      setFunctionCallOutputs([]);
      setIsProcessing(false);
    }
  }, [isSessionActive]);

  return (
    <section className="h-full w-full flex flex-col gap-4">
      <div className="h-full bg-gray-50 rounded-md p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Yapı Kredi Asistan Araçları</h2>

        <div className="mb-4">
          <label htmlFor="prompt-select" className="block text-sm font-medium text-gray-700 mb-1">
            Asistan Rolünü Seçin
          </label>
          <select
            id="prompt-select"
            value={selectedPromptKey}
            onChange={handlePromptChange}
            disabled={isSessionActive} 
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-200"
          >
            {Object.entries(systemPrompts).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {isSessionActive ? (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Yapı Kredi Dijital Satış Asistanı aktif. Müşteri görüşmesi için hazır.
              </p>
            </div>
            {functionCallOutputs.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="font-semibold">Çağrılan Fonksiyonlar:</h3>
                {functionCallOutputs.slice(-5).map((output, index) => (
                  <div key={index} className="border rounded p-2">
                    <FunctionCallOutput functionCallOutput={output} />
                  </div>
                ))}
              </div>
            )}
            {isProcessing && (
              <div className="mt-4">
                <p className="text-sm text-blue-600">İşlem yapılıyor...</p>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500">Rolü seçip oturumu başlatın...</p>
        )}
      </div>
    </section>
  );
}