---
layout: default
title: window.js
---

<link rel="stylesheet" href="window.css">
<script src="window.js"></script>

<script>
w0 = Window.create("readme")
w0.setTitle("window.js")
w0.setTheme("theme-origina")
w0.setTheme("theme-original")
w0.setContents("<h1>window.js</h1><p>window.jsはウィンドウを再現するスクリプトです。</p>")
</script>

# 使用方法

```js
w1 = Window.create("hoge")
w1.setTitle("タイトル")
w1.setContents("<h1>lorem ipsum</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>")
```

<p>
<button onclick='w1 = Window.create("hoge");w1.setTitle("タイトル");w1.setContents("<h1>lorem ipsum</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>")'>実行</button>
</p>