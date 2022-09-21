# Upload Original Albedo if it exists

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ErrorActionPreference = 'Stop'

$_rawfilename = 'C:/Users/DELL/AppData/Local/Temp/Original_Albedo.exr'
 $folder = 'seam-removal'
 $filename = 'Original_Albedo.exr'
 $keyFile = ($folder+ '/' + $filename)
 $service = 's3'
 $bucket = 'quixel-ml-team-data'
 $region = 'us-west-2'
 $host1 = $bucket + '.s3'  + '.amazonaws.com'
 $access_key = 'AKIAYZL7ANTUBCWOS5E7'
 $secret_key = '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'
 $br = [regex]::Unescape('\u000a')
 function HmacSHA256($message, $secret) {
     $hmacsha = New-Object System.Security.Cryptography.HMACSHA256
     $hmacsha.key = $secret
     $signature = $hmacsha.ComputeHash([Text.Encoding]::ASCII.GetBytes($message))
     return $signature
 }
 
 function getSignatureKey($key, $dateStamp, $regionName, $serviceName) {
     $kSecret = [Text.Encoding]::UTF8.GetBytes(('AWS4' + $key).toCharArray())
     $kDate = HmacSHA256 $dateStamp $kSecret
     $kRegion = HmacSHA256 $regionName $kDate
     $kService = HmacSHA256 $serviceName $kRegion
     $kSigning = HmacSHA256 'aws4_request' $kService
 
     return $kSigning
 }
 
 function hash($request) {
     $hasher = [System.Security.Cryptography.SHA256]::Create()
     $content = [Text.Encoding]::UTF8.GetBytes($request)
     $bytes = $hasher.ComputeHash($content)
     return ($bytes | ForEach-Object ToString x2) -join ''
 }
 function requestBuilder($method, $key) {
 
     $now = [DateTime]::UtcNow
     $amz_date = $now.ToString('yyyyMMddTHHmmssZ')
     $datestamp = $now.ToString('yyyyMMdd')
 
     $signed_headers = 'host'
     $credential_scope = $datestamp + '/' + $region + '/' + $service + '/' + 'aws4_request'
 
     $canonical_querystring = ''
     $canonical_querystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256'
     $canonical_querystring += '&X-Amz-Credential=' + [uri]::EscapeDataString(($access_key + '/' + $credential_scope))
     $canonical_querystring += '&X-Amz-Date=' + $amz_date
     $canonical_querystring += '&X-Amz-Expires=86400'
     $canonical_querystring += '&X-Amz-SignedHeaders=' + $signed_headers
 
     $canonical_headers = 'host:' + $host1 + $br
 
     $canonical_request = $method + $br
     $canonical_request += '/' + $key + $br
     $canonical_request += $canonical_querystring + $br
     $canonical_request += $canonical_headers + $br
     $canonical_request += $signed_headers + $br
     $canonical_request += 'UNSIGNED-PAYLOAD'
 
     $algorithm = 'AWS4-HMAC-SHA256'
 
     $canonical_request_hash = hash -request $canonical_request
     $string_to_sign = $algorithm + $br
     $string_to_sign += $amz_date + $br
     $string_to_sign += $credential_scope + $br
     $string_to_sign += $canonical_request_hash
 
     $signing_key = getSignatureKey $secret_key $datestamp $region $service
     $signature =  HmacSHA256 -secret $signing_key -message $string_to_sign
     $signature = ($signature|ForEach-Object ToString x2) -join ''
 
     $canonical_querystring += '&X-Amz-Signature=' + $signature
 
     $request_url = 'http://' + $host1 + '/' + $key + '?' + $canonical_querystring
     Write-Host $request_url
     return $request_url
 }

#C# class to create callback
$code = @"
public class SSLHandler
{
    public static System.Net.Security.RemoteCertificateValidationCallback GetSSLHandler()
    {

        return new System.Net.Security.RemoteCertificateValidationCallback((sender, certificate, chain, policyErrors) => { return true; });
    }

}
"@

#compile the class
Add-Type -TypeDefinition $code

