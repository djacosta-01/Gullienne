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
|Type|Values|JavaScript|
|----|------|----------|
|Joolean `joolean`|`ideal`, `!ideal`|Boolean `true` `false`|
|Number `number`|`3.97385`, `7895.2734`|Number `99465.213`|
|String `string`|`` `carrot` ``, `` `bob` ``|String `"phrase"`|

### Data Structures
|Structure|Syntax|JavaScript|
|---|---|---|
|Lists| `[ a, b, c ]` | `[ a , b , c ]` |
|Maps| `<< a :: x , b :: y >>` | `{ a : x , b : y }` |
|Set| `< a, b, c >` | `Set()` |

### Operators and Precedence 
|Operator|Symbol|Operational Types|Precedence|Associativity|
|--------|------|-----------------|:------:|:----:|
|Attributor|`.`|Object|1|L to R|
|List Indexer|`[]`|List|1| ^ |
|Map Indexer|`{}`|Map|1| ^ |
|Set Indexer|`<>`|Set|1| ^ |
|Call|`()`|Functions|1| ^ |
|Negation|`!`|Joolean|2|R to L|
|Negation|`-`|Numbers|2| ^ |
|Exponentiation|`^`|Numbers|2| ^ |
|Multiplication|`*`|Numbers, List|3| L to R |
|Division|`/`|Numbers|3| ^ |
|Remainder|`%`|Numbers|3| ^ |
|Union|`union`|List, Set, Map|4| ^ |
|Intersection|`intersect`|List, Set, Map|4| ^ |
|Addition|`+`|Numbers, List, Set, Map|4| ^ |
|Subtraction|`-`|Numbers|4| ^ |
|Less Than|`<`|Numbers|5|None|
|Less Than or equal|`<=`|Numbers|5| ^ |
|Greater Than|`>`|Numbers|5| ^ |
|Greater Than or equal|`>=`|Numbers|5| ^ |
|Equality|`==`|Joolean, Numbers|6| ^ |
|Inequality|`!=`|Joolean, Numbers|6| ^ |
|Logical AND|`&`|Joolean|7| ^ |
|Logical OR|`\|`|Joolean|8| ^ |
|Assignment|`@`|Joolean, Numbers, String, List, Map, Set, Object|9|R to L|

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
