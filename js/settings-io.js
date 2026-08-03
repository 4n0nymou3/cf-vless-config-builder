const APP_ID = 'tcb';
const SCHEMA_VERSION = 1;

export function collectExportData() {
  return {
    appId: APP_ID,
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      token: document.getElementById('uid').value.trim(),
      trojanPassword: document.getElementById('tpw').value.trim(),
      protocols: {
        vless: document.getElementById('protoVless').checked,
        trojan: document.getElementById('protoTrojan').checked
      },
      workerDomain: document.getElementById('wdom').value.trim(),
      ips: document.getElementById('ips').value,
      tlsPorts: [...document.querySelectorAll('.ptls:checked')].map(el => el.value),
      wsPorts: [...document.querySelectorAll('.pws:checked')].map(el => el.value),
      fingerprint: document.getElementById('fpSelect').value,
      wsPath: document.getElementById('pathSelect').value,
      fragment: {
        enabled: document.getElementById('fragEnable').checked,
        packets: document.getElementById('fragPackets').value,
        interval: document.getElementById('fragInterval').value,
        length: document.getElementById('fragLength').value,
        maxSplit: document.getElementById('fragMaxSplit').value,
        stage2: {
          enabled: document.getElementById('frag2Enable').checked,
          packets: document.getElementById('frag2Packets').value,
          interval: document.getElementById('frag2Interval').value,
          length: document.getElementById('frag2Length').value,
          maxSplit: document.getElementById('frag2MaxSplit').value
        },
        xrayTls: {
          unsafeFingerprint: document.getElementById('fpUnsafeXray').checked,
          cipherSuites: document.getElementById('cipherSuitesXray').value
        }
      },
      advancedJson: {
        fakeDns: document.getElementById('fakeDns').value,
        ipv6: document.getElementById('ipv6').value,
        lanAccess: document.getElementById('lanAccess').value,
        tcpFastOpen: document.getElementById('tcpFastOpen').value
      },
      ech: {
        enabled: document.getElementById('echEnable').checked,
        dns: document.getElementById('echDns').value
      },
      dns: {
        local: document.getElementById('localDns').value,
        remote: document.getElementById('remoteDns').value
      },
      routingCountries: {
        ir: document.getElementById('routeIr').checked,
        cn: document.getElementById('routeCn').checked,
        ru: document.getElementById('routeRu').checked
      },
      blockRules: {
        ads: document.getElementById('blockPromo').checked,
        porn: document.getElementById('blockPorn').checked,
        quic: document.getElementById('blockQuic').checked,
        malware: document.getElementById('blockMalware').checked,
        phishing: document.getElementById('blockPhishing').checked,
        cryptominers: document.getElementById('blockCryptominers').checked
      },
      observatory: {
        leastPingInterval: document.getElementById('leastPingInterval').value,
        leastLoadInterval: document.getElementById('leastLoadInterval').value,
        leastLoadMode: document.getElementById('leastLoadMode').value,
        leastLoadSampling: document.getElementById('leastLoadSampling').value,
        leastLoadTimeout: document.getElementById('leastLoadTimeout').value
      },
      chainConfig: document.getElementById('chainConfig').value,
      jsonName: document.getElementById('jsonName').value
    }
  };
}

export function exportSettingsToString() {
  return JSON.stringify(collectExportData(), null, 2);
}

export function isValidImportPayload(payload) {
  return !!(
    payload &&
    typeof payload === 'object' &&
    payload.appId === APP_ID &&
    payload.data &&
    typeof payload.data === 'object'
  );
}

