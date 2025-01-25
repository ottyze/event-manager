import http, { ServerResponse } from "http"
import * as fs from "fs/promises"
import * as pathlib from "path"

/**
 * 
 * @param {string} file 
 */
function getFileType(file) {
    if (file.endsWith("html"))
        return "text/html"
    else if (file.endsWith("css"))
        return "text/css"
    else if (file.endsWith("js"))
        return "text/javascript"

    return "text/plain"
}

/**
 *
 * @param {Request} req
 * @param {ServerResponse} res
 */
function requestListener(req, res) {
    const [path, query] = req.url.split("?")

	let file = ""

	if (path == "/") {
		file = "index.html"
	} else {
		file = path
	}
    

	fs.readFile(pathlib.join("public", file))
		.then((content) => {
			res.setHeader("Content-Type", getFileType(file))
			res.writeHead(200)
			res.end(content)
		})
		.catch((err) => {
            console.log(err)
			res.writeHead(502)
			res.end("internal server error")
		})
}

const server = http.createServer(requestListener)

server.listen(80, () => {
	console.log("Server is listening on port 80")
})
