"""Python Flask WebApp Auth0 integration example with authorization
"""
import json
from os import environ as env
from functools import wraps
from db import DB
from urllib.parse import quote_plus, urlencode
from authlib.integrations.flask_client import OAuth
from dotenv import find_dotenv, load_dotenv
from flask import Flask, redirect, render_template, session, url_for, request, jsonify

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

app = Flask(__name__)
app.secret_key = env.get("SECRET_KEY")

oauth = OAuth(app)
oauth.register(
    "auth0",
    client_id=env.get("AUTH0_CLIENT_ID"),
    client_secret=env.get("AUTH0_CLIENT_SECRET"),
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f'https://{env.get("AUTH0_DOMAIN")}/.well-known/openid-configuration',
)

# Auth decorator
def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user' not in session:
            return redirect('/login')
        return f(*args, **kwargs)
    return decorated

# Controllers API
@app.route("/")
def home():
    return "home"

@app.route("/protected")
@requires_auth
def protected():
    user_id = session['user']['userinfo']['sub']  # Get Auth0 user ID
    return user_id

@app.route("/callback", methods=["GET", "POST"])
def callback():
    # return render_template(
    #     "auto_close.html"
    # )
    token = oauth.auth0.authorize_access_token()

    # Get the user information from Auth0's userinfo endpoint
    userinfo_response = oauth.auth0.get(f'https://{env.get("AUTH0_DOMAIN")}/userinfo')
    userinfo = userinfo_response.json()

    # Store both token and userinfo
    session["user"] = {
        "access_token": token,
        "userinfo": userinfo
    }
    return redirect("/")

@app.route("/login")
def login():
    return oauth.auth0.authorize_redirect(
        redirect_uri=url_for("callback", _external=True)
    )

@app.route("/logout")
def logout():
    session.clear()
    return redirect(
        "https://"
            + env.get("AUTH0_DOMAIN")
            + "/v2/logout?"
            + urlencode(
                {
                    "returnTo": url_for("home", _external=True),
                    "client_id": env.get("AUTH0_CLIENT_ID"),
                },
                quote_via=quote_plus,
            )
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=env.get("PORT", 5000))
