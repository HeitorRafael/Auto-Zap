# ✏️ Como Personalizar o Fluxo para Cada Cliente

> Guia rápido para adaptar os templates aos dados reais de cada empresa.

---

## Variáveis a substituir em TODOS os flows

| Placeholder | Substituir por | Onde encontrar |
|---|---|---|
| `{{NOME_IMOBILIARIA}}` | Nome real da empresa | Reunião de coleta |
| `{{NOME_RESTAURANTE}}` | Nome real | Reunião de coleta |
| `{{NOME_CLINICA}}` | Nome real | Reunião de coleta |
| `{{NOME_MEI}}` | Nome real | Reunião de coleta |
| `{{LINK_PORTFOLIO}}` | URL do site/instagram | Cliente informa |
| `{{LINK_CARDAPIO}}` | URL ou "Ver cardápio: [link]" | Cliente envia |
| `{{LINK_TABELA_VALORES}}` | URL da tabela de preços | Cliente envia |
| `{{LISTA_SERVICOS}}` | Lista em texto plano | Montar com o cliente |
| `{{HORARIOS_ATENDIMENTO}}` | Horários formatados | Reunião de coleta |
| `{{TELEFONE_CONTATO}}` | Número com DDD | Cliente informa |
| `{{EMAIL_CONTATO}}` | Email de contato | Cliente informa |

---

## Como editar no Typebot Builder

```
1. Acesse https://flows.seudominio.com.br
2. Abra o flow do cliente
3. Clique no bloco de texto que contém o placeholder
4. Edite diretamente o texto
5. Para a URL do webhook: clique no bloco "Webhook" e
   atualize o campo URL com o endpoint correto do n8n
6. Clique em "Publish" ao finalizar
```

---

## Imobiliária — personalizações adicionais

- **Regiões**: Substituir lista de bairros pelos bairros atendidos pela imobiliária
- **Faixas de aluguel**: Ajustar valores nas opções de orçamento para o perfil do mercado local
- **Link do portfólio**: Pode ser o link do Instagram, site ou uma pasta do Drive com fotos

```
Exemplo de personalização de regiões (bloco de escolha):
Original: [Aviação] [Mirim] [Guilhermina] [Ocian] [Outro]
Imobiliária Gonzaga: [Gonzaga] [Embaré] [Boqueirão] [Vila Mathias] [Outro]
```

---

## Restaurante — personalizações adicionais

- **Horários de reserva**: Substituir pela grade de horários real do restaurante
- **Cardápio**: Pode ser uma imagem enviada diretamente no chat ou um link
- **Capacidade**: Ajustar opções de "número de pessoas" se a casa tiver limite por mesa
- **Dias de funcionamento**: Atualizar o texto estático na etapa de horários

---

## Clínica / Estética — personalizações adicionais

- **Lista de procedimentos**: Substituir pelos procedimentos reais da clínica
- **Orientações de preparação**: Personalizar para os procedimentos oferecidos (atenção ao RAG)
- **Períodos**: Se a clínica funciona apenas manhã ou apenas tarde, remover a opção desnecessária

---

## MEI — personalizações adicionais

- **Botões do menu**: Os 4 botões são configuráveis — adaptar para os serviços do cliente
- **Serviços**: O texto da etapa "Ver serviços" é um placeholder — substituir pela lista real
- **Horários**: Muitos MEIs atendem por agendamento — ajustar mensagem de horários

---

## Ajustar cores do bot (visual)

No Typebot Builder, cada flow tem configurações visuais:

```
1. Abrir o flow
2. Clicar no ícone de paleta (Theme) no menu lateral
3. Ajustar:
   - hostBubbles.backgroundColor: cor principal da empresa
   - guestBubbles: manter neutro
   - buttons.backgroundColor: cor de destaque
4. Opcionalmente: adicionar logo da empresa como avatar do bot
```

---

## Testando após personalização

```
1. No Typebot, clicar em "Preview" (ícone de play)
2. Percorrer TODOS os caminhos do fluxo:
   - Caminho A → B → C → webhook
   - Caminho alternativo (handoff, outra opção do menu)
3. Verificar se o webhook dispara e o lead chega no Sheets
4. Verificar se as variáveis estão sendo capturadas corretamente
5. Só publicar após o teste completo
```
