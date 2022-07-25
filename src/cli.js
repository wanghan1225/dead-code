const path = require('path')
const chalk = require('chalk')
const { workDir } = require('./config')

function createCli({ filenameArr, fix, include }) {
  const CLIEngine = require('eslint').CLIEngine
  const cli = new CLIEngine({
    'parserOptions': {
      'ecmaVersion': 12,
      'sourceType': 'module',
    },
    rules: {
      'deadvars/dead-vars': [2, { filenameArr, vars: 'local' }],
      "autofix-fork/no-unused-vars": 2,
    },
    fix,
    useEslintrc: false,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'deadvars', 'autofix-fork'],
    envs: ['browser', 'es2021', 'node'],
    cwd: path.join(__dirname, '../'),
    ignorePattern: ['**/*.d.ts', '**/*.test.ts', '**/*.test.js', '**/*.spec.ts', '**/*.spec.js'],
    extensions: ['.ts', 'tsx', '.js', 'jsx'],
  })
  console.log(chalk.red('==================================================unUsedVars==================================================='))
  try {
    include = include.map(p => path.resolve(workDir, p))
    const report = cli.executeOnFiles(include || [])
    let index = 1
    const allMessages = report.results.reduce((prev, { filePath, messages }) => {
      messages = messages.filter(({ ruleId }) => ruleId !== 'autofix-fork/no-unused-vars')
      if (!messages.length) return prev
      console.log(chalk.green(`${index++}: ${path.relative(workDir, filePath)}`))
      messages.forEach(({ message, ruleId, line, column }) => {
        console.log(`${chalk.yellow(`ruleId: ${ruleId}`)}, ${chalk.red(`message: ${message}`)}, ${chalk.green(`line: ${line}, column: ${column}`)}`)
      })
      return prev.concat(messages)
    }, [])
    if (!allMessages.length) {
      console.log(chalk.green('No unused vars'))
    }
    CLIEngine.outputFixes(report)
  } catch (error) {
    console.log(chalk.green('No unused vars'))
    console.log(chalk.red(error))
  }
  
  
}

module.exports = {
  createCli
}