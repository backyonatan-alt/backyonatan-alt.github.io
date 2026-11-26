# python3 build.py -> draft.html (prototype, self-contained; not yet a site page)
import os
D = os.path.dirname(os.path.abspath(__file__))
rd = lambda f: open(D + '/' + f, encoding='utf-8').read()
html = rd('page.html').replace('/*MAP*/null', rd('map.json')).replace('/*DATA*/null', rd('data.json'))
open(D + '/draft.html', 'w', encoding='utf-8').write(html)
print('draft.html', len(html) // 1024, 'KB')
