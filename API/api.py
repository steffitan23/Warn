from flask import Flask, request, jsonify
from flask_restx import Resource, Api
from gcp_client import *

app = Flask(__name__)
api = Api(app)

@api.route('/safeSearch')
class safeSearch(Resource):
    def post(self):
        """Uses the Google Cloud Vision API to detect safe search properties in the image.

        Returns:
            JSON: A JSON object containing the safe search properties of the image.
        """
        image_uri = request.form['image_uri']
        return jsonify(detect_safe_search_uri(image_uri))

if __name__ == "__main__":
    app.run(host='127.0.0.1')