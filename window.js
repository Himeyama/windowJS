class Window{
    id
    title
    element
    flag = false
    
    static create(id){
        if(document.getElementById(id)){
            let err = Window.create("Error" + String(Math.floor(Math.random() * Math.floor(1000000))))
            err.setTitle("")
            err.setContents("<h3>エラー</h3><p>idが重複しています</p>")
            return false
        }

        let w = new Window
        let win = document.createElement("div")
        win.style.zIndex = (Window.zIndex ? Window.zIndex : 1)
        win.id = id
        win.className = "window"
        win.innerHTML 
            = `<div class="winTitle"><div class="winTitleText"></div><div class="winCloseBtn"></div></div><div class="winContents"></div>`
        w.id = id
        document.body.appendChild(win)
        w.element = document.getElementById(id)

        // ウィンドウの移動
        let winY, winX
        w.element.getElementsByClassName("winTitle")[0].onmousedown = function(e){
            w.flag = true
            winY = e.offsetY
            winX = e.offsetX
        }

        w.element.onmousedown = function(e){
            if(!Window.zIndex){
                Window.zIndex = 1
            }
            w.element.style.zIndex = Window.zIndex++

            // ウィンドウの移動
            document.body.onmouseup = function(e){
                w.flag = false
            }
            document.body.onmousemove = function(e){
                if(w.flag){
                    w.element.style.top = `${e.pageY - winY}px`
                    w.element.style.left = `${e.pageX - winX}px`
                }
            }
        }

        // ウィンドウを閉じる
        w.element.getElementsByClassName("winCloseBtn")[0].onclick = function(e){
            w.close()
        }

        if(!Window.Top){
            Window.Top = 0
        }
        if(!Window.Left){
            Window.Left = 0
        }
        w.element.style.top = `${Window.Top += 16}px`
        w.element.style.left = `${Window.Left += 16}px`

        return w
    }

    setTitle(title){
        this.title = title
        let titleText = this.element.getElementsByClassName("winTitleText")[0]
        titleText.innerText = title
    }

    close(){
        this.element.remove()
    }

    setContents(html){
        this.element.getElementsByClassName("winContents")[0].innerHTML = html
    }
}
