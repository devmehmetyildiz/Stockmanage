
export interface ChangeLogItem {
    version: string
    changes?: ChangeLogItemChangeItem[]
    bugs?: ChangeLogItemChangeItem[]
    features?: ChangeLogItemChangeItem[]
    withoutIssues?: ChangeLogItemChangeItem[]
}

export interface ChangeLogItemChangeItem {
    title: string
    commits: string[]
}

const version1_0_1_1 = {
    version: "1.0.1.1",
    changes: [
        {
            title: "Güvenlik", commits: [
                "Ekran kapanmalarını önlemek için değişiklikler yapıldı",
                "Token süresi 5 dakikadan 10 dakikaya çıkartıldı",
            ],
        },
        {
            title: "Kullanıcılar", commits: [
                "Kullanıcı detay sayfası eklendi",
                "Güncelleme ve oluşturma ekranları değiştirildi",
                "Detay sayfası eklendi",
                "Departmanlara personel departmanı özelliği eklendi",
                "Durumlara personel durumları eklendi",
            ],
        },
        {
            title: "Hastalar", commits: [
                "Hasta detay sayfasına hareketler çizelgesi eklendi",
                "Vefat eden veya ayrılan hastaları tekrar aktif et özelliği eklendi",
                "Hasta detay sayfasında ek parametreler eklendi",
                "Hastalara açıklama ve vasi notu eklendi",
                "Hasta tanımlarından ölüm ile alaklı bilgiler kaldırıldı",
                "Hasta tanımlarında tasarım düzenlemesi yapıldı",
            ],
        },
        {
            title: "Kurum Yönetimi", commits: [
                "Bekleyen onaylarım sayfası eklendi, fonksiyonlar daha eklenecek",
            ],
        },
    ]
}

const version1_0_1_2: ChangeLogItem = {
    version: "1.0.1.2",
    features: [
        {
            title: "Hakedişler", commits: [
                "Parametre oluşturma sayfası eklendi",
                "Hakediş oluşturma sayfası eklendi, geliştirmeler devam ediyor",
            ],
        },
        {
            title: "Hastalar", commits: [
                "Otomatik hasta ekleme fonksiyonu geliştirildi",
            ],
        },
    ],
    changes: [
        {
            title: "Hastalar", commits: [
                "Kuruma giriş tarihi kaldırıldı, gerekli zorunluluklar kabul tarihine eklendi",
            ],
        },
    ],
}

const version1_0_1_3: ChangeLogItem = {
    version: "1.0.1.3",
    features: [
        {
            title: "Hakedişler", commits: [
                "Parameterler Sayfasında Güncellemeler Yapıldı",
                "Personel Teşviki Hariç Hakedişler Aktif Edildi",
            ],
        },
        {
            title: "Hastalar", commits: [
                "Geçmiş Tarihli Durum Girişi Eklendi",
                "Hareketleri Düzenle Ekranı Eklendi, Hareketler Silinebilir, Güncellenebilir",
            ],
        },
        {
            title: "Kullanıcılar", commits: [
                "Kullanıcı Detay Sayfası Güncellendi, Detay Tablolar Eklendi",
                "Kullanıcılar için Durum Değiştirme, Geçmiş Tarihli Durum, Durum Düzenleme Sayfası Eklendi",
            ],
        },
    ],
    changes: [
        {
            title: "Dosya", commits: [
                "Dosya Yükleme Fonksiyonlarında Düzenlemeler Yapıldı",
                "Dosyalar Artık Önizleme Olarak Görüntülenecek, Talep Edilirse İndirilecek (Sadece PDF Ve PNG)",
            ],
        },
        {
            title: "Kurum Yönetimi", commits: [
                "Arıza ve Bakım Talepleri Sayfaları Ambarlar Ana Menusune Taşındı",
                "Hasta Durumları Sayfası Kaldırıldı, Hastalar Ekranına Çoklu İşlemler Menusunde Gerçekleştirilecek (Daha Aktif Değil)",
            ],
        },
    ],
}

