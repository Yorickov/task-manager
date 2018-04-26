install:
	npm install

build:
	rm -rf dist
	npm run build

dev:
	DEBUG=app* npm run nodemon -- --watch .  --ext '.js' --exec npm run gulp -- server

prod:
	DEBUG=sequelize* npm start

test:
	DEBUG=app* npm test

test-w:
	npm test -- --watchAll

lint:
	npm run eslint .

clean:
	rm -rf dist

.PHONY: test
