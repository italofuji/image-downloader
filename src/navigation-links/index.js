export const getNavigationLinks = async (page) => await page.$$eval('#list > div:first-child .pagination > li > a', (nodes) => nodes.map((node) => ({
  text: node.textContent,
  url: node.href
})).filter((link) => link.text !== '...' && link.url !== 'https://arkhamdb.com/set/dwl/card#'))

export const visidAllNavigationLinks = async (page, links, visited = {}) => {
  if (links.length === 0) return

  const [currentLink] = links
  await page.goto(currentLink.url)

  visited[currentLink.text] = true

  const pageLinks = await getNavigationLinks(page)
  const pageToBeVisited = pageLinks.filter((link) => visited[link.text] === undefined)

  console.log(visited)

  await visidAllNavigationLinks(page, pageToBeVisited, visited)
}
