from datetime import datetime


def strip_to_none(str_val):
    if str_val is not None:
        str_val = str_val.strip()
        if len(str_val) == 0:
            return None
        return str_val


def get_val(d, k):
    try:
        return strip_to_none(d[k])
    except KeyError:
        return None


DATETIME_FMT = '%Y-%m-%dT%H:%M:%S.%f'
DATE_FMT = '%Y-%m-%d'


def date_from_str(str_val):
    if str_val is not None:
        try:
            dt_val = datetime.strptime(str_val, DATETIME_FMT)
        except ValueError:
            dt_val = datetime.strptime(str_val, DATE_FMT)
        return dt_val
    return None


EPOCH_STR = '1970-01-01T00:00:00.000'
EPOCH = date_from_str(EPOCH_STR)


def begin_of_day(dtime=None):
    if not dtime:
        dtime = datetime.now()
    return datetime(
        dtime.year,
        dtime.month,
        dtime.day,
        0, 0, 0, 0
    )


def str_from_date(dt):
    if dt:
        return dt.strftime(DATE_FMT)
    return None


def get_date(d, k):
    return date_from_str(get_val(d, k))