const version1_0_1_5: ChangeLogItem = {
    version: "1.0.1.5",
    features: [
        {
            title: "Kurum Yönetimi", commits: [
                "Hasta Yerleşimleri Ekran Tasarımı Düzenlendi",
                "Genel Kurum Takip Ekranı Eklendi",
                "Eğitimler Sayfasında Tamamlanma Durumu Eklendi, Eğitime Katılan Kullanıcılar Belirli Olacak.",
                "Eğitimler Ekleme Ve Güncelleme Ekranlarına Hızlı Personel Ekleme Fonksiyonu Eklendi.",
            ],
        },
        {
            title: "Hastalar", commits: [
                "Hastalar için Işlemlerde Vaka Gir Eklendi",
                "Hastalar için Vaka Düzenleme Ve Silme Fonksiyonları Eklendi",
            ],
        },
        {
            title: "Kullanıcılar", commits: [
                "Bildirim Süresi, Bildirim Pozisyonu Kullanıcı Ayarlarına Eklendi.",
                "Kullanıcılar Detay Ekranına Bekleyen Eğitimlerim Tablosu Eklendi, Eğitime Katıldım Onayladım Yapılabilir",
            ],
        },
    ],
    changes: [
        {
            title: "Stok Hareketleri", commits: [
                "Hastalarda Yaşanan Stok Tüketimi Işlemlerinde Onay Istenilmeyecek",
            ],
        },
    ],
    bugs: [
        {
            title: "Stoklar ve Stok Hareketleri", commits: [
                "Stok Tüketimlerindeki Negatife Düşme Sorunu Giderildi",
                "Ambarlardan Stok Girişi Yapılırken Stok Eklemede Stok Tür Grubu Eklenmeme Problemi Giderildi.",
            ],
        },
    ],
}

const version1_0_1_6: ChangeLogItem = {
    version: "1.0.1.6",
    changes: [
        {
            title: "Genel Arama", commits: [
                "Kullanıcılar aranabilir hale getirildi",
            ],
        },
        {
            title: "Bireysel Bakım Planları", commits: [
                "Destek Planlarına ve Destek Plan listelerine tür eklendi, İlgili bakım planı türüne göre plan eklenecek",
                "Hastaların Destek Planlarını güncellemede tür eklendi",
                "Bireysel Bakım Planlarına ait ekranlar yenilendi, tür eklendi",
                "Bireysel Bakım Planlarının taslak onaylama ve detay ekranları eklendi",
            ],
        },
    ],
    bugs: [
        {
            title: "Genel Arama", commits: [
                "Aynı Sayfa içerisinde yapılan hasta aramalarında ekran yenilenmeme sorunu giderildi",
            ],
        },
    ],
}

const version1_0_1_7: ChangeLogItem = {
    version: "1.0.1.7",
    bugs: [
        {
            title: "Hastalar", commits: [
                "Hasta Yerleşimleri tasarım düzenlemesi",
                "Ön Kayıtlar, tamamlanan hastalar tasarım düzenlemesi",
                "Hasta ve Kullanıcı Durum Değiştirmede Hata Düzenlemesi",
            ],
        },
        {
            title: "Sistem", commits: [
                "Arka Plan Servis Düzenlemeleri",
            ],
        },
    ],
}

