#! /usr/bin/env node
import yargs from 'yargs'

const args = yargs(process.argv.slice(2)).array('url')
console.log(args)
