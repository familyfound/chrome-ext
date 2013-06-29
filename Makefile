
default: build
	@:

zip: build
	@rm -rf ext.zip
	@zip -r ext.zip ext

build-dev: index.js
	@echo "Component"
	@component build -s familyfound -o ext/src/inject -n inject --dev

build: index.js
	@echo "Component"
	@component build -s familyfound -o ext/src/inject -n inject

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

.PHONY: clean
