# Função para validar entrada numérica
function LerNumeroValidado($prompt) {
    do {
        $valor = Read-Host $prompt
        if (-not ($valor -match '^\d+$')) {
            Write-Host "Entrada invalida. Digite apenas numeros." -ForegroundColor Red
        }
    } while (-not ($valor -match '^\d+$'))
    return $valor
}

# Menu de escolha
Write-Host "`nEscolha uma opcao:" -ForegroundColor Cyan
Write-Host "1 - Conectar (adb connect)"
Write-Host "2 - Parear (adb pair)"
$opcao = Read-Host "Digite 1 ou 2"

# Leitura dos últimos 3 dígitos do IP
$ultimoOcteto = LerNumeroValidado "Digite os ultimos 3 digitos do IP (ex: 123 para 162.168.10.123)"

# Leitura do número da porta
$porta = LerNumeroValidado "Digite o numero da porta"

# Montando o endereço IP completo
$ipCompleto = "162.168.10.$ultimoOcteto"
$endereco = "$ipCompleto`:$porta"

if ($opcao -eq "1") {
    $comando = "adb connect $endereco"
} elseif ($opcao -eq "2") {
    $codigoPareamento = LerNumeroValidado "Digite o codigo de pareamento exibido no dispositivo"
    $comando = "adb pair $endereco $codigoPareamento"
} else {
    Write-Host "Opcao inválida!" -ForegroundColor Red
    exit
}

# Mostrando o comando no console
Write-Host "`nExecutando: $comando" -ForegroundColor Green

# Executando o comando ADB
Invoke-Expression $comando