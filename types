---
layout: default
title: Type System
---

### NianioLang type system

We have implemented some drawing engine in the previous chapter. Now we can define types used in this module to allow for more control during code development:

    use ptd;
    
    def test::point_t() {
    	return ptd::rec({x => ptd::sim(), y => ptd::sim()});
    }
    
    def test::shape_t() {
    	return ptd::var({
    			circle => ptd::rec({p => @test::point_t, r => ptd::sim()}),
    			rect => ptd::rec({p1 => @test::point_t, p2 => @test::point_t})
    		});
    }
    
    def test::drawing_t() {
    	return ptd::arr(ptd::rec({shape => @test::shape_t, color => ptd::sim()}));
    }

As you can see NianioLang syntax is powerful enough to define types without special syntax. The only new syntax element is `@` operator which creates an im with module name and function name. So `@m::f` is equivalent to `:ref({module => 'm', name = 'f'})` . The `@` operator has two advantages over manual `:ref` construction:

1. It is shorter
2. It reports an error when function is missing

So once we understand `@` operator we can explain the type system. Types are defined using functions from `ptd` module. Each type is an `im`.

    todo: add ptd module to online editor so we can show types and not only use them.

There are several functions in ptd module:

    ptd::sim() - returns a simple type
    ptd::arr(type)
    ptd::rec(hash)
    ptd::hash(type)
    ptd::var(hash)
    ptd::none() - used with ptd::var to declare a variant element without value
   
If we would like to define a name for a type then we declare a function which returns the type. Then the function name becomes the type name and we can use it with `@` operator.

We have already defined types in our example. Now we can use them. Modify the following lines:

    def test::drawing() : @test::drawing_t {

    def inside_shape(p, shape : @test::shape_t) {

    def test::render(w, h, d : @test::drawing_t) {

And that's all. The compiler will be able to deduct all required types to meet these constraints.

### Types are optional in NianioLang

NianioLang has fully optional types. It means that we can remove all type information and semantics of the program remains unchanged. Still if a variable is declared with a type then it is guaranteed to meet this type requirements. So typed variable can easily be passed as untyped arguments, but not the other way.

### Final example with types:

    use console;
    use array;
    use ptd;
    
    def test::point_t() {
    	return ptd::rec({x => ptd::sim(), y => ptd::sim()});
    }
    
    def test::shape_t() {
    	return ptd::var({
    			circle => ptd::rec({p => @test::point_t, r => ptd::sim()}),
    			rect => ptd::rec({p1 => @test::point_t, p2 => @test::point_t})
    		});
    }
    
    def test::drawing_t() {
    	return ptd::arr(ptd::rec({shape => @test::shape_t, color => ptd::sim()}));
    }
    
    def test::drawing() : @test::drawing_t {
    	return [
    		{shape => :circle({p => {x => 4, y => 4}, r => 4}), color => '@'},
    		{shape => :rect({p1 => {x => 3, y => 2}, p2 => {x => 7, y => 6}}), color => '^'},
    		{shape => :rect({p1 => {x => 5, y => 4}, p2 => {x => 8, y => 6}}), color => '+'}
    	];
    }
    
    def inside_shape(p, shape : @test::shape_t) {
    	match (shape) case :rect(var r) {
    		return p->x >= r->p1->x && p->y >= r->p1->y && p->x < r->p2->x && p->y < r->p2->y;
    	} case :circle(var c) {
    		c->p->x -= p->x;
    		c->p->y -= p->y;
    		return c->p->x * c->p->x + c->p->y * c->p->y <= c->r * c->r;
    	}
    }
    
    def test::render(w, h, d : @test::drawing_t) {
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
