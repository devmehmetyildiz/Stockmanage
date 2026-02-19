
export interface ChangeLogItem {
    version: string
    date: string
    changes?: ChangeLogItemChangeItem[]
    bugs?: ChangeLogItemChangeItem[]
    features?: ChangeLogItemChangeItem[]
    withoutIssues?: ChangeLogItemChangeItem[]
}

export interface ChangeLogItemChangeItem {
    title: string
    commits: string[]
}

const version1_0_0_0_preAlpha: ChangeLogItem = {
    version: "1.0.0.0-preAlpha",
    date: "2025-10-08"
}

const version1_0_0_0_beta: ChangeLogItem = {
    version: "1.0.0.0-beta",
    date: "2025-11-19",
    changes: [
        {
            title: 'Ziyaretler',
            commits: [
                'Ziyaret tamamlama aşamasında ön ödeme ve ön ödeme yönteminin zorunluluğu kaldırıldı, ön ödeme alınmış ise ön öndeme türü talep edilecek'
            ]
        },
        {
            title: 'Metin Düzenlemeleri',
            commits: [
                'Ürünler alanlarında türkçe metin düzenlemeleri',
                'İngilizce dil eklendi',
            ]
        },
    ],
    features: [
        {
            title: 'Tahsilatlar',
            commits: [
                'Tahsilat girişlerinde ödeme tarihi eklendi',
                'Tamamlanan tahsilatlarda ödeme tarihi tablolara eklendi',
            ]
        },
        {
            title: 'Ziyaretler',
            commits: [
                'Ziyaretlere açıklama alanı getirildi',
            ]
        },
    ],
    bugs: [
        {
            title: 'Arka plan düzenlemeleri',
            commits: [
                'Başarılı olan işlemler sonrası alınan servis hatası giderildi'
            ]
        }
    ]
}

const version1_0_0_0_rc: ChangeLogItem = {
    version: "1.0.0.0-rc",
    date: "2025-12-04",
    features: [
        {
            title: 'Ziyaretler',
            commits: [
                'Ziyaretler için ücretsiz ziyaret tipi eklendi',
                'Normal Ziyaretler için satış ziyaretleri alanına taşındı',
                'Ödeme planı detayından ziyaretlere kısayol eklendi',
                'Genel aramadan ziyaretlere gitme sağlandı',
            ]
        }
    ],
    changes: [
        {
            title: 'Kurum Yönetimi',
            commits: [
                "Menü sıralama düzenlemesi",
                "Onay taleplerindeki kullanıcı isim görüntülemede değişiklik",
            ]
        },
        {
            title: 'Ziyaretler',
            commits: [
                "İşlemi yapan kullanıcı yerine Sorumlu kullanıcı ve çalışan kullanıcı kolonları eklendi"
            ]
        },
        {
            title: 'Depolar Ve Ürün Yönetimi',
            commits: [
                "Depolar sayfasına ürün girişi butonu eklendi",
                "Depolar Detay sayfasına ürün girişi butonu eklendi",
                "Ürün tanımlarındaki tedarikçi zorunlulukları kaldırıldı",
                "Depo detayında ürüne tıklanarak harekete gidebilme sağlandı",
            ]
        },
    ],
    bugs: [
        {
            title: 'Ziyaretler',
            commits: [
                'Tamamlanan ve kapatılan sayfalarındaki ödeme kolonlarındaki veri çekim hatası giderildi'
            ]
        }
    ]
}

const version1_0_0_0: ChangeLogItem = {
    version: "1.0.0.0",
    date: "2026-01-06",
    changes: [
        {
            title: 'Ziyaretler',
            commits: [
                'Ziyaret girişlerinde ürün seçiminde depo seçimi ürün bazına indirgendi',
                'Ziyaret detay sayfasında iade edilen ürün miktarının gösterilmesi sağlandı',
            ]
        }
    ],
    features: [
        {
            title: 'Ürünler',
            commits: [
                'Ürün sayfasına marka kolonu eklendi',
                'Ambar detay sayfasına ürün adına marka eklendi',
                'Manuel ürün girişi sayfasına ürün adı yanına marka eklendi',
                'Manuel ürün girişi sayfasında ürün ve depo için arama özelliği eklendi',
                'Doktor tanımları sayfasına tc alanı zorunluluğu kaldırıldı.',
            ]
        }
    ],
}

const version1_0_1_0: ChangeLogItem = {
    version: "1.0.1.0",
    date: "2026-02-13",
    changes: [
        {
            title: 'Sistem',
            commits: [
                'İşlem loglama performans geliştirmeleri yapıldı, sistemsel kesinye yol açması önlendi',
                'Kullanıcı bildirimerinin doğru gelmesi sağlandı, sağ üst zil iconuna tıklandığında bildirimler düzgün şekilde listeleniyor',
            ]
        },
        {
            title: 'Depolar',
            commits: [
                'Depo detay sayfasında ürün hareketleri sekmesi için tasarım düzenlemeleri yapıldı',
                'Depo detayıda listelenen ürünler için sayfalama eklendi',
                'Ürün hareketlerindeki geçmiş hareketler ile alakalı tasarım düzenlemeleri yapıldı',
            ]
        },
    ],
    features: [
        {
            title: 'Muhasebe',
            commits: [
                'Cari işlem hareketleri ve Cari işlem analizi sayfaları eklendi',
                'Cari işlem hareketleri ziyaretlerden herhangi bir ödeme alınınca veya bir taksit ödemesi gerçekleşince otomatik olarak eklenecek şekilde ayarlandı',
                'Cari işlem hareketleri sayfasının sağ üst köşesine Yeni Cari İşlem butonu eklendi, bu buton ile manuel olarak cari işlem girişi yapılabiliyor',
                'Cari işlem analizi sayfasında cari işlemlere ait görsel grafikler eklendi',
                'Analiz grafikleri gelir, gider ve net tutar bazında gösteriliyor',
                'Giderler, manuel olarak eklenenen cari işlemlerden seçiliyor',
                'Cari işlemler ile alakalı roller eklendi, istenirse bu iki sayfa gizlenebilir.',
            ]
        },
    ],
    bugs: [
        {
            title: 'Sistem',
            commits: [
                "Başarılı ve hata bildirimlerinin ekran pozisyonlarının kullanıcı ayarlarına göre gelmemesi sorunu giderildi, bildirimler artık kullanıcı ayarlarında seçilen pozisyonda gösteriliyor",
                "Parola sıfırlama durumlarında silinen kullanıcalara mail gitmesi sorunu giderildi",
            ]
        }
    ]
}

const version1_0_1_1: ChangeLogItem = {
    version: "version1_0_1_1",
    date: "2026-02-19",
    bugs: [
        {
            title: 'Raporlar',
            commits: [
                "Sistemde tanımlı satış ziyareti yokken rapor sayfasının hataya düşme sorunu giderildi",
            ]
        }
    ]
}

export default
    [
        version1_0_1_1,
        version1_0_1_0,
        version1_0_0_0,
        version1_0_0_0_rc,
        version1_0_0_0_beta,
        version1_0_0_0_preAlpha,
    ] as ChangeLogItem[]
