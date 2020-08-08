class Shell{
    frame_object
    shell_window
    terminal_display = ""
    ps1 = `<span style="color:var(--shell_green);">Terminal</span> <span style="color:var(--shell_blue);">~</span> $ `
    pass = false

    static link(shell_window){
        let shell_object = new Shell
        shell_object.shell_window = shell_window
        shell_window.element.classList.add("Shell")
        shell_object.frame_object = document.createElement("div")
        shell_window.frame = shell_object.frame_object

        shell_window.element.getElementsByClassName("frame")[0].onclick = function(e){
            e.target.getElementsByTagName("input")[0].focus()
        }
        
        return shell_object
    }

    static create(id){
        let shell_window = Window.create(id)
        shell_window.title = "Terminal"
        let shell = Shell.link(shell_window)
        shell.frame_object.innerHTML = shell.ps1 + "<input>"
        Shell.manager[id] = shell
        console.log(shell_window)
        return shell
    }

    static keydown_enter(id){
        let shell = Shell.manager[id]
        let command = shell.frame_object.getElementsByTagName("input")[0].value
        let out = shell.command(command)
        if(!shell.pass){
            shell.terminal_display += shell.ps1 + `${command}<br>${out}`
            shell.frame_object.innerHTML = shell.terminal_display + shell.ps1 + `<input>`
        }
        shell.pass = false
        shell.frame_object.getElementsByTagName("input")[0].focus()
    }

    command(command){
        let command_ary = command.split(" ")
        let c0 = command_ary[0]
        if(command == "")
            return ""
        else if(c0 == "echo")
            return this.echo(command)
        else if(c0 == "ls")
            return this.ls(command)
        else if(c0 == "date")
            return this.date(command)
        else if(c0 == "clear")
            return this.clear(command)

        return `${c0}: が見つかりません<br>`
    }

    clear(command){
        this.terminal_display = ""
        this.frame_object.innerHTML = this.ps1 + `<input>`
        this.pass = true
        console.log(this)
    }

    echo(command){
        let command_ary = command.split(" ")
        return command_ary.slice(1, command_ary.size).join(" ") + "<br>"
    }

    ls(command){
        return ""
    }

    date(command){
        let date = new Date
        return `${date.getFullYear()}年 ${date.getMonth() + 1}月 ${date.getDate()}日 \
${["日", "月", "火", "水", "木", "金", "土"][date.getDay()]}曜日 \
${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} <br>`
    }
}
Shell.manager = {}

class Dir{
    path

    constructor(){
        this.path = "/root/"
    }

    pwd(){
        return this.path
    }

    ls(){
        let path = this.path
        let ary = path.split("/").map(function(e){return e + "/"})
        ary = ary.slice(0, ary.length - 1)
        console.log(path, ary)
    }
}
Dir.fs = {
    "/": {
        "root/": {},
        "etc/": {},
        "bin/": {},
        "usr/": {}
    }
}

document.addEventListener("keydown", function(e){
    // アクティブなウィンドウを探す
    let window = document.getElementsByClassName("window")
    active_window = null
    for(let i = 0; i < window.length; i++){
        if(Array.from(document.getElementsByClassName("window")[i].classList).includes("noactive") == false){
            active_window = document.getElementsByClassName("window")[i]
            break
        }
    }
    if(active_window){
        if(Array.from(active_window.classList).includes("Shell")){
            if(e.key == "Enter")
                Shell.keydown_enter(active_window.id)
        }
    }
})