const version1_0_1_8: ChangeLogItem = {
    version: "1.0.1.8",
    bugs: [
        {
            title: "Kurum Yönetimi", commits: [
                "Kurum Hasta Genel Görünümde Yer Alan Aylık Kurum Kapasite Değişim Grafiği Düzeltildi.",
                "Kurum Hasta Genel Görünümde Yer Alan Aylık Aylık Kurum Hareketleri Düzeltildi.",
            ],
        },
    ],
    changes: [
        {
            title: "Hastalar", commits: [
                "Hasta Vakaları Daha Detaylı Hale Getirildi, Vaka Türü Olaya Dahil Kişiler vb. Parametreler Eklendi.",
            ],
        },
        {
            title: "Ayarlar", commits: [
                "Kullanım Türlerine Hastalar için Zorunlumu, Personeller için Zorunlumu Durumları Eklendi.",
            ],
        },
    ],
    features: [
        {
            title: "Hastalar", commits: [
                "Hasta Vakaları Ekranı Eklendi, Vakalar Hem Hasta Detayından Hemde Bu Ekrandan Takip Edilebilecek.",
                "Hasta Etkinlikleri Ekranı Eklendi, Hastaların Yaptıkları Etkinlikler Bu Ekrandan Takip Edilecek.",
                "Hasta Ziyaretleri Ekranı Eklendi, Hasta Yakınlarının Etkinlikleri Takip Edilecek.",
                "Hasta Vefat Girme ve Hasta Ayrılma Ekranlarında Tarih Girme Özelliği Eklendi.",
            ],
        },
        {
            title: "Kurum Yönetimi", commits: [
                "Eğitimlere Eğitim Kullanıcı Türü Eklendi. Hastalara, Hasta Yakınlarına, Personellere Ayrı Ayrı Eğitim Oluşturulabilecek.",
                "Eğitimler Tamamlanırken, Herkes Katıldı Olarak Tamamla Butonu Eklendi.",
                "Personel Olayları Ekranı Eklendi. Personellere Yönelik Vakalar,İstenmeyen Olaylar Bu Ekrandan Takip Edilecek.",
                "Anketler Ekranı Eklendi. Personel, Hasta Yakını ve Hastalar İçin Anket Oluşturulabilecek.",
                "Gösterge Kartları Eklendi.",
            ],
        },
        {
            title: "Ayarlar", commits: [
                "Kullanııclar Ekranına İşten Ayrılma Butonu Eklendi.",
            ],
        },
    ],
}

const version1_0_1_9: ChangeLogItem = {
    version: "1.0.1.9",
    bugs: [
        {
            title: "Hastalar", commits: [
                "Dosya Silme Sorunu Giderildi.",
            ],
        },
        {
            title: "Kurum Yönetimi", commits: [
                "Gösterge Kartlarındaki Yüklenmeme sorunu giderildi.",
            ],
        },
    ],
    changes: [
        {
            title: "Sistem", commits: [
                "Uygulama Raporları değiştirildi.",
            ],
        },
    ],
    features: [
        {
            title: "Kurum Yönetimi", commits: [
                "Bakım Hizmetleri Gösterge Kartları Eklendi",
            ],
        },
    ],
}

const version1_0_1_10: ChangeLogItem = {
    version: "1.0.1.10",
    bugs: [
        {
            title: "Kullanıcılar", commits: [
                "Kullanıcı eklemesinde işten ayrılanlara otomatik gitme sorunu düzeltildi.",
            ],
        },
    ],
    features: [
        {
            title: "Sistem", commits: [
                "Grid Ekranlarda satıra tıklanıldığında arka plan farklı olabilecek.",
            ],
        },
    ],
}

const version1_0_1_11: ChangeLogItem = {
    version: "1.0.1.11",
    bugs: [
        {
            title: "Sistem", commits: [
                "Uzun süreli kullanımlarda uygulamanın çıkış yapma sorunu ile alakalı geliştirme yapıldı.",
                "Grid Ekranlardaki tıklanıldığı zaman renk değişiminde geliştirme yapıldı. Sayfalar arası geçişte tıklamanın takılı kalma sorunu giderildi.",
            ],
        },
    ],
    changes: [
        {
            title: "Sistem", commits: [
                "Bildirimler ekranı yenilendi. Sadece okunmamış en güncel 50 bildirim gözükecek.",
                "Detayına bakıldığında liste güncellelecek, okunan veya okunmayan bildirimler için tüm bildirimler satırına tıklamak yeterli, ayrı sayfa üzerinden takip edilecek.",
            ],
        },
    ],
    features: [
        {
            title: "Hastalar", commits: [
                "Hasta Yoklama Ekranı Eklendi.",
            ],
        },
    ],
}

const version1_0_1_12: ChangeLogItem = {
    version: "1.0.1.12",
    bugs: [
        {
            title: "Genel", commits: [
                "Genel Ekran Testleri Yapıldı, Hata Çözümleri Yapıldı",
            ],
        },
    ],
}

