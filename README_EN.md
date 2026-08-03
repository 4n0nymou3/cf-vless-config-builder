<div align="center">

[فارسی](README.md) | [**English**](README_EN.md)

</div>

<div align="left" dir="ltr">

# Tunnel Config Builder (TCB) v5.3

A tool for building VLESS and Trojan configs for Cloudflare Workers — no VPS or personal server required

## Overview

Tunnel Config Builder is a web-based tool that lets you build VLESS and Trojan configs at no cost, using only the free Cloudflare Workers service. Every step, from creating the Worker to generating the configs, happens right on this page.

## Features

- Simultaneous support for both VLESS and Trojan protocols on a single Worker — with the option to enable only VLESS, only Trojan, or both at once
- Direct build and download of the Worker file with the Token (VLESS) and Password (Trojan) embedded
- Automatic UUID and Password generation, or use your own custom values
- Support for TLS ports: 443, 8443, 2053, 2083, 2087, 2096
- Support for WebSocket ports without TLS: 80, 8080, 8880, 2052, 2082, 2086, 2095
- Support for multiple IPs and domains at once
- TLS Fingerprint selection from 10 options to bypass DPI
- WebSocket Path selection
- Fragment settings to counter deep packet inspection filtering
- Advanced JSON settings: Fake DNS, IPv6, Allow LAN, TCP Fast Open, Local DNS, Remote DNS / DoH
- ECH support to encrypt the Client Hello and hide the SNI from DPI systems
- Configurable routing rules: select Iran, China, and Russia for direct routing (Bypass), and select the Ads, Porn, QUIC, Malware, Phishing, and Cryptominers categories for blocking; both groups apply simultaneously across all three output formats (Xray, Sing-box, Clash)
- User-editable Observatory Settings (leastPing/leastLoad interval, mode, sampling, timeout) for the Xray core
- Chain Proxy — the ability to chain TCB configs to an external server (VLESS, Trojan, Shadowsocks, SOCKS5, or HTTP) to keep the outbound IP fixed, across all three JSON output formats (Xray, Sing-box, Clash)
- JSON config dedicated to the Xray core, based on the latest stable release of that core (26.7.28)
- Simultaneous generation of configs in four formats: VLESS/Trojan link, JSON for the Xray core (with least-ping support), JSON for Sing-box, and JSON for Clash / Mihomo
- Export and import of all page settings as a single file, for backup or quick settings transfer
- One-click dedicated QR Code display for each config — generated fully offline with no external service or API required
- Unique naming for every config (including protocol, IP number, and port) so no two configs share the same name

## How to Use

### Step 1 — Create a Worker on Cloudflare

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign in to your account.

2. From the menu, select Workers and Pages, click Create Application, choose Create Worker, enter a name of your choice, and deploy it.

### Step 2 — Configure the Token and Upload the Code

1. In the tool, generate a new Token, or enter your own custom UUID directly into the field. To use the Trojan protocol, generate a Password the same way, or enter your own custom value.

2. Copy the Worker code — which has already been automatically updated with your Token and Password — using the copy code button, or download the `worker.js` file with the download `.js` button.

3. In the Cloudflare dashboard, click Edit Code, delete the default code, paste the copied code, and deploy.

4. Copy the address Cloudflare shows after deploying (something like `myworker.username.workers.dev`).

At any step, you can use the "📤 Export Settings" button to download a backup file of all settings entered on the page (Token, Password, selected protocols, Worker address, IPs, ports, Fingerprint, WebSocket Path, Fragment settings, advanced JSON settings, ECH, DNS, routing rules, Observatory Settings, Chain Proxy, and the JSON config name). Use the "📥 Import Settings" button to load that same file back into the page so all settings are restored automatically. This button only accepts files exported from this same tool.

### Step 3 — Build the Config

1. Enter the Worker address in the corresponding field.

2. Select the desired protocol(s) — VLESS, Trojan, or both.

