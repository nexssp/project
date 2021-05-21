module.exports = (cmd, args) => {
  // removes project from the list
  const _log = require('@nexssp/logdebug')
  const { bold, green } = require('@nexssp/ansi')
  const fs = require('fs')
  const { NEXSS_PROJECTS_DB } = require('../../config/project')
  const { config1 } = require('../../config/config')
  const NEXSS_PROJECT_CONFIG_PATH = config1.getPath()
  const cliArgs = require('minimist')(process.argv.slice(2))
  const projectToDelete = cliArgs._[1]

  if (!projectToDelete) {
    _log.error(bold('Enter project to delete. eg. nexss p <projectToDelete>'))
    return true
  }
  const projects = require(NEXSS_PROJECTS_DB)
  if (!projects[projectToDelete]) {
    _log.error(`project ${bold(projectToDelete)} does not exist in ${bold(NEXSS_PROJECTS_DB)}`)
   return true
  }

  delete projects[projectToDelete]
  try {
    fs.writeFileSync(NEXSS_PROJECTS_DB, JSON.stringify(projects, null, 2))
  } catch (e) {
    _log.error(e)
  }

  _log.success('Done..')
  return true
}
