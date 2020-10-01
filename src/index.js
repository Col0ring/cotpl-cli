#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const commander = require('commander')
const chalk = require('chalk')
const inquirer = require('inquirer')
const symbols = require('log-symbols')
const download = require('./download')
const render = require('./render')
const repositories = require('./repositories')

// version
commander.version(
  require(path.resolve(__dirname, '../package.json')).version,
  '-V, --version'
)

// create
commander
  .command('create <name>')
  .description('create a new project powered by cotpl-cli')
  .action(async (name) => {
    if (fs.existsSync(name)) {
      console.error(
        symbols.error,
        chalk`{rgb(255,255,255) Target directory {rgb(130,223,226) ${process.cwd()}/${name}} already exists.}`
      )
    } else {
      const { type } = await inquirer.prompt([
        {
          type: 'list',
          name: 'type',
          message: 'choose a templete type you want to create:',
          choices: ['Vue', 'React', 'Node.js', 'Electron']
        }
      ])
      const typeRepositories = repositories[type]
      const typeKeys = Object.keys(typeRepositories)
      if (typeRepositories && typeKeys.length > 0) {
        const { templateName, description, author } = await inquirer.prompt([
          {
            name: 'templateName',
            message: `choose the template you need:`,
            type: 'list',
            choices: typeKeys
          },
          {
            name: 'description',
            message: 'please enter a description:'
          },
          {
            name: 'author',
            message: 'please enter a author:'
          }
        ])
        const downloadPath = `direct:${typeRepositories[templateName]}`
        download(downloadPath, name)
          .then(() => {
            render({ author, description, name })
            console.log(
              symbols.success,
              chalk`{rgb(87,190,56) download successfully!}`
            )
          })
          .catch((err) => {
            console.error(symbols.error, chalk`{rgb(255,255,255) ${err}}`)
            console.error(
              symbols.error,
              chalk`{rgb(255,255,255) download template fail,please check your network connection and try again.}`
            )
            process.exit()
          })
      } else {
        console.log(
          symbols.info,
          chalk`{rgb(255,255,255) There are no templates for ${type}}`
        )
      }
    }
  })

// parse the argv from terminal
commander.parse(process.argv)
