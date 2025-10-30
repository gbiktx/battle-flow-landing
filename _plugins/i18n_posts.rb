module Jekyll
  class I18nPostGenerator < Generator
    safe true
    priority :low

    def generate(site)
      site.posts.docs.each do |post|
        # Only process posts that have a post_id
        next unless post.data['post_id']

        post_id = post.data['post_id']

        # Get all available languages
        languages = site.config['languages'] || ['en']

        # Generate a page for each language
        languages.each do |lang|
          # Skip English since the original post already serves it
          next if lang == 'en'

          # Check if translation exists
          translation_data = site.data.dig('posts', post_id, lang)
          next unless translation_data

          # Create a new document for this language
          i18n_post = I18nPost.new(site, post, lang, translation_data)
          site.pages << i18n_post
        end
      end
    end
  end

  class I18nPost < Page
    def initialize(site, original_post, lang, translation_data)
      @site = site
      @base = site.source
      @dir = "#{lang}/blog"
      @name = "#{original_post.data['post_id']}.html"

      self.process(@name)

      # Initialize data hash
      self.data = {}

      # Copy metadata from original post
      self.data['layout'] = 'post'
      self.data['lang'] = lang
      self.data['post_id'] = original_post.data['post_id']
      self.data['date'] = original_post.date
      self.data['author'] = original_post.data['author']
      self.data['categories'] = original_post.data['categories']
      self.data['tags'] = original_post.data['tags']
      self.data['reading_time'] = original_post.data['reading_time']

      # Use translated content
      self.data['title'] = translation_data['title']
      self.data['description'] = translation_data['description']

      # Set permalink
      self.data['permalink'] = "/#{lang}/blog/#{original_post.data['post_id']}/"

      # Convert markdown content to HTML
      if translation_data['content']
        converter = site.find_converter_instance(Jekyll::Converters::Markdown)
        self.content = converter.convert(translation_data['content'])
      end

      # Add alternate language links for SEO
      self.data['alternate_languages'] = {}
      site.config['languages'].each do |other_lang|
        if other_lang == 'en'
          self.data['alternate_languages'][other_lang] = "/blog/#{original_post.data['post_id']}/"
        else
          self.data['alternate_languages'][other_lang] = "/#{other_lang}/blog/#{original_post.data['post_id']}/"
        end
      end
    end
  end
end
