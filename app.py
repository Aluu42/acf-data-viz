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
from bokeh.models import *
from us_state_abbrev import *

us_states = us_states.data.copy()
del us_states["HI"]
del us_states["AK"]
us_states = dict([(us_state_abbrev[key], value) for key, value in us_states.items()])

app = Flask(__name__)
def cleanScholarshipData():

    scholarships = pd.read_csv("data_with_states.csv")
    scholarships.dropna(axis=0, how='any', thresh=None, subset=None, inplace=False)
    top = 49.3457868 # north lat
    left = -124.7844079 # west long
    right = -66.9513812 # east long
    bottom =  24.7433195 # south lat

    scholarships['Longitude'] = scholarships['Longitude'].apply(lambda x: -1*float(str(x).split(' ')[0]))
    scholarships['Latitude'] = scholarships['Latitude'].apply(lambda x: float(str(x).split(' ')[0]))
    scholarships['GrantAmt'] = scholarships['GrantAmt'].apply(lambda x: float(str(x)[1:].replace(',', '')))


    scholarships = scholarships[scholarships['Longitude'] > left]
    scholarships = scholarships[scholarships['Longitude'] < right]
    scholarships = scholarships[scholarships['Latitude'] > bottom]
    scholarships = scholarships[scholarships['Latitude'] < top]

    scholarshipsAgg = scholarships.groupby(['Institution', 'Latitude', 'Longitude', 'State']).agg({"GrantAmt": ["sum", "count"]}).reset_index()

    scholarshipsAgg.columns = ['Institution', 'Latitude', 'Longitude', 'State', 'GrantAmtSum', 'GrantAmtCount']
    print(scholarshipsAgg.head(5))
    return scholarshipsAgg


def generateMap():

    state_xs = [us_states[code]["lons"] for code in us_states]
    state_ys = [us_states[code]["lats"] for code in us_states]

    scholarships = cleanScholarshipData()
    stateTotals = scholarships.groupby(['State'])[["GrantAmtSum"]].sum().reset_index()


    source = ColumnDataSource(data=dict(
        x=scholarships['Longitude'].values,
        y=scholarships['Latitude'].values,
        school=scholarships['Institution'],
        grantAmt = scholarships['GrantAmtSum'],
        grantCnt = scholarships['GrantAmtCount']
    ))


    p = figure(title="Plotting Schools",
               toolbar_location="left", plot_width=1000, plot_height=750)


    color_palette = ['#abcafc', '#5a92ed', '#3468bc']
    state_colors = []
    for us_state in us_states:
        try:

            totalMoney = stateTotals.loc[stateTotals['State'] == us_state].values[0][1]
        except:
            totalMoney = 0

        if totalMoney in range(5000, 20000):
            state_colors.append(color_palette[1])
        elif totalMoney > 20000:
            state_colors.append(color_palette[2])
        else:
            state_colors.append(color_palette[0])




    p.patches(state_xs, state_ys, fill_alpha=1, fill_color=state_colors,
        line_color="#884444", line_width=1.5)


    p.circle('x', 'y', source=source, size=2, color='navy', alpha=1)
    g1 = Cross(x='x', y='y')
    g1_r = p.add_glyph(source_or_glyph=source, glyph=g1)
    g1_hover = HoverTool(renderers=[g1_r],
                             tooltips=[('School', '@school'), ('Total Scholarships', '@grantCnt'), ('Total Scholarship $', '@grantAmt')])
    p.add_tools(g1_hover)

    show(p)

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
    app.run(host='0.0.0.0', port=8000, threaded=True)