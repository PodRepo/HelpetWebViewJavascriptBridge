;(function() {
	if (window.HelpetWebViewJavascriptBridge) { return }
	var messagingIframe
	var sendMessageQueue = []
	var receiveMessageQueue = []
	var messageHandlers = {}


	var objcHandlers = JSON.parse(window.HelpetWebViewJavascriptBridge_ObjCHandlerStr)


	var CUSTOM_PROTOCOL_SCHEME = 'wvjbscheme'
	var QUEUE_HAS_MESSAGE = '__WVJB_QUEUE_MESSAGE__'
	
	var responseCallbacks = {}
	var uniqueId = 1
	
	function _createQueueReadyIframe(doc) {
		messagingIframe = doc.createElement('iframe')
		messagingIframe.style.display = 'none'
		messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE
		doc.documentElement.appendChild(messagingIframe)
	}

	function init(messageHandler) {

		if (HelpetWebViewJavascriptBridge._messageHandler) {
            alert("error HelpetWebViewJavascriptBridge.init called twice")
            throw new Error('HelpetWebViewJavascriptBridge.init called twice')
        }
		HelpetWebViewJavascriptBridge._messageHandler = messageHandler
		var receivedMessages = receiveMessageQueue
		receiveMessageQueue = null
		for (var i=0; i<receivedMessages.length; i++) {
			_dispatchMessageFromObjC(receivedMessages[i])
		}
	}


    function chechObjCHandler(handler){
        for(var i in objcHandlers){
            if(handler == objcHandlers[i]){
                return true
            }
        }
        return false
    }


	function send(data, responseCallback) {
		_doSend({ data:data }, responseCallback)
	}
	
	function registerHandler(handlerName, handler) {
		messageHandlers[handlerName] = handler
	}
	
	function callHandler(handlerName, data, responseCallback) {
		_doSend({ handlerName:handlerName, data:data }, responseCallback)
	}
	
	function _doSend(message, responseCallback) {
		if (responseCallback) {
			var callbackId = 'cb_'+(uniqueId++)+'_'+new Date().getTime()
			responseCallbacks[callbackId] = responseCallback
			message['callbackId'] = callbackId
		}
		sendMessageQueue.push(message)
		messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE
	}

	function _fetchQueue() {
		var messageQueueString = JSON.stringify(sendMessageQueue)
		sendMessageQueue = []
		return messageQueueString
	}

	function _dispatchMessageFromObjC(messageJSON) {
		setTimeout(function _timeoutDispatchMessageFromObjC() {
			var message = JSON.parse(messageJSON)
			var messageHandler
			var responseCallback

			if (message.responseId) {
				responseCallback = responseCallbacks[message.responseId]
				if (!responseCallback) { return; }
				responseCallback(message.responseData)
				delete responseCallbacks[message.responseId]
			} else {
				if (message.callbackId) {
					var callbackResponseId = message.callbackId
					responseCallback = function(responseData) {
						_doSend({ responseId:callbackResponseId, responseData:responseData })
					}
				}
				
				var handler = HelpetWebViewJavascriptBridge._messageHandler
				if (message.handlerName) {
					handler = messageHandlers[message.handlerName]
                   if(!handler){
                      handler = HelpetWebViewJavascriptBridge._messageHandler
                   }
				}
				
				try {
					handler(message.data, responseCallback)
				} catch(exception) {
					if (typeof console != 'undefined') {
						console.log("HelpetWebViewJavascriptBridge: WARNING: javascript handler threw.", message, exception)
                        alert("call js func error"+ exception)
					}
				}
			}
		})
	}
	
	function _handleMessageFromObjC(messageJSON) {
		if (receiveMessageQueue) {
			receiveMessageQueue.push(messageJSON)
		} else {
			_dispatchMessageFromObjC(messageJSON)
		}
	}

	window.HelpetWebViewJavascriptBridge = {
		init: init,
        chechObjCHandler:chechObjCHandler,
		send: send,
		registerHandler: registerHandler,
		callHandler: callHandler,
		_fetchQueue: _fetchQueue,
		_handleMessageFromObjC: _handleMessageFromObjC
	}

	var doc = document
	_createQueueReadyIframe(doc)
	var readyEvent = doc.createEvent('Events')
	readyEvent.initEvent('HelpetWebViewJavascriptBridgeReady')
	readyEvent.bridge = HelpetWebViewJavascriptBridge
	doc.dispatchEvent(readyEvent)
})();


