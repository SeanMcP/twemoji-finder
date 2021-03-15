(function () {
  const outputEl = document.getElementById("output");
  const notificationEl = document.getElementById("notification");

  function notify(content) {
    notificationEl.textContent = "⚠️ " + content;
    notificationEl.removeAttribute("hidden");
  }

  function clearNotification() {
    notificationEl.setAttribute("hidden", true);
  }

  document
    .querySelector('form[name="emoji-form"]')
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      clearNotification();
      outputEl.innerHTML = "";

      
      const fd = new FormData(event.target)
      const emoji = fd.get("emoji");
      const version = fd.get("version");
      if (!emoji) return;
      
      const { default: twemoji } = await import(`https://twemoji.maxcdn.com/v/${version}/twemoji.esm.js`)
      const parsed = twemoji.parse(emoji);

      if (parsed === emoji)
        return notify(`Unable to detect an emoji in "${emoji}"`);

      const count = parsed.match(/img/g).length;
      if (count > 1) return notify(`Please submit one emoji (found ${count})`);

      const [, unicode] = parsed.match(/72x72\/(.*)\.png/);

      if (!unicode) return notify("Unable to parse that emoji");

      outputEl.innerHTML = `
        <div class="emoji-result">
            ${parsed}
            <ul class="links">
                <li>
                    <a href="https://github.com/twitter/twemoji/blob/v${version}/assets/svg/${unicode}.svg" target="_blank" rel="noreferrer noopener">SVG</a>
                </li>
                <li>
                    <a href="https://raw.githubusercontent.com/twitter/twemoji/v${version}/assets/svg/${unicode}.svg" target="_blank" rel="noreferrer noopener">SVG raw</a>
                </li>
                <li>
                    <a href="https://github.com/twitter/twemoji/blob/v${version}/assets/72x72/${unicode}.png" target="_blank" rel="noreferrer noopener">PNG</a>
                </li>
                <li>
                    <a href="https://github.com/twitter/twemoji/raw/v${version}/assets/72x72/${unicode}.png" target="_blank" rel="noreferrer noopener">PNG download</a>
                </li>
            </ul>
        </div>
        `;
    });
})();
