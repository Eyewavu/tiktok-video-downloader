
const input =document.querySelector("input")
const form =document.querySelector("form")

const msg_boxes =document.querySelectorAll("[data-type='message-box']")
const msg_boxes_btns =document.querySelectorAll("[data-type='message-box']>button")

const [msg_wait,msg_err,msg_ready] =msg_boxes
const download_btn = document.querySelector("[data-type='download']>a")

/**
 * @param {HTMLElement} el
 * @param {Boolean} bool
 */
function set_visibility(el,bool) {
  el.setAttribute("data-hidden",!bool)
}

function hide_all() {
  msg_boxes.forEach(box => {
    set_visibility(box,false)
  })
}


msg_boxes_btns.forEach(btn => {
  btn.addEventListener("click", () => {
    hide_all()
    input.value =""
  })
})



form.addEventListener("submit", e => {
  e.preventDefault()

  hide_all()
  set_visibility(msg_wait,true)
  
  const [valid] =input.value.match(/https:\/{2}(vm|www|tiktok).(tiktok)?.com/) || [null]
  if ( !valid ) {
    hide_all()
    set_visibility(msg_err,true)
    
    return
  }
  
  sendDudes(input.value)
  input.value =""
})


/**
 * Makes an api call that returns binaries for the video file
 * @param {string} url
 */
function sendDudes(url) {
  fetch("/tiktok",{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({link:url})
  })
  .then(res => res.arrayBuffer())
  .then(bin => {
    if ( bin.byteLength < 20 ) {
      hide_all()
      set_visibility(msg_err,true)
  
      return
    }

    hide_all()
    set_visibility(msg_ready,true)

    download_binary(bin)
  })
}

/**
 * @param {ArrayBuffer} input
 */
function download_binary(input) {
  const blob =new Blob([input],{type:"video/mp4"})
  const uri =URL.createObjectURL(blob)

  download_btn.textContent ="download"
  download_btn.download ="tiktok_video.mp4"
  download_btn.href =uri

  download_btn.onclick =() => {
    setTimeout(()=>{
      download_btn.href =""
      download_btn.download =""
      URL.revokeObjectURL(uri)

    },300)
  }
}