#!/usr/bin/env python

from setuptools import setup, find_packages

setup(name='fantasydj-housekeeper',
      version='0.1',
      description='Housekeeper Process for FantasyDJ',
      author='Lane Oliver-Paull',
      author_email='oliverpa@email.sc.edu',
      url='https://github.com/SCCapstone2/FantasyDJ',
      packages=find_packages(),
      install_requires=[
          'appdirs>=1.4',
          'dill>=0.2',
          'enum34>=1.1',
          'future>=0.16',
          'futures>=3',
          'gax-google-logging-v2>=0.8',
          'gax-google-pubsub-v1>=0.8',
          'gcloud>=0.17',
          'google-gax>=0.15',
          'googleapis-common-protos>=1.5',
          'grpc-google-logging-v2>=0.8',
          'grpc-google-pubsub-v1>=0.8',
          'grpcio>=1',
          'httplib2>=0.9',
          'jws>=0.1',
          'oauth2client>=3',
          'packaging>=16.8',
          'ply>=3.8',
          'protobuf>=3',
          'py>=1.4',
          'pyasn1>=0.1.9',
          'pyasn1-modules>=0.0.8',
          'pycryptodome>=3.4',
          'pyparsing>=2.1',
          'Pyrebase>=3',
          'pytest>=3',
          'python-dateutil>=2.6',
          'python-jwt>=2',
          'requests>=2.11',
          'requests-toolbelt>=0.7',
          'rsa>=3.4',
          'six>=1.10',
          'spotipy>=2.4',
      ],
)
