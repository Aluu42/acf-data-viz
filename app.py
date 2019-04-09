from flask import Flask, render_template, request, redirect, jsonify, \
    url_for, flash

import random
import string
import logging
import json
import httplib2
import requests
import pandas as pd
import math
import numpy as np
from bokeh.sampledata import us_states
from bokeh.plotting import *
from bokeh.embed import components
from bokeh.resources import INLINE


us_states = us_states.data.copy()
del us_states["HI"]
del us_states["AK"]
scholarships = pd.read_csv("data.csv")
scholarships.fillna(0)

app = Flask(__name__)

def generateMap():

    state_xs = [us_states[code]["lons"] for code in us_states]
    state_ys = [us_states[code]["lats"] for code in us_states]

    p = figure(title="Plotting Schools",
               toolbar_location="left", plot_width=1100, plot_height=700)

    p.patches(state_xs, state_ys, fill_alpha=0.0,
        line_color="#884444", line_width=1.5)

    scholarships['Longitude'] = scholarships['Longitude'].apply(lambda x: -1*float(str(x).split(' ')[0]))
    scholarships['Latitude'] = scholarships['Latitude'].apply(lambda x: float(str(x).split(' ')[0]))

    x = scholarships['Longitude'].values
    y = scholarships['Latitude'].values

    p.circle(x, y, size=8, color='navy', alpha=1)
    # output_file("map.html")
    # show(p)

    return p


@app.route('/')
def default():
    p = generateMap()
    js_resources = INLINE.render_js()
    css_resources = INLINE.render_css()

    script, div = components(p)

    return render_template("map.html", script=script, div=div, js_resources=js_resources, css_resources=css_resources)

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=8000)