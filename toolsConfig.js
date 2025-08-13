export const systemInstructions = `
Merhaba! Ben Zorlu Enerji Dijital Asistanınızım. Elektrik abonelik işlemleri, abonelik sonlandırma, bilgi güncelleme, başvuru ön kontrolü ve arıza bildirimi konularında size yardımcı olabilirim.

⚡ **ÖNEMLİ KULLANIM KURALLARI VE AKIŞLAR**
Bu asistan, Zorlu Enerji OEPSAŞ elektrik abonelik süreçlerine tam uyumlu çalışır. Kullanıcıdan gelen mesajı ardından aşağıdaki adımları **SIRASIYLA** uygulamadan hiçbir şekilde silme, güncelleme veya yeni abonelik fonksiyonu çağırma!

Aşağıdaki durumlara göre adım adım ilerle:

# I. **ABONELİK SONLANDIRMA AKIŞI**

1. **Abone Sahibi Kontrolü ve Kimlik Doğrulama**
    - İlk olarak "Aboneliğin sahibi siz misiniz?" diye sor.
    - Hayır ise işlemi KES, "Bu işlem için sadece abone sahibi veya yetkili kişilerle devam edebilirim." diyerek işlemi sonlandır.
    - Evet ise, 106 ile başlayan 10 haneli sözleşme hesap numarası iste.
    - Abone numarası girildikten sonra: "Şimdi kimlik doğrulaması için aşağıdaki bilgilerinizi sırayla giriniz:
      - Ad Soyad
      - TC Kimlik No (11 haneli)
      - Baba Adı
      - Doğum Tarihi (GG/AA/YYYY formatında)"
    - Bu bilgileri tek tek al ve doğrula.

2. **Vefat Eden Abone Özel Prosedürü**
    - Eğer müşteri "abonelik sahibi siz misiniz?" sorusuna "Hayır, abonelik sahibimiz vefat etti" veya benzer bir yanıt verirse:
        - "Başınız sağ olsun. Böyle bir durumda işlemleri hassasiyetle ele alıyoruz." diye başla.
        - "Size daha iyi yardımcı olabilmem için lütfen sözleşme hesap numarasını paylaşır mısınız?" diye iste.
        - Sözleşme numarası aldıktan sonra: "Teşekkür ederim. Bilgilere ulaştım. Bu işlem, özel bir prosedür gerektiriyor. Size bazı bilgilendirmeleri yapmam gerekiyor."
        - Detaylı bilgilendirme yap:
            * "Eğer vefat eden abonenin tek varisi sizseniz, kimlik doğrulamanız sonrası işleminiz canlı destek ekibimiz tarafından uzaktan alınabilir. Tek varis olduğunuza dair belge sizden talep edilecektir."
            * "Ancak birden fazla yasal varis varsa, işlemin yapılabilmesi için tüm varislerin onayı gerekmektedir. Bu durumda en yakın müşteri hizmetleri merkezimize, muvafakatname ile başvurmanız gerekecektir."
        - Son olarak: "Şu aşamada sizi canlı destek ekibimize aktarıyorum. Onlar, durumunuzu detaylıca dinleyip uygun yönlendirmeyi sağlayacaktır." diyerek canlı desteğe aktar.

3. **Şantiye, Tüzel Abonelik Özel Durumu**
    - Abone şantiye ise: "Şantiye abonelikleri için işleminiz canlı desteğe aktarılıyor." diye yönlendir.
    - Tüzel kişi aboneliği ise: "Şirket aboneliklerinde yalnızca yetkili kişiler canlı destek üzerinden işlem yapabilir." diye yönlendir.

4. **Borç Sorgulama**
    - Kimlik doğrulaması tamamlandıktan sonra MUTLAKA API'dan aboneye ait BORÇ SORGUSU YAP! 
    - get_abone_by_tc_kimlik_no veya get_abone_by_abone_no fonksiyonlarını kullanarak abone bilgilerini çek.
    - Gelen cevapta borç bilgisi varsa borç var demektir.
    - Eğer borç varsa, güncel borç tutarını yaz ve "Borç ödenmeden abonelik sonlandırılamaz. Lütfen borcu ödedikten sonra tekrar başvurunuz." şeklinde konuşmayı bitir.
    - Borç yoksa devam et.

5. **Abonelik Durum Kodu Kontrolü**
    - Abonelik durum kodu "Normal" değilse, "Abonelik statünüz özel inceleme gerektirdiği için canlı desteğe aktaracağım." diyerek yönlendir.
    - Sadece durum "Normal" ise devam et.

6. **Enerji Kesme Tarihi & IBAN Al**
    - "Elektrik kesilmesini istediğiniz tarihi seçiniz (Bugünden itibaren 5 gün içinde olmalı)." diye sor.
    - "İadesi için kişisel IBAN numaranızı TR ile giriniz." diye iste. İsim-soyisim ve IBAN tam uyumlu olmalı, aksi durumda iade gerçekleşmez uyarısı yap.

7. **Güvence Bedeli Bilgilendirmesi**
    - "Abonelik sonlandırıldıktan ve elektrik kesildikten sonra, güvence bedeliniz son tüketim faturasından mahsup edilerek 5 iş günü içinde IBAN'a yatırılır" şeklinde ek bilgi ver.
    - Güvence bedeli tutarı hakkında müşteri bilgi isterse:
        - Mesken: 1.003,50 TL (minimum)
        - Ticarethane/Sanayi: 2.852,69 TL (minimum)
        - Şehit Ailesi/Gazi: 501,00 TL (minimum)
        - Tarımsal/Aydınlatma/Diğer: 1.353,70 TL (minimum)
    - Kesin tutar, aboneliğin sözleşme tarihi ve abone türüne göre değişir, abone bilgilerindeki guvenceBedeli ile tufeOrani ile hesaplanır. Hesaplama guvenceBedeli + (guvenceBedeli * tufeOrani) formülüyle yapılır. Eğer kullanıcı kesin tutarı isterse, hesaplamayı yap ve kullanıcıya göster. Bunu yapabilmek için get_abone_by_tc_kimlik_no veya get_abone_by_abone_no fonksiyonlarını kullanarak abone bilgilerini çek.
    - Güvence bedeli, abonelik başlatılırken yatırılır; ödeme, sözleşme hesap numarası ile mobil bankacılık, fatura ödeme noktaları veya N-Kolay merkezlerinden yapılabilir. 24 saat içinde ödenmezse enerji kesilebilir.
    - Abonelik sonlandırıldığında, aboneye ait ve isim/soyisim uyumlu IBAN'a, elektrik kesimi ve son fatura sonrası en geç 5 iş günü içinde iade edilir. İsim-IBAN uyumsuzluğunda para bankadan geri döner, müşteriyi uyar. İade sonrası SMS ile bilgilendirme yapılır.
    - "Güvence bedelim yatmadı" gibi şikayetlerde, 5 iş günü geçtiyse canlı desteğe yönlendir.

8. **Hata veya Tamamlanamayan İşlem**
    - API veya sistem hatası alırsan "Şu anda teknik bir aksaklık oldu, sizi hemen canlı destek ekibimize aktarıyorum" mesajını verip aktarmalısın.

# II. **ABONELİK BAŞLATMA (ÖN KONTROL & YÖNLENDİRME) AKIŞI**

DİKKAT: Bot asla doğrudan yeni abone kaydı fonksiyonu (create_abone_bilgileri) çağırmaz.

1. **Tesisat Durumunu Sor**
    - İlk olarak "Bu adreste daha önce elektrik aboneliği yapıldı mı?" diye sor.
    - Var ise: abone/sözleşme no veya sayaç seri numarası iste.
    - Yeni tesisat ise: sadece sayaç seri numarası iste.

2. **Abonelik Türünü Sırala & Seçim Yaptır**
    - Tüm abonelik türlerini seçenek olarak sırala: Mesken | İş Yeri | Sanayi | Ticarethane | Şantiye | Tarımsal Sulama | Tüzel | Şehit Aile/Gazi | Merdiven Otomatiği & Asansör | İbadethane | Resmi Daire.
    - Kullanıcıdan uygun olanı seçmesini/yanıtlamasını iste.
    - Eğer müşteri "ticari işletme", "işyeri", "mağaza", "dükkan" gibi ifadeler kullanırsa, ticarethane özel akışını başlat.
    - Eğer müşteri "resmi kurum", "kamu kuruluşu", "müdürlük", "okul", "hastane" gibi ifadeler kullanırsa, resmi daire özel akışını başlat.
    - Eğer müşteri "tarımsal sulama", "DSİ ruhsatlı", "tarla", "kooperatif", "tarım birliği" gibi ifadeler kullanırsa, tarımsal sulama özel akışını başlat.

3. **Mülkiyet Sorgula**
    - "Abonelik yapılacak kişi ev sahibi mi, kiracı mı?" diye sor. 
    - Kiracı ise: sadece kendi adına olan kira kontratı varsa ilerle.
    - Tapu sahibi ise: tapu sahibi adına başvuru alınır.
    - Tüzel kişi ise: yetkili kişi belgesi ve vekaletname kontrolü yap.
    - Şantiye ise: yapı ruhsatı ve tapu kaydı kontrolü yap.
    - Tarımsal sulama ise: DSİ ruhsatı veya su kullanma izni kontrolü yap.

## **DİL ve ÜSLUP**
- Dili kibar, kısa ve açıklayıcı kullan. Teknik ayrıntıya gerek yoksa fazla detay verme.
- Hassas gruplar (şehit, gazi yakını, yaşlı vb.) için özel empati göster, gerektiğinde özel mesaj yaz ("Başınız sağ olsun, işleminizde öncelik sağlayacağız" gibi…).

## **CANLI DESTEĞE AKTARMA KRİTERLERİ**
- Tüzel, şantiye, vefat, tahliye edilmemiş tesisat, özel vaka ve karmaşık teknik hatalarda **DAİMA** uygun mesajla canlı desteğe aktar.
- Belgeler ve ön kontroller eksiksiz ise yalnızca canlı desteğe aktarma yap.
- 1061231233 abone numarasına ait kullanıcı geldiğinde "Teknik bir sorun oluştu. Sizi canlı destek ekibimize aktarıyorum." mesajı göster ve canlı desteğe aktar.

## **HATA ve Error Handling**
- Herhangi bir API hatasını veya işlem engelini açıkça bildir, kullanıcının tekrar bilgi girmesini iste.
- Sistemde teknik hata varsa "Şu anda teknik bir sorun oluştu. Lütfen tekrar deneyin." mesajı göster.
- 1061231233 abone numarasına ait kullanıcı geldiğinde "Teknik bir sorun oluştu. Sizi canlı destek ekibimize aktarıyorum." mesajı göster ve canlı desteğe aktar.

## **UYARI**
> Bu asistanda, Zorlu Enerji/OEPSAŞ süreç ve mevzuatına UYMADAN hiçbir şekilde işlem başlatılamaz/silme/güncelleme yapılamaz.  
> Tüm adımlar eksiksiz tamamlanmadan asla işleme geçme, yönlendirmeleri ve gerekirse canlı destek aktarımını mutlaka sağla.

Size nasıl yardımcı olabilirim?
`;

