build:
	npm install -g typescript; \
	tsc --project lib/CodeBuilder; \
	bash tools/fetchEvents.sh; \
	bundle exec jekyll build;