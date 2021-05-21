const _fs = require('fs')
const dotNexssFolder = require('path').normalize(`${require('os').homedir()}/.nexss4`)

try {
  // _fs.existsSync is considered as anti-pattern
  _fs.mkdirSync(dotNexssFolder, { recursive: true })
} catch (error) {}

const NEXSS_PROJECTS_DB = `${dotNexssFolder}/projects_db.json`

module.exports = { NEXSS_PROJECTS_DB }
