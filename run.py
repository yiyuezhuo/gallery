# -*- coding: utf-8 -*-
"""
Created on Sun May  1 23:26:33 2016

@author: yiyuezhuo
"""

import core
import sys

if len(sys.argv)>1 and sys.argv[1]=='page':
    import webbrowser
    webbrowser.open('http://localhost:5000/')
    core.page_mode=True
    core.app.run(debug=False)
else:
    core.app.run(debug=True)