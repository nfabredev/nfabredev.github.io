/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});

workbox.core.setCacheNameDetails({prefix: "gatsby-plugin-offline"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "webpack-runtime-5e2876bd8b771f1c84a5.js"
  },
  {
    "url": "framework-5dd3c501fd049989ea3a.js"
  },
  {
    "url": "styles.491a16106869c73de5f8.css"
  },
  {
    "url": "styles-37d63a57eaf6d055b3bc.js"
  },
  {
    "url": "app-339821b1fd041114e1b1.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "37f67c4b0d8edbc151b40512f1d7dc22"
  },
  {
    "url": "component---cache-caches-gatsby-plugin-offline-app-shell-js-03961122c56b363d9fd9.js"
  },
  {
    "url": "e436e1a6d9a0c01b87e958db3126c411b5db3a5a-50a5f4c100a3d41a44c4.js"
  },
  {
    "url": "component---src-pages-404-js-ed9b337638234d604390.js"
  },
  {
    "url": "page-data/404/page-data.json",
    "revision": "54e6162fd56a924846fb693238b32a58"
  },
  {
    "url": "page-data/app-data.json",
    "revision": "16a008f347f4527d1a105d5daf6d62ac"
  },
  {
    "url": "page-data/404.html/page-data.json",
    "revision": "d931d61a2740de8ea50f88de09b489d3"
  },
  {
    "url": "component---src-pages-about-tsx-5b768985eda67ad4e29f.js"
  },
  {
    "url": "page-data/about/page-data.json",
    "revision": "f244621870c66c41778ac6c59faa444e"
  },
  {
    "url": "component---src-pages-index-tsx-161fc45d20a49673abf9.js"
  },
  {
    "url": "page-data/index/page-data.json",
    "revision": "6dc393934aca0fe2356f03b42d3acfd5"
  },
  {
    "url": "component---src-templates-blog-post-tsx-5e9c7fcee02f955098a3.js"
  },
  {
    "url": "page-data/terminal-magic/page-data.json",
    "revision": "0abf68fd853550c240db930e275c53e7"
  },
  {
    "url": "page-data/top-vscode-extensions/page-data.json",
    "revision": "5df707e4c97bbd2c49c018b31e26f08e"
  },
  {
    "url": "page-data/uses/page-data.json",
    "revision": "8bc74542bfd5d28b1e1a953d4f7cde88"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "c70b8b321e4250c56838c7b861b4b328"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/(\.js$|\.css$|static\/)/, new workbox.strategies.CacheFirst(), 'GET');
workbox.routing.registerRoute(/^https?:.*\page-data\/.*\/page-data\.json/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:\/\/fonts\.googleapis\.com\/css/, new workbox.strategies.StaleWhileRevalidate(), 'GET');

/* global importScripts, workbox, idbKeyval */

importScripts(`idb-keyval-iife.min.js`)

const { NavigationRoute } = workbox.routing

let lastNavigationRequest = null
let offlineShellEnabled = true

// prefer standard object syntax to support more browsers
const MessageAPI = {
  setPathResources: (event, { path, resources }) => {
    event.waitUntil(idbKeyval.set(`resources:${path}`, resources))
  },

  clearPathResources: event => {
    event.waitUntil(idbKeyval.clear())
  },

  enableOfflineShell: () => {
    offlineShellEnabled = true
  },

  disableOfflineShell: () => {
    offlineShellEnabled = false
  },
}

self.addEventListener(`message`, event => {
  const { gatsbyApi: api } = event.data
  if (api) MessageAPI[api](event, event.data)
})

function handleAPIRequest({ event }) {
  const { pathname } = new URL(event.request.url)

  const params = pathname.match(/:(.+)/)[1]
  const data = {}

  if (params.includes(`=`)) {
    params.split(`&`).forEach(param => {
      const [key, val] = param.split(`=`)
      data[key] = val
    })
  } else {
    data.api = params
  }

  if (MessageAPI[data.api] !== undefined) {
    MessageAPI[data.api]()
  }

  if (!data.redirect) {
    return new Response()
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: lastNavigationRequest,
    },
  })
}

const navigationRoute = new NavigationRoute(async ({ event }) => {
  // handle API requests separately to normal navigation requests, so do this
  // check first
  if (event.request.url.match(/\/.gatsby-plugin-offline:.+/)) {
    return handleAPIRequest({ event })
  }

  if (!offlineShellEnabled) {
    return await fetch(event.request)
  }

  lastNavigationRequest = event.request.url

  let { pathname } = new URL(event.request.url)
  pathname = pathname.replace(new RegExp(`^`), ``)

  // Check for resources + the app bundle
  // The latter may not exist if the SW is updating to a new version
  const resources = await idbKeyval.get(`resources:${pathname}`)
  if (!resources || !(await caches.match(`/app-339821b1fd041114e1b1.js`))) {
    return await fetch(event.request)
  }

  for (const resource of resources) {
    // As soon as we detect a failed resource, fetch the entire page from
    // network - that way we won't risk being in an inconsistent state with
    // some parts of the page failing.
    if (!(await caches.match(resource))) {
      return await fetch(event.request)
    }
  }

  const offlineShell = `/offline-plugin-app-shell-fallback/index.html`
  const offlineShellWithKey = workbox.precaching.getCacheKeyForURL(offlineShell)
  return await caches.match(offlineShellWithKey)
})

workbox.routing.registerRoute(navigationRoute)

// this route is used when performing a non-navigation request (e.g. fetch)
workbox.routing.registerRoute(/\/.gatsby-plugin-offline:.+/, handleAPIRequest)