#disable checks using new class
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = [SSLHandler]::GetSSLHandler()
#do the request
try
{
    if (Test-Path $_rawfilename)
    {
        Invoke-RestMethod -Verbose -Method PUT -Uri (requestBuilder 'PUT' $keyFile) -InFile $_rawfilename
    }
} catch {
    # do something
    Write-Host $_
} finally {
   #enable checks again
   [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {true}
}

# Upload Filled Albedo if it exists

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ErrorActionPreference = 'Stop'

$_rawfilename = 'C:/Users/DELL/AppData/Local/Temp/Filled_Albedo.exr'
 $folder = 'seam-removal'
 $filename = 'Filled_Albedo.exr'
 $keyFile = ($folder+ '/' + $filename)
 $service = 's3'
 $bucket = 'quixel-ml-team-data'
 $region = 'us-west-2'
 $host1 = $bucket + '.s3'  + '.amazonaws.com'
 $access_key = 'AKIAYZL7ANTUBCWOS5E7'
 $secret_key = '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'
 $br = [regex]::Unescape('\u000a')
 function HmacSHA256($message, $secret) {
     $hmacsha = New-Object System.Security.Cryptography.HMACSHA256
     $hmacsha.key = $secret
     $signature = $hmacsha.ComputeHash([Text.Encoding]::ASCII.GetBytes($message))
     return $signature
 }
 
 function getSignatureKey($key, $dateStamp, $regionName, $serviceName) {
     $kSecret = [Text.Encoding]::UTF8.GetBytes(('AWS4' + $key).toCharArray())
     $kDate = HmacSHA256 $dateStamp $kSecret
     $kRegion = HmacSHA256 $regionName $kDate
     $kService = HmacSHA256 $serviceName $kRegion
     $kSigning = HmacSHA256 'aws4_request' $kService
 
     return $kSigning
 }
 
 function hash($request) {
     $hasher = [System.Security.Cryptography.SHA256]::Create()
     $content = [Text.Encoding]::UTF8.GetBytes($request)
     $bytes = $hasher.ComputeHash($content)
     return ($bytes | ForEach-Object ToString x2) -join ''
 }
 function requestBuilder($method, $key) {
 
     $now = [DateTime]::UtcNow
     $amz_date = $now.ToString('yyyyMMddTHHmmssZ')
     $datestamp = $now.ToString('yyyyMMdd')
 
     $signed_headers = 'host'
     $credential_scope = $datestamp + '/' + $region + '/' + $service + '/' + 'aws4_request'
 
     $canonical_querystring = ''
     $canonical_querystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256'
     $canonical_querystring += '&X-Amz-Credential=' + [uri]::EscapeDataString(($access_key + '/' + $credential_scope))
     $canonical_querystring += '&X-Amz-Date=' + $amz_date
     $canonical_querystring += '&X-Amz-Expires=86400'
     $canonical_querystring += '&X-Amz-SignedHeaders=' + $signed_headers
 
     $canonical_headers = 'host:' + $host1 + $br
 
     $canonical_request = $method + $br
     $canonical_request += '/' + $key + $br
     $canonical_request += $canonical_querystring + $br
     $canonical_request += $canonical_headers + $br
     $canonical_request += $signed_headers + $br
     $canonical_request += 'UNSIGNED-PAYLOAD'
 
     $algorithm = 'AWS4-HMAC-SHA256'
 
     $canonical_request_hash = hash -request $canonical_request
     $string_to_sign = $algorithm + $br
     $string_to_sign += $amz_date + $br
     $string_to_sign += $credential_scope + $br
     $string_to_sign += $canonical_request_hash
 
     $signing_key = getSignatureKey $secret_key $datestamp $region $service
     $signature =  HmacSHA256 -secret $signing_key -message $string_to_sign
     $signature = ($signature|ForEach-Object ToString x2) -join ''
 
     $canonical_querystring += '&X-Amz-Signature=' + $signature
 
     $request_url = 'http://' + $host1 + '/' + $key + '?' + $canonical_querystring
     Write-Host $request_url
     return $request_url
 }

#C# class to create callback
$code = @"
public class SSLHandler
{
    public static System.Net.Security.RemoteCertificateValidationCallback GetSSLHandler()
    {

        return new System.Net.Security.RemoteCertificateValidationCallback((sender, certificate, chain, policyErrors) => { return true; });
    }

}
"@

#compile the class
Add-Type -TypeDefinition $code

#disable checks using new class
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = [SSLHandler]::GetSSLHandler()
#do the request
try
{
    if (Test-Path $_rawfilename)
    {
    Invoke-RestMethod -Verbose -Method PUT -Uri (requestBuilder 'PUT' $keyFile) -InFile $_rawfilename
    }
} catch {
    # do something
    Write-Host $_
} finally {
   #enable checks again
   [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {true}
}

# Upload Displacement

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ErrorActionPreference = 'Stop'

$_rawfilename = 'C:/Users/DELL/AppData/Local/Temp/Displacement.exr'
 $folder = 'seam-removal'
 $filename = 'Displacement.exr'
 $keyFile = ($folder+ '/' + $filename)
 $service = 's3'
 $bucket = 'quixel-ml-team-data'
 $region = 'us-west-2'
 $host1 = $bucket + '.s3'  + '.amazonaws.com'
 $access_key = 'AKIAYZL7ANTUBCWOS5E7'
 $secret_key = '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'
 $br = [regex]::Unescape('\u000a')
 function HmacSHA256($message, $secret) {
     $hmacsha = New-Object System.Security.Cryptography.HMACSHA256
     $hmacsha.key = $secret
     $signature = $hmacsha.ComputeHash([Text.Encoding]::ASCII.GetBytes($message))
     return $signature
 }
 
 function getSignatureKey($key, $dateStamp, $regionName, $serviceName) {
     $kSecret = [Text.Encoding]::UTF8.GetBytes(('AWS4' + $key).toCharArray())
     $kDate = HmacSHA256 $dateStamp $kSecret
     $kRegion = HmacSHA256 $regionName $kDate
     $kService = HmacSHA256 $serviceName $kRegion
     $kSigning = HmacSHA256 'aws4_request' $kService
 
     return $kSigning
 }
 
 function hash($request) {
     $hasher = [System.Security.Cryptography.SHA256]::Create()
     $content = [Text.Encoding]::UTF8.GetBytes($request)
     $bytes = $hasher.ComputeHash($content)
     return ($bytes | ForEach-Object ToString x2) -join ''
 }
 function requestBuilder($method, $key) {
 
     $now = [DateTime]::UtcNow
     $amz_date = $now.ToString('yyyyMMddTHHmmssZ')
     $datestamp = $now.ToString('yyyyMMdd')
 
     $signed_headers = 'host'
     $credential_scope = $datestamp + '/' + $region + '/' + $service + '/' + 'aws4_request'
 
     $canonical_querystring = ''
     $canonical_querystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256'
     $canonical_querystring += '&X-Amz-Credential=' + [uri]::EscapeDataString(($access_key + '/' + $credential_scope))
     $canonical_querystring += '&X-Amz-Date=' + $amz_date
     $canonical_querystring += '&X-Amz-Expires=86400'
     $canonical_querystring += '&X-Amz-SignedHeaders=' + $signed_headers
 
     $canonical_headers = 'host:' + $host1 + $br
 
     $canonical_request = $method + $br
     $canonical_request += '/' + $key + $br
     $canonical_request += $canonical_querystring + $br
     $canonical_request += $canonical_headers + $br
     $canonical_request += $signed_headers + $br
     $canonical_request += 'UNSIGNED-PAYLOAD'
 
     $algorithm = 'AWS4-HMAC-SHA256'
 
     $canonical_request_hash = hash -request $canonical_request
     $string_to_sign = $algorithm + $br
     $string_to_sign += $amz_date + $br
     $string_to_sign += $credential_scope + $br
     $string_to_sign += $canonical_request_hash
 
     $signing_key = getSignatureKey $secret_key $datestamp $region $service
     $signature =  HmacSHA256 -secret $signing_key -message $string_to_sign
     $signature = ($signature|ForEach-Object ToString x2) -join ''
 
     $canonical_querystring += '&X-Amz-Signature=' + $signature
 
     $request_url = 'http://' + $host1 + '/' + $key + '?' + $canonical_querystring
     Write-Host $request_url
     return $request_url
 }

#C# class to create callback
$code = @"
public class SSLHandler
{
    public static System.Net.Security.RemoteCertificateValidationCallback GetSSLHandler()
    {

        return new System.Net.Security.RemoteCertificateValidationCallback((sender, certificate, chain, policyErrors) => { return true; });
    }

}
"@

#compile the class
Add-Type -TypeDefinition $code

#disable checks using new class
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = [SSLHandler]::GetSSLHandler()
#do the request
try
{
    if (Test-Path $_rawfilename)
    {
    Invoke-RestMethod -Verbose -Method PUT -Uri (requestBuilder 'PUT' $keyFile) -InFile $_rawfilename
    }
} catch {
    # do something
    Write-Host $_
} finally {
   #enable checks again
   [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {true}
}

# Upload AO

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ErrorActionPreference = 'Stop'

$_rawfilename = 'C:/Users/DELL/AppData/Local/Temp/AO.exr'
 $folder = 'seam-removal'
 $filename = 'AO.exr'
 $keyFile = ($folder+ '/' + $filename)
 $service = 's3'
 $bucket = 'quixel-ml-team-data'
 $region = 'us-west-2'
 $host1 = $bucket + '.s3'  + '.amazonaws.com'
 $access_key = 'AKIAYZL7ANTUBCWOS5E7'
 $secret_key = '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'
 $br = [regex]::Unescape('\u000a')
 function HmacSHA256($message, $secret) {
     $hmacsha = New-Object System.Security.Cryptography.HMACSHA256
     $hmacsha.key = $secret
     $signature = $hmacsha.ComputeHash([Text.Encoding]::ASCII.GetBytes($message))
     return $signature
 }
 
 function getSignatureKey($key, $dateStamp, $regionName, $serviceName) {
     $kSecret = [Text.Encoding]::UTF8.GetBytes(('AWS4' + $key).toCharArray())
     $kDate = HmacSHA256 $dateStamp $kSecret
     $kRegion = HmacSHA256 $regionName $kDate
     $kService = HmacSHA256 $serviceName $kRegion
     $kSigning = HmacSHA256 'aws4_request' $kService
 
     return $kSigning
 }
 
 function hash($request) {
     $hasher = [System.Security.Cryptography.SHA256]::Create()
     $content = [Text.Encoding]::UTF8.GetBytes($request)
     $bytes = $hasher.ComputeHash($content)
     return ($bytes | ForEach-Object ToString x2) -join ''
 }
 function requestBuilder($method, $key) {
 
     $now = [DateTime]::UtcNow
     $amz_date = $now.ToString('yyyyMMddTHHmmssZ')
     $datestamp = $now.ToString('yyyyMMdd')
 
     $signed_headers = 'host'
     $credential_scope = $datestamp + '/' + $region + '/' + $service + '/' + 'aws4_request'
 
     $canonical_querystring = ''
     $canonical_querystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256'
     $canonical_querystring += '&X-Amz-Credential=' + [uri]::EscapeDataString(($access_key + '/' + $credential_scope))
     $canonical_querystring += '&X-Amz-Date=' + $amz_date
     $canonical_querystring += '&X-Amz-Expires=86400'
     $canonical_querystring += '&X-Amz-SignedHeaders=' + $signed_headers
 
     $canonical_headers = 'host:' + $host1 + $br
 
     $canonical_request = $method + $br
     $canonical_request += '/' + $key + $br
     $canonical_request += $canonical_querystring + $br
     $canonical_request += $canonical_headers + $br
     $canonical_request += $signed_headers + $br
     $canonical_request += 'UNSIGNED-PAYLOAD'
 
     $algorithm = 'AWS4-HMAC-SHA256'
 
     $canonical_request_hash = hash -request $canonical_request
     $string_to_sign = $algorithm + $br
     $string_to_sign += $amz_date + $br
     $string_to_sign += $credential_scope + $br
     $string_to_sign += $canonical_request_hash
 
     $signing_key = getSignatureKey $secret_key $datestamp $region $service
     $signature =  HmacSHA256 -secret $signing_key -message $string_to_sign
     $signature = ($signature|ForEach-Object ToString x2) -join ''
 
     $canonical_querystring += '&X-Amz-Signature=' + $signature
 
     $request_url = 'http://' + $host1 + '/' + $key + '?' + $canonical_querystring
     Write-Host $request_url
     return $request_url
 }

#C# class to create callback
$code = @"
public class SSLHandler
{
    public static System.Net.Security.RemoteCertificateValidationCallback GetSSLHandler()
    {

        return new System.Net.Security.RemoteCertificateValidationCallback((sender, certificate, chain, policyErrors) => { return true; });
    }

}
"@

#compile the class
Add-Type -TypeDefinition $code

#disable checks using new class
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = [SSLHandler]::GetSSLHandler()
#do the request
try
{
    if (Test-Path $_rawfilename)
    {
    Invoke-RestMethod -Verbose -Method PUT -Uri (requestBuilder 'PUT' $keyFile) -InFile $_rawfilename
    }
} catch {
    # do something
    Write-Host $_
} finally {
   #enable checks again
   [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {true}
}

# Upload Normal

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ErrorActionPreference = 'Stop'

$_rawfilename = 'C:/Users/DELL/AppData/Local/Temp/Normal.exr'
 $folder = 'seam-removal'
 $filename = 'Normal.exr'
 $keyFile = ($folder+ '/' + $filename)
 $service = 's3'
 $bucket = 'quixel-ml-team-data'
 $region = 'us-west-2'
 $host1 = $bucket + '.s3'  + '.amazonaws.com'
 $access_key = 'AKIAYZL7ANTUBCWOS5E7'
 $secret_key = '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'
 $br = [regex]::Unescape('\u000a')
 function HmacSHA256($message, $secret) {
     $hmacsha = New-Object System.Security.Cryptography.HMACSHA256
     $hmacsha.key = $secret
     $signature = $hmacsha.ComputeHash([Text.Encoding]::ASCII.GetBytes($message))
     return $signature
 }
 
 function getSignatureKey($key, $dateStamp, $regionName, $serviceName) {
     $kSecret = [Text.Encoding]::UTF8.GetBytes(('AWS4' + $key).toCharArray())
     $kDate = HmacSHA256 $dateStamp $kSecret
     $kRegion = HmacSHA256 $regionName $kDate
     $kService = HmacSHA256 $serviceName $kRegion
     $kSigning = HmacSHA256 'aws4_request' $kService
 
     return $kSigning
 }
 
 function hash($request) {
     $hasher = [System.Security.Cryptography.SHA256]::Create()
     $content = [Text.Encoding]::UTF8.GetBytes($request)
     $bytes = $hasher.ComputeHash($content)
     return ($bytes | ForEach-Object ToString x2) -join ''
 }
 function requestBuilder($method, $key) {
 
     $now = [DateTime]::UtcNow
     $amz_date = $now.ToString('yyyyMMddTHHmmssZ')
     $datestamp = $now.ToString('yyyyMMdd')
 
     $signed_headers = 'host'
     $credential_scope = $datestamp + '/' + $region + '/' + $service + '/' + 'aws4_request'
 
     $canonical_querystring = ''
     $canonical_querystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256'
     $canonical_querystring += '&X-Amz-Credential=' + [uri]::EscapeDataString(($access_key + '/' + $credential_scope))
     $canonical_querystring += '&X-Amz-Date=' + $amz_date
     $canonical_querystring += '&X-Amz-Expires=86400'
     $canonical_querystring += '&X-Amz-SignedHeaders=' + $signed_headers
 
     $canonical_headers = 'host:' + $host1 + $br
 
     $canonical_request = $method + $br
     $canonical_request += '/' + $key + $br
     $canonical_request += $canonical_querystring + $br
     $canonical_request += $canonical_headers + $br
     $canonical_request += $signed_headers + $br
     $canonical_request += 'UNSIGNED-PAYLOAD'
 
     $algorithm = 'AWS4-HMAC-SHA256'
 
     $canonical_request_hash = hash -request $canonical_request
     $string_to_sign = $algorithm + $br
     $string_to_sign += $amz_date + $br
     $string_to_sign += $credential_scope + $br
     $string_to_sign += $canonical_request_hash
 
     $signing_key = getSignatureKey $secret_key $datestamp $region $service
     $signature =  HmacSHA256 -secret $signing_key -message $string_to_sign
     $signature = ($signature|ForEach-Object ToString x2) -join ''
 
     $canonical_querystring += '&X-Amz-Signature=' + $signature
 
     $request_url = 'http://' + $host1 + '/' + $key + '?' + $canonical_querystring
     Write-Host $request_url
     return $request_url
 }

#C# class to create callback
$code = @"
public class SSLHandler
{
    public static System.Net.Security.RemoteCertificateValidationCallback GetSSLHandler()
    {

        return new System.Net.Security.RemoteCertificateValidationCallback((sender, certificate, chain, policyErrors) => { return true; });
    }

}
"@

#compile the class
Add-Type -TypeDefinition $code

#disable checks using new class
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = [SSLHandler]::GetSSLHandler()
#do the request
try
{
    if (Test-Path $_rawfilename)
    {
    Invoke-RestMethod -Verbose -Method PUT -Uri (requestBuilder 'PUT' $keyFile) -InFile $_rawfilename
    }
} catch {
    # do something
    Write-Host $_
} finally {
   #enable checks again
   [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {true}
}

# Upload Roughness

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ErrorActionPreference = 'Stop'

$_rawfilename = 'C:/Users/DELL/AppData/Local/Temp/Roughness.exr'
 $folder = 'seam-removal'
 $filename = 'Roughness.exr'
 $keyFile = ($folder+ '/' + $filename)
 $service = 's3'
 $bucket = 'quixel-ml-team-data'
 $region = 'us-west-2'
 $host1 = $bucket + '.s3'  + '.amazonaws.com'
 $access_key = 'AKIAYZL7ANTUBCWOS5E7'
 $secret_key = '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'
 $br = [regex]::Unescape('\u000a')
 function HmacSHA256($message, $secret) {
     $hmacsha = New-Object System.Security.Cryptography.HMACSHA256
     $hmacsha.key = $secret
     $signature = $hmacsha.ComputeHash([Text.Encoding]::ASCII.GetBytes($message))
     return $signature
 }
 
 function getSignatureKey($key, $dateStamp, $regionName, $serviceName) {
     $kSecret = [Text.Encoding]::UTF8.GetBytes(('AWS4' + $key).toCharArray())
     $kDate = HmacSHA256 $dateStamp $kSecret
     $kRegion = HmacSHA256 $regionName $kDate
     $kService = HmacSHA256 $serviceName $kRegion
     $kSigning = HmacSHA256 'aws4_request' $kService
 
     return $kSigning
 }
 
 function hash($request) {
     $hasher = [System.Security.Cryptography.SHA256]::Create()
     $content = [Text.Encoding]::UTF8.GetBytes($request)
     $bytes = $hasher.ComputeHash($content)
     return ($bytes | ForEach-Object ToString x2) -join ''
 }
 function requestBuilder($method, $key) {
 
     $now = [DateTime]::UtcNow
     $amz_date = $now.ToString('yyyyMMddTHHmmssZ')
     $datestamp = $now.ToString('yyyyMMdd')
 
     $signed_headers = 'host'
     $credential_scope = $datestamp + '/' + $region + '/' + $service + '/' + 'aws4_request'
 
     $canonical_querystring = ''
     $canonical_querystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256'
     $canonical_querystring += '&X-Amz-Credential=' + [uri]::EscapeDataString(($access_key + '/' + $credential_scope))
     $canonical_querystring += '&X-Amz-Date=' + $amz_date
     $canonical_querystring += '&X-Amz-Expires=86400'
     $canonical_querystring += '&X-Amz-SignedHeaders=' + $signed_headers
 
     $canonical_headers = 'host:' + $host1 + $br
 
     $canonical_request = $method + $br
     $canonical_request += '/' + $key + $br
     $canonical_request += $canonical_querystring + $br
     $canonical_request += $canonical_headers + $br
     $canonical_request += $signed_headers + $br
     $canonical_request += 'UNSIGNED-PAYLOAD'
 
     $algorithm = 'AWS4-HMAC-SHA256'
 
     $canonical_request_hash = hash -request $canonical_request
     $string_to_sign = $algorithm + $br
     $string_to_sign += $amz_date + $br
     $string_to_sign += $credential_scope + $br
     $string_to_sign += $canonical_request_hash
 
     $signing_key = getSignatureKey $secret_key $datestamp $region $service
     $signature =  HmacSHA256 -secret $signing_key -message $string_to_sign
     $signature = ($signature|ForEach-Object ToString x2) -join ''
 
     $canonical_querystring += '&X-Amz-Signature=' + $signature
 
     $request_url = 'http://' + $host1 + '/' + $key + '?' + $canonical_querystring
     Write-Host $request_url
     return $request_url
 }

#C# class to create callback
$code = @"
public class SSLHandler
{
    public static System.Net.Security.RemoteCertificateValidationCallback GetSSLHandler()
    {

        return new System.Net.Security.RemoteCertificateValidationCallback((sender, certificate, chain, policyErrors) => { return true; });
    }

}
"@

#compile the class
Add-Type -TypeDefinition $code

#disable checks using new class
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = [SSLHandler]::GetSSLHandler()
#do the request
try
{
    if (Test-Path $_rawfilename)
    {
    Invoke-RestMethod -Verbose -Method PUT -Uri (requestBuilder 'PUT' $keyFile) -InFile $_rawfilename
    }
} catch {
    # do something
    Write-Host $_
} finally {
   #enable checks again
   [System.Net.ServicePointManager]::ServerCertificateValidationCallback = {true}
}



