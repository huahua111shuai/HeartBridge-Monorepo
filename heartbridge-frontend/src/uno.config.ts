import {
    defineConfig,
    presetUno,
    presetAttributify,
    presetIcons,
    presetTypography,
    transformerDirectives,
    transformerVariantGroup,
} from 'unocss'

export default defineConfig({
    presets:,
    transformers:,
    theme: {
        colors: {
            primary: '#0066FF',
            apple: {
                gray: '#f5f5f7',
                blue: '#007AFF',
            }
        },
        fontFamily: {
            sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }
    },
    shortcuts: {
        'flex-center': 'flex justify-center items-center',
        'glass': 'bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-white/20 dark:border-white/10',
    }
})