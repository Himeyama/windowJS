class Shell{
    frame_object
    shell_window
    terminal_display = ""
    ps1 = `<span style="color:var(--shell_green);">Terminal</span> <span style="color:var(--shell_blue);">~</span> $ `
    pass = false
    fs

    static link(shell_window){
        let shell_object = new Shell
        shell_object.fs = new Dir
        shell_object.shell_window = shell_window
        shell_window.element.classList.add("Shell")
        shell_object.frame_object = document.createElement("div")
        shell_window.frame = shell_object.frame_object

        shell_window.element.getElementsByClassName("frame")[0].onclick = function(e){
            if(e.target.getElementsByTagName("input")[0])
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
        else if(c0 == "pwd")
            return this.pwd(command)

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
        let path = command.split(" ")[1]
        let str = this.fs.ls(path)
        if(str)
            str += "<br>"
        return str
    }

    pwd(command){
        return this.fs.pwd() + "<br>"
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
    path = ["root"]

    getFullPath(path){
        let r
        if(!path)
            path = ""
        if(path.match("^/.*"))
            r = path.split("/")
        else
            r = this.path.concat(path.split("/"))
        if(r[0] == "")
            r = r.slice(1)
        if(r[r.length - 1] == "")
            r = r.slice(0, -1)
        let tmp = []
        for(let i = 0; i < r.length; i++){
            if(r[i] == "..")
                tmp = tmp.slice(0, -1)
            else if(r[i] == ".")
                1
            else
                tmp = tmp.concat(r[i])
        }
        r = tmp
        return r
    }

    pwd(){
        return this.path
    }

    ls(path){
        let tmp = path
        path = this.getFullPath(path)
        let str = ""
        let dir = Dir.fs
        if(Dir.fileType(path) == "File")
            return `${path[path.length - 1]}`
        for(let i = 0; i < path.length; i++)
            if(dir[path[i]])
                dir = dir[path[i]]
            else
                return `ls: '${tmp}' にアクセスできません: そのようなファイルやディレクトリはありません`
        let list = Object.keys(dir)
        for(let i = 0; i < list.length; i++){
            let filePath = path.concat(list[i])
            let fileType = Dir.fileType(filePath)
            if(fileType == "Directory"){
                str += `<span style="color: var(--shell_blue);">${list[i]}</span> `
            }else{
                str += `${list[i]} `
            }
        }
        return str
    }

    static fileType(path){
        if(!path)
            return undefined
        let dir = Dir.fs
        for(let i = 0; i < path.length; i++){
            if(dir[path[i]])
                dir = dir[path[i]]
            else
                return false    
        }
        if(dir["data"])
            return "File"
        else
            return "Directory"
    }
}
Dir.fs = {
    "root": {
        "file": {"data": "hogehoge"},
        "file1": {"data": "hogehoge"},
        "dir": {}
    },
    "etc": {},
    "bin": {},
    "usr": {}
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