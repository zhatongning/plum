import chalk from 'chalk'

const handleExit = () => {
  process.on('uncaughtException', () => {
    console.log(
      chalk.bgCyan('\r\n[Plum]'),
      chalk.gray('Existed, See you next time~')
    )
    process.exit(0)
  })
}

export const handleException = () => {
  handleExit()
}
