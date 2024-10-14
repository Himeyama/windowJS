class Window{
    id
    t
    element
    flag = false

    static new(winId, title, content){
        const win = Window.create(winId)
        win.title = title
        win.frame = content
        return win
    }
    
    color(){
        let w = this
        Window.noactive()
        w.element.classList.remove("noactive")
    }

    setTheme(theme){
        let obj = document.getElementById(this.id)
        for(let i = 0; i < obj.classList.length; i++){
            if(obj.classList[i].match(/^themes-.*/)){
                obj.classList.remove(obj.classList[i])
            }
        }
        obj.classList.add(theme)
    }

    static noactive(){
        for(let i = 0; i < Window.list.length; i++){
            const obj = Window.list[i].element;
            if(Array.from(obj.classList).includes("temp-active-lock")){
                window.setTimeout(() => {obj.classList.remove("temp-active-lock")}, 200);
            }else{
                obj.classList.add("noactive")
            }
        }
    }

    static create(id){
        if(document.getElementById(id)){
            let err = Window.create("Error" + String(Math.floor(Math.random() * Math.floor(1000000))))
            err.title = ""
            err.setContents("<h3>エラー</h3><p>idが重複しています</p>")
            return false
        }

        let w = new Window
        let win = document.createElement("div")
        win.style.zIndex = Window.zIndex
        win.id = id
        Window.activeID = win.id
        win.className = "window"

        const winInnerHTML = (win) => {
            // タイトルゾーンの作成
            const titleZone = document.createElement('div');
            titleZone.className = 'title_zone';

            // タイトル部分の作成
            const titleWithoutButton = document.createElement('div');
            titleWithoutButton.className = 'title-without-button';

            const icon = document.createElement('div');
            icon.className = 'icon';

            const title = document.createElement('div');
            title.className = 'title';

            titleWithoutButton.appendChild(icon);
            titleWithoutButton.appendChild(title);

            // ボタン部分の作成
            const btn = document.createElement('div');
            btn.className = 'btn';

            const btnL = document.createElement('div');
            btnL.className = 'btn_l';
            btnL.innerHTML = '';

            const btnMR = document.createElement('div');
            btnMR.className = 'btn_mr';
            btnMR.innerHTML = '';

            const btnM = document.createElement('div');
            btnM.className = 'btn_m';
            btnM.innerHTML = '';

            const btnR = document.createElement('div');
            btnR.className = 'btn_r';
            btnR.innerHTML = '';

            btn.appendChild(btnL);
            btn.appendChild(btnMR);
            btn.appendChild(btnM);
            btn.appendChild(btnR);

            // フレーム部分の作成
            const frame = document.createElement('div');
            frame.className = 'frame';

            const section = document.createElement('section');

            // 各要素を親要素に追加
            titleZone.appendChild(titleWithoutButton);
            titleZone.appendChild(btn);
            frame.appendChild(section);

            // 最終的なHTMLに追加
            win.innerHTML = '';
            win.appendChild(titleZone);
            win.appendChild(frame);
        }
        winInnerHTML(win)
        w.id = id
        document.body.appendChild(win)
        w.element = document.getElementById(id)

        setTimeout(function(){
            w.color()
        }, 30)

        // ウィンドウの移動
        let winY, winX
        w.element.getElementsByClassName("title-without-button")[0].onmousedown = function(e){
            w.flag = true
            winY = e.offsetY
            winX = e.offsetX
        }

        w.element.onmousedown = (e) => {
            if(!Window.zIndex){
                Window.zIndex = 1
            }
            setTimeout(() => {Window.activeID = w.id}, 200)
            w.element.style.zIndex = Window.zIndex++
            w.color()

            // ウィンドウの移動
            document.body.onmouseup = (e) => {
                w.flag = false
            }
            document.body.onmousemove = (e) => {
                if(w.flag){
                    w.element.style.top = `${e.pageY - winY}px`
                    w.element.style.left = `${e.pageX - winX}px`
                }
            }
        }

        // ウィンドウを閉じる
        w.element.getElementsByClassName("btn_r")[0].onmousedown = (e) => {
            w.close()
        }

        // タイトルバーをダブルクリック
        w.element.getElementsByClassName("title-without-button")[0].addEventListener("dblclick", (event) => {
            const size_max = Array.from(w.element.classList).includes("size_max");
            size_max ? w.restore() : w.max();
            w.element.classList.add("temp-active-lock");
        });

        // ウィンドウを拡大
        w.element.getElementsByClassName("btn_m")[0].onmousedown = (e) => {
            w.max()
            w.element.classList.add("temp-active-lock");
        }

        // ウィンドウを元の大きさに戻す
        w.element.getElementsByClassName("btn_mr")[0].onmousedown = (e) => {
            w.restore()
            w.element.classList.add("temp-active-lock");
        }

        if(!Window.Top) Window.Top = 0
        if(!Window.Left) Window.Left = 0
        w.element.style.top = `${Window.Top += 16}px`
        w.element.style.left = `${Window.Left += 16}px`
        Window.list[Window.list.length] = w

        return w
    }

    set title(t){
        this.t = t
        let titleText = this.element.getElementsByClassName("title")[0]
        titleText.innerText = t
    }

    set frame(dom){
        let obj = document.getElementById(this.id)
        let tmp = obj.getElementsByClassName("frame")[0]
        tmp.innerHTML = ""
        tmp.append(dom)
    }

    close(){
        this.element.remove()
    }

    max(){
        let obj = document.getElementById(this.id)
        obj.classList.add("size_max")
    }

    restore(){
        let obj = document.getElementById(this.id)
        obj.classList.remove("size_max")
    }

    setContents(html){
        this.element.getElementsByClassName("frame")[0].innerHTML = html
    }
}
Window.list = []
Window.zIndex = 1

// 窓外をクリックしたとき
document.body.onclick = (e) => {
    let element = e.target
    while(element.localName != "body"){
        element = element.parentElement
        if(element.classList.contains("window")){
            break
        }
    }
    if(element.classList.contains("window")){
        Window.activeID = undefined
    }else{
        Window.noactive()
    }
}
