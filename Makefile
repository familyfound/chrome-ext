
default: build
	@:

build: index.js chrome-ext.css template.js todo-tpl.js
	@echo "Component"
	@component build --dev
	cp build/build.js ext/src/inject/inject.js && cp build/build.css ext/src/inject/inject.css

todo-tpl.js: todo-tpl.html
	@component convert $<

todo-tpl.html: todo.jade
	@jade -P < $< > todo-tpl.html

template.html: template.jade
	@jade -P $<

template.js: template.html
	@component convert $<

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

.PHONY: clean
