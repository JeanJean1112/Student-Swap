"""Builds the two single-file artifact pages from the site's source files."""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.environ.get("ARTIFACT_OUT", os.path.join(ROOT, "dist"))
INDEX_URL = "https://claude.ai/code/artifact/6a8e15d4-3133-4bc1-8b1d-5db0c62a5d1e"
MARKET_URL = "https://claude.ai/artifact/Sg5ZwWJyEyNYKkVJL3aQUp"
FONTS = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    '<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700'
    '&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n'
)

def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return f.read()

def body_of(html):
    body = re.search(r"<body>(.*)</body>", html, flags=re.S).group(1)
    return re.sub(r"<script src=[^>]*></script>\s*", "", body).strip()

def external(html, url):
    return html.replace(f'href="{url}', f'target="_blank" rel="noopener" href="{url}')

css = read("css/styles.css")
placeholder = read("js/placeholder.js")

# ---- landing page ----
index_body = body_of(read("index.html"))
index_body = re.sub(r'href="marketplace\.html(\?[^"]*)?"', f'target="_blank" rel="noopener" href="{MARKET_URL}"', index_body)
index_body = index_body.replace('href="index.html"', 'href="#top"')
index_html = (
    "<title>StudentSwap</title>\n" + FONTS + f"<style>\n{css}\n</style>\n\n" + index_body +
    f"\n\n<script>\n{placeholder}\n{read('js/script.js')}\n</script>\n"
)

# ---- marketplace page ----
market_body = body_of(read("marketplace.html"))
market_body = re.sub(r'href="index\.html(#[^"]*)?"', lambda m: f'target="_blank" rel="noopener" href="{INDEX_URL}{m.group(1) or ""}"', market_body)
market_body = market_body.replace('href="marketplace.html"', 'href="#top"')
market_html = (
    "<title>StudentSwap Marketplace</title>\n" + FONTS + f"<style>\n{css}\n</style>\n\n" + market_body +
    f"\n\n<script>\n{placeholder}\n{read('js/marketplace.js')}\n</script>\n"
)

os.makedirs(OUT, exist_ok=True)
for name, content in (("studentswap-artifact.html", index_html), ("studentswap-marketplace-artifact.html", market_html)):
    with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="") as f:
        f.write(content)
    print("wrote", name, len(content))
