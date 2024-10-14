# window.js

window.jsはウェブページでつくる仮想的なウィンドウです。

- [デモ](https://himeyama.github.io/windowJS/)
- [ダウンロード (window_w.css)](https://himeyama.github.io/windowJS/window_w.css)
- [ダウンロード (window_w.js)](https://himeyama.github.io/windowJS/window_w.js)

## サンプル
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="window_w.css">
    <script src="window_w.js"></script>
    <title>window.js</title>
</head>
<body>
    <script>
    const frameElement = document.createElement("div")
    frameElement.innerHTML = "<h1>Hello, world!</h1>"
    const win = Window.new("hoge", "Window Title", frameElement)
    </script>
</body>
</html>
```