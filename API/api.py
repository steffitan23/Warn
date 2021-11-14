from flask import Flask, request, jsonify
from flask_restx import Resource, Api
from gcp_client import *
from aws_client import api as aws_moderation_label
from text_analysis import hate_check, unwanted_words_check
import requests
from flask_cors import CORS
import os

# hate_check("test") #warm up the API

app = Flask(__name__)
CORS(app)
api = Api(app)


@api.route('/test')
class Test(Resource):
    def post(self):
        print(request.form['image_uri'])
        return {"url": request.form['image_uri']}, 200, {"Access-Control-Allow-Origin": "*"}

@api.route('/assembly')
class Assembly(Resource):
    def post(self):
        print( request.form['audio_url'])
        endpoint = "https://api.assemblyai.com/v2/transcript"
        json = {"audio_url": request.form['audio_url'], "content_safety": True}
        headers = {
        "authorization": os.getenv("assembly_auth"),
        "content-type": "application/json"
        }

        response = requests.post(endpoint, json=json, headers=headers)
        print(response.json())
        return response.json()
@api.route('/assemblyPoll')
class AssemblyPoll(Resource):
    def post(self):
        id = request.form['id']
        endpoint = "https://api.assemblyai.com/v2/transcript/"+id
        headers = {
        "authorization": os.getenv("assembly_auth"),
        } 
        response = requests.get(endpoint, headers=headers)
        print(response.json())
        return response.json()
    
@api.route('/hateSpeech')
@api.doc(params={'text': 'A string of text'})
class HateSpeech(Resource):
    def post(self):
        """
        Detects whether a string of text is hate speech.

        Returns:
            JSON: Returns the hate speech score of the text
        """
        text = request.form['text']
        return jsonify(hate_check(text))


@api.route('/unwantedWords')
@api.doc(params={'text': 'A string of text', 'unwanted_words': 'A list of unwanted words'})
class UnwantedWords(Resource):
    def post(self):
        text = request.form['text']
        unwanted_words = request.form['unwanted_words']
        return jsonify(unwanted_words_check(text, unwanted_words))


@api.route('/gcpSafeSearch')
@api.doc(params={'image_uri': 'A link to an image'})
class SafeSearch(Resource):
    def post(self):
        """Uses the Google Cloud Vision API to detect safe search properties in the image.

        Returns:
            JSON: A JSON object containing the safe search properties of the image.
        """
        image_uri = request.form['image_uri']
        return jsonify(detect_safe_search_uri(image_uri))


@api.route('/awsModeration')
@api.doc(params={'image_uri': 'A link to an image'})
class AWSModeration(Resource):
    def post(self):
        """Uses the AWS Rekognition API to detect moderation labels in the image.
        https://docs.aws.amazon.com/rekognition/latest/dg/moderation.html#moderation-api

        Returns:
            JSON: A JSON object containing the moderation properties of the image.
        """
        return
        image_uri = request.form['image_uri']
        return jsonify(aws_moderation_label(image_uri))


if __name__ == "__main__":
    app.run(host='127.0.0.1')
