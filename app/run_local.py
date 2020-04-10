"""
For running the server on your local machine.

Run with:
python run_local.py "url" "password" where "url" and "password" are the database
url and password respectively.
"""

from sys import argv
import os

if len(argv) != 3:
    print('Expected DB_URL and DB_PASS, got {}'.format(argv))
else:
    db_url = argv[1]
    db_pass = argv[2]

    os.environ['DB_URL'] = db_url
    os.environ['DB_PASS'] = db_pass

    exec(open('./main.py').read())
