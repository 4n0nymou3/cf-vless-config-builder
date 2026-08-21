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
const SANCTION_RULE_CODES = ['openai', 'googleai', 'microsoft', 'oracle', 'docker', 'adobe', 'epicgames', 'intel', 'amd', 'nvidia', 'asus', 'hp', 'lenovo'];

export function resolveSelectedCountries(routingCountries) {
  const selected = ROUTING_COUNTRY_CODES.filter(c => routingCountries && routingCountries[c]);
  return selected.length ? selected : ['ir'];
}

export function resolveSelectedBlockRules(blockRules) {
  return BLOCK_RULE_CODES.filter(c => blockRules && blockRules[c]);
}

export function resolveSelectedSanctionRules(sanctionBypass) {
  return SANCTION_RULE_CODES.filter(c => sanctionBypass && sanctionBypass[c]);
}

function isPlainIPv4(value) {
  return /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/.test(value);
}

function isPlainIPv6(value) {
  const bracketed = value.match(/^\[([0-9A-Fa-f:]+)\](\/\d{1,3})?$/);
  const candidate = bracketed ? bracketed[1] + (bracketed[2] || '') : value;
  return candidate.includes(':') && /^[0-9A-Fa-f:]+(\/\d{1,3})?$/.test(candidate) ? candidate : null;
}

function isPlainDomain(value) {
  return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(value);
}

export function parseCustomRuleList(raw) {
  const lines = String(raw || '').split('\n').map(s => s.trim()).filter(Boolean);
  const domains = [];
  const ips = [];
  const seen = new Set();
  lines.forEach(line => {
    if (seen.has(line)) return;
    seen.add(line);
    const ipv6 = isPlainIPv6(line);
    if (ipv6) { ips.push(ipv6); return; }
    if (isPlainIPv4(line)) { ips.push(line); return; }
    if (isPlainDomain(line)) { domains.push(line.toLowerCase()); return; }
  });
  return { domains, ips };
}

export function durationToSeconds(value, fallbackSeconds) {
  const match = typeof value === 'string' ? value.trim().match(/^([1-9][0-9]*)(m|s)$/) : null;
  if (!match) return fallbackSeconds;
  const amount = parseInt(match[1]);
  return match[2] === 'm' ? amount * 60 : amount;
}

export function resolveTcbLabel(jsonName, echEnable, fragEnable, customDomainUsed) {
  const base = jsonName || (echEnable ? '👽 Anonymous TCB (ECH) 🚀' : (fragEnable ? '👽 Anonymous TCB (Fragment) 🚀' : '👽 Anonymous TCB (Normal) 🚀'));
  return base + (customDomainUsed ? ' 🌐' : '');
}