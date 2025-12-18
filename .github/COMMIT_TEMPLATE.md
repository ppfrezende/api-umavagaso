# Padrão de Mensagem de Commit

## Formato

```
<tipo>: <descrição curta>

<corpo opcional>

<rodapé opcional>
```

## Tipos

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Alterações na documentação
- **style**: Formatação, ponto e vírgula, etc (sem mudança de código)
- **refactor**: Refatoração de código (sem adicionar feature ou corrigir bug)
- **test**: Adição ou correção de testes
- **chore**: Tarefas de build, configs, dependências, etc

## Exemplos

```
feat: adicionar endpoint de registro com tenant

Implementa criação automática de tenant no primeiro registro.
O usuário que cria o tenant recebe role OWNER.

Refs: #123
```

```
fix: corrigir validação de email duplicado

Adiciona verificação case-insensitive para emails.
```

```
docs: atualizar README com instruções de setup
```

```
refactor: extrair lógica de validação para service
```

## Regras

- Use modo imperativo ("adicionar" não "adicionado")
- Primeira linha com no máximo 72 caracteres
- Corpo opcional para explicar o "porquê" (não o "o que")
- Referencie issues relacionadas no rodapé
