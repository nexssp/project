module.exports = (cmd, args) => {
  const _log = require('@nexssp/logdebug')
  const _path = require('path')
  const { bold, green } = require('@nexssp/ansi')
  const { existsSync, writeFileSync } = require('fs')
  const { NEXSS_PROJECTS_DB } = require('../../config/project')
  const cliArgs = require('minimist')(process.argv.slice(2))

  const inquirer = require('inquirer')

  inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))

  const forceCreate = cliArgs.f || cliArgs.force

  _log.info(`Attaching project from current folder ${bold(process.cwd())}`)

  let configContent
  const questions = []

  const { config1 } = require('../../config/config')

  const NEXSS_PROJECT_CONFIG_PATH = config1.getPath()
  if (NEXSS_PROJECT_CONFIG_PATH) {
    configContent = config1.load()
    _log.info(`This is ${bold('Nexss PROGRAMMER')} project.`)
  }

  const answersFromParams = {}

  if (configContent && configContent.name) {
    _log.info(`Project name: ${green(configContent.name)}`)
  } else if (cliArgs.projectName) {
    answersFromParams.projectName = cliArgs.projectName
    _log.info(`Project name: ${green(answersFromParams.projectName)}`)
  } else {
    questions.push({
      type: 'input',
      name: 'projectName',
      message: 'Enter project name',
      default: _path.basename(process.cwd()),
    })
  }
  if (cliArgs.description) {
    answersFromParams.description = cliArgs.description
    _log.info(`Description: ${green(answersFromParams.description)}`)
  } else {
    questions.push({
      type: 'input',
      name: 'description',
      message: 'Enter description',
      default: cliArgs.description,
    })
  }

  if (cliArgs.keywords) {
    answersFromParams.keywords = cliArgs.keywords
    _log.info(`Keywords: ${green(answersFromParams.keywords)}`)
  } else {
    questions.push({
      type: 'input',
      name: 'keywords',
      message: 'Enter keywords (for searching)',
    })
  }

  if (cliArgs.repo) {
    answersFromParams.repo = cliArgs.repo
    _log.info(`Repo: ${green(answersFromParams.repo)}`)
  } else {
    questions.push({
      type: 'input',
      name: 'repo',
      message: 'Enter repository',
    })
  }

  if (cliArgs.editor) {
    answersFromParams.editor = cliArgs.editor
    _log.info(`Editor: ${green(answersFromParams.editor)}`)
  } else {
    questions.push({
      type: 'input',
      name: 'editor',
      message: 'Enter code editor command',
      default: 'code .',
    })
  }
  if (cliArgs.note) {
    answersFromParams.note = cliArgs.note
    _log.info(`Note: ${green(answersFromParams.note)}`)
  } else {
    questions.push({
      type: 'input',
      name: 'note',
      message: 'Enter extra note',
    })
  }

  if (questions.length === 0) {
    attachProject(answersFromParams)
  } else {
    inquirer.prompt(questions).then((answers) => {
      answers = Object.assign(answers, answersFromParams)
      attachProject(answers)
    })
  }

  function attachProject(answers) {
    const projectNameIndex = answers.projectName || configContent.name

    const projects = existsSync(NEXSS_PROJECTS_DB) ? require(NEXSS_PROJECTS_DB) : {}
    if (!forceCreate && projects[projectNameIndex]) {
      _log.warn(`project ${bold(projectNameIndex)} already exists in ${bold(NEXSS_PROJECTS_DB)}`)
      process.exit(0)
    }
    delete answers.projectName

    answers.workDir = process.cwd()
    Object.assign(projects, { [projectNameIndex]: answers })

    writeFileSync(NEXSS_PROJECTS_DB, JSON.stringify(projects, null, 2))
    return true
  }
}
