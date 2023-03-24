<p align="center">
  <img src="docs/GullienneLogo.png" width="50%">
</p>

# [Gullienne](https://djacosta-01.github.io/Gullienne/)

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

<code>//Let's break this down.</code>

</td>
<td>

<code>~Let's break this down.~</code>

</td>
</tr>
<tr> <td>

<pre><code>/* Let's see here...
W- Wait, what is that? */</code></pre>

</td>
<td>

<pre><code>~ Let's see here...
W- Wait, what is that? ~</code></pre>

</td> </tr> </table>

### Data Types

<table>
<tr> <th>Type</th> <th>Values</th> <th>JavaScript</th> </tr>
<tr><td>

Joolean <code>joolean</code>

</td><td>

<code>ideal</code>, <code>!ideal</code>

</td><td>

Boolean <code>true</code> <code>false</code>

</td></tr>
<tr><td>

Number <code>number</code>

</td><td>

<code>3.97385</code>, <code>7895.2734</code>

</td><td>

Number <code>99465.213</code>

</td></tr>
<tr><td>

String <code>string</code>

</td><td>

<code>`carrot`</code>, <code>`bob`</code>

</td><td>

String <code>"phrase"</code>

</td></tr>
</table>

### Data Structures

<table>
<tr> <th>Structure</th> <th>Syntax</th> <th>JavaScript</th> </tr>
<tr><td>Lists</td><td>

<code>[ a, b, c ]</code>

</td><td>

<code>[ a , b , c ]</code>

</td></tr>
<tr><td>Maps</td><td>

<code><< a :: x , b :: y >></code>

</td><td>

<code>{ a : x , b : y }</code>

</td></tr>
<tr><td>Sets</td>
<td>

<code>< a, b, c ></code>

</td>
<td>

<code>Set()</code>

</td></tr>
</table>

### Operators and Precedence

<table>
<tr> <th>Operator</th> <th>Symbol</th> <th>Operational Types</th> <th>Precedence</th> <th>Associativity</th> </tr>
<tr><td>Attributor</td><td>

<code>.</code>

</td><td>Object</td><td >1</td><td >L to R</td></tr>
<tr><td>List Indexer</td><td>

<code>[]</code>

</td><td>List</td><td >1</td><td >^</td></tr>
<tr><td>Map Indexer</td><td>

<code><<>></code>

</td><td>Map</td><td >1</td><td >^</td></tr>
<tr><td>Set Indexer</td><td>

<code><></code>

</td><td>Set</td><td >1</td><td >^</td></tr><tr>
<td>Call</td><td>

<code>()</code>

</td><td>Function</td><td >1</td><td >^</td></tr><tr>
<td>Boolean Negation</td><td>

<code>!</code>

</td><td>Joolean</td><td >2</td><td >R to L</td></tr>
<tr><td>Numeric Negation</td><td>

<code>-</code>

</td><td>Number</td><td >2</td><td >^</td></tr>
<tr><td>Exponentiation</td><td>

<code>^</code>

</td><td>Number</td><td >2</td><td >^</td></tr>
<tr><td>Multiplication</td><td>

<code>\*</code>

</td><td>Number, List</td><td >3</td><td >L to R</td></tr>
<tr><td>Division</td><td>

<code>/</code>

</td><td>Number</td><td >3</td><td >^</td></tr>
<tr><td>Remainder</td><td>

<code>%</code>

</td><td>Number</td><td >3</td><td >^</td></tr>
<tr><td>Union</td><td>

<code>union</code>

</td><td>List, Set, Map</td><td >4</td><td >^</td></tr>
<tr><td>intersection</td><td>

<code>intersect</code>

</td><td>List, Set, Map</td><td >4</td><td >^</td></tr>
<tr><td>Addition</td><td>

<code>+</code>

</td><td>Number, List, Set, Map</td><td >4</td><td >^</td></tr>
<tr><td>Subtraction</td><td>

<code>-</code>

</td><td>Number</td><td >4</td><td >^</td></tr>
<tr><td>Less Than</td><td>

<code><</code>

</td><td>Number</td><td >5</td><td >None</td></tr>
<tr><td>Less Than or Equal</td><td>

