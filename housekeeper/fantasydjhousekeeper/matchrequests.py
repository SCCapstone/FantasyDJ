import logging
from .entities import Request
from .leagues import LeagueModel
from .util import get_date, now, str_from_date, date_from_str
import ioniccloud

logger = logging.getLogger(__name__)


def match_requests(requests):
    matches = []

    prematches = []
    for request in requests:
        if not request.fulfilled:
            found = False
            if len(prematches) > 0:
                for prematch in prematches:
                    if prematch.user != request.user:
                        matches.append((prematch, request))
                        prematches.remove(prematch)
                        found = True
                        break
            if not found:
                prematches.append(request)

    return matches


class MatchRequestModel(object):

    def __init__(self, db):
        self.db = db
        self.league_model = LeagueModel(db)

    def __request_from_result(self, fbrequest):
        val = fbrequest.val()

        if val is None:
            raise ValueError('value of request result is None')

        fulfilled = None
        fulfilled_val = val['fulfilled']
        if fulfilled_val is False:
            fulfilled = False
        else:
            fulfilled = date_from_str(fulfilled_val)

        request = Request(
            fbrequest.key(),
            val['user'],
            get_date(val, 'created'),
            fulfilled
        )
        return request

    def get_request(self, request_id):
        return self.__request_from_result(
            self.db.child('Requests/{}'.format(request_id)).get()
        )

    def __get_requests(self):
        fbrequests = self.db.child('Requests').get()
        requests = [
            self.__request_from_result(fbrequest)
            for fbrequest in fbrequests.each()
        ]
        return requests

    def set_fulfilled(self, request_id):
        self.db.child(
            'Requests/{}/fulfilled'.format(request_id)
        ).set(str_from_date(now()))

    def create_matched_leagues(self):
        matches = match_requests(self.__get_requests())

        for match in matches:
            user_ids = [req.user for req in match]
            self.league_model.create_league('Random League', user_ids)
            for ids in [user_ids, [user_ids[1], user_ids[0]]]:
                ioniccloud.send_push(
                    ids[0],
                    'A league with random user {} has been created'.format(
                        ids[1]
                    )
                )
            for req in match:
                self.set_fulfilled(req.id)

