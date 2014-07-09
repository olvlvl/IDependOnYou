test: node_modules
	@npm test

node_modules:
	@npm install

clean:
	rm -Rf node_modules