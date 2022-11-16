
function on(eventName, listener) {
  const callListener = ({ detail }) => {
    listener(detail)
  }
  window.addEventListener(eventName, callListener)
  return () => {
    window.removeEventListener(eventName, callListener)
  }
}

function emit(eventName, data) {
  window.dispatchEvent(new CustomEvent(eventName, { detail: data }))
}

export const eventBus = { on, emit }

// export const eventBusService = createEventEmitter()

export function showUserMsg(msg) {
  eventBus.emit('show-msg', msg)
}

export function showSuccessMsg(txt) {
    showUserMsg({txt, type: 'success'})
}
export function showErrorMsg(txt) {
    showUserMsg({txt, type: 'error'})
}



// function createEventEmitter() {
//   const listenersMap = {}
//   return {
//       on(evName, listener){
//           listenersMap[evName] = (listenersMap[evName])? [...listenersMap[evName], listener] : [listener]
//           return ()=>{
//               listenersMap[evName] = listenersMap[evName].filter(func => func !== listener)
//           }
//       },
//       emit(evName, data) {
//           if (!listenersMap[evName]) return
//           listenersMap[evName].forEach(listener => listener(data))
//       }
//   }
// }
