
default: build-dev
	@:

zip: build
	@rm -rf ext.zip
	@zip -r ext.zip ext

build: build-main build-settings

build-dev: build-main-dev build-settings

build-main-dev: index.js
	@echo "Component"
	@component build -s familyfound -o ext/src/inject -n inject --dev

build-main: index.js
	@echo "Component"
	@component build -s familyfound -o ext/src/inject -n inject

build-settings: settings/index.js settings/settings.css
	@cd settings && component build -s settings -o ../ext/src/options_custom/ -n settings

components: component.json
	@component install --dev

clean:
	rm -fr ext/src/options_custon/settings.* ext/src/inject/inject.* components template.js

# open browser correctly in mac or linux
UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Linux)
		open := google-chrome
endif
ifeq ($(UNAME_S),Darwin)
		open := open
endif

.PHONY: clean
