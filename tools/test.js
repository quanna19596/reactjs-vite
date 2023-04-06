import { readFile } from './utils.js';

const fileData = readFile('./src/router/config.ts');

const BREAK_LINE = process.platform.startsWith('win') ? '\r\n' : '\n';

const rg = new RegExp(`{([${BREAK_LINE}].*?)(.*?(?:path: EPagePath.${'SIGN_IN'}).*)(([${BREAK_LINE}]+([^${BREAK_LINE}]+)){7})`, 'g');

const layouts = ['DashboardLayout', 'LandingLayout'];

const pageObj = fileData.match(rg)[0];

const layout = layouts.find((l) => pageObj.includes(l));

console.log(layout);
