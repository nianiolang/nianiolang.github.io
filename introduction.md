---
layout: default
title: Introduction to NianioLang
---

# Introduction to NianioLang

After reading this introduction you should be able to start writing programs in NianioLang using interactive editor.

We focus on distinctive features of the language.

### Interactive editor

You can try NianioLang inside Chrome browser at [](http://www.atinea.pl/kolko/nl/nl.html) (Chrome only at the moment)

There are a few buttons in Polish:

    Sprawdź   -> Check
    Uruchom   -> Run
    Zrób krok -> Step
    Edytuj    -> Edit
    Biegnij / Czekaj -> Run / Wait

So we have a few *todos* that will be noted throughout this document. You are most welcome to help. Each todo has some size estimation:

    TODO: move interactive editor to github (small).
    TODO: fix IE and Firefox issues (small).

### Hello World

    use console;
    
    def test::main() {
    	console::print('Cześć!');
    }

Functions are either private or public. Public functions are prefixed with the module name. There are no magic identifier resolution rules. Either you call a private function inside your module or a public function. If you call a public function from within its module then you are still required to prefix it with the module name.

We do not want any magic in NianioLang. Or at least we fight hard to keep the magic as controlled as possible. Report all uncontrolled magic to us with suggested remedy.

### Let's draw something

	def test::drawing() {
		return [
			{shape => :circle({p => {x => 4, y => 4}, r => 4}), color => '@'},
			{shape => :rect({p1 => {x => 3, y => 2}, p2 => {x => 7, y => 6}}), color => '^'},
			{shape => :rect({p1 => {x => 5, y => 4}, p2 => {x => 8, y => 6}}), color => '+'}
		];
	}

As you can see drawing in NianioLang is easy. What you can also notice in our interactive editor at http://www.atinea.pl/kolko/nl/nl.html is that PrettyPrinter requires some minor fixes when handling multiline expressions. You are very welcome to fork and pull request with necessary fixes.

    TODO: repair PrettyPrinter (medium).

Each value is called **im** in NianioLang. There are 4 types of im values in NianioLang:

1. **Simple**. It's just an array of bytes. You can use them as strings, numbers, UTF-8 encoded unicode strings. It is important to notice that it's operation that defines how a simple type is treated. `34` and `'34'` are exactly the same values. In our example coordinate and radius are simple values and color is a simple value.
2. **Array**. It's just an array and you declare it with square brackets and commas. In the example, our drawing is an array of elements.
3. **Record**. It can be a record with fields or a hash or a dictionary. Conceptually this is a *simple* to *im* mapping. In the example elements are records of shape and color. Point is a record with `x` and `y` coordinates.
4. **Variant**. It is a label (simple) and an optional im value. With define it with color, identifier and optional *im* value in parenthesizes. In the example shapes are defined using variants. Each shape is either `:rect` or `:circle`. Each shape has a different set of attributes, which are defined as records.

### Rendering engine

Our drawing is beautiful and we quickly embrace the expressiveness of NianioLang, but... Having some non-programming friends, we would like to impress them with our art as well. This is why we need to create a rendering engine for humans:

	def test::render(w, h, d) {
		rep var y (h) {
			rep var x (w) {
				var color = '.';
				fora var elem (d) {
					if (inside_shape({x => x, y => y}, elem->shape)) {
						color = elem->color;
					}
				}
				console::print(color);
			}
			console::println();
		}
	}

We have a function that takes 3 arguments - width, height and drawing. `rep` is a loop from `0` to `n-1`. There is a C like `for` as well but 90% of loops are `0..n-1`. This shows how we would like NianioLang to develop. NianioLang is not a derivation of an idea. It is a derivation of use-cases with a very strong idea in it's core. So we have a `rep` because it was widely used. `fora` is a for-each loop for arrays. Yes - there is `forh` as well for hashes - `forh var key, var value (hash)`.

As you can see, there is also an extensive IO library, suitable for drawing ;) Do not try to apply arguments to `println` though.

This was easy, but we are missing `inside_shape` function. And here the tricky part begins:

	def inside_shape(p, shape) {
		match (shape) case :rect(var r) {
			return p->x >= r->p1->x && p->y >= r->p1->y && p->x < r->p2->x && p->y < r->p2->y;
		} case :circle(var c) {
			c->p->x -= p->x;
			c->p->y -= p->y;
			return c->p->x * c->p->x + c->p->y * c->p->y <= c->r * c->r;
		}
	}

If you are familiar with C or Java only then your mind might explode if you see a `match` instruction. This is a special branching instruction for variants. It does two thing - one is branching based on variant label and the second one if extraction of the value from variant.

There is a second tricky element in the circle branch demonstrated. See these two ugly assignment instructions?

		c->p->x -= p->x;
		c->p->y -= p->y;

Of course we should have declared two new variable, but this assignment is important to demonstrate two core elements of NianioLang:

