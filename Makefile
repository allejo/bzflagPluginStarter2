build:
	node_modules/.bin/tsc --project lib/CodeBuilder; \
	node_modules/.bin/babel assets/js/ -d build; \
	bash tools/fetchEvents.sh; \
	bundle exec jekyll build;