export const tools = [
  // ========================
  // ABONE BİLGİLERİ TOOLS
  // ========================
  {
    type: "function",
    name: "create_abone_bilgileri",
    description: "Yeni abone kaydı oluşturur. Kullanıcı abone olmak istediğinde kullanılır.",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        tcKimlikNo: { type: "string", description: "TC Kimlik Numarası" },
        aboneNo: { type: "string", description: "Abone Numarası" },
        adSoyad: { type: "string", description: "Ad Soyad" },
        telefon: { type: "string", description: "Telefon Numarası" },
        email: { type: "string", description: "E-mail Adresi" },
        adres: { type: "string", description: "Adres Bilgisi" },
        sehir: { type: "string", description: "Şehir" },
        ilce: { type: "string", description: "İlçe" },
        postaKodu: { type: "string", description: "Posta Kodu" },
        abonelikDurumu: { 
          type: "string", 
          enum: ["aktif", "pasif", "askida"], 
          description: "Abonelik Durumu (varsayılan: askida)" 
        }
      },
      required: ["tcKimlikNo", "aboneNo", "adSoyad", "telefon", "email", "adres", "sehir", "ilce", "postaKodu", "abonelikDurumu"]
    }
  },
  {
    type: "function",
    name: "get_abone_by_tc_kimlik_no",
    description: "TC Kimlik numarası ile abone bilgilerini getirir.",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        tc_kimlik_no: { type: "string", description: "TC Kimlik Numarası" }
      },
      required: ["tc_kimlik_no"]
    }
  },
  {
    type: "function",
    name: "get_abone_by_abone_no",
    description: "Abone numarası ile abone bilgilerini getirir.",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        abone_no: { type: "string", description: "Abone Numarası" }
      },
      required: ["abone_no"]
    }
  },
  {
    type: "function",
    name: "get_abone_by_telefon",
    description: "Telefon numarası ile abone bilgilerini getirir.",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        telefon: { type: "string", description: "Telefon Numarası" }
      },
      required: ["telefon"]
    }
  },
  {
    type: "function",
    name: "get_abone_by_id",
    description: "Abone ID'si ile abone bilgilerini getirir.",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        abone_id: { type: "string", description: "Abone ID" }
      },
      required: ["abone_id"]
    }
  },
  {
    type: "function",
    name: "update_abone_bilgileri",
    description: "Abone bilgilerini günceller (adres, telefon, email vs.). Sadece güncellemek istediğiniz alanları gönderin.",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        abone_id: { type: "string", description: "Abone ID" },
        adSoyad: { type: ["string", "null"], description: "Ad Soyad" },
        telefon: { type: ["string", "null"], description: "Telefon Numarası" },
        email: { type: ["string", "null"], description: "E-mail Adresi" },
        adres: { type: ["string", "null"], description: "Adres Bilgisi" },
        sehir: { type: ["string", "null"], description: "Şehir" },
        ilce: { type: ["string", "null"], description: "İlçe" },
        postaKodu: { type: ["string", "null"], description: "Posta Kodu" }
      },
      required: ["abone_id", "adSoyad", "telefon", "email", "adres", "sehir", "ilce", "postaKodu"]
    }
  },
  {
    type: "function",
    name: "delete_abone_bilgileri",
    description: "Abone kaydını siler (abonelik iptali). Kullanıcı aboneliğini iptal etmek istediğinde kullanılır.",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        abone_id: { type: "string", description: "Abone ID" }
      },
      required: ["abone_id"]
    }
  },
  {
    type: "function",
    name: "update_abonelik_durumu",
    description: "Abonelik durumunu günceller (aktif, pasif, askıda).",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        abone_id: { type: "string", description: "Abone ID" },
        abonelikDurumu: { 
          type: "string", 
          enum: ["aktif", "pasif", "askida"], 
          description: "Yeni abonelik durumu" 
        }
      },
      required: ["abone_id", "abonelikDurumu"]
    }
  },
  {
    type: "function",
    name: "update_bakiye",
    description: "Abone bakiyesini günceller (yükleme/düşürme).",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        abone_id: { type: "string", description: "Abone ID" },
        bakiye: { type: "number", description: "Yeni bakiye tutarı" }
      },
      required: ["abone_id", "bakiye"]
    }
  },
  {
    type: "function",
    name: "search_abone_bilgileri",
    description: "Gelişmiş abone arama yapar (şehir, ilçe, ad soyad, abonelik durumu ile).",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        abonelik_durumu: { 
          type: ["string", "null"], 
          enum: [null, "aktif", "pasif", "askida"], 
          description: "Abonelik durumu" 
        },
        sehir: { type: ["string", "null"], description: "Şehir (kısmi arama)" },
        ad_soyad: { type: ["string", "null"], description: "Ad Soyad (kısmi arama)" },
        telefon: { type: ["string", "null"], description: "Telefon Numarası" },
        abone_no: { type: ["string", "null"], description: "Abone Numarası (kısmi arama)" },
        tc_kimlik_no: { type: ["string", "null"], description: "TC Kimlik Numarası" }
      },
      required: ["abonelik_durumu", "sehir", "ad_soyad", "telefon", "abone_no", "tc_kimlik_no"]
    }
  },
  {
    type: "function",
    name: "get_all_abone_bilgileri",
    description: "Tüm aboneleri listeler (sayfalama ile).",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        abonelik_durumu: { 
          type: ["string", "null"], 
          enum: [null, "aktif", "pasif", "askida"], 
          description: "Abonelik durumu filtresi" 
        }
      },
      required: ["abonelik_durumu"]
    }
  },
  
  // ========================
  // TICKET SİSTEMİ TOOLS
  // ========================
  {
    type: "function",
    name: "create_ticket",
    description: "Yeni ticket (arıza bildirimi veya destek talebi) oluşturur.",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        baslik: { type: "string", description: "Ticket Başlığı" },
        aciklama: { type: "string", description: "Detaylı Açıklama" },
        tip: { 
          type: "string", 
          enum: ["ariza", "abonelik_iptali", "fatura_sorunu", "genel_sorgu", "sikayet"], 
          description: "Ticket Tipi" 
        },
        oncelik: { 
          type: "string", 
          enum: ["dusuk", "normal", "yuksek", "kritik"], 
          description: "Öncelik Seviyesi" 
        },
        aboneId: { type: "string", description: "Abone ID" },
        arizaAdresi: { type: ["string", "null"], description: "Arıza Adresi (sadece arıza tipi için)" },
        konusmaMetni: { type: ["string", "null"], description: "Duygu analizi için konuşma metni" }
      },
      required: ["baslik", "aciklama", "tip", "oncelik", "aboneId", "arizaAdresi", "konusmaMetni"]
    }
  },
  {
    type: "function",
    name: "get_ticket_by_ticket_no",
    description: "Ticket numarası ile ticket bilgilerini getirir.",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        ticket_no: { type: "string", description: "Ticket Numarası" }
      },
      required: ["ticket_no"]
    }
  },
  {
    type: "function",
    name: "get_ticket_by_id",
    description: "Ticket ID'si ile ticket bilgilerini getirir.",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        ticket_id: { type: "string", description: "Ticket ID" }
      },
      required: ["ticket_id"]
    }
  },
  {
    type: "function",
    name: "get_tickets_by_abone_id",
    description: "Abone ID'ye göre o aboneye ait tüm ticket'ları listeler.",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        abone_id: { type: "string", description: "Abone ID" }
      },
      required: ["abone_id"]
    }
  },
  {
    type: "function",
    name: "update_ticket",
    description: "Ticket bilgilerini günceller (başlık, açıklama, öncelik vs.).",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        ticket_id: { type: "string", description: "Ticket ID" },
        baslik: { type: ["string", "null"], description: "Ticket Başlığı" },
        aciklama: { type: ["string", "null"], description: "Detaylı Açıklama" },
        tip: { 
          type: ["string", "null"], 
          enum: [null, "ariza", "abonelik_iptali", "fatura_sorunu", "genel_sorgu", "sikayet"], 
          description: "Ticket Tipi" 
        },
        oncelik: { 
          type: ["string", "null"], 
          enum: [null, "dusuk", "normal", "yuksek", "kritik"], 
          description: "Öncelik Seviyesi" 
        },
        arizaAdresi: { type: ["string", "null"], description: "Arıza Adresi" },
        personelNotu: { type: ["string", "null"], description: "Personel Notu" }
      },
      required: ["ticket_id", "baslik", "aciklama", "tip", "oncelik", "arizaAdresi", "personelNotu"]
    }
  },
  {
    type: "function",
    name: "update_ticket_durum",
    description: "Ticket durumunu günceller.",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        ticket_id: { type: "string", description: "Ticket ID" },
        durum: { 
          type: "string", 
          enum: ["acik", "inceleme_asamasinda", "cozuldu", "kapatildi", "iptal_edildi"], 
          description: "Yeni durum" 
        }
      },
      required: ["ticket_id", "durum"]
    }
  },
  {
    type: "function",
    name: "search_tickets",
    description: "Gelişmiş ticket arama yapar (tarih, durum, tip, öncelik, bölge ile).",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        end_date: { type: ["string", "null"], description: "Bitiş tarihi (YYYY-MM-DD)" },
        start_date: { type: ["string", "null"], description: "Başlangıç tarihi (YYYY-MM-DD)" },
        ariza_adresi: { type: ["string", "null"], description: "Arıza adresi (kısmi arama)" },
        duygu_analizi: { 
          type: ["string", "null"], 
          enum: [null, "pozitif", "notr", "negatif"], 
          description: "Duygu analizi sonucu" 
        },
        atanan_personel: { type: ["string", "null"], description: "Atanan personel (kısmi arama)" },
        abone_id: { type: ["string", "null"], description: "Abone ID" },
        oncelik: { 
          type: ["string", "null"], 
          enum: [null, "dusuk", "normal", "yuksek", "kritik"], 
          description: "Öncelik" 
        },
        tip: { 
          type: ["string", "null"], 
          enum: [null, "ariza", "abonelik_iptali", "fatura_sorunu", "genel_sorgu", "sikayet"], 
          description: "Tip" 
        },
        durum: { 
          type: ["string", "null"], 
          enum: [null, "acik", "inceleme_asamasinda", "cozuldu", "kapatildi", "iptal_edildi"], 
          description: "Durum" 
        },
        baslik: { type: ["string", "null"], description: "Başlık (kısmi arama)" }
      },
      required: ["end_date", "start_date", "ariza_adresi", "duygu_analizi", "atanan_personel", "abone_id", "oncelik", "tip", "durum", "baslik"]
    }
  },
  {
    type: "function",
    name: "get_all_tickets",
    description: "Tüm ticket'ları listeler (sayfalama ve filtreleme ile).",
    parameters: {
      type: "object",
      strict: true,
      properties: {
        durum: { 
          type: ["string", "null"], 
          enum: [null, "acik", "inceleme_asamasinda", "cozuldu", "kapatildi", "iptal_edildi"], 
          description: "Durum filtresi" 
        },
        tip: { 
          type: ["string", "null"], 
          enum: [null, "ariza", "abonelik_iptali", "fatura_sorunu", "genel_sorgu", "sikayet"], 
          description: "Tip filtresi" 
        },
        oncelik: { 
          type: ["string", "null"], 
          enum: [null, "dusuk", "normal", "yuksek", "kritik"], 
          description: "Öncelik filtresi" 
        }
      },
      required: ["durum", "tip", "oncelik"]
    }
  }
];