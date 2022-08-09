/**
 * @param {string} url
 * @example "https://vm.tiktok.com/.../?k=1"
 */
export default async function downloadVidFromTikTok(url) {
  return new Promise((resolve,reject) => {
    fetch(url)
    .then(res => res.text())
    .then(html => {
      const index =html.search("downloadAddr")
      const [ uri ] =html.substring(index,index +600).split("\"").filter(i => i.length > 100)
      const link =decodeURI(uri).replace(/\\u002F/g,"/")
      if (!link.includes("https://")) return reject("cannot find that video")

      fetch(link)
      .then(res => res.arrayBuffer())
      .then(bin => resolve(bin))
    })
  })
}