const version1_0_1_13: ChangeLogItem = {
    version: "1.0.1.13",
    bugs: [
        {
            title: "Hakedişler", commits: [
                "Hakediş Hesaplamaları, virgülden sonra hesap edilecek basamak sayıları değiştirildi / düzeltildi",
            ],
        },
        {
            title: "Hastalar", commits: [
                "Hasta Hareketlerinde, durum güncellenirken herhangi bir tarih seçilmez ise haketet tarihini belirlemiyor, bu durum düzeltildi, hasta yoklamalarındaki hata düzelmiş oldu.",
            ],
        },
    ],
    changes: [
        {
            title: "Hastalar", commits: [
                "Hasta Detayındaki işlemler kısmındaki seçeneklerin iconlarında kücük düzenlemeler yapıldı",
            ],
        },
    ],
    features: [
        {
            title: "Kurum Yönetimi", commits: [
                "Bakım Planı periyotları eklendi, otomatik olarak kontrol edilecek envanterler için periyot oluşturabilecek, kurallarda ekleme yapıldıktan sonra çalışır hale gelecek",
            ],
        },
    ],
}

const version1_0_1_14: ChangeLogItem = {
    version: "1.0.1.14",
    bugs: [
        {
            title: "Arama", commits: [
                "Navigation kısmında hasta aramada türkçe karakter sorunu giderildi",
            ],
        },

    ],
    changes: [
        {
            title: "Genel", commits: [
                "Çoklu Tablı yapıdaki sayfalarda tab hatırlama fonksiyonu eklendi, kaydetme ve güncelleme sonrası aynı tab'dan devam edilebilecek",
                "Hastalar Yataklar Departmanlar Roller ve Kullanıcılar Sayfasında hafif tasarım değişiklikleri (Performans)",
            ],
        },
        {
            title: "Kurum Yönetimi", commits: [
                "Hasta Yerleşimlerinde tasarım değişikliği",
                "Kurum Hasta Genel Görünüm ekranında performans düzenlemeleri, hatalı verilerin düzenlenmesi",
                "Kurum Hasta Genel Görünüm ekranında pasta grafikleri Genel hasta takibi ekranına yönlendirme yapacak",
                "Gösterge kartlarında hatalı yazıların düzenlenmesi",
            ],
        },
        {
            title: "Hastalar", commits: [
                "Hasta Para girişlerinde pasif türü kaldırıldı",
            ],
        },
    ],
}

const version1_0_1_15: ChangeLogItem = {
    version: "1.0.1.15",
    features: [
        {
            title: "Kurum Yönetimi", commits: [
                "Bekleyen Onaylar Sayfası Eklendi",
            ],
        },

    ],
}

const version1_0_1_16: ChangeLogItem = {
    version: "1.0.1.16",
    changes: [
        {
            title: "Güvenlik", commits: [
                "Parolalar artık En Küçük 8 Karakter, En az 1 büyük harf, 1 küçük harf, 1 adet sayı ve 1 adet özel karakter olmalıdır",
                "Kullanıcı adları Artık küçük harflerden veya sayılardan oluşur, minmum 3 maximum 25 karakter olmalıdır.",
            ],
        },
    ],
}

const version1_0_1_17: ChangeLogItem = {
    version: "1.0.1.17",
    changes: [
        {
            title: "Vardiya Yönetimi", commits: [
                "Vardiya yönetim sayfasında güncellemeler yapıldı, taslak vardiya oluşturmalar eklendi",
                "Vardiya Oluşturma ve Ön ayarlar bekleyen onaylar tabına eklendi",
            ],
        },
        {
            title: "Bildirimler", commits: [
                "Okunmamış, görülmemiş bildirimleri belirten ayarlar güncellendi",
                "Açık arıza veya bakım taleplerini gösteren bildirimler eklendi",
            ],
        },
        {
            title: "Kurallar", commits: [
                "Kuralların çalışabilirlik durumları ayrı bir şekilde gösteren kural eklendi",
                "Yeni kural taslakları eklendi",
            ],
        },
    ],
}

const version1_0_1_18: ChangeLogItem = {
    version: "1.0.1.18",
    changes: [
        {
            title: "Genel", commits: [
                "Uygulamadi isimlendirmeler değiştirildi (ekipman => malzeme vb...)",
                "Hamburger Menüde konum değişiklikleri yapıldı",
            ],
        },
        {
            title: "Sistem", commits: [
                "Yazdırma Taslaklarında arka plan düzenlemeleri yapıldı",
                "Uygulama Kullanım raporlarında kullanıcı işlem grafiği eklendi",
            ],
        },
    ],
}

