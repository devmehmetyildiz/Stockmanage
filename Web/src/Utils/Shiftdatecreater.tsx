const Getshiftstartdate = (inputdate: string | Date) => {
    const lastdaydate = new Date(inputdate)
    lastdaydate.setMonth(lastdaydate.getMonth() + 1)
    lastdaydate.setDate(0)
    const lastday = lastdaydate.getDate()
    switch (lastday) {
        case 28:
            return 15
        case 29:
            return 16
        case 30:
            return 16
        case 31:
            return 17
        default:
            return 16
    }
}

const Getshiftlastdate = (inputdate: string | Date) => {
    const startDay = new Date(inputdate).getDate()
    let lastDay = Getshiftstartdate(inputdate)
    if (lastDay === startDay) {
        const start = new Date(inputdate)
        start.setMonth(start.getMonth() + 1)
        start.setDate(0)
        lastDay = start.getDate()
    } else {
        lastDay--;
    }
    return lastDay
}

const Getdateoptions = (limit = 4) => {

    //TODO TR LETTER 
    function getMonthName(monthIndex: number) {
        const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
            "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
        return monthNames[monthIndex];
    }

    const options = []

    for (let index = -limit; index < limit; index++) {
        const firstShift = new Date()
        firstShift.setMonth(firstShift.getMonth() + index)
        const lastday = Getshiftstartdate(firstShift)

        const isCurrentmonth = index === 0
        const isStart = lastday > firstShift.getDate()

        firstShift.setDate(1)
        firstShift.setHours(0, 0, 0, 0)
        options.push({
            key: Math.random(),
            text: `${getMonthName(firstShift.getMonth())} ${firstShift.getFullYear()}- 1 ${(isCurrentmonth && isStart) ? '(Aktif)' : ''}`,
            value: firstShift
        })

        const secondShift = new Date(firstShift)
        secondShift.setDate(lastday)
        secondShift.setHours(0, 0, 0, 0)
        options.push({
            key: Math.random(),
            text: `${getMonthName(secondShift.getMonth())} ${secondShift.getFullYear()}- 2 ${(isCurrentmonth && !isStart) ? '(Aktif)' : ''}`,
            value: secondShift
        })
    }
    return options
}

export {
    Getdateoptions,
    Getshiftstartdate,
    Getshiftlastdate
}