import chalk from 'chalk'

const handleExit = () => {
  process.on('exit', () => {
    console.log(
      chalk.bgCyan('\r\n[Plum]'),
      chalk.gray('\u{1F61E} 你已退出 Plum')
    )
    process.exit(0)
  })
}

export const handleException = () => {
  handleExit()
}