const version1_0_1_19: ChangeLogItem = {
    version: "1.0.1.19",
    features: [
        {
            title: "Kurum Yönetimi", commits: [
                "Kurum Arşivi eklendi",
            ],
        },
    ],
    changes: [
        {
            title: "Hastalar", commits: [
                "Hasta Detayı Özlük bilgilerine Bağımlılık Derecesi eklendi.",
                "Genel Hasta Takibine sayfası daha hızlı yüklenmesi için performans düzenlemeleri yapıldı.",
                "Genel Hasta Takibine yaşlar eklendi",
                "Genel Hasta Takibinde yer alan tablara filtreleme eklendi, Hasta Grafiklerinde yer alan seçeneklere tıklandığında ilgili filtre uygulanmış şekilde sayfa açılacak.",
            ],
        },
        {
            title: "Sistem", commits: [
                "Dosyalar Tabı Yenilendi, Önizleme Eklendi",
                "Dosya Önizleme barına ait genişlikler arttırıldı, dosya indirilme öncesi dosya botunu görünecek, indirilme durumu takip edilebilecek.",
                "Dosya Önizlemede yazdırma butonu eklendi, dosyalar indirilmeden yazdırılabilecek",
            ],
        },
    ],
}

const version1_0_1_20: ChangeLogItem = {
    version: "1.0.1.20",
    bugs: [

        {
            title: "Hakedişler", commits: [
                "Hakediş hesaplama hatası giderildi",
            ],
        },

    ],
    changes: [
        {
            title: "Hastalar", commits: [
                "Hasta kayıt işlemlerinde tamamlama yapılırken geçmiş tarihli giriş ayarı eklendi, geçmiş tarih eklendiğinde sistem otomatik düzeltecek",
                "Hasta kayıt işlemlerindeki kurumda mı seçeneği kaldırıldı.",
                "Hasta yatak seçiminde tasarım güncellemesi yapıldı",
            ],
        },
        {
            title: "Sistem", commits: [
                "İşten ayrılmış kullanıcıların sisteme girişi engellendi",
                "Uygulamadaki tüm fonskiyonlara ait roller eklendi",
            ],
        },
    ],
}

const version2_0_0_0_preAlpha: ChangeLogItem = {
    version: "2.0.0.0-pre-alpha",
    features: [
        {
            title: "Genel", commits: [
                "Uygulama Genel Revizyonu",
                "Mobil tasarımlar daha uygun hale getirildi",
            ],
        },
        {
            title: "Sistem", commits: [
                "Performans artırmak için altyapı değişiklikleri yapıldı",
                "Sayfalardaki veri çekme işlemleri bölümlere ayrıldı, sayfanın erken yüklenmesi için geliştirmeler yapıldı",
                "Sayfalar açılırken kısmi yükleme ekranları olacak, kullanıcı performası daha optimize çalışacak",
            ],
        },
    ],
}

const version2_0_0_0_alpha: ChangeLogItem = {
    version: "2.0.0.0-alpha",
    bugs: [
        {
            title: "Hastalar",
            commits: [
                "Hasta grafik ve detay kart alanı düzenlemeleri",
                "Hasta zaman grafik düzenlemeleri",
                "Eksik hasta detay ekranları eklendi (destek planları, rutinler...)",
                "Hasta hareketleri düzenlendi",
                "Hasta detayına ölüm ve vefat durumlarında gidilememesi"
            ]
        },
        {
            title: "Kullanıcıları",
            commits: [
                "Kullanıcı detay ekranlarında zaman grafik düzenlemeleri",
                "Kullanıcı durum değişikliği ve hareket düzenleme ekranları eklendi",
                "Kullanıcı detayına ölüm ve vefat durumlarında gidilememesi"
            ]
        },
        {
            title: "Genel",
            commits: [
                "Mobil ve tablet uyumluluk için tasarım düzenlemeleri",
                "Excel export düzenlemeleri",
                "Menu icon düzenlemeleri"
            ]
        }
    ],
    features: [
        {
            title: "Güvenlik",
            commits: [
                "Yetkisiz sayfa girişleri düzenlemeleri"
            ]
        }
    ]
}

