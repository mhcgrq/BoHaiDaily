import cheerio from 'cheerio';

export default function parse(html: string) {
    const $ = cheerio.load(html);
}
