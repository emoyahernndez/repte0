# TR01.02 · Expresión regular de la calculadora

## Enunciado

Analitza l'expressió regular del material (en detall):

Fer servir la graella d'elements de patrons vista a classe.

https://github.com/jjbonnin/IP-repte1/blob/main/MD2.1%20Comen%C3%A7am%20a%20picar%20codi%20la%20calculadora.md#10-vuit%C3%A8-concepte-les-expressions-regulars

Modifica l'expressió regular perquè doni resposta a la nostra calculadora amb expressions del tipus:

La forma simbòlica general d'una operació binària (amb dos operands) s'expressa de la següent manera:

    a op b

On cada element representa:

- **a**: el primer operand.
- **b**: el segon operand.
- **op**: el símbol de l'operador (que representa qualsevol operació matemàtica).

Recordau que podem fer servir nombres decimals amb signe i que hi pot haver espais entre els elements (o no).

`3+5` està ben escrit i ha de funcionar.

Crea un petit algoritme que capturi els diferents errors d'entrada de les operacions que no estiguin ben formades. Mira la imatge adjunta *CodiError2* per fer les proves.

## 1. El patrón de clase

```js
/^\s*(-?\d+(?:\.\d+)?)\s*([+\-*/%])\s*(-?\d+(?:\.\d+)?)\s*$/
```

Se lee de izquierda a derecha: espacios, número, espacios, operador, espacios, número, espacios.

El material lo llama *graella d'elements*. Pieza por pieza:

| Pieza | Qué significa |
| --- | --- |
| `^` | Aquí empieza el texto. Si hay algo antes, no vale. |
| `\s*` | Espacios. Puede haberlos o no: `3+5` y `3 + 5` valen igual. |
| `( … )` | Paréntesis de captura: guardan el número, el operador y el número en `parts[1]`, `parts[2]` y `parts[3]`. |
| `-?` | El número puede llevar un menos delante. |
| `\d+` | Uno o más dígitos. Tiene que haber dígitos antes del punto. |
| `\.` | Un punto literal. Sin la barra, `.` significaría "cualquier carácter". |
| `(?:\.\d+)?` | Decimales opcionales: punto y más dígitos. `.5` y `5.` no valen. |
| `([+\-*/%])` | El operador: `+`, `-`, `*`, `/` o `%`. |
| `$` | Aquí acaba el texto. Si sobra algo, no vale. |

Los paréntesis guardan cada parte en `parts[1]`, `parts[2]` y `parts[3]`. El `(?:...)` no guarda nada, y así los índices no se desplazan.

## 2. `^` y `$` no son decoración

Sin `$`, `match` se queda con el primer trozo que encaja. `1 + 2 + 3` se leería como `1 + 2` y el `+ 3` se perdería. Con `^` y `$`, o encaja todo o no encaja nada.

## 3. Qué cambio para mi calculadora

El patrón de clase solo admite el signo menos. Para mi calculadora haría que también admitiera el más, cambiando `-?` por `[+\-]?` en los dos números:

```js
/^\s*([+\-]?\d+(?:\.\d+)?)\s*([+\-*/%])\s*([+\-]?\d+(?:\.\d+)?)\s*$/
```

Así valen `3+5`, `3 + 5`, `-5 + 2`, `+3 + 5`, `3+-5`, `3.5*2` y `-2.5 * 3`. No cambio nada más. Si meto potencias o paréntesis, cosas como `1 + 2 + 3` o `3 ** 2` empezarían a colarse, y no toca.

## 4. Cómo controlo los errores

1. Leo la entrada.
2. Si es `null` (Cancel·lar), error: `Has cancel·lat l'operació`.
3. La paso por el patrón. Si no encaja, error: `L'expressió no és vàlida. Usa: nombre operador nombre`.
4. Si el operador es `/` y el segundo número es `0`, error: `No es pot dividir entre zero`.
5. Si el operador es `%` y el segundo número es `0`, error: `No es pot calcular el mòdul entre zero`.
6. Calculo y muestro `a op b = resultado`.

Todo va dentro de un `try/catch`: el `throw` lanza el error y el `catch` muestra `Error: ...`.

La división y el módulo los miro a mano porque JavaScript no da error: devuelve `Infinity` o `NaN`.

## 5. Pruebas

| Entrada | Resultado |
| --- | --- |
| `3+5` | `3 + 5 = 8` |
| `3.5*2` | `3.5 * 2 = 7` |
| `-2.5 * 3` | `-2.5 * 3 = -7.5` |
| `8 / 0` | `Error: No es pot dividir entre zero` |
| `8 % 0` | `Error: No es pot calcular el mòdul entre zero` |
| `1 + 2 + 3` | `Error: L'expressió no és vàlida. Usa: nombre operador nombre` |
| `hola` | `Error: L'expressió no és vàlida. Usa: nombre operador nombre` |
| `.5 + 1` | `Error: L'expressió no és vàlida. Usa: nombre operador nombre` |
| Cancel·lar | `Error: Has cancel·lat l'operació` |

## 6. Cómo lo haría yo

Primero leería el patrón por partes, no entero de golpe.

Luego probaría `3+5`, `3 + 5`, `.5 + 1` y `1 + 2 + 3` para ver qué entra y qué no.

Después cambiaría `-?` por `[+\-]?`, porque el enunciado pide números con signo y el patrón de clase solo tiene el menos.

Al final haría las comprobaciones en este orden: cancelar, formato, cero. No tiene sentido dividir si la expresión todavía no es válida.
