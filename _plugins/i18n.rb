module Jekyll
  module I18nFilter
    def t(input, lang = nil)
      lang ||= @context.registers[:page]['lang'] || @context.registers[:site].config['default_lang'] || 'en'

      keys = input.split('.')
      result = @context.registers[:site].data

      # Try language-specific path first
      keys.each do |key|
        if result.is_a?(Hash)
          # Try localized version first
          if key == keys.first && result.key?(key) && result[key].is_a?(Hash) && result[key].key?(lang)
            result = result[key][lang]
            keys = keys.drop(1)
            break
          else
            result = result[key]
          end
        else
          return input
        end
      end

      # Navigate remaining keys
      keys.each do |key|
        if result.is_a?(Hash) && result.key?(key)
          result = result[key]
        else
          return input
        end
      end

      result.is_a?(String) ? result : input
    end
  end
end

Liquid::Template.register_filter(Jekyll::I18nFilter)
