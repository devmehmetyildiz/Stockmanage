
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

const version1_0_0_0_preAlpha: ChangeLogItem = {
    version: "1.0.0.0-preAlpha",
}

const version1_0_0_0_beta: ChangeLogItem = {
    version: "1.0.0.0-beta",
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

export default
    [
        version1_0_0_0_beta,
        version1_0_0_0_preAlpha,
    ] as ChangeLogItem[]
