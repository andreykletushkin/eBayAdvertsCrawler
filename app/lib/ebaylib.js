import { findAll } from './mongodb-connector.js';
const readVisitedAdverts = async () => { return ((await findAll()).map(el => el.title)) };
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
export { readVisitedAdverts, delay }