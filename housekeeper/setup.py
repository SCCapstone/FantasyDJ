#!/usr/bin/env python

from setuptools import setup, find_packages

setup(name='fantasydj-housekeeper',
      version='0.1',
      description='Housekeeper Process for FantasyDJ',
      author='Philip Oliver-Paull',
      author_email='oliverpa@email.sc.edu',
      url='https://github.com/SCCapstone2/FantasyDJ',
      packages=find_packages(),
      install_requires=[
        'pyrebase',
        'spotipy',
        'six',
      ],
)
