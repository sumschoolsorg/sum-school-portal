import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) results = results.concat(walk(full));
    else if (full.endsWith('.ts') || full.endsWith('.tsx')) results.push(full);
  });
  return results;
}

function getRoutes(dir, baseRoute = '') {
  let routes = new Set();
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      routes = new Set([...routes, ...getRoutes(full, baseRoute + '/' + file)]);
    } else if (file === 'page.tsx' || file === 'page.js') {
      routes.add(baseRoute || '/');
    }
  });
  return routes;
}

const validRoutes = getRoutes('src/app');
const allSrc = walk('src');
const deadLinks = [];

allSrc.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.matchAll(/href=["'](\/[^"'#?\s]+)["']/g);
  for (const m of matches) {
    let route = m[1];
    if (route.length > 1 && route.endsWith('/')) route = route.slice(0, -1);
    if (
      !validRoutes.has(route) &&
      !route.startsWith('/api') &&
      !route.startsWith('/images') &&
      !route.startsWith('/icons')
    ) {
      deadLinks.push({ file: f, route });
    }
  }
});

console.log('Total valid routes:', validRoutes.size);
console.log('Dead internal links:', deadLinks.length);
deadLinks.forEach(d => console.log(`Dead Link: ${d.route} in ${d.file}`));