const version2_0_0_0_beta: ChangeLogItem = {
    version: "2.0.0.0-beta",
    features: [
        {
            title: "Genel",
            commits: [
                "Sürekli çalışma için güvenlik düzenlemeleri yapıldı",
                "Bildirimler ekranı için tasarım düzenlemeleri yapıldı",
                "Logout durumları için geliştirmeler yapıldı"
            ]
        },
        {
            title: 'Hastalar',
            commits: [
                "Hasta Detay ve Hasta listelerinde yer alan ürün aktar eklendi",
                "Hasta Detay ve Hasta listelerinde yer alan ürün iade et eklendi",
                "Hasta Detayına günlük hasta rutinleri ekranı eklendi",
                "Hastalar menüsüne hasta rutin kontrolleri menüsü eklendi",
                "Hasta rutin oluşturma kuralı eklendi"
            ]
        },
        {
            title: 'Kurum Yönetimi',
            commits: [
                "Hasta yoklamaları ekranları tasarım düzenlemeleri yapıldı",
            ]
        },
    ]
}

const version2_0_0_0_rc_1_0: ChangeLogItem = {
    version: "2.0.0.0-rc-1.0",
    features: [
        {
            title: "Genel",
            commits: [
                "Başlıklar için tasarım düzenlemeleri",
                "Tarih alanlarının sıralamaları için düzenlemeler",
            ]
        },
        {
            title: 'Hastalar',
            commits: [
                "Hasta Rutin yönetimi eklendi",
                "Hasta Rutin kontrolleri tasarım düzenlemeleri",
            ]
        },
        {
            title: 'Kurum Yönetimi',
            commits: [
                "Kurum Raporları için altyapı düzenlemeleri",
            ]
        },
    ]
}

const version2_0_0_0_rc_1_1: ChangeLogItem = {
    version: "2.0.0.0-rc-1.1",
    features: [
        {
            title: 'Hastalar',
            commits: [
                "Ön kayıtlardaki tamamlama yatak seçim düzenlemeleri",
                "Ön kayıt oluşturma da durumlar filtrelendi",
                "Hasta detay kart alanına bakım planları eklendi",
            ]
        },
        {
            title: 'Kurum Yönetimi',
            commits: [
                "Hasta Grafiklerine aktif kurum durumu eklendi",
            ]
        },
    ],
    changes: [
        {
            title: "Genel",
            commits: [
                "Uygulama icon değişikliği",
                "Tutar alanları TL ikonu ile gösterilecek",
            ]
        },
        {
            title: "Hastalar",
            commits: [
                "Para giriş ekranı düzenleme",
                "Durum değişikliği düzenlemeleri",
                "Yatak seçimi tasarım düzenlemesi",
                "Kurum Bilgileri güncelleme düzenlemeler",
                "Bireysel bakım planlarındaki validasyon düzenlemeleri",
            ]
        },
        {
            title: "Kurum Yönetimi",
            commits: [
                "Gösterge Kartlarında veriler düzenlendi",
            ]
        },
        {
            title: 'Sistem',
            commits: [
                "Uygulama servis yönlendirme düzenlemeleri",
            ]
        },
    ]
}

const version2_0_0_0_rc_1_2: ChangeLogItem = {
    version: "2.0.0.0-rc-1.2",
    features: [
        {
            title: 'Kurum Yönetimi',
            commits: [
                "Onay Talepleri sayfası eklendi",
            ]
        },

    ],
}

export default
    [
        version2_0_0_0_rc_1_2,
        version2_0_0_0_rc_1_1,
        version2_0_0_0_rc_1_0,
        version2_0_0_0_beta,
        version2_0_0_0_alpha,
        version2_0_0_0_preAlpha,
        version1_0_1_20,
        version1_0_1_19,
        version1_0_1_18,
        version1_0_1_17,
        version1_0_1_16,
        version1_0_1_15,
        version1_0_1_14,
        version1_0_1_13,
        version1_0_1_12,
        version1_0_1_11,
        version1_0_1_10,
        version1_0_1_9,
        version1_0_1_8,
        version1_0_1_7,
        version1_0_1_6,
        version1_0_1_5,
        version1_0_1_3,
        version1_0_1_2,
        version1_0_1_1,
    ] as ChangeLogItem[]
