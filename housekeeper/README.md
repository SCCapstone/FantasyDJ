## The FantasyDJ Housekeeper

This process runs nightly to collect popularity scores from Spotify for the
songs being used in active leagues. It also calculates playlist scores and
determines league winners. It can also be used to query the collected
popularity scores.

### Building
It is highly recommended that you set this up inside of a virtualenv. There
are very nice tools like mkvirtualenv that make setup and teardown quite
simple.

Once you have a virtualenv created and it is active, you can set this package
up for development:

`python setup.py develop`

This will install the needed dependencies and add this directory to python's
path so that any changes you make will be available immediately upon the next
run.

### Running

To update the popularity scores for the day, simply run:

`python -m fantasydjhousekeeper`

*NOTE: if it has already gotten the popularity for the day for a song, it will
not attempt to update what is already in the database.*

To see a list of popularity scores for a particular song, run:

`python -m fantasydjhousekeeper -t <spotify_track_id_of_song>`

To see a list of popularity scores for all songs in the database, run:

`python -m fantasydjhousekeeper -a`
