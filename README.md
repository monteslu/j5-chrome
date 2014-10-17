Johnny-Five Chrome
=======

This app lets you run [Johnny-Five](https://github.com/rwaldron/johnny-five) directly in Chrome.

Screenshot:

![Screenshot](screenshot.png)

```
npm install
gulp
````
And load up the build directory as a chrome extenstion.

## But we have Problem

Unfortunately due to the way Chrome packaged apps handle eval() calls in a sandbox without the rest of the chrome APIs, I'm a bit stuck.

I have an [open issue](https://code.google.com/p/chromium/issues/detail?id=424659) that I'd love to get any feedback on regarding this situation :)


Another idea might be to `window.postMessage` back and forth with actual serial data, but this thing is already fragile enough without that level of hackiness.
