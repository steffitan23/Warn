from flask import Flask
from flask_restx import Resource, Api

app = Flask(__name__)
api = Api(app)

@api.route('/categorizeImage')
class CategorizeImage(Resource):
    def post(self, image_uri):
        return image_uri

if __name__ == "__main__":
    app.run(host='0.0.0.0')