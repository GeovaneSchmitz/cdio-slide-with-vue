const { classes, classInCss } = require('./classstore')
const {
  permitedPathsClasses,
  generateGetLocalIdent,
  kebabToCamelCase,
  prefixLocalOrGlobal,
} = require('./common.js')

module.exports = function (source) {
  const getLocalIdent = generateGetLocalIdent(this.mode !== 'production')

  const getClassname = ({ classname, filename, isGlobal }) => {
    if (isGlobal) {
      if (this.mode === 'production')
        return getLocalIdent(
          this,
          null,
          '_' + classes.getName(classname, filename)
        )
      return getLocalIdent(this, null, classname)
    }
    if (this.mode === 'production') return classes.getName(classname, filename)
    return classname
  }
  const convertClassname = (classname, filename) => {
    const classnameWithPrefix = prefixLocalOrGlobal(classname)
    if (classnameWithPrefix.match(/^_/)) {
      return `'${getClassname({
        classname: kebabToCamelCase(classnameWithPrefix),
        filename,
        isGlobal: true,
      })}'`
    }
    return (
      '$style.' +
      getClassname({
        classname: kebabToCamelCase(classnameWithPrefix),
        filename,
        isGlobal: false,
      })
    )
  }

  const convertObject = (objectClass, filename) =>
    objectClass.replace(
      /(&quot;[A-Z_a-z0-9 -]+?&quot;|'[A-Z_a-z0-9 -]+?')(?=[^,]*(:))/g,
      (classname) =>
        `[${convertClassname(classname.replace(/&quot;|'/g, ''), filename)}]`
    )

  const convertDynamicAttribute = (classAttributeContent, filename) => {
    const isObject = classAttributeContent.match(/^[ ]*\{/g)
    const isArray = classAttributeContent.match(/^[ ]*\[/g)
    if (isObject) {
      return [convertObject(classAttributeContent, filename)]
    } else if (isArray) {
      return classAttributeContent
        .replace(/^\[|]$/g, '')
        .split(',')
        .map((classe) => convertDynamicAttribute(classe, filename))
    }
    return [classAttributeContent]
  }
  const isValidPath = permitedPathsClasses.some(
    (path) => this.resourcePath.indexOf(path) === 0
  )
  if (isValidPath) {
    source = source.replace(/<[^>]+?class[^>]+?>/g, (tag) => {
      const classes = []
      const staticClassAttribute = tag.match(/ class="[^"]+/g)
      if (staticClassAttribute) {
        const staticClasses = staticClassAttribute[0]
          .replace(/^ class="/, '')
          .split(' ')
        classes.push(
          ...staticClasses.map((classname) =>
            convertClassname(classname, this.resourcePath)
          )
        )
      }

      const classAttribute = tag.match(/ :class="[^"]+/g)
      if (classAttribute) {
        const classAttributeContent = classAttribute[0].replace(
          /^ :class="/,
          ''
        )
        classes.push(
          ...convertDynamicAttribute(classAttributeContent, this.resourcePath)
        )
      }

      if (classes.length === 0) return tag
      let newClassAtrributeContent
      if (classes.length > 1) {
        newClassAtrributeContent = `[${classes.join(', ')}]`
      } else {
        newClassAtrributeContent = classes[0]
      }

      const tagWithoutClass = tag
        .replace(/:?class="[^"]*"/g, '')
        .replace(/ + /g, ' ')
        .replace(/ >/g, '>')

      return tagWithoutClass.replace(
        />$/,
        ` :class="${newClassAtrributeContent}">`
      )
    })
  }
  return source
}
