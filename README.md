<p align="center">
  <img src="docs/GullienneLogo.png" width="50%">
</p>

# Gullienne

The language Gullienne is inspired by our favorite TA Julian and his iconic sayings (Julianisms). We chose this version of Julian’s name to avoid any legal consequences. It compiles into JavaScript(JS) and shares some characteristics from JS, Python, and Swift but definitely not Java. We chose these languages as a basis because we like them, from the argument labels of Swift to making the distinction of mutable and immutable variables from JS. Although we have committed the forbidden crime of using semi-colons, we make up for it with our Joolean ideals and not ideals. We also came up with some new and fresh ideas like binding our variables with “@” instead of the mainstream “=”. You may think that Gullienne would be unreadable, but you would be wrong. As long as you have your overheard channel handy, the understanding will simply come to you just like a polite squid at Roski’s.

## Language Overview

- Uses Static, Strong and Manifest typing
- Object Oriented
- A fun language inspired by "Julianisms"

Below is an in-depth view of Gullienne with a comparison to equivalent code in JavaScript.

### Comments

<table>
<tr> <th>JavaScript</th><th>Gullienne</th> </tr>
<tr>
<td>

`//Let's break this down.`

</td>
<td>

`~Let's break this down.~`

</td>
</tr>
<tr> <td>

```
/* Let's see here...
W- Wait, what is that? */
```

</td>
<td>

```
~ Let's see here...
W- Wait, what is that? ~
```

</td> </tr> </table>

### Data Types

<table>
<tr> <th>Type</th> <th>Values</th> <th>JavaScript</th> </tr>
<tr><td>

Joolean `joolean`

</td><td>

`ideal`, `!ideal`

</td><td>

Boolean `true` `false`

</td></tr>
<tr><td>

Number `number`

</td><td>

`3.97385`, `7895.2734`

</td><td>

Number `99465.213`

</td></tr>
<tr><td>

String `string`

</td><td>

`` `carrot` ``, `` `bob` ``

</td><td>

String `"phrase"`

</td></tr>
</table>

### Data Structures

<table>
<tr> <th>Structure</th> <th>Syntax</th> <th>JavaScript</th> </tr>
<tr><td>Lists</td><td>

`[ a, b, c ]`

</td><td>

`[ a , b , c ]`

</td></tr>
<tr><td>Maps</td><td>

`<< a :: x , b :: y >>`

</td><td>

`{ a : x , b : y }`

</td></tr>
<tr><td>Sets</td>
<td>

`< a, b, c >`

</td><td>

`Set()`

</td></tr>
</table>

### Operators and Precedence

<table>
<tr> <th>Operator</th> <th>Symbol</th> <th>Operational Types</th> <th>Precedence</th> <th>Associativity</th> </tr>
<tr><td>Attributor</td><td>

`.`

</td><td>Object</td><td id="centered">1</td><td id="centered">L to R</td></tr>
<tr><td>List Indexer</td><td>

`[]`

</td><td>List</td><td id="centered">1</td><td id="centered">^</td></tr>
<tr><td>Map Indexer</td><td>

`<<>>`

</td><td>Map</td><td id="centered">1</td><td id="centered">^</td></tr>
<tr><td>Set Indexer</td><td>

`<>`

</td><td>Set</td><td id="centered">1</td><td id="centered">^</td></tr><tr>
<td>Call</td><td>

`()`

</td><td>Function</td><td id="centered">1</td><td id="centered">^</td></tr><tr>
<td>Boolean Negation</td><td>

`!`

</td><td>Joolean</td><td id="centered">2</td><td id="centered">R to L</td></tr>
<tr><td>Numeric Negation</td><td>

`-`

</td><td>Number</td><td id="centered">2</td><td id="centered">^</td></tr>
<tr><td>Exponentiation</td><td>

`^`

</td><td>Number</td><td id="centered">2</td><td id="centered">^</td></tr>
<tr><td>Multiplication</td><td>

`*`

</td><td>Number, List</td><td id="centered">3</td><td id="centered">L to R</td></tr>
<tr><td>Division</td><td>

`/`

</td><td>Number</td><td id="centered">3</td><td id="centered">^</td></tr>
<tr><td>Remainder</td><td>

`%`

</td><td>Number</td><td id="centered">3</td><td id="centered">^</td></tr>
<tr><td>Union</td><td>

`union`

</td><td>List, Set, Map</td><td id="centered">4</td><td id="centered">^</td></tr>
<tr><td>intersection</td><td>

`intersect`

