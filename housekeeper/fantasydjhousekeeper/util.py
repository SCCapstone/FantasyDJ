from datetime import datetime
from dateutil import parser, tz
from dateutil.relativedelta import relativedelta
import re


def strip_to_none(str_val):
    if str_val is not None:
        str_val = str_val.strip()
        if len(str_val) == 0:
            return None
        return str_val
    return None


def get_val(d, k):
    try:
        return strip_to_none(d[k])
    except KeyError:
        # obviously not there.
        return None
    except AttributeError:
        # not a string. don't strip.
        return d[k]


DATETIME_OUT_FMT = '%Y-%m-%dT%H:%M:%S.%f'
DATETIME_FMT = DATETIME_OUT_FMT + 'Z'
DATE_FMT = '%Y-%m-%d'

PAT_DATE = '\d{4}(-\d{2}){2}'
PAT_DATETIME_NO_TZ = PAT_DATE + 'T(\d{2}:){2}\d{2}\.\d{3}'
PAT_DATETIME_Z = PAT_DATETIME_NO_TZ + 'Z'
PAT_DATETIME = PAT_DATETIME_NO_TZ + '\+0000'

RE_DATE = re.compile(PAT_DATE)
RE_DATETIME_NO_TZ = re.compile(PAT_DATETIME_NO_TZ)
RE_DATETIME_Z = re.compile(PAT_DATETIME_Z)
RE_DATETIME = re.compile(PAT_DATETIME)


def date_from_str(str_val):
    if str_val is None:
        return None

    match = RE_DATETIME.match(str_val)
    if not match:
        orig_str_val = str_val
        match = RE_DATETIME_Z.match(str_val)
        if match:
            str_val = str_val[:-1]

        match = RE_DATETIME_NO_TZ.match(str_val)
        if match:
            str_val += '+0000'
        else:
            match = RE_DATE.match(str_val)
            if match and match.group(0) == str_val:
                str_val += 'T00:00:00.000+0000'

        match = RE_DATETIME.match(str_val)
        if not match:
            raise ValueError(
                'date not formatted correctly: {}'.format(orig_str_val)
            )

    return parser.parse(str_val)


EPOCH_STR = '1970-01-01T00:00:00.000Z'
EPOCH = date_from_str(EPOCH_STR)


def now():
    return datetime.now(tz.tzutc())


def begin_of_day(dtime=None):
    if not dtime:
        dtime = datetime.now(tz.tzutc())
    return datetime(
        dtime.year,
        dtime.month,
        dtime.day,
        0, 0, 0, 0,
        dtime.tzinfo
    )


def next_day(dtime):
    return dtime + relativedelta(days=1)


def one_week_earlier(dtime):
    return dtime - relativedelta(days=7)


def str_from_date(dt, in_ts_format=False):
    if dt:
        if in_ts_format:
            return dt.strftime(DATETIME_OUT_FMT)[:-3] + 'Z'
        return dt.strftime(DATE_FMT)
    return None


def get_date(d, k):
    return date_from_str(get_val(d, k))
