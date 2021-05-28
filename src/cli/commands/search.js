module.exports = (cmd, args) => {
  const _log = require('@nexssp/logdebug')
  const { bold, green, yellow } = require('@nexssp/ansi')
  const _fs = require('fs')
  const _path = require('path')
  const { NEXSS_PROJECTS_DB } = require('../../config/project')
  const { config1 } = require('../../config/config')
  // const NEXSS_PROJECT_CONFIG_PATH = config1.getPath()
  const cliArgs = require('minimist')(process.argv.slice(2))

  const exists = _fs.existsSync

  // const nexssConfig = config1.load(NEXSS_PROJECT_CONFIG_PATH)

  let search = cliArgs._[2]

  _log.info(`Projects from ${bold(NEXSS_PROJECTS_DB)}`)
  _log.header()
  if (exists(NEXSS_PROJECTS_DB)) {
    if (search) console.log(`Searching: ${yellow(bold(search))}`)
    const projects = require(NEXSS_PROJECTS_DB)
    Object.keys(projects).forEach((e) => {
      if (search) {
        search = search.toLowerCase()
        if (
          !(
            e.toLowerCase().indexOf(search) > -1 ||
            (projects[e].keywords && projects[e].keywords.toLowerCase().indexOf(search) > -1)
          )
        ) {
          return
        }
      }
      const { workDir } = projects[e]
      if (!exists(workDir)) {
        _log.warn(e, red(' NOT EXISTS '), projects[e].workDir)
        return
      }
      const isNexss = exists(_path.join(workDir, '_nexss.yml'))
      if (isNexss) {
        _log.info(yellow(e), green(bold('NEXSSP')), projects[e].workDir)
      } else {
        _log.info(yellow(e), ' ', projects[e].workDir)
      }
    })
  }
  return true
}
