export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

});

browser.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
  console.log('Received message', message, sender);
  sendResponse({ response: 'Hello from background!' });
});