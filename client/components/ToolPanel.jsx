import { useEffect, useState } from "react";
import { tools, systemInstructions } from "../../toolsConfig.js"; 
import * as bankApi from "../../oepsasApi.js"; 


const toolFunctions = {
  get_customer_data_for_call: async (params) => {
    
    return await bankApi.getCustomerDataForCall(params.customerId);
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


const sessionUpdate = {
  type: "session.update",
  session: {
    instructions: systemInstructions,
    tools: tools,
    tool_choice: "auto",
  },
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

  useEffect(() => {
    if (!events || events.length === 0) return;

    const firstEvent = events[events.length - 1];
    
    if (!toolsAdded && firstEvent.type === "session.created") {
      console.log("Oturum oluşturuldu, Yapı Kredi araçları ve talimatları ile güncelleniyor...");
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
              const functionName = output.name;
              const functionArgs = JSON.parse(output.arguments);
              
              if (toolFunctions[functionName]) {
                console.log(`Fonksiyon çalıştırılıyor: ${functionName}`, functionArgs);
                const result = await toolFunctions[functionName](functionArgs);
                console.log(`Fonksiyon sonucu:`, result);
                
               
                setTimeout(() => {
                  sendClientEvent({
                    type: "conversation.item.create",
                    item: {
                      type: "function_call_output",
                      call_id: output.call_id,
                      output: JSON.stringify(result)
                    }
                  });
                
                  sendClientEvent({ type: "response.create" });
                }, 500);
              } else {
                console.error(`Hata: Fonksiyon bulunamadı: ${functionName}`);
                
                setTimeout(() => {
                  sendClientEvent({
                    type: "conversation.item.create",
                    item: {
                      type: "function_call_output",
                      call_id: output.call_id,
                      output: JSON.stringify({ error: `Function ${functionName} not implemented` })
                    }
                  });
                  sendClientEvent({ type: "response.create" });
                }, 500);
              }
            } catch (error) {
              console.error("Fonksiyon çalıştırılırken bir hata oluştu:", error);
             
              setTimeout(() => {
                sendClientEvent({
                  type: "conversation.item.create",
                  item: {
                    type: "function_call_output",
                    call_id: output.call_id,
                    output: JSON.stringify({ error: error.message })
                  }
                });
                sendClientEvent({ type: "response.create" });
              }, 500);
            } finally {
              setIsProcessing(false);
            }
          }
        }
      });
    }
  }, [events, toolsAdded, sendClientEvent, isProcessing]);


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
          <p>Oturumu başlatın...</p>
        )}
      </div>
    </section>
  );
}