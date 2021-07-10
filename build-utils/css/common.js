const path = require('path')
const { classInCss } = require('./classstore')

const permitedPathsClasses = [
  'components',
  'pages',
  'layouts',
  'styles/colors.scss',
].map((folder) => path.resolve(folder))

const permitedPathsVariables = [
  'components',
  'pages',
  'layouts',
  'styles/colors.scss',
  'styles/transitions.scss',
].map((folder) => path.resolve(folder))

const permitedPathsKeyframes = [
  'components',
  'pages',
  'layouts',
  'styles/colors.scss',
  'styles/transitions.scss',
].map((folder) => path.resolve(folder))

const prefixLocalOrGlobal = (classname) => {
  const isGlobal = classname.match(/[A-Z]/)
  const isLocal = classname.match(/[a-z]/)
  const hasUnderscore = classname.match(/_/)
  if (hasUnderscore) throw new Error(`CSS class ${classname} with underscore`)
  if (isGlobal && isLocal)
    throw new Error(
      `CSS class '${classname}' with uppercase and lowercase letters, impossible to know whether it is local or global class`
    )
  if (isGlobal) classname = '_' + classname
  return classname
}

const kebabToCamelCase = (classname) => {
  return classname.replace(/-./g, (hyphen) => hyphen.charAt(1).toUpperCase())
}

const escapeRegex = (string) => {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}
const generateGetLocalIdent =
  (isDev) => (context, _localIdentName, localName) => {
    const isGlobal = localName.match(/^_/)

    const isValidPath = permitedPathsClasses.some(
      (path) => context.resourcePath.indexOf(path) === 0
    )
    if (!isValidPath) return localName
    const classnameWithoutTransition = localName.replace(
      /(Leave|Enter)(To|From|Active)?$/i,
      ''
    )
    let classname = classInCss.getName(
      classnameWithoutTransition,
      context.resourcePath
    )

    if (isDev) {
      if (isGlobal) {
        classname = localName + '-' + classname
      } else {
        classname = kebabToCamelCase(localName) + '-' + classname
      }
    }

    const transition =
      (classnameWithoutTransition !== localName &&
        localName.replace(
          /[\S]+?(Leave|Enter)(To|From|Active)?$/i,
          (_, leaveOrEnter, toOrFromOrActive) =>
            `-${leaveOrEnter.toLowerCase()}${
              toOrFromOrActive ? '-' + toOrFromOrActive.toLowerCase() : ''
            }`
        )) ||
      ''

    return `${classname}${transition}`
  }

module.exports = {
  permitedPathsClasses,
  permitedPathsKeyframes,
  permitedPathsVariables,
  generateGetLocalIdent,
  prefixLocalOrGlobal,
  kebabToCamelCase,
  escapeRegex,
}
