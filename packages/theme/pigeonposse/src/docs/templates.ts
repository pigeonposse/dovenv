/**
 * Returns a readme template for a package.
 *
 * **required const**: title, pkg, socialBadges, pkgBadges, toc
 *
 * **required partial**: installation, toc, content
 */
export const readmePkg = `# {{const.title}}

{{const.socialBadges}}

[![BANNER]({{const.pkg.repository.url}}/blob/main/docs/public/banner.png?raw=true)]({{const.pkg.homepage}})

{{const.pkgBadges}}

{{const.desc}}

{{const.toc}}

{{partial.precontent}}

## 🔑 Installation

{{partial.installation}}

{{partial.content}}

---

{{partial.footer}}
`

/**
 * Returns a index template for a `dovenv` docs page.
 *
 * **required const**: templateMark, docsIndex
 *
 * **required partial**: installationGroup
 */
export const docsIndex = `---
{{const.templateMark}}

{{const.docsIndex}}
---

{{partial.installationGroup}}
`
/**
 * Returns a index template for a `dovenv` docs page.
 *
 * **required const**: templateMark, docsIndex
 *
 * **required partial**: installationGroup
 */
export const docsIndexWithCreate = `---
{{const.templateMark}}

{{const.docsIndex}}
---

## Installation
{{partial.installationGroup}}

## Start a project
{{partial.creationGroup}}
`

/**
 * Returns a contributors index template for a `dovenv` docs page.
 *
 * **required const**: templateMark
 */
export const docsContributors = `---
{{const.templateMark}}

layout: contributors
---

`
