class Shell{
    frame_object
    shell_window
    terminal_display = ""
    ps1 = `<span class="ps1"><span style="color:var(--shell_green);">Terminal</span> <span style="color:var(--shell_blue);">~</span> $&nbsp;</span>`
    pass = false
    fs
    home = ["root"]

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
            shell.ps1 = `<span class="ps1"><span style="color:var(--shell_green);">Terminal</span> <span style="color:var(--shell_blue);">${shell.fs.hpwd()}</span> $&nbsp;</span>`
            shell.frame_object.innerHTML = shell.terminal_display + shell.ps1
            shell.frame_object.innerHTML += `<input style="width: ${shell.frame_object.offsetWidth - Array.from(shell.frame_object.getElementsByClassName("ps1")).slice(-1)[0].offsetWidth - 16}px;">`
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
        else if(c0 == "help")
            return this.help(command)
        else if(c0 == "cat")
            return this.cat(command)
        else if(c0 == "cd")
            return this.cd(command)

        return `${c0}: が見つかりません<br>`
    }

    clear(command){
        this.terminal_display = ""
        this.frame_object.innerHTML = this.ps1 + `<input>`
        this.pass = true
    }

    echo(command){
        let command_ary = command.split(" ")
        return command_ary.slice(1, command_ary.size).join(" ") + "<br>"
    }

    ls(command){
        let path = command.split(" ")[1]
        let str = this.fs.ls(path)
        return str
    }

    cat(command){
        let path = command.split(" ")[1]
        return this.fs.cat(path)
    }

    pwd(command){
        return this.fs.pwd() + "<br>"
    }

    cd(command){
        let path = command.split(" ")[1]
        if(!path)
            return ""
        let status = this.fs.cd(path)
        return status
    }

    date(command){
        let date = new Date
        return `${date.getFullYear()}年 ${date.getMonth() + 1}月 ${date.getDate()}日 \
${["日", "月", "火", "水", "木", "金", "土"][date.getDay()]}曜日 \
${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${("0" + date.getSeconds()).slice(-2)} <br>`
    }

    help(command){
        let ary = [
            "cat [file]", "cd [dir]", "clear", "date", "echo [text]", "help", "ls [dir]", "pwd" 
        ]
        return ary.map(function(e){return `&nbsp;${e}`}).join("<br>") + "<br>"
    }
}
Shell.manager = {}

class Dir{
    homepath = ["root"]
    path = ["root"]

    hpwd(){
        let str = ""
        let b = true
        let i
        if(this.path.length == 0)
            return "/"
        for(i = 0; i < this.homepath.length; i++)
            if(!this.path.includes(this.homepath[i]))
                return [""].concat(this.path).join("/")
        return "~" + [""].concat(this.path.slice(i)).join("/")
    }

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
        return [""].concat(this.path).join("/")
    }

    ls(path){
        let tmp = path
        path = this.getFullPath(path)
        let str = ""
        let dir = Dir.fs
        if(Dir.fileType(path) == "File")
            return `${path[path.length - 1]}<br>`
        for(let i = 0; i < path.length; i++)
            if(dir[path[i]])
                dir = dir[path[i]]
            else
                return `ls: '${tmp}' にアクセスできません: そのようなファイルやディレクトリはありません<br>`
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
        if(str) str += "<br>"
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

    cat(path){
        let tmp = path
        if(!path)
            return ""
        path = this.getFullPath(path)
        let dir = Dir.fs
        for(let i = 0; i < path.length; i++){
            if(dir[path[i]])
                dir = dir[path[i]]
            else
                return `cat: ${tmp}: そのようなファイルやディレクトリはありません<br>`  
        }
        if(Dir.fileType(path) == "Directory")
            return `cat: ${tmp}: ディレクトリです<br>`
        let str = dir.data
        let dummy = document.createElement("div")
        dummy.innerText = str
        str = dummy.innerHTML
        return str
    }

    cd(path){
        let tmp = path
        if(!path)
            return undefined
        path = this.getFullPath(path)
        let dir = Dir.fs
        for(let i = 0; i < path.length; i++){
            if(dir[path[i]])
                dir = dir[path[i]]
            else
                return `cd: ${tmp}: そのようなファイルやディレクトリはありません<br>`  
        }
        if(Dir.fileType(path) != "Directory")
            return `cd: ${tmp}: ディレクトリではありません<br>`
        this.path = path
        return ""
    }
}
Dir.fs = {
    "root": {
        "readme": {"data": "ターミナルっぽいやつです\n"},
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