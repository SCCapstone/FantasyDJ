from fantasydjhousekeeper.matchrequests import match_requests
from fantasydjhousekeeper.entities import Request
from fantasydjhousekeeper.util import now
import pytest

def req_str(request):
    return '<{},{},{}>'.format(
        request.id, request.user, request.fulfilled != False
    )


# arg_tuples is a list of tuples in the format (username, fulfilled)
def gen_reqs(arg_tuples):
    requests = []
    keyCount = 0
    for arg_tuple in arg_tuples:
        requests.append(Request(
            '-k{}'.format(keyCount), arg_tuple[0], now(), arg_tuple[1]
        ))
        keyCount += 1
    if len(requests) > 0:
        print 'generated:'
    for req in requests:
        print '  {}'.format(req_str(req))
    return requests


def assert_match_size(requests, size):
    matches = match_requests(requests)
    if len(matches) > 0:
        print 'matches:'
    for match in matches:
        print '  match:'
        for req in match:
            print '    {}'.format(req_str(req))
    assert len(matches) == size


def test_match_requests():
    # empty
    assert_match_size([], 0)

    # two unfulfilled with same username
    assert_match_size(
        gen_reqs([
            ('u1', False),
            ('u1', False)
        ]),
        0
    )

    # two unfulfilled with different usernames
    assert_match_size(
        gen_reqs([
            ('u1', False),
            ('u2', False)
        ]),
        1
    )

    # two with different usernames, one fulfilled
    assert_match_size(
        gen_reqs([
            ('u1', now()),
            ('u2', False)
        ]),
        0
    )

    # two with different usernames, both fulfulled
    assert_match_size(
        gen_reqs([
            ('u1', now()),
            ('u2', now())
        ]),
        0
    )

    # three, two with same username, all unfulfilled
    assert_match_size(
        gen_reqs([
            ('u1', False),
            ('u1', False),
            ('u2', False)
        ]),
        1
    )

    # four, two with same username, all unfulfilled
    assert_match_size(
        gen_reqs([
            ('u1', False),
            ('u1', False),
            ('u2', False),
            ('u3', False)
        ]),
        2
    )
