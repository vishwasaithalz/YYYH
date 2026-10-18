import { allArticles } from '../src/data/articlesData';
import fs from 'fs';

console.log('Total articles count:', allArticles.length);
const summary = allArticles.map(a => ({
  id: a.id,
  slug: a.slug,
  title: a.title,
  date: a.date,
  updatedDate: a.updatedDate,
  category: a.category
}));
fs.writeFileSync('/tmp/articles_list.json', JSON.stringify(summary, null, 2));
console.log('Sample:', summary.slice(0, 5));
