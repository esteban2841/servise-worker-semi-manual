importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js')

workbox.loadModule("workbox-background-sync")

workbox.precaching.precacheAndRoute( self.__WB_MANIFEST )

const { registerRoute } = workbox.routing
const { CacheFirst, NetworkFirst, NetworkOnly } = workbox.strategies
const { BackgroundSyncPlugin } = workbox.backgroundSync

const apiOfflineFallBacks = [
    "http://localhost:4000/api/auth/renew",
    "http://localhost:4000/api/events"
]
const cacheNetworkFirst = [
    "/api/auth/renew",
    "/api/events"
]


registerRoute(
    ({request, url})=>{
        console.log({request, url})
        if(cacheNetworkFirst.includes(url.pathname)) return true
        return false
    },
    new NetworkFirst()
)

// registerRoute(
//     new RegExp(apiOfflineFallBacks[0]),
//     new NetworkFirst()
// )

const cacheFirstNetwork = [
    "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css"
]


registerRoute(
    ({request, url})=>{
        console.log({request, url})
        if(cacheFirstNetwork.includes(url.href)) return true
        return false
    },
    new CacheFirst()
)

// registerRoute(
//     new RegExp("https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"),
//     new CacheFirst()
// ) 


//offline posts
const bgSyncPlugin = new BackgroundSyncPlugin('posts-offline', {
    maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
  });

registerRoute(
    new RegExp(apiOfflineFallBacks[1]),
    new NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    "POST"
)

registerRoute(
    new RegExp(apiOfflineFallBacks[1]),
    new NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    "DELETE"
)

registerRoute(
    new RegExp(apiOfflineFallBacks[1]),
    new NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    "PUT"
)