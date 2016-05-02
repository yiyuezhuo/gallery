# -*- coding: utf-8 -*-
"""
Created on Sun May  1 22:27:46 2016

@author: yiyuezhuo
"""

from flask import Flask,render_template,send_from_directory,request
import os
import json
import sys

CUR_DIR = os.path.realpath(os.path.dirname(__file__))

static_folder_root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app")

#TODO wait to wrap
var_setting={'map_path':''}

page_mode=False

def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()



app = Flask(__name__,template_folder=os.path.join(CUR_DIR,'app'))

@app.route('/js/<path:path>')
def static_js(path):
    return send_from_directory(os.path.join(static_folder_root,'js'),path,cache_timeout = 0)
    
@app.route('/css/<path:path>')
def static_css(path):
    return send_from_directory(os.path.join(static_folder_root,'css'),path,cache_timeout = 0)

@app.route('/image/<path:path>')
def static_image(path):
    return send_from_directory(os.path.join(static_folder_root,'image'),path,cache_timeout = 0)
    
@app.route('/map/<path:path>')
def map_image(path):
    print(path)
    map_path=var_setting['map_path']
    #return send_from_directory(map_path,path)#remove cache_timeout to speed test
    return send_from_directory(map_path,path,cache_timeout = 0)

@app.route('/allImagePath.json',methods=['GET','POST'])
def all_image():
    #test_request(request)
    data=json.loads(request.data.decode('utf8'))
    #print(request.data.decode('utf8'))
    map_path=data['map_path']
    var_setting['map_path']=map_path
    pass_type=['png','jpg','bmp','gif']
    listdir=['map/'+name for name in os.listdir(map_path) if name.split('.')[-1].lower() in pass_type]
    return json.dumps(listdir)


@app.route('/index.html')
def index():
    return render_template('index.html')
    
@app.route('/')
def index2():
    return render_template('index.html')
    
@app.route('/exit',methods=['GET','POST'])
def _exit():
    if page_mode:
        shutdown_server()
        #app.run
        #sys.exit()
    

def test_request(request):
    print('request.data')
    print(request.data)
    print('request.get_json()')
    print(request.get_json())
    #form=request.get_json()
    print('--------------')
    print('request.form')
    print(request.form)
    #print(type(request.form))
    print('request.args')
    print(request.args)
    print('request')
    print(request)
    print('request.values')
    print(request.values)
    print('request.path')
    print(request.path)
    form=dict(request.form)
    print('dict(request.form)')
    print(form)
    #ugly hack,what the fuck d3.js and flask
    #form=json.loads(list(dict(request.form).keys())[0])
    #print('form')
    #print(form)
    #rd=php['system'].solve(form)
    #print('rd')
    #print(rd)
