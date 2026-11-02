installs =	install-all \
						install-app \
						install-buffers \
						install-device \
						install-host \
						install-radiostack \
						install-serialvote

builds = 		build-app \
						build-device \
						build-host

.PHONY: help $(installs) install $(builds) build test

help:
	@echo "make <command>"
	@echo "install: setup the environment and install dependencies"
	@echo "help: display this message"
	@echo "test: run automated tests where applicable"

build: $(builds)

install: $(installs)

test:
	npm --prefix buffers run pxt test

install-all:
	npm install

install-app: install-all
	npm --prefix app install

install-buffers: install-all
	npm --prefix buffers install
	npm --prefix buffers run pxt install

install-device: install-all
	npm --prefix device install
	npm --prefix device run mkc install

install-host: install-all
	npm --prefix host install
	npm --prefix host run mkc install

install-radiostack: install-all
	npm --prefix radiostack install
	npm --prefix radiostack run mkc install

install-serialvote: install-all
	npm --prefix serialvote install
	npm --prefix serialvote run mkc install

build-app:
	npm --prefix app run build

build-device:
	npm --prefix device run mkc build

build-host:
	npm --prefix host run mkc build
