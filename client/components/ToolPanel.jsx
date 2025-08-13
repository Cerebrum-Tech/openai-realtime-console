import { useEffect, useState } from "react";
import { tools, systemInstructions } from "../../toolsConfig.js";
import * as oepsasApi from "../../oepsasApi.js";

// Tool function implementations
const toolFunctions = {
  // Abone Bilgileri API
  create_abone_bilgileri: async (params) => {
    const data = { ...params, bakiye: 0 };
    return await oepsasApi.createAboneBilgileri(data);
  },
  get_abone_by_tc_kimlik_no: async (params) => {
    return await oepsasApi.getAboneByTcKimlikNo(params.tc_kimlik_no);
  },
  get_abone_by_abone_no: async (params) => {
    return await oepsasApi.getAboneByAboneNo(params.abone_no);
  },
  get_abone_by_telefon: async (params) => {
    return await oepsasApi.getAboneByTelefon(params.telefon);
  },
  get_abone_by_id: async (params) => {
    return await oepsasApi.getAboneById(params.abone_id);
  },
  update_abone_bilgileri: async (params) => {
    const { abone_id, ...data } = params;
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== null)
    );
    return await oepsasApi.updateAboneBilgileri(abone_id, filteredData);
  },
  delete_abone_bilgileri: async (params) => {
    return await oepsasApi.deleteAboneBilgileri(params.abone_id);
  },
  update_abonelik_durumu: async (params) => {
    return await oepsasApi.updateAbonelikDurumu(params.abone_id, {
      data: { abonelikDurumu: params.abonelikDurumu }
    });
  },
  update_bakiye: async (params) => {
    return await oepsasApi.updateBakiye(params.abone_id, {
      data: { bakiye: params.bakiye }
    });
  },
  search_abone_bilgileri: async (params) => {
    return await oepsasApi.searchAboneBilgileri({
      abonelikDurumu: params.abonelik_durumu,
      sehir: params.sehir,
      adSoyad: params.ad_soyad,
      telefon: params.telefon,
      aboneNo: params.abone_no,
      tcKimlikNo: params.tc_kimlik_no
    });
  },
  get_all_abone_bilgileri: async (params) => {
    return await oepsasApi.getAllAboneBilgileri(null, null, params.abonelik_durumu);
  },
  
  // Ticket Sistemi API
  create_ticket: async (params) => {
    return await oepsasApi.createTicket({ data: params });
  },
  get_ticket_by_ticket_no: async (params) => {
    return await oepsasApi.getTicketByTicketNo(params.ticket_no);
  },
  get_ticket_by_id: async (params) => {
    return await oepsasApi.getTicketById(params.ticket_id);
  },
  get_tickets_by_abone_id: async (params) => {
    return await oepsasApi.getTicketsByAboneId(params.abone_id);
  },
  update_ticket: async (params) => {
    const { ticket_id, ...data } = params;
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== null)
    );
    return await oepsasApi.updateTicket(ticket_id, { data: filteredData });
  },
  update_ticket_durum: async (params) => {
    return await oepsasApi.updateTicketDurum(params.ticket_id, {
      data: { durum: params.durum }
    });
  },
  search_tickets: async (params) => {
    return await oepsasApi.searchTickets({
      endDate: params.end_date,
      startDate: params.start_date,
      arizaAdresi: params.ariza_adresi,
      duyguAnalizi: params.duygu_analizi,
      atananPersonel: params.atanan_personel,
      aboneId: params.abone_id,
      oncelik: params.oncelik,
      tip: params.tip,
      durum: params.durum,
      baslik: params.baslik
    });
  },
  get_all_tickets: async (params) => {
    return await oepsasApi.getAllTickets(null, null, params.durum, params.tip, params.oncelik);
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
      console.log("Session created, updating with OEPSAS tools...");
      sendClientEvent(sessionUpdate);
      setToolsAdded(true);
    }

    const mostRecentEvent = events[0];
    
    // Handle function calls from the assistant
    if (
      mostRecentEvent.type === "response.done" &&
      mostRecentEvent.response.output
    ) {
      mostRecentEvent.response.output.forEach(async (output) => {
        if (output.type === "function_call") {
          console.log("Function call received:", output);
          setFunctionCallOutputs(prev => [...prev, output]);
          
          // Process the function call
          if (!isProcessing) {
            setIsProcessing(true);
            try {
              const functionName = output.name;
              const functionArgs = JSON.parse(output.arguments);
              
              if (toolFunctions[functionName]) {
                console.log(`Executing function: ${functionName}`, functionArgs);
                const result = await toolFunctions[functionName](functionArgs);
                console.log(`Function result:`, result);
                
                // Send the function result back
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
                console.error(`Function not found: ${functionName}`);
                // Send error response
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
              console.error("Error executing function:", error);
              // Send error response
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
        <h2 className="text-lg font-bold mb-4">OEPSAS API Tools</h2>
        {isSessionActive ? (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Zorlu Enerji Dijital Asistanı aktif. Abonelik işlemleri ve arıza bildirimleri için hazır.
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