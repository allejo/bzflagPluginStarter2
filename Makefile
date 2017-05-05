build:
	npm install -g typescript; \
	tsc --project lib/CodeBuilder; \
	bundle install; \
	bundle exec jekyll build;