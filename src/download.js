const download = require('download-git-repo')
const ora = require('ora')
/**
 *
 * @param {string} path
 * @param {string} name
 */
function downloadRepositorie(path, name) {
  return new Promise((resolve, reject) => {
    const spinner = ora('downloading template...')
    spinner.start()
    download(path, name, { clone: true }, (err) => {
      if (err) {
        spinner.fail()
        reject(err)
      }
      spinner.succeed()
      resolve()
    })
  })
}

module.exports = downloadRepositorie
