$gitExecPath = git --exec-path
$wincred = Join-Path $gitExecPath "git-credential-wincred.exe"
$cred = "protocol=https`nhost=github.com`n" | & $wincred get
$pwdLine = ($cred | Select-String "password=").Line
$token = $pwdLine.Substring(9).Trim()
$remoteUrl = "https://" + $token + "@github.com/CHIRAG-GOUR/Olympiad-Activities.git"
git push $remoteUrl main
