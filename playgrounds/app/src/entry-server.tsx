// @refresh reload
import { createHandler, StartServer } from '@solidjs/start/server'

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <meta name="apple-mobile-web-app-title" content="Lithium" />
          <link rel="manifest" href="/site.webmanifest" />
          <script
            defer
            data-domain="lithium.cmgriffing.com"
            src="https://plausible.io/js/script.outbound-links.js"
          ></script>
          {assets}
        </head>
        <body class="font-body">
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
))
