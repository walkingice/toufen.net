all:
	@echo make server # run hexo server
	@echo make generate # generate posts
	@echo make theme# editing theme

server:
	./node_modules/.bin/hexo s

generate:
	./node_modules/.bin/hexo g

files := public/index.html public/*/index.html
theme:
	touch public/css/style.css
	rm public/css/style.css
	touch $(files)
	rm $(files)
	./node_modules/.bin/hexo generate