<code><=</code>

</td><td>Number</td><td >5</td><td >^</td></tr>
<tr><td>Less Than or Equal</td><td>

<code><=</code>

</td><td>Number</td><td >5</td><td >^</td></tr>
<tr><td>Greater Than</td><td>

<code>></code>

</td><td>Number</td><td >5</td><td >^</td></tr>
<tr><td>Greater Than or Equal</td><td>

<code>>=</code>

</td><td>Number</td><td >5</td><td >^</td></tr>
<tr><td>Equality</td><td>

<code>==</code>

</td><td>Joolean, Number, String</td><td >6</td><td >^</td></tr>
<tr><td>Inequality</td><td>

<code>!=</code>

</td><td>Joolean, Number, String</td><td >6</td><td >^</td></tr>
<tr><td>Logical AND</td><td>

<code>&</code>

</td><td>Joolean</td><td >7</td><td >^</td></tr>
<tr><td>Logical OR</td><td>

<code>|</code>

</td><td>Number</td><td >8</td><td >^</td></tr>
<tr><td>Assignment</td><td>

<code>@</code>

</td><td>Joolean, Numbers, String, List, Map, Set, Object</td><td >9</td><td >R to L</td></tr>
</table>

## Examples

### Hello World

<table>
<tr> <th>JavaScript</th><th>Gullienne</th> </tr>
<tr>
<td>

<code>console.log(“You’re farming overheards again!”)</code>

</td>
<td>

<code>overheard(`You’re farming overheards again!`);</code>

</td> </tr> </table>

### Variable Binding

<table>
<tr> <th>JavaScript</th><th>Gullienne</th> </tr>
<tr>
<td>

<code>let overtime = true</code>

</td>
<td>

<code>overtime:joolean @ ideal;</code>

</td>
</tr>
<tr> <td>

<code>const hoursClocked = 900;</code>

</td>
<td>

<code>hoursClocked:NUMBER @ 900;</code>

</td> </tr> </table>

### Type Conversions

<table>
<tr> <th>JavaScript</th><th>Gullienne</th> </tr>
<tr>
<td>

<pre><code>let you = 21
let aString = String(you)</code></pre>

</td>
<td>

<pre><code>you:number @ 21;
aString:string @ mangle(you, string);</code></pre>

</td> </tr> </table>

### Loops

<table>
<tr> <th>JavaScript</th><th>Gullienne</th> </tr>
<tr><td>

<pre><code>let bob = 0

while (bob < 5) {
    bob++
	console.log(“Number of squids on floor: “ + bob)
}</code></pre>

</td><td>

<pre><code>bob:number @ 0;

noCap(bob < 5) {
	bob++;
    overheard(`Number of squids on floor:` + mangle(bob, string));
}</code></pre>

</td></tr>
<tr><td>

<pre><code>debt = [2, 3, 1, 5, 3]

for (hotChocolates in debt) {
	console.log(“I owe you “ + hotChocolates + " for this.”)
}</code></pre>

</td>
<td>

<pre><code>debt:[number] @ [2, 3, 1, 5, 3];

cap(hotChocolates in debt) {
	overheard(`I owe you ` + hotChocolates + ` for this.`);
}</code></pre>

</td> </tr> </table>

### Conditionals

<table>
<tr> <th>JavaScript</th><th>Gullienne</th> </tr>
<tr>
<td>

<pre><code>if (job == true) {
    console.log(“truthy”)
} else if (job ==  false) {
    console.log(“falsy”)
} else {
    console.log(“How did we get here?”)
}</code></pre>

</td>
<td>

<pre><code>so (job = ideal) {
    overheard(`true`);
} but (job = !ideal) {
    overheard(`false`);
} otherwise {
    overheard(`How did we get here?`);
}</code></pre>

</td> </tr> </table>

### Functions

<table>
<tr> <th>JavaScript</th><th>Gullienne</th> </tr>
<tr>
<td>

<pre><code>function jsAddFunction(bob, job) {
	return bob + job
}</code></pre>

</td>
<td>

<pre><code>do:number gluAddFunction(bob:number, job:number) {
	howItBe bob + job;
}</code></pre>

</td> </tr> </table>
