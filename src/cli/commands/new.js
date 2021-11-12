module.exports = (cmd, args) => {
  // const args = require('minimist')(process.argv.slice(2))
  const _fs = require('fs')
  const _path = require('path')
  const _log = require('@nexssp/logdebug')
  const { bold } = require('@nexssp/ansi')
  const copydir = require('copy-dir')
  const currentPath = process.cwd()

  let paramName = args[0]

  if (!paramName) {
    _log.error(`Enter project name eg. nexss project new project-name-here.`)
    process.exit(1)
  }
  let projectPath, dotDir
  if (paramName === '.') {
    dotDir = true
    //We take make project path foldername as current dir
    paramName = _path.basename(currentPath)
    projectPath = currentPath

    if (_fs.existsSync(`${projectPath}/_nexss.yml`)) {
      console.log('This is nexss project.')
      return true
    }
  } else if (`${paramName}`.length < 3) {
    _log.error(`Project name needs to be at least 3 characters.`)
    process.exit(1)
  } else {
    projectPath = _path.join(currentPath, paramName)
    _log.info(`Creating project '${paramName}'`)
    if (!_fs.existsSync(projectPath)) {
      console.log(`creating project ${projectPath}`)
      _fs.mkdirSync(projectPath, 0777)
    } else {
      if (!args.f && !args.ff) {
        _log.error(`Folder ${projectPath} exists. Folder cannot exist.`)
        return true
      } else {
        _log.error(`Folder ${projectPath} exists but ${yellow('force option enabled.')}`)
      }
    }
  }

  let nexss = {}
  nexss.template = args.template ? args.template : 'default'
  nexss.fullforce = args.ff

  if (nexss.template) {
    const templatePath = _path.join(__dirname, '../../templates/', nexss.template)

    if (!_fs.existsSync(templatePath)) {
      _log.error(`Template ${bold(nexss.template)} does not exist.`)
      _fs.rmdirSync(projectPath)
      return true
    } else {
      _log.success(`Using ${bold(nexss.template)} template. Copying files...`)

      options = {}
      options.cover = false
      if (!_fs.existsSync(`${projectPath}/_nexss.yml`)) {
        // We check if there is default template already (first run?)
        if (!_fs.existsSync(`${templatePath}/_nexss.yml`)) {
          //We clone the default template
          try {
            require('child_process').execSync(
              `git clone https://github.com/nexssp/template_default.git ${templatePath}`,
              {
                stdio: 'inherit',
              }
            )
            _log.success(`Default template cloned.`)
          } catch (er) {
            console.error(er)
            process.exit(0)
          }
        }
        copydir.sync(templatePath, projectPath, options)
      } else {
        console.log('This is already nexss project.')
      }
    }

    const { config1 } = require('../../config/config')
    const newProjectConfigPath = _path.join(projectPath, '_nexss.yml')
    let configContent = config1.load(newProjectConfigPath)
    configContent.name = paramName

    // console.log(configContent);

    config1.save(configContent, newProjectConfigPath)

    if (dotDir) {
      //current folder new project
      _log.success(
        `Project '${paramName}' is ready. 
to run please enter 'nexss start'`
      )
    } else {
      _log.success(
        `Project '${paramName}' is ready. 
Go to the project by command '${bold('cd ' + paramName)}'`
      )
    }
    return true
  }
}