</td><td>List, Set, Map</td><td id="centered">4</td><td id="centered">^</td></tr>
<tr><td>Addition</td><td>

`+`

</td><td>Number, List, Set, Map</td><td id="centered">4</td><td id="centered">^</td></tr>
<tr><td>Subtraction</td><td>

`-`

</td><td>Number</td><td id="centered">4</td><td id="centered">^</td></tr>
<tr><td>Less Than</td><td>

`<`

</td><td>Number</td><td id="centered">5</td><td id="centered">None</td></tr>
<tr><td>Less Than or Equal</td><td>

`<=`

</td><td>Number</td><td id="centered">5</td><td id="centered">^</td></tr>
<tr><td>Less Than or Equal</td><td>

`<=`

</td><td>Number</td><td id="centered">5</td><td id="centered">^</td></tr>
<tr><td>Greater Than</td><td>

`>`

</td><td>Number</td><td id="centered">5</td><td id="centered">^</td></tr>
<tr><td>Greater Than or Equal</td><td>

`>=`

</td><td>Number</td><td id="centered">5</td><td id="centered">^</td></tr>
<tr><td>Equality</td><td>

`==`

</td><td>Joolean, Number, String</td><td id="centered">6</td><td id="centered">^</td></tr>
<tr><td>Inequality</td><td>

`!=`

</td><td>Joolean, Number, String</td><td id="centered">6</td><td id="centered">^</td></tr>
<tr><td>Logical AND</td><td>

`&`

</td><td>Joolean</td><td id="centered">7</td><td id="centered">^</td></tr>
<tr><td>Logical OR</td><td>

`|`

</td><td>Number</td><td id="centered">8</td><td id="centered">^</td></tr>
<tr><td>Assignment</td><td>

`@`

</td><td>Joolean, Numbers, String, List, Map, Set, Object</td><td id="centered">9</td><td id="centered">R to L</td></tr>
</table>

## Examples

### Hello World

<table>
<tr> <th>JavaScript</th><th>Gullienne</th> </tr>
<tr>
<td>

`console.log(“You’re farming overheards again!”)`

</td>
<td>

`` overheard(`You’re farming overheards again!`); ``

</td> </tr> </table>

### Variable Binding

<table>
<tr> <th>JavaScript</th><th>Gullienne</th> </tr>
<tr>
<td>

`let overtime = true`

</td>
<td>

`overtime:joolean @ ideal;`

</td>
</tr>
<tr> <td>

`const hoursClocked = 900;`

</td>
<td>

`hoursClocked:NUMBER @ 900;`

</td> </tr> </table>

### Type Conversions

<table>
<tr> <th>JavaScript</th><th>Gullienne</th> </tr>
<tr>
<td>

```
let you = 21
let aString = String(you)
```

</td>
<td>

```
you:number @ 21;
aString:string @ mangle(you, string);
```

</td> </tr> </table>

### Loops

<table>
<tr> <th>JavaScript</th><th>Gullienne</th> </tr>
<tr>
<td>

```
let bob = 0

while (bob < 5) {
    bob++
	console.log(“Number of squids on floor: “ + bob)
}
```

</td>
<td>

```
bob:number @ 0;

noCap(bob < 5) {
	bob++;
    overheard(`Number of squids on floor: ` + mangle(bob, string));
}
```

</td>
</tr>
<tr>
<td>

```
debt = [2, 3, 1, 5, 3]

for (hotChocolates in debt) {
	console.log(“I owe you “ + hotChocolates + " for this.”)
}
```

</td>
<td>

```
debt:[number] @ [2, 3, 1, 5, 3];

cap(hotChocolates in debt) {
	overheard(`I owe you ` + hotChocolates + ` for this.`);
}
```

</td> </tr> </table>

### Conditionals

<table>
<tr> <th>JavaScript</th><th>Gullienne</th> </tr>
<tr>
<td>

```
if (job == true) {
    console.log(“truthy”)
} else if (job ==  false) {
    console.log(“falsy”)
} else {
    console.log(“How did we get here?”)
}
```

</td>
<td>

```
so (job = ideal) {
    overheard(`true`);
} but (job = !ideal) {
    overheard(`false`);
} otherwise {
    overheard(`How did we get here?`);
}
```

</td> </tr> </table>

### Functions

<table>
<tr> <th>JavaScript</th><th>Gullienne</th> </tr>
<tr>
<td>

```
function jsAddFunction(bob, job) {
	return bob + job
}
```

</td>
<td>

```
do:number gluAddFunction(bob:number, job:number) {
	howItBe bob + job;
}
```

</td> </tr> </table>