1. All arguments are passed by values. So in this example we do not modify the basic shape.
2. We can use complex LValues to modify variables. Here we modify `c` variable twice.

**What is LValue?** LValue is an expression that we can read from or write to (get value or set value). Take a look at how `c->p->x` expression is treated differently:

* `f(c->p->x)` - we read from the expression, in particular from the `c` variable.
* `c->p->x = 4` - we write to the expression, in particular we modify `c` variable.
* `c->p->x += 1` - we do both - read and write. First we read, then we do computation and then we write modifying the `c` variable.

What is a difference between Java / C and NianioLang LValues and why are they so cool?

In C language you can write `c->p->x = 3`. But LValue is always a pointer. So in this example you do not modify c variable. Rather you modify a memory region designated by `&c->p->x`. This is similar in Java. In NianioLang there are no pointers. So LValue always points to the base variable. If you modify `c` then you do not modify the underlying shape or drawing.

    TODO: better explain the difference and power of NianioLang LValues :)

Now we are ready to write the main function:

	def test::main() {
		var drawing = test::drawing();
		test::render(10, 10, drawing);
	}

And test the program.

### No references, no pointers, no global variables. How can we live without them?

Let's say we would like to translate our drawing. Here is how we can do this:

	use array;
	
	def translate_point(ref p, vec) {
		p->x += vec->x;
		p->y += vec->y;
	}
	
	def translate_shape(ref s, vec) {
		match (s) case :rect(var r) {
			translate_point(ref r->p1, vec);
			translate_point(ref r->p2, vec);
			s = :rect(r);
		} case :circle(var c) {
			translate_point(ref c->p, vec);
			s = :circle(c);
		}
    }
	
	def translate_drawing(ref d, vec) {
		rep var i (array::len(d)) {
			translate_shape(ref d[i]->shape, vec);
		}
	}

	def test::main() {
		var drawing = test::drawing();
		test::render(10, 10, drawing);
		console::println();
		translate_drawing(ref drawing, {x => 1, y => 2});
		test::render(10, 10, drawing);
	}

We need to add `use array` to get access to `array::len`. We can pass any LValue as a `ref` argument. This works as input/output arguments. First we extract the value from LValue, pass it to the function, take result and then modify the original variable back. This allows for having value semantics for all arguments and at the same time have a very convenient syntax for modifying complex variables. Take a look at how our drawing is destructed all the way down to `translate_point` and then new im is constructed all the way up at the function exit.

	TODO: consider adding fora ref x (arr) and match (x) case :e(ref z) to the language
	TODO: consider adding array::len operator to the language

### Summary

In the part 1 we explained the basic NianioLang syntax. In particulate we have shown the following not so common features, that are core to NianioLang:

* im value system (simple / record / array / variant)
* Variant type and match instruction
* Value semantics for all operations
* Complex LValues and ref function arguments

Now you are ready to learn the type system of NianioLang.

### Final program

	use console;
	use array;

	def test::drawing() {
		return [
			{shape => :circle({p => {x => 4, y => 4}, r => 4}), color => '@'},
			{shape => :rect({p1 => {x => 3, y => 2}, p2 => {x => 7, y => 6}}), color => '^'},
			{shape => :rect({p1 => {x => 5, y => 4}, p2 => {x => 8, y => 6}}), color => '+'}
		];
	}

	def inside_shape(p, shape) {
		match (shape) case :rect(var r) {
			return p->x >= r->p1->x && p->y >= r->p1->y && p->x < r->p2->x && p->y < r->p2->y;
		} case :circle(var c) {
			c->p->x -= p->x;
			c->p->y -= p->y;
			return c->p->x * c->p->x + c->p->y * c->p->y <= c->r * c->r;
		}
	}

	def test::render(w, h, d) {
		rep var y (h) {
			rep var x (w) {
				var color = '.';
				fora var elem (d) {
					if (inside_shape({x => x, y => y}, elem->shape)) {
						color = elem->color;
					}
				}
				console::print(color);
			}
			console::println();
		}
	}

	def translate_point(ref p, vec) {
		p->x += vec->x;
		p->y += vec->y;
	}

	def translate_shape(ref s, vec) {
		match (s) case :rect(var r) {
			translate_point(ref r->p1, vec);
			translate_point(ref r->p2, vec);
			s = :rect(r);
		} case :circle(var c) {
			translate_point(ref c->p, vec);
			s = :circle(c);
		}
	}

	def translate_drawing(ref d, vec) {
		rep var i (array::len(d)) {
			translate_shape(ref d[i]->shape, vec);
		}
	}

	def test::main() {
		var drawing = test::drawing();
		test::render(10, 10, drawing);
		console::println();
		translate_drawing(ref drawing, {x => 1, y => 2});
		test::render(10, 10, drawing);
	}
	
