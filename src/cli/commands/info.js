module.exports = (_) => {
  const { bold, yellow, green, grey } = require('@nexssp/ansi')
  const { config1 } = require('../../config/config')
  let nexssConfig = config1.load()
  const _log = require('@nexssp/logdebug')
  if (nexssConfig) {
    console.log(bold(yellow('Current Project: ')))
    const { files } = nexssConfig
    const { sequences } = nexssConfig
    const pInfo = () =>
      `\nFiles: ${yellow(files && files.length)} ${grey('nexss f add myfile.php')}`
    // Config file: ${util.inspect(nexssConfig)}

    console.log(`Name: ${bold(green(nexssConfig.name))}`)

    if (files) {
      console.log(pInfo())
      console.table(files)
    }
    if (sequences) {
      console.log(bold(yellow(`Sequences:`)))

      Object.keys(sequences).forEach((element) => {
        console.log(bold(element))
        console.table(sequences[element])
      })
    }
    console.log(`${grey("To display config 'nexss config get'")}`)
  } else {
    _log.warn(`This is not ${bold('Nexss PROGRAMMER project')}`)
    _log.info(
      `Create new project:
      New folder: ${bold('nexss project new MyProjectName')} OR ${bold('nexss p n MyProjectName')}
      Current folder: ${bold('nexss project new .')} OR ${bold('nexss p n .')}
    `
    )
  }
  return true
}
