# Dependencies
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from datetime import datetime, timedelta

from flask import Flask, jsonify

# Database
engine = create_engine("sqlite:///Resources/hawaii.sqlite")

base = automap_base()
base.prepare(engine, reflect = True)

# Save references to the tables
measure = base.classes.measurement
stat = base.classes.station

# Flask 
app = Flask(__name__)

@app.route("/")
def home():
    return(
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"
        f"/api/v1.0/<start><br/>"
        f"/api/v1.0/<start>/<end>"
    )

@app.route("/api/v1.0/precipitation")
def precipitation():
    # Start Query
    session = Session(engine)
    results = session.query(measure.date, measure.prcp).order_by(measure.date).all()
    # End Query
    session.close()

    all_precip = []

    for date, prcp in results:
        precip_dict = {}
        precip_dict['date'] = date
        precip_dict['prcp'] = prcp
        all_precip.append(precip_dict)

    return jsonify(all_precip)

@app.route("/api/v1.0/stations")
def stations():
    session = Session(engine)
    results = session.query(stat.name).all()
    session.close()

    station_names = list(np.ravel(results))
    return jsonify(station_names)

@app.route("/api/v1.0/tobs")
def tobs():
    # Start Query
    session = Session(engine)

    # Find most active station
    active_station = session.query(measure.station, func.count(measure.station)).\
        group_by(measure.station).\
        order_by(func.count(measure.station).desc()).\
        all()
    
    stat_tuple = active_station[0]
    active_station = stat_tuple[0]
    # Calculate last date found in database, then find last year
    year_ago = session.query(measure.date).\
        filter(measure.station == active_station).\
        order_by(measure.date.desc()).\
        first()
    year_ago_dt = datetime.fromisoformat(str(year_ago[0])) - timedelta(days = 365)
    # year_ago_str = datetime.strftime(str(year_ago[0]), "%Y-%m-%d")

    # Query temperature observations
    results = session.query(measure.station, measure.date, measure.tobs).\
        filter(measure.date > year_ago_dt).\
        filter(measure.station == active_station).\
        all()

    # Close Query
    session.close()

    tobs_list = []
    for result in results:
        tobs_dict = {}
        tobs_dict['station'] = result[0]
        tobs_dict['date'] = result[1]
        tobs_dict['tobs'] = result[2]
        tobs_list.append(tobs_dict)

    return jsonify(tobs_list)

@app.route("/api/v1.0/<start>")
def date(start):
    session = Session(engine)
    start_date = datetime.strptime(start, "%Y-%m-%d")
    
    results = session.query(func.min(measure.tobs), func.max(measure.tobs), func.avg(measure.tobs)).\
        filter(measure.date > start_date).all()
    session.close()
    
    start_temps = []
    for result in results:
        tobs_dict = {}
        tobs_dict['min'] = result[0]
        tobs_dict['max'] = result[1]
        tobs_dict['avg'] = result[2]
        start_temps.append(tobs_dict)

    return jsonify(start_temps)

@app.route("/api/v1.0/<start>/<end>")
def twodates(start, end):
    session = Session(engine)
    
    start_date = datetime.strptime(start, "%Y-%m-%d")
    end_date = datetime.strptime(end, "%Y-%m-%d")

    results = session.query(func.min(measure.tobs), func.max(measure.tobs), func.avg(measure.tobs)).\
        filter(measure.date.between(start_date, end_date)).all()

    session.close()

    date_temps = []
    for result in results:
        tobs_dict = {}
        tobs_dict['min'] = result[0]
        tobs_dict['max'] = result[1]
        tobs_dict['avg'] = result[2]
        date_temps.append(tobs_dict)

    return jsonify(date_temps)


if __name__ == "__main__":
    app.run(debug = True)