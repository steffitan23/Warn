# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

"""
Purpose
Shows how to use the AWS SDK for Python (Boto3) with Amazon Rekognition to
recognize people, objects, and text in images.
The usage demo in this file uses images in the .media folder. If you run this code
without cloning the GitHub repository, you must first download the image files from
    https://github.com/awsdocs/aws-doc-sdk-examples/tree/master/python/example_code/rekognition/.media
"""

import logging
import boto3
from botocore.exceptions import ClientError

from rekognition_objects import RekognitionModerationLabel
import requests

logger = logging.getLogger(__name__)


class RekognitionImage:
    """
    Encapsulates an Amazon Rekognition image. This class is a thin wrapper
    around parts of the Boto3 Amazon Rekognition API.
    """
    def __init__(self, image, image_name, rekognition_client):
        """
        Initializes the image object.
        :param image: Data that defines the image, either the image bytes or
                      an Amazon S3 bucket and object key.
        :param image_name: The name of the image.
        :param rekognition_client: A Boto3 Rekognition client.
        """
        self.image = image
        self.image_name = image_name
        self.rekognition_client = rekognition_client
# snippet-end:[python.example_code.rekognition.RekognitionImage]

# snippet-start:[python.example_code.rekognition.RekognitionImage.from_file]
    @classmethod
    def from_file(cls, image_file_name, rekognition_client, image_name=None):
        """
        Creates a RekognitionImage object from a local file.
        :param image_file_name: The file name of the image. The file is opened and its
                                bytes are read.
        :param rekognition_client: A Boto3 Rekognition client.
        :param image_name: The name of the image. If this is not specified, the
                           file name is used as the image name.
        :return: The RekognitionImage object, initialized with image bytes from the
                 file.
        """
        with open(image_file_name, 'rb') as img_file:
            image = {'Bytes': img_file.read()}
        name = image_file_name if image_name is None else image_name
        return cls(image, name, rekognition_client)
# snippet-end:[python.example_code.rekognition.RekognitionImage.from_file]

# snippet-start:[python.example_code.rekognition.RekognitionImage.from_bucket]
    @classmethod
    def from_bucket(cls, s3_object, rekognition_client):
        """
        Creates a RekognitionImage object from an Amazon S3 object.
        :param s3_object: An Amazon S3 object that identifies the image. The image
                          is not retrieved until needed for a later call.
        :param rekognition_client: A Boto3 Rekognition client.
        :return: The RekognitionImage object, initialized with Amazon S3 object data.
        """
        image = {'S3Object': {'Bucket': s3_object.bucket_name, 'Name': s3_object.key}}
        return cls(image, s3_object.key, rekognition_client)
# snippet-end:[python.example_code.rekognition.RekognitionImage.from_bucket]


# snippet-start:[python.example_code.rekognition.DetectModerationLabels]
    def detect_moderation_labels(self):
        """
        Detects moderation labels in the image. Moderation labels identify content
        that may be inappropriate for some audiences.
        :return: The list of moderation labels found in the image.
        """
        try:
            response = self.rekognition_client.detect_moderation_labels(
                Image=self.image)
            labels = [RekognitionModerationLabel(label)
                      for label in response['ModerationLabels']]
            logger.info(
                "Found %s moderation labels in %s.", len(labels), self.image_name)
        except ClientError:
            logger.exception(
                "Couldn't detect moderation labels in %s.", self.image_name)
            raise
        else:
            return labels
# snippet-end:[python.example_code.rekognition.DetectModerationLabels]


def usage_demo():
    print('-'*88)
    print("Welcome to the Amazon Rekognition image detection demo!")
    print('-'*88)

    logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
    rekognition_client = boto3.client('rekognition')
    image = RekognitionImage.from_file('image.jpg', rekognition_client)
    resp = image.detect_moderation_labels()
    for o in resp:
        print(o.to_dict())
    
# snippet-end:[python.example_code.rekognition.Usage_ImageDetection]
def api(image_uri):
    logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
    rekognition_client = boto3.client('rekognition')
    image = RekognitionImage({'Bytes': requests.get(image_uri, allow_redirects=True).content},image_uri, rekognition_client)
    resp = image.detect_moderation_labels()
    return [o.to_dict() for o in resp]

if __name__ == '__main__':
    usage_demo()