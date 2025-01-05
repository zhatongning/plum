import chalk from 'chalk'

export const log = (...str) => {
  console.log(chalk.bgCyan('[Plum]'), ...str)
}
