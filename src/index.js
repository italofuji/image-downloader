#! /usr/bin/env node
import yargs from 'yargs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'
import fs from 'fs'

import { getNavigationLinks, visidAllNavigationLinks } from './navigation-links'

const DEFAULT_OUTPUT_PATH = dirname(fileURLToPath(import.meta.url))

const params = yargs(process.argv.slice(2))
  .option('url', { type: 'string', demandOption: true, description: 'website url' })
  .option('outputPath', { type: 'string', description: 'directory to save downloaded images', default: DEFAULT_OUTPUT_PATH })

const { url, outputPath } = params.argv

console.log('url: ', url)
console.log('outputPath: ', outputPath)

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath)
}

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  page.on('response', async response => {
    const url = response.url()
    if (response.request().resourceType() === 'image') {
      response.buffer().then(file => {
        const fileName = url.split('/').pop()
        const filePath = resolve(outputPath, fileName)
        const writeStream = fs.createWriteStream(filePath)
        writeStream.write(file)
      })
    }
  })

  await page.goto(url)
  const links = await getNavigationLinks(page)

  await visidAllNavigationLinks(page, links)

  await browser.close()
})()
