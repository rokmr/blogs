.PHONY: help install update serve run clean dev

# Default target - show help
help:
	@echo "📚 Jekyll Blog - Makefile Commands"
	@echo ""
	@echo "🚀 Quick Start:"
	@echo "  make serve      - Setup everything & run dev server"
	@echo "  make run        - Same as serve (alias)"
	@echo ""
	@echo "Other commands:"
	@echo "  make install    - Install dependencies only"
	@echo "  make update     - Update dependencies"
	@echo "  make clean      - Clean generated files"
	@echo ""
	@echo "🌐 Server runs at: http://localhost:4000"
	@echo ""

# Auto-setup Ruby if needed (internal target)
_setup-ruby-if-needed:
	@if ! command -v ruby &> /dev/null || [ "$$(ruby -e 'puts RUBY_VERSION.split(".")[0].to_i' 2>/dev/null || echo 0)" -lt 3 ]; then \
		echo "⚠️  Ruby 3.0+ required. Current: $$(ruby --version 2>/dev/null || echo 'not found')"; \
		echo ""; \
		echo "🔧 Auto-installing Ruby 3.3.6 via rbenv..."; \
		echo ""; \
		if ! command -v rbenv &> /dev/null; then \
			echo "📥 Installing rbenv..."; \
			brew install rbenv ruby-build || { echo "❌ Failed to install rbenv. Install manually: brew install rbenv"; exit 1; }; \
			echo 'eval "$$(rbenv init - zsh)"' >> ~/.zshrc; \
			eval "$$(rbenv init - zsh)"; \
		fi; \
		echo "📥 Installing Ruby 3.3.6..."; \
		rbenv install 3.3.6 --skip-existing || { echo "❌ Failed to install Ruby"; exit 1; }; \
		rbenv local 3.3.6; \
		eval "$$(rbenv init - zsh)"; \
		rbenv rehash; \
		echo ""; \
		echo "✅ Ruby 3.3.6 installed!"; \
		echo ""; \
	fi

# Install dependencies
install: _setup-ruby-if-needed
	@echo "📦 Installing dependencies..."
	@if ! command -v bundle &> /dev/null; then \
		echo "📥 Installing bundler..."; \
		gem install bundler; \
	fi
	@bundle install
	@echo "✅ Dependencies installed!"

# Update dependencies
update: _setup-ruby-if-needed
	@echo "🔄 Updating dependencies..."
	@if ! command -v bundle &> /dev/null; then \
		echo "📥 Installing bundler..."; \
		gem install bundler; \
	fi
	@bundle update
	@echo "✅ Dependencies updated!"

# Run local development server (handles everything automatically)
serve: _setup-ruby-if-needed
	@echo "📦 Checking dependencies..."
	@if ! command -v bundle &> /dev/null; then \
		echo "📥 Installing bundler..."; \
		gem install bundler; \
	fi
	@if [ ! -f "Gemfile.lock" ]; then \
		echo "📥 Installing gems (first time)..."; \
		bundle install; \
	else \
		echo "✅ Dependencies OK"; \
	fi
	@echo ""
	@echo "🚀 Starting Jekyll dev server..."
	@echo ""
	@echo "🌐 Open in browser:"
	@echo "   → http://localhost:4000"
	@echo ""
	@echo "Press Ctrl+C to stop"
	@echo ""
	@bundle exec jekyll serve --baseurl "" --livereload

# Alias for serve
run: serve

# Development command (same as serve)
dev: serve

# Clean generated files
clean:
	@echo "🧹 Cleaning generated files..."
	@if command -v bundle &> /dev/null; then \
		bundle exec jekyll clean; \
	else \
		rm -rf _site .jekyll-cache .jekyll-metadata; \
	fi
	@echo "✅ Cleaned!"
