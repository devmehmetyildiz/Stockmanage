const breakdownmainteanciesrule = `
const axios = require('axios')
const interval = 1000
const secret = process.env.APP_SESSION_SECRET
const userroleurl = process.env.USERROLE_URL
const warehouseurl = process.env.WAREHOUSE_URL

const notificationProcess = async () => {
    try {
        console.log("/////// JOB BAŞLADI ///////")
        const users = await getUsers()
        const roles = await getRoles()
        const breakdowns = await getBreakdowns()
        const mainteancies = await getMainteancies()

        let notifications = []
        users.forEach(user => {
            const isValid = checkRolesfornotification(user.Roleuuids, roles)
            if (isValid) {
                if (breakdowns.length > 0) {
                    notifications.push({
                        UserID: user?.Uuid,
                        Notificationtype: 'Information',
                        Notificationtime: Date.now.toString(),
                        Subject: 'Aktuel Arızalar',
                        Message: 'Aktif' + breakdowns.length +' arıza var !',
                        Isshowed: false,
                        Isreaded: false,
                        Pushurl: '/Breakdowns'
                    })
                }
                if (mainteancies.length > 0) {
                    notifications.push({
                        UserID: user?.Uuid,
                        Notificationtype: 'Information',
                        Notificationtime: Date.now.toString(),
                        Subject: 'Aktuel Bakım Talepleri',
                        Message: 'Aktif' + mainteancies.length +' bakım var !',
                        Isshowed: false,
                        Isreaded: false,
                        Pushurl: '/Mainteancies'
                    })
                }
            }
        })
        if (notifications.length > 0) {
            notifications.forEach(async (notification) => {
                await axios({
                    method: 'POST',
                    url: userroleurl + 'Usernotifications',
                    headers: {
                        session_key: secret
                    },
                    data: notification
                })
            })
            console.log('notifications.length adet bildirim gönderildi')
        }
    }
    catch (error) {
        console.log("error", error)
    }
}

const checkRolesfornotification = (roleUuids, roles) => {
    let valid = false
    roleUuids.forEach(roleUuid => {
        const role = (roles || []).find(u => u.Uuid === roleUuid?.RoleID)
        const privileges = (role?.Privileges || []).map(u => { return u.code })
        if (privileges.includes('admin')) {
            valid = true
        }
    })
    return valid
}

const getBreakdowns = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: warehouseurl + 'Breakdowns',
            headers: {
                session_key: secret
            },
        })
        return response?.data.filter(u => !u.Iscompleted)
    }
    catch (error) {
        throw error
    }
}

const getMainteancies = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: warehouseurl + 'Mainteancies',
            headers: {
                session_key: secret
            },
        })
        return response?.data.filter(u => !u.Iscompleted)
    }
    catch (error) {
        throw error
    }
}

const getUsers = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: userroleurl + 'Users',
            headers: {
                session_key: secret
            },
        })
        return response?.data
    }
    catch (error) {
        throw error
    }
}

const getRoles = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: userroleurl + 'Roles',
            headers: {
                session_key: secret
            },
        })
        return response?.data
    }
    catch (error) {
        throw error
    }
}


setTimeout(() => {
    notificationProcess()
}, interval)
`
const usercreaterule = `

const axios = require('axios')
const secret = process.env.APP_SESSION_SECRET
const userroleurl = process.env.USERROLE_URL

const users = [

]

const usercreaterule = async () => {
  try {
    console.log("/////// JOB BAŞLADI ///////")

    for (const user of users) {
      const body = {
        Username: user.Username,
        Name: user.Name,
        Surname: user.Surname,
        Email: user.Email,
        Password: String(user.Password),
        Language: 'tr',
        Isworker: true,
        Workstarttime: new Date(user.Workstarttime),
        Isworking: true,
        ProfessionID: user.ProfessionID,
        Dateofbirth: new Date(user.Dateofbirth),
        Phonenumber: user.Phonenumber,
        Bloodgroup: user.Bloodgroup,
        Foreignlanguage: user.Foreignlanguage,
        Graduation: user.Graduation,
        Contactnumber: user.Contactnumber,
        Chronicillness: user.Chronicillness,
        Covid: user.Covid,
        City: user.City,
        Town: user.Town,
        Adress: user.Adress,
        Includeshift: false,
        CountryID: String(user.CountryID),
        Gender: String(user.Gender),
        Roles: [
          { Uuid: "" }
        ]
      }
      await postUsers(body)
      console.log("Kullanıcı Eklendi" + user.Username)
    }
  }
  catch (error) {
    console.log("error", error)
  }
}



const postUsers = async (data) => {
  try {
    const response = await axios({
      method: 'POST',
      url: userroleurl + 'Users',
      headers: {
        session_key: secret
      },
      data: data
    })
    return response.data
  }
  catch (error) {
    throw error?.response?.data
  }
}


usercreaterule()

`

