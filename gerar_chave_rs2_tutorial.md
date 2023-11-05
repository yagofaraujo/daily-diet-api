# Gerar a chave privada

`openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048`

# Gerar a chave pública
`openssl rsa -pubout -in private.key -out public.key -outform PEM`

# Converter a chave privada para base64
`JWT_PRIVATE_KEY=$(openssl base64 -in private.key -A)`

# Converter a chave pública para base64
`JWT_PUBLIC_KEY=$(openssl base64 -in public.key -A)`

# Adicionar as chaves ao arquivo .env
`echo "JWT_PRIVATE_KEY=\"$JWT_PRIVATE_KEY\"" >> .env`
`echo "JWT_PUBLIC_KEY=\"$JWT_PUBLIC_KEY\"" >> .env`

# Remover os arquivos de chave
`rm private.key public.key`