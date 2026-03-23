
const languages = [
    'tr',
    'en'
]

module.exports = (req, res, next) => {
    if (req.headers && req.headers.language) {
        const language = req.headers.language
        if (languages.includes(language.toLowerCase())) {
            req.i18n.changeLanguage(language.toLowerCase())
        } else {
            req.i18n.changeLanguage("tr")
        }
    }
    next()
}