export function applyImportedSettings(payload) {
  const d = payload.data;

  if (typeof d.token === 'string') document.getElementById('uid').value = d.token;
  if (typeof d.trojanPassword === 'string') document.getElementById('tpw').value = d.trojanPassword;
  if (d.protocols && typeof d.protocols === 'object') {
    document.getElementById('protoVless').checked = d.protocols.vless !== false;
    document.getElementById('protoTrojan').checked = !!d.protocols.trojan;
  }
  if (typeof d.workerDomain === 'string') document.getElementById('wdom').value = d.workerDomain;
  if (typeof d.ips === 'string') document.getElementById('ips').value = d.ips;

  const tlsSet = new Set(Array.isArray(d.tlsPorts) ? d.tlsPorts : []);
  document.querySelectorAll('.ptls').forEach(el => { el.checked = tlsSet.has(el.value); });

  const wsSet = new Set(Array.isArray(d.wsPorts) ? d.wsPorts : []);
  document.querySelectorAll('.pws').forEach(el => { el.checked = wsSet.has(el.value); });

  if (typeof d.fingerprint === 'string') document.getElementById('fpSelect').value = d.fingerprint;
  if (typeof d.wsPath === 'string') document.getElementById('pathSelect').value = d.wsPath;

  if (d.fragment && typeof d.fragment === 'object') {
    document.getElementById('fragEnable').checked = !!d.fragment.enabled;
    if (typeof d.fragment.packets === 'string') document.getElementById('fragPackets').value = d.fragment.packets;
    if (typeof d.fragment.interval === 'string') document.getElementById('fragInterval').value = d.fragment.interval;
    if (typeof d.fragment.length === 'string') document.getElementById('fragLength').value = d.fragment.length;
    if (typeof d.fragment.maxSplit === 'string') document.getElementById('fragMaxSplit').value = d.fragment.maxSplit;

    const s2 = d.fragment.stage2 && typeof d.fragment.stage2 === 'object' ? d.fragment.stage2 : null;
    document.getElementById('frag2Enable').checked = !!(s2 && s2.enabled);
    document.getElementById('frag2Packets').value = (s2 && typeof s2.packets === 'string') ? s2.packets : '1-1';
    document.getElementById('frag2Interval').value = (s2 && typeof s2.interval === 'string') ? s2.interval : '10-20';
    document.getElementById('frag2Length').value = (s2 && typeof s2.length === 'string') ? s2.length : '100-200';
    document.getElementById('frag2MaxSplit').value = (s2 && typeof s2.maxSplit === 'string') ? s2.maxSplit : '10';

    const xt = d.fragment.xrayTls && typeof d.fragment.xrayTls === 'object' ? d.fragment.xrayTls : null;
    document.getElementById('fpUnsafeXray').checked = !!(xt && xt.unsafeFingerprint);
    document.getElementById('cipherSuitesXray').value = (xt && typeof xt.cipherSuites === 'string') ? xt.cipherSuites : '';
  } else {
    document.getElementById('frag2Enable').checked = false;
    document.getElementById('frag2Packets').value = '1-1';
    document.getElementById('frag2Interval').value = '10-20';
    document.getElementById('frag2Length').value = '100-200';
    document.getElementById('frag2MaxSplit').value = '10';
    document.getElementById('fpUnsafeXray').checked = false;
    document.getElementById('cipherSuitesXray').value = '';
  }

  if (d.advancedJson && typeof d.advancedJson === 'object') {
    if (typeof d.advancedJson.fakeDns === 'string') document.getElementById('fakeDns').value = d.advancedJson.fakeDns;
    if (typeof d.advancedJson.ipv6 === 'string') document.getElementById('ipv6').value = d.advancedJson.ipv6;
    if (typeof d.advancedJson.lanAccess === 'string') document.getElementById('lanAccess').value = d.advancedJson.lanAccess;
    if (typeof d.advancedJson.tcpFastOpen === 'string') document.getElementById('tcpFastOpen').value = d.advancedJson.tcpFastOpen;
  }

  if (d.ech && typeof d.ech === 'object') {
    document.getElementById('echEnable').checked = !!d.ech.enabled;
    if (typeof d.ech.dns === 'string') document.getElementById('echDns').value = d.ech.dns;
  }

  if (d.dns && typeof d.dns === 'object') {
    if (typeof d.dns.local === 'string') document.getElementById('localDns').value = d.dns.local;
    if (typeof d.dns.remote === 'string') document.getElementById('remoteDns').value = d.dns.remote;
  }

  if (d.routingCountries && typeof d.routingCountries === 'object') {
    document.getElementById('routeIr').checked = d.routingCountries.ir !== false;
    document.getElementById('routeCn').checked = !!d.routingCountries.cn;
    document.getElementById('routeRu').checked = !!d.routingCountries.ru;
  } else {
    document.getElementById('routeIr').checked = true;
    document.getElementById('routeCn').checked = false;
    document.getElementById('routeRu').checked = false;
  }

  if (d.blockRules && typeof d.blockRules === 'object') {
    document.getElementById('blockPromo').checked = d.blockRules.ads !== false;
    document.getElementById('blockPorn').checked = d.blockRules.porn !== false;
    document.getElementById('blockQuic').checked = d.blockRules.quic !== false;
    document.getElementById('blockMalware').checked = d.blockRules.malware !== false;
    document.getElementById('blockPhishing').checked = d.blockRules.phishing !== false;
    document.getElementById('blockCryptominers').checked = d.blockRules.cryptominers !== false;
  } else {
    document.getElementById('blockPromo').checked = true;
    document.getElementById('blockPorn').checked = true;
    document.getElementById('blockQuic').checked = true;
    document.getElementById('blockMalware').checked = true;
    document.getElementById('blockPhishing').checked = true;
    document.getElementById('blockCryptominers').checked = true;
  }

  if (d.observatory && typeof d.observatory === 'object') {
    document.getElementById('leastPingInterval').value = typeof d.observatory.leastPingInterval === 'string' && d.observatory.leastPingInterval.trim() ? d.observatory.leastPingInterval : '3m';
    document.getElementById('leastLoadInterval').value = typeof d.observatory.leastLoadInterval === 'string' && d.observatory.leastLoadInterval.trim() ? d.observatory.leastLoadInterval : '5m';
    document.getElementById('leastLoadMode').value = d.observatory.leastLoadMode === 'GET' ? 'GET' : 'HEAD';
    document.getElementById('leastLoadSampling').value = typeof d.observatory.leastLoadSampling === 'string' && d.observatory.leastLoadSampling.trim() ? d.observatory.leastLoadSampling : '2';
    document.getElementById('leastLoadTimeout').value = typeof d.observatory.leastLoadTimeout === 'string' && d.observatory.leastLoadTimeout.trim() ? d.observatory.leastLoadTimeout : '30s';
  } else if (typeof d.pingInterval === 'string' && d.pingInterval.trim() && parseInt(d.pingInterval) > 0) {
    document.getElementById('leastPingInterval').value = parseInt(d.pingInterval) + 's';
    document.getElementById('leastLoadInterval').value = '5m';
    document.getElementById('leastLoadMode').value = 'HEAD';
    document.getElementById('leastLoadSampling').value = '2';
    document.getElementById('leastLoadTimeout').value = '30s';
  } else {
    document.getElementById('leastPingInterval').value = '3m';
    document.getElementById('leastLoadInterval').value = '5m';
    document.getElementById('leastLoadMode').value = 'HEAD';
    document.getElementById('leastLoadSampling').value = '2';
    document.getElementById('leastLoadTimeout').value = '30s';
  }

  if (typeof d.chainConfig === 'string') {
    document.getElementById('chainConfig').value = d.chainConfig;
  } else {
    document.getElementById('chainConfig').value = '';
  }

  if (typeof d.jsonName === 'string') document.getElementById('jsonName').value = d.jsonName;
}