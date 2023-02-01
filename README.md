<p align="center">
  <img src="docs/morphjulian4x.png" width="40%">
</p>

# Gullienne

This language is dedicated to our favorite PLang/Compilers TA.

## Language Overview

- Statically and Strongly Typed
- Visually Rigid for Ease of Readability
- Strong parallel operation support

Below is an in-depth view of Gullienne with a comparison to equivalent code in JavaScript

## Examples

### Hello World

<table>
<tr> <th>JavaScript</th><th>Gullienne</th> </tr>
<tr>
<td>

```
console.log(“You’re farming overheards again!”)
```

</td>
<td>

```
overheard(`You’re farming overheards again!`);
```

</td> </tr> </table>

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
W- Wait, what is that?
```

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
while (i < 5) {
	message = “Number of squids on floor: “ + i
	i++
	console.log(message)
}
```

</td>
<td>

```
noCap(i < 5) {
	message @ `Number of squids on floor: ` + i;
	i++;
    overheard(message);
}
```

</td>
</tr>
<tr> <td>

```
debt = [2, 3, 1, 5, 3]

for (hotChocolates in debt) {
	console.log(“I owe you “ + hotChocolates + " for this.”)
}
```

</td>
<td>

```
debt @ [2, 3, 1, 5, 3];

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
if (x == true) {
    console.log(“truthy”)
} else if (x ==  false) {
    console.log(“falsy”)
} else {
    console.log(“How did we get here?”)
}
```

</td>
<td>

```
so (x == ideal) {
    overheard(“true”);
} but (x == !ideal) {
    overheard(“false”);
} otherwise {
    overheard(“How did we get here?”);
}
```

</td> </tr> </table>

### Functions

<table>
<tr> <th>JavaScript</th><th>Gullienne</th> </tr>
<tr>
<td>

```
function jsAddFunction(x, y) {
	return x + y
}
```

</td>
<td>

```
do gluAddFunction(x, y) {
	howItBe x + y;
}
```

</td> </tr> </table>
