### Como aplicar este patch no seu ambiente, Tonnks:

1. Salve este arquivo na raiz do projeto `financeiro-automatizado` como `tonnks-update.patch`
2. Abra o terminal na mesma pasta e rode:
   ```bash
   git apply tonnks-update.patch
   ```
3. Alternativamente, se quiser que o git já crie o commit para você com a autoria original:
   ```bash
   git am tonnks-update.patch
   ```
