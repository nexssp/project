function nexssGitProject({
  projectType,
  repoAddress,
  projectName,
  install: installPackages,
  tag: gitTag,
} = {}) {
  const _fs = require('fs')
  const _path = require('path')
  const _log = require('@nexssp/logdebug')
  const { bold } = require('@nexssp/ansi')

  const run = () => {
    const { nSpawn } = require('@nexssp/system')

    const currentPath = process.cwd()
    let paramName = projectName
    if (!paramName) {
      _log.error(bold(`Enter project name eg. nexss project ${projectType} project-name-here`))
      process.exit(1)
    }

    //   const projectPath = _path.join(currentPath, paramName)

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
    } else {
      projectPath = _path.join(currentPath, paramName)
      _log.info(`Creating project '${paramName}'`)

      if (!_fs.existsSync(projectPath)) {
        console.log(`creating project ${projectPath}`)
        _fs.mkdirSync(projectPath, 0777)
      } else {
        _log.error(`Folder ${projectPath} exists. Folder cannot exist.`)
        return true // stop
      }
    }

    try {
      const result = nSpawn(`git clone --depth=1 ${repoAddress} ${projectPath}`, {
        stdio: 'inherit',
      })

      if (result.exitCode > 0) {
        process.exit(1)
      }
    } catch (error) {
      if ((error + '').indexOf('Command failed: git clone') > -1) {
        console.error(`Issue with the repository: ${bold(repoAddress)}`, error)

        process.exit(1)
      }
    }

    if (gitTag) {
      const gitTagCommand = `git checkout tags/${gitTag}`
      try {
        nSpawn(gitTagCommand, {
          stdio: 'inherit',
          cwd: projectPath,
        })
      } catch (error) {
        console.error(`${gitTagCommand} failed: ${bold(repoAddress)}`, error)
        process.exit(1)
      }
    }

    //   npm install
    if (installPackages) {
      try {
        const projectPathPackageJson = _path.join(projectPath, 'package.json')
        const projectPathNodeModules = _path.join(projectPath, 'node_modules')
        _log.info('Installing packages..')

        if (_fs.existsSync(projectPathPackageJson) && !_fs.existsSync(projectPathNodeModules)) {
          nSpawn('npm install', {
            stdio: 'inherit',
            cwd: projectPath,
          })
        }
      } catch (error) {
        if ((error + '').indexOf('Command failed: npm install') > -1) {
          console.error(`Project path: ${bold(projectPath)}`, error)

          process.exit(1)
        }
      }
    }

    if (dotDir) {
      //current folder new project
      _log.success(`Project '${paramName}' is ready.`)
    } else {
      _log.success(
        `Project '${paramName}' is ready. 
Go to the project by command '${bold('cd ' + paramName)}'`
      )
    }

    _log.success(`see README.md for more details.`)
  }

  return { run, getType }
}

const getType = (type) => {
  const projectTypes = require('../projectTypes')

  try {
    return projectTypes[type]
  } catch (error) {
    console.error(`Project ${type} not found in the list.`)
    process.exit(1)
  }
}

module.exports = { nexssGitProject, getType }