3. Enter clean Cloudflare IPs in the corresponding box. Besides IPs, you can also use certain domains (e.g. chatgpt.com). To find clean IPs, you can use the [Clean IP Scanner](https://github.com/4n0nymou3/Clean-IP-Scanner) tool.

4. Select the desired TLS and WebSocket ports.

5. Choose the TLS Fingerprint and the WebSocket Path.

6. If you'd like, enable Fragment settings and enter your custom values.

7. If you'd like, change the advanced JSON settings based on your needs.

8. Select the desired countries for direct routing and the desired categories for blocking; if you'd like, also adjust the Observatory Settings.

9. If you want a fixed outbound IP, enter your external server's config in the Chain Proxy box.

10. Click Generate Config.

### Step 4 — Use the Configs

- Import the generated configs (`vless://` and `trojan://` links) into v2rayNG or similar clients.
- Import the Xray JSON output config into Xray-compatible clients like v2rayNG to take advantage of least-ping mode.
- Import the Sing-box JSON output config directly into clients like Sing-box, Hiddify, or NekoBox.
- Import the Clash output config (downloaded with a `.yaml` extension) into Clash Meta / Mihomo clients like Clash Verge.

## Settings Guide

### Protocols — VLESS and Trojan

This tool supports both the VLESS and Trojan protocols on a single Worker. The Token (UUID) is used for VLESS authentication and the Password for Trojan authentication; the two operate completely independently, and changing either one in the Worker code only disables that specific protocol (exactly like how the Token behaved in earlier versions). The "Output Protocols" checkboxes in Step 3 determine which protocol(s) get configs (link, JSON, Sing-box, and Clash) built for you; the Worker code always supports both protocols, and toggling these checkboxes doesn't require redeploying the Worker.

### TLS Fingerprint

This setting determines which browser or device your client presents itself as during the TLS handshake. DPI systems can detect proxy traffic by examining the TLS pattern; choosing a common Fingerprint like chrome or firefox makes this detection harder. Available options:

`chrome` — `firefox` — `safari` — `ios` — `android` — `edge` — `360` — `qq` — `random` — `randomized`

### WebSocket Path

The WebSocket path used in the configs. Available options: `/vless`, `/proxy`, `/v2ray`, `/ws`, `/`

### Fragment

Enabling Fragment splits the TLS handshake data into smaller pieces, making it harder for DPI to detect. This setting only applies to the JSON config and has no effect on VLESS configs. Fragment and ECH cannot be enabled at the same time.

Fragment settings:
- **Fragment Packets**: the type of data that gets fragmented. The value `tlshello` is recommended for fragmenting the TLS Client Hello.
- **Fragment Interval**: the time interval between sending fragments (milliseconds).
- **Fragment Length**: the size of each fragment (bytes).
- **Fragment Max Split**: the maximum number of times a packet is split.

In the Fragment Interval and Fragment Length fields, instead of a simple range (e.g. `10-20`), you can enter several comma-separated sequential values (e.g. `5,94,1`) so each cut has a different size or delay; the last value entered keeps repeating for any further cuts.

#### Advanced Finalmask Settings (optional — Xray core JSON only)

This section is a sub-part of the Fragment settings, designed for users facing severe upload restrictions on mobile or fixed networks. These settings only apply to the Xray core JSON config and have no effect on the Sing-box or Clash configs.

- **Enable a second Fragment stage (two-layer)**: when enabled, the output of the first Fragment stage is split once more (equivalent to adding a second fragment object to the `finalmask.tcp` array). The Stage 2 Packets, Stage 2 Interval, Stage 2 Length, and Stage 2 Max Split fields work exactly like the first stage's fields and support the same comma-separated sequential-values syntax.
- **Use the unsafe fingerprint instead of the one above**: when enabled, instead of mimicking a specific browser's fingerprint (e.g. Chrome or Firefox), the Xray core builds a raw ClientHello packet with a fixed, predictable length. This option only affects the Xray core JSON output; the link format, Sing-box, and Clash still use the fingerprint selected at the top of the page.
- **Custom Cipher Suites**: optionally enter a custom list of cipher suites. This value is also only added to the Xray core JSON, and if the field is left empty, no extra field is added to the output at all.

The point of combining these three options is to keep the real length of the ClientHello packet fixed and predictable, so the Fragment split points (in both the first and second stage) always land accurately — which is what improves upload speed on severely-restricted networks.

### ECH — Encrypted Client Hello

ECH is an additional encryption layer over the TLS handshake that hides the destination domain name (SNI) from DPI systems. When you enable ECH, your Worker domain's encryption key is fetched automatically from the DNS server, and the Client Hello is encrypted before being sent.

Simply enabling the checkbox is enough. The default address in the DNS box (Cloudflare DoH) is suitable for most users. If you have your own DoH Proxy, replace it with that address for greater reliability. ECH applies to all four output formats (VLESS/Trojan link, Xray JSON, Sing-box JSON, and Clash JSON), only in Normal mode (without Fragment), since Fragment and ECH cannot be enabled at the same time.

### Advanced JSON Settings

- **Fake DNS**: fake DNS to improve resolve speed on the client.
- **IPv6**: enable or disable IPv6 support.
- **Allow LAN**: lets other devices on the local network use the proxy.
- **TCP Fast Open**: improves connection speed by reducing handshake latency.
- **Local DNS**: the DNS server used to resolve domestic domains of the selected countries (default: 8.8.8.8).
- **Remote DNS / DoH**: the DNS server for traffic outside the selected countries (default: Cloudflare DoH). You can use the [DoH Proxy](https://github.com/4n0nymou3/cloudflare-doh-proxy) tool to build your own dedicated DoH server on Cloudflare.

### Routing Rules

This section contains two groups of checkboxes that are applied consistently across all three output formats (Xray, Sing-box, Clash):

- **Bypass rules — Iran, China, Russia**: determines which country/countries' traffic and DNS are routed directly, without going through the proxy. At least one country must be enabled; by default only Iran is selected. For greater accuracy and to prevent DNS poisoning, detecting each country's domestic domains in the Xray config is accompanied by an extra DNS verification layer (expectIPs).
- **Block rules — Ads, Porn, QUIC, Malware, Phishing, Cryptominers**: determines which categories are blocked. QUIC means blocking UDP traffic (including HTTP/3) so the browser automatically switches to regular HTTPS that passes through the tunnel. By default, all these categories are enabled.

For each country and each category, the GeoIP/GeoSite databases specific to that output format are used.

### Observatory Settings

This section controls how the Xray core tests and selects the best server, and mirrors the Observatory Settings screen of the v2rayNG client exactly:

- **leastPing Interval**: the interval between simple ping tests used to pick the fastest server. Default is `3m` (3 minutes).
- **leastLoad Interval**: the interval between rounds of the more advanced leastLoad test. Default is `5m` (5 minutes).
- **leastLoad Mode**: the HTTP method used for the test request — `HEAD` or `GET`. Default is `HEAD`.
- **leastLoad Sampling**: the number of samples taken per leastLoad test round. Default is `2`.
- **leastLoad Timeout**: the maximum time to wait for each test request. Default is `30s` (30 seconds).

Time values (leastPing Interval, leastLoad Interval, leastLoad Timeout) must be entered with an `m` (minutes) or `s` (seconds) suffix — e.g. `3m` or `30s` — and leastLoad Sampling must be a positive integer; the panel automatically prevents invalid values from being entered in these fields. These settings apply only to the Xray-core JSON config (as `observatory` and `burstObservatory` blocks) and have no effect on the Sing-box or Clash configs.

> Technical note: since the Xray core has fully removed the `allowInsecure` TLS option, it has been removed from every Xray-core JSON config generated by TCB (including Chain Proxy configs) to stay fully compatible with the latest Xray core releases and clients built on it (such as v2rayNG).

### Chain Proxy — Fixing the Outbound IP

By entering a URL-format config from an external server (e.g. a VPS with a fixed IP) into the Chain Proxy box, TCB configs get chained to that server: you connect first through your Worker (to bypass filtering) and then through that server to the internet — meaning the outbound IP is always fixed and equal to that server's IP.

Formats supported in this box: VLESS (tcp/ws/grpc networks with none/tls/reality security), Trojan (tcp/ws/grpc with tls), Shadowsocks, SOCKS5, and HTTP.

Important notes:
- This feature only applies to JSON configs for Xray, Sing-box, and Clash, not single link-format configs, since chaining requires two coordinated nodes that can only be defined in a complete config file.
- When this feature is enabled, a ⛓️ emoji is added next to the JSON config names so it's clear which configs are chained.
- The config you enter in this box must not belong to another Cloudflare Worker, since Workers don't have dedicated fixed IPs; be sure to use a config from a real server (like a VPS) with its own dedicated IP.
- To disable this feature, leave the Chain Proxy box empty.

### Config Output Formats

After building the config, the result is available simultaneously in four formats:

- **VLESS link** (`vless://`) — for direct import into v2rayNG and similar clients.
- **JSON for Xray** — a complete config with least-ping mode for automatically selecting the fastest server.
- **JSON for Sing-box** — a complete config for Sing-box, Hiddify, and NekoBox, including ECH support when enabled.
- **JSON for Clash / Mihomo** — a complete config for Clash Meta and similar clients like Clash Verge, including ECH support when enabled. This file is written with a JSON structure but downloaded with a `.yaml` extension, since JSON is a valid subset of YAML. Note that the Clash/Mihomo format doesn't support Fragment.

All four formats are built from the same settings (IPs, ports, Fingerprint, Fragment, advanced JSON settings).

## Running Offline on Your Own Device

If you want to run this tool without an internet connection, directly on your own device, follow the steps below.

### Required Tools

To run this project locally, you need two things:

- **Git** — to download the project files from GitHub
- **Python** — to run a simple local server

---

### Step 1 — Install Git (if needed)

If Git isn't installed on your system, install it first:

**Linux (Ubuntu/Debian):**

</div>

```sh
sudo apt install git
```

<div align="left" dir="ltr">

**macOS:**

</div>

```sh
brew install git
```

<div align="left" dir="ltr">

**Windows:** download and run the installer from [git-scm.com](https://git-scm.com).

**Termux on Android:**

</div>

```sh
pkg install git
```

<div align="left" dir="ltr">

**iSH on iOS:**

</div>

```sh
apk add git
```

---

<div align="left" dir="ltr">

### Step 2 — Clone the Project

The command below downloads all the project files from GitHub to your device:

</div>

```sh
git clone https://github.com/4n0nymou3/tcb.git
```

<div align="left" dir="ltr">

> **Note:** the `git clone` command means "make me a complete copy of this project." After running it, a folder named `tcb` will be created in your current path.

---

### Step 3 — Enter the Project Folder

</div>

```sh
cd tcb
```

<div align="left" dir="ltr">

> **Note:** the `cd` command means "go into this folder." You must do this step, otherwise the next steps won't work.

---

### Step 4 — Install Python (if needed)

Python is usually already installed on Linux and macOS. If it isn't:

**Linux (Ubuntu/Debian):**

</div>

```sh
sudo apt install python3
```

<div align="left" dir="ltr">

**macOS:**

</div>

```sh
brew install python3
```

<div align="left" dir="ltr">

**Windows:** download the installer from [python.org](https://python.org). Be sure to check **Add Python to PATH** during installation.

**Termux on Android:**

</div>

```sh
pkg install python
```

<div align="left" dir="ltr">

**iSH on iOS:**

</div>

```sh
apk add python3
```

---

<div align="left" dir="ltr">

### Step 5 — Start a Local Server

This tool is a web page and needs a server to run correctly. Python will build this simple server for you.

Depending on the Python version installed on your system, run one of the commands below:

**Python 3 (Linux, macOS, Windows, Termux):**

</div>

```sh
python -m http.server 8080
```

<div align="left" dir="ltr">

**Python 3 on iSH:**

</div>

```sh
python3 -m http.server 8080
```

<div align="left" dir="ltr">

**Python 2 (older version):**

</div>

```sh
python -m SimpleHTTPServer 8080
```

<div align="left" dir="ltr">

> **Note:** `8080` is the port number. If that port is already in use, you can substitute another number like `8000` or `9090`.

When the server starts successfully, you'll see something like this:

</div>

```
Serving HTTP on 0.0.0.0 port 8080 ...
```

---

<div align="left" dir="ltr">

### Step 6 — Open the Tool in Your Browser

Open your browser and enter the address below:

</div>

```
http://localhost:8080
```

<div align="left" dir="ltr">

---

### Stopping the Server

When you're done, simply press the following keys in the same terminal window to shut down the server:

</div>

```
Ctrl + C
```

<div align="left" dir="ltr">

#### If You Accidentally Closed the Terminal

Sometimes you close the terminal window, but the server keeps running in the background and holds onto port 8080. In that case, the next time you try to start the server you'll get an error.

To fix this, run the two commands below in order:

**First — find the program occupying port 8080:**

</div>

```sh
lsof -i :8080
```

<div align="left" dir="ltr">

This command shows a table. In the `PID` column you'll see a number — that number is the ID of the program that needs to be closed.

**Second — close that program using its ID:**

</div>

```sh
kill -9 PID
```

<div align="left" dir="ltr">

Replace `PID` with the actual number from the previous command's output. For example, if the number was `2341`:

</div>

```sh
kill -9 2341
```

---

<div align="left" dir="ltr">

## Related Tools

- [Clean IP Scanner](https://github.com/4n0nymou3/Clean-IP-Scanner) — find clean Cloudflare IPs with Termux on Android
- [DoH Proxy](https://github.com/4n0nymou3/cloudflare-doh-proxy) — build your own dedicated DNS over HTTPS server on Cloudflare

## License

This project is released under the [MIT License](LICENSE) — free to use

---

## Author

Designed and developed by: **Anonymous**

Contact: [Telegram](https://t.me/An0nymou3Bot)

---

## Support the Project

If this tool was useful to you:

- ⭐ Give the repository a Star
- Share it with your friends

</div>
