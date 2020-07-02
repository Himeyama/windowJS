class Window{
    id
    title
    element
    flag = false
    
    color(){
        let w = this
        Window.noactive()
        w.element.classList.remove("noactive")
    }

    setTheme(theme){
        let obj = document.getElementById(this.id)
        for(let i = 0; i < obj.classList.length; i++){
            console.log(obj.classList[i])
            if(obj.classList[i].match(/^themes-.*/)){
                console.log(obj.classList[i])
                obj.classList.remove(obj.classList[i])
            }
        }
        obj.classList.add(theme)
    }

    static noactive(){
        for(let i = 0; i < Window.list.length; i++){
            Window.list[i].element.classList.add("noactive")
        }
    }

    static create(id){
        if(document.getElementById(id)){
            let err = Window.create("Error" + String(Math.floor(Math.random() * Math.floor(1000000))))
            err.setTitle("")
            err.setContents("<h3>エラー</h3><p>idが重複しています</p>")
            return false
        }

        let w = new Window
        let win = document.createElement("div")
        win.style.zIndex = Window.zIndex
        win.id = id
        Window.activeID = win.id
        win.className = "window"
        win.innerHTML 
            = `<div class="winTitle"><div class="winTitleText"></div><div class="winCloseBtn"></div></div><div class="winContents"></div>`
        w.id = id
        document.body.appendChild(win)
        w.element = document.getElementById(id)

        setTimeout(function(){
            w.color()
        }, 30)

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
            setTimeout(function(){Window.activeID = w.id}, 200)
            // console.log(w.id)
            w.element.style.zIndex = Window.zIndex++

            w.color()

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
        w.element.getElementsByClassName("winCloseBtn")[0].onmousedown = function(e){
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

        Window.list[Window.list.length] = w

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
Window.list = []
Window.zIndex = 1

// 窓外をクリックしたとき
document.body.onclick = function(e){
    let element = e.target
    while(element.localName != "body"){
        element = element.parentElement
        if(element.classList.contains("window")){
            break
        }
    }
    // console.log(element)
    if(element.classList.contains("window")){
        Window.activeID = undefined
    }else{
        Window.noactive()
    }
}