const mainteancecreaterule = `

const axios = require('axios')
const interval = 1000 * 60 * 10                // 10 dakika interval
const secret = process.env.APP_SESSION_SECRET
const warehouseurl = process.env.WAREHOUSE_URL

const notificationProcess = async () => {
    try {
        const plans = await getMainteanceplans()
        const mainteancies = await getMainteancies()
        for (const plan of plans) {
            const planStartDate = new Date(plan?.Startdate)
            const now = new Date()
            const shouldControlStart = isDateInFourDayPeriod(planStartDate, now, plan?.Dayperiod)
            if (shouldControlStart) {
                const controlStart = new Date();
                controlStart.setHours(0, 0, 0, 0)
                const controlEnd = new Date();
                controlEnd.setHours(23, 59, 59, 999)
                const openedMainteanciesBetweenControl = mainteancies
                    .filter(u => new Date(u.Starttime).getTime() >= controlStart.getTime())
                    .filter(u => new Date(u.Starttime).getTime() <= controlEnd.getTime())
                    .filter(u => u.EquipmentID === plan?.EquipmentID && u.ResponsibleuserID === plan?.UserID)

                if (openedMainteanciesBetweenControl.length <= 0) {
                    const mainteanceData = {
                        EquipmentID: plan?.EquipmentID || '',
                        ResponsibleuserID: plan?.UserID || '',
                        Openinfo: plan?.Info || ''
                    }

                    await postMainteance(mainteanceData)
                    console.log(plan?.Uuid+' id numaralı job bakım periyodu oluşturdu');

                }
            }
        }
    }
    catch (error) {
        console.log("error", error)
    }
}

const isDateInFourDayPeriod = (startDate, now, period) => {
    const start = new Date(startDate).setHours(0, 0, 0, 0);

    const diffInDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));

    return diffInDays >= 0 && diffInDays % period === 0;
}

const getMainteanceplans = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: warehouseurl + 'Mainteanceplans',
            headers: {
                session_key: secret
            },
        })
        return (response?.data || []).filter(u => u.Isactive && u.Iscompleted && u.Isworking)
    }
    catch (error) {
        throw error
    }
}

const postMainteance = async (data) => {
    try {
        const response = await axios({
            method: 'POST',
            data: data,
            url: warehouseurl + 'Mainteancies',
            headers: {
                session_key: secret
            },
        })
        return true
    }
    catch (error) {
        throw error
    }
}

const getMainteancies = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: warehouseurl + 'Mainteancies',
            headers: {
                session_key: secret
            },
        })
        return (response?.data?.list || []).filter(u => u.Isactive)
    }
    catch (error) {
        throw error
    }
}

console.log("/////// App Started ///////")


setInterval(() => {
    notificationProcess()
}, interval)

`

const maintestrule = `
const nodemailer = require("nodemailer");

const email = ''
const password = ''

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: email,
        pass: password,
    },
});

const mailOptions = {
    from: email,
    to: email,
    subject: "Hello from Nodemailer",
    text: "This is a test email sent using Nodemailer.",
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Error sending email: ", error);
    } else {
        console.log("Email sent: ", info.response);
    }
});
`


export { breakdownmainteanciesrule,  usercreaterule, mainteancecreaterule, maintestrule }