from flask import Flask, request, jsonify
from flask_restx import Resource, Api
from gcp_client import *
from aws_client import api as aws_moderation_label

app = Flask(__name__)
api = Api(app)

@api.route('/gcpSafeSearch')
class SafeSearch(Resource):
    def post(self):
        """Uses the Google Cloud Vision API to detect safe search properties in the image.

        Returns:
            JSON: A JSON object containing the safe search properties of the image.
        """
        image_uri = request.form['image_uri']
        return jsonify(detect_safe_search_uri(image_uri))
@api.route('/awsModeration')
class AWSModeration(Resource):
    def post(self):
        """Uses the AWS Rekognition API to detect moderation labels in the image.
        https://docs.aws.amazon.com/rekognition/latest/dg/moderation.html#moderation-api

        Returns:
            JSON: A JSON object containing the moderation properties of the image.
        """
        image_uri = request.form['image_uri']
        return jsonify(aws_moderation_label(image_uri))

if __name__ == "__main__":
    app.run(host='127.0.0.1')