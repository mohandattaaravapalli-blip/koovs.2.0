$port = 8080
$prefix = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
try {
    $listener.Start()
    Write-Host "Server started at $prefix"
} catch {
    $port = 8081
    $prefix = "http://localhost:$port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
    Write-Host "Server started at $prefix"
}

$root = "c:\Users\ADMIN\Desktop\koovs 2"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath)
        if ($urlPath -eq "/") { $urlPath = "/index.html" }
        
        $relativePath = $urlPath.TrimStart('/').Replace('/', '\')
        $localPath = [System.IO.Path]::Combine($root, $relativePath)
        
        if (Test-Path $localPath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".css"  { $response.ContentType = "text/css" }
                ".js"   { $response.ContentType = "application/javascript" }
                ".png"  { $response.ContentType = "image/png" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
                ".jpeg" { $response.ContentType = "image/jpeg" }
                ".svg"  { $response.ContentType = "image/svg+xml" }
                default { $response.ContentType = "application/octet-stream" }
            }
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # continue listener loop
    }
}
