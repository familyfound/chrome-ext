
default: build
	@:

build: index.js chrome-ext.css template.js
	@echo "Component"
	@component build --dev
	cp build/build.js ext/src/inject/inject.js && cp build/build.css ext/src/inject/inject.css

template.html: template.jade
	@jade -P $<

template.js: template.html
	@component convert $<

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

# open browser correctly in mac or linux
UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Linux)
		open := google-chrome
endif
ifeq ($(UNAME_S),Darwin)
		open := open
endif

example:
	@${open} test/example.html

.PHONY: clean example
