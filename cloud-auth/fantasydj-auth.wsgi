#!/usr/bin/python

activate_this = '<path_to_env>/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

import sys
import logging

logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, "/var/www/fantasydj-auth/")

from fantasydjauth import app as application
application.secret_key = '<generated_secret_key'
