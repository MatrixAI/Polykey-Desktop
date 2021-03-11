module.exports = {
  purge: ['./src/**/*.vue'],
  theme: {
    fontFamily: {
      nunito: ['Nunito Sans', 'sans-serif'],
      opensans: ['Open Sans', 'sans-serif'],
      robotomono: ['Roboto Mono', 'monospace']
    },
    extend: {
      colors: {
        // Grey
        grey1: '#FFFFFF',
        grey2: '#FDFEFF',
        grey3: '#FAFAFA',
        grey4: '#E7E9F2',
        grey5: '#E8F0F0',
        grey6: '#EEEFF2',
        grey7: '#2C3531',
        grey8: '#F7F9FC',

        // Primary
        primary1: '#116466',
        primary1b: '#167577',
        primary2: '#289295',
        primary3: '#7BBBBC',
        primary4: '#D1E8E2',

        // Semantic
        sematic1: '#F15446',
        sematic1b: '#fdf7f7',

        // Content tones
        content1: '#1F211B',
        content2: '#7F88A5',
        content3: '#C2C9DF',
        content4: '#E4E9F2',
        content5: '#D1E8E2',
        content6: '#7F88A5',

        'list-border': '#95A1C3'
      },
      height: {
        '20vh': '20vh',
        '30vh': '30vh',
        '70vh': '70vh',
        '80vh': '80vh',
        header: '42px',
        search: '29px',
        action: '12px',
        'large-input': '34px'
      },
      borderRadius: {
        p2: '2px'
      },
      boxShadow: {
        p1: '0px 4px 15px rgba(0, 0, 0, 0.05)',
        p2: '0px 4.36842px 5.46053px 5.46053px rgba(228, 233, 242, 0.25);'
      },
      fontSize: {
        xxs: '10px'
      },
      width: {
        search: '96vw'
      },
      transitionProperty: {
        width: 'width'
      },
      zIndex: {
        '-10': '-10'
      },
      top: {
        '30': '30px'
      }
    }
  },
  variants: {},
  plugins: []
};
