# Prompts para gerar as fotografias da LP "Pode dizer sim"

Ferramenta recomendada: **Adobe Firefly** (já incluso no seu Creative Cloud e com
licença comercial garantida — importante para uma peça publicitária da Setta).
Alternativas: Midjourney, Leonardo, ChatGPT/DALL·E.

---

## ⚠️ Antes de começar: os 3 depoimentos NÃO podem ser gerados por IA

`depoimentos/jefferson-verdfrut.jpg`, `victor-pizzahut.jpg` e
`paulo-varanda-do-parque.jpg` são pessoas reais, com nome, cargo, empresa e
depoimento verdadeiro na página. Gerar um rosto sintético para elas seria
enganoso e um risco jurídico e de imagem para a Setta.

Caminhos possíveis:

1. Pedir uma foto ao próprio cliente (o mais simples — um retrato de celular com
   luz de janela resolve).
2. Agendar uma sessão rápida no ponto de venda de cada um.
3. Se não conseguir: me avise que eu reformulo a seção para funcionar sem o
   retrato — logo da empresa em destaque, citação grande e assinatura. Fica
   íntegro e continua bonito.

As 10 imagens abaixo são situações ilustrativas, sem pessoa identificável
associada a uma declaração — essas sim podem ser geradas ou compradas.

---

## Direção de arte comum a todas

Cole isto no fim de todo prompt para manter unidade visual entre as 10 imagens:

```
fotografia documental brasileira, pessoas do Nordeste do Brasil, pele e traços
diversos, luz natural quente de fim de tarde ou luz de abajur, ambiente de casa
brasileira de classe média real, cores quentes e suaves, profundidade de campo
rasa, 35mm, sem olhar para a câmera, momento espontâneo e não posado,
fotorrealista
```

**Prompt negativo (o que evitar):**

```
pose de banco de imagens, sorriso forçado para a câmera, iluminação de estúdio,
fundo branco, executivos de terno, placas solares, painéis fotovoltaicos,
ícones, texto, marca d'água, mãos deformadas, aparência de render 3D, HDR
exagerado, cores saturadas demais
```

> **Por que "sem placas solares":** a promessa central da página é justamente que
> o cliente **não** instala nada. Painel solar na imagem contradiz a copy.

---

## 1. O Sim na prática — `assets/images/sim/` · 16:9 · 800×450

Aqui a foto precisa mostrar **o "sim"**, o momento bom que a economia permite —
nunca o "não". São imagens de alívio e prazer cotidiano.

### `ar-condicionado.jpg`
> Quarto brasileiro à noite, casal adulto dormindo tranquilo sob um edredom leve,
> ar-condicionado split discreto na parede ao fundo levemente desfocado, luz azulada
> suave da madrugada entrando pela janela, clima de conforto e sono profundo

### `viagem.jpg`
> Família brasileira chegando a uma pousada de praia no Nordeste, tirando as malas
> do porta-malas do carro, crianças correndo à frente animadas, luz dourada de fim
> de tarde, expressão de quem finalmente conseguiu viajar

### `presente.jpg`
> Mulher brasileira entregando um presente embrulhado a uma senhora idosa na sala
> de casa, as duas rindo, sofá e parede com quadros de família ao fundo, luz quente
> de fim de tarde pela janela

### `curso.jpg`
> Jovem brasileira estudando em casa à noite na mesa da sala, notebook aberto e
> caderno anotado, abajur aceso, xícara ao lado, expressão concentrada e satisfeita

### `banho.jpg`
> Detalhe de um chuveiro ligado em banheiro simples de casa brasileira, água caindo
> em contraluz, vapor suave, azulejos claros, sem pessoas, clima de banho demorado
> e relaxante

### `pizza.jpg`
> Amigos brasileiros dividindo uma pizza na mesa da sala numa sexta à noite,
> mãos pegando fatias, refrigerante e copos, risada em andamento, luz quente de
> luminária baixa

---

## 2. Como funciona — `assets/images/passos/` · 3:2 · 900×600

⚠️ O número (1, 2, 3) aparece **sobreposto no canto inferior esquerdo** da foto.
Deixe essa área com fundo limpo — sem rosto nem elemento importante ali.

### `passo-1-cadastro.jpg`
> Mulher brasileira sentada no sofá de casa preenchendo um formulário no celular,
> expressão tranquila e concentrada, sala aconchegante desfocada ao fundo, luz
> natural de janela, canto inferior esquerdo do enquadramento livre

### `passo-2-conta-de-luz.jpg`
> Homem brasileiro fotografando uma conta de luz em papel com o celular sobre a
> mesa da cozinha, vista de cima em leve ângulo, mãos em primeiro plano, luz
> natural da manhã, canto inferior esquerdo livre

### `passo-3-desconto.jpg`
> Casal brasileiro na cozinha olhando junto a tela do celular com expressão de
> alívio e surpresa boa, conta de luz em papel sobre a bancada ao lado, luz quente
> de fim de tarde, canto inferior esquerdo livre

---

## 3. Indique e Ganhe — `assets/images/indique/` · 4:3 · 800×600

⚠️ Esta imagem aparece **sobre o fundo laranja** `#FFA300`. Prefira uma cena com
tons neutros ou frios para não competir com o fundo.

### `indique-e-ganhe.jpg`
> Duas amigas brasileiras juntas no sofá olhando a tela de um celular e rindo,
> uma mostrando algo para a outra, sala de casa em tons neutros, luz natural
> difusa, clima de recomendação entre amigas

---

## Depois de gerar

1. Salve com **exatamente o nome do arquivo** indicado, na pasta indicada.
2. Exporte em JPG, qualidade 82–86, na largura sugerida.
3. Substitua o arquivo-placeholder de mesmo nome. Nada precisa ser alterado no
   código — o `<img>` já aponta para o caminho certo.

Se preferir, me mande as imagens geradas que eu faço o recorte na proporção
exata, otimizo o peso e devolvo o projeto já montado.

---

## Alternativa: banco de imagens

Se optar por foto de banco em vez de IA, busque nestes termos e **filtre por
"Brasil" ou "Latin America"** — é o que evita o resultado genérico:

| Arquivo | Busca sugerida |
|---|---|
| `ar-condicionado.jpg` | brazilian family sleeping bedroom night air conditioning |
| `viagem.jpg` | brazilian family arriving vacation luggage beach |
| `presente.jpg` | brazilian woman giving gift grandmother home |
| `curso.jpg` | brazilian woman studying laptop home night |
| `banho.jpg` | shower running water bathroom backlight steam |
| `pizza.jpg` | friends sharing pizza home table night brazil |
| `passo-1-cadastro.jpg` | brazilian woman filling form smartphone sofa |
| `passo-2-conta-de-luz.jpg` | photographing document bill smartphone kitchen table |
| `passo-3-desconto.jpg` | brazilian couple checking phone kitchen relief |
| `indique-e-ganhe.jpg` | brazilian friends looking smartphone laughing sofa |

Bancos com boa representatividade brasileira: **Adobe Stock** (já no seu plano),
Freepik, e o acervo brasileiro do Unsplash/Pexels (gratuito, porém menor).
