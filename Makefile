install:
	npm install

build:
	rm -rf dist
	NODE_ENV=development npm run build

dev:
	npm run nodemon -- --watch .  --ext '.js' --exec npm run gulp -- development

dev-debug:
	DEBUG=sequelize:* npm run nodemon -- --watch .  --ext '.js' --exec npm run gulp -- development

prod:
	npm start

test:
	npm test

test-watch:
	npm test -- --watchAll

test-coverage:
	npm test -- --coverage

lint:
	npm run eslint .

clean:
	rm -rf dist

.PHONY: test
