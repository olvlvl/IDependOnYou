# IDependOnYou <3

**IDependOnYou** is a very bare approach to JavaScript asynchronous module definition, also known
as [AMD][]. An approach so bare that it only resolves the dependencies between what you define
and what you require. It does not fetch code from the server, nor does it manipulates it in cool
ways. In other words, it's not a stunning replacement for [RequireJS][].

"Why bother then ?" you ask yourself, well because the following code produces a very unexpected
result with [RequireJS][]:

```js
define('one', function() {

	alert('here0')

	return 'one'

})

define('two', [ 'one' ], function(one) {

	alert('here1')

	return 'two'

})

define([ 'two' ], function(two) {

	alert('here2')

})

document.addEventListener('DOMContentLoaded', function() {

	alert('here3')

})
```

http://jsfiddle.net/olvlvl/z9jPn/

You see [RequireJS][] resolves dependencies once the document is ready, not when dependencies are
available. Thus instead of alerts popping "here0", "here1", "here2", "here3"; "here3" pops first.

That's a shame because since the dependency requirements are met I expected my code to work
properly. More over, waiting for `domready` is a deal breaker for [Brickrouge][] since the
event is used to construct custom elements, and because its handler is executed before
[RequireJS][]'s one, the constructors defined using `define()` fail miserably.

Since I didn't care about loading code from the server, I decided to write my own little piece
of code. That's ~1ko once compressed.





## Is IDependOnYou suitable for your project ?

Between [Brickrouge][] and [Icybee][], I use a lot of JavaScript to power custom elements which I
create using PHP classes. When these elements are rendered the required JavaScript and CSS assets
are collected and automatically added to the document, thus I rarery require code from the server,
and when I do [Brickrouge][] is here to help, and it supports JavaScript as well as CSS assets.

So, if like me your code is already available when you need it, or you have your own means to fetch
it from the server, and you just need something to keep things in order, **IDependOnYou** might be
for you too.





## Usage

Include `idependonyou.js` before the code you want to define/require. As with [RequireJS][]
you use `define(id, dependencies?, factory)` to define something and
`define(dependencies, factory)` to require dependencies. `define.amd.engine` equals
"IDependOnYou" if **IDependOnYou** is used. A `IDependOnYou` variable is available as well.

Using **IDependOnYou** with the previous example finally produces the expected results:

http://jsfiddle.net/olvlvl/szJzL/





## License

The module is licensed under the MIT License - See the [LICENSE](LICENSE) file for details.





[AMD]: http://en.wikipedia.org/wiki/Asynchronous_module_definition
[Brickrouge]: http://brickrouge.org/
[Icybee]: http://icybee.org/
[RequireJS]: http://requirejs.org/