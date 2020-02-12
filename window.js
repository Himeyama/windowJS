class Window{
    id
    title
    element
    
    static create(id){
        let w = new Window
        let win = document.createElement("div")
        win.id = id
        win.className = "window"
        win.innerHTML 
            = `<div class="winTitle"><div class="winTitleText"></div><div class="winCloseBtn"></div></div><div class="winContents"></div>`
        w.id = id
        document.body.appendChild(win)
        w.element = document.getElementById(id)

        // ウィンドウの移動
        let flag = false
        let winY, winX
        w.element.getElementsByClassName("winTitle")[0].onmousedown = function(e){
            flag = true
            winY = e.offsetY
            winX = e.offsetX
        }
        document.body.onmouseup = function(e){
            flag = false
        }
        document.body.onmousemove = function(e){
            if(flag){
                w.element.style.top = `${e.pageY - winY}px`
                w.element.style.left = `${e.pageX - winX}px`
            }
        }

        // ウィンドウを閉じる
        w.element.getElementsByClassName("winCloseBtn")[0].onclick = function(e){
            w.close()
        }

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