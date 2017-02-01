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

DATETIME_FMT = '%Y-%m-%dT%H:%M.%S%f'
DATE_FMT = '%Y-%m-%d'

def get_date(d, k):
    str_val = get_val(d, k)
    if str_val is not None:
        try:
            dt_val = datetime.strptime(str_val, DATETIME_FMT)
        except ValueError:
            dt_val = datetime.strptime(str_val, DATE_FMT)
        return dt_val
    return None

def str_from_date(dt):
    return dt.strftime(DATE_FMT)
