export function randomizeCase(str) {
  let out = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    out += Math.random() < 0.5 ? ch.toUpperCase() : ch.toLowerCase();
  }
  return out;
}

const ROUTING_COUNTRY_CODES = ['ir', 'cn', 'ru'];
const BLOCK_RULE_CODES = ['ads', 'porn', 'malware', 'phishing', 'cryptominers'];

export function resolveSelectedCountries(routingCountries) {
  const selected = ROUTING_COUNTRY_CODES.filter(c => routingCountries && routingCountries[c]);
  return selected.length ? selected : ['ir'];
}

export function resolveSelectedBlockRules(blockRules) {
  return BLOCK_RULE_CODES.filter(c => blockRules && blockRules[c]);
}