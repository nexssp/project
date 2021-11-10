module.exports = (cmd, args) => {
  // TODO: to implement gitTag
  const { nexssGitProject, getType } = require('../../lib/nexssGitProject')
  // Get info about project type, repo etc.
  const projectType = getType(cmd)
  //   cmd = 'vue2'
  const projectName = args[0]
  const newGitProject = nexssGitProject({
    projectType: cmd, //preact
    projectName,
    repoAddress: projectType.repo,
    // gitTag, TODO: to implement
    install: process.argv.includes('--install'),
  })

  newGitProject.run()